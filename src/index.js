const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');
const { checkCooldown } = require('./utils/cooldown');o
require('dotenv').config();
const Validator = require('./utils/validator');
const ServerMonitor = require('./modules/serverMonitor');
const permissions = require('./config/permissions');
const cach = require('./utils/cache');

const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
    ] 
});

client.commands = new Collection();
const commandFolders = ['admin', 'public'];

// Load commands
for (const folder of commandFolders) {
    const commandPath = path.join(__dirname, 'commands', folder);
    const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const command = require(path.join(commandPath, file));
        client.commands.set(command.name, command);
    }
}

// Load events
const eventFiles = fs.readdirSync(path.join(__dirname, 'events'))
    .filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Error handling
client.on('error', error => {
    logger.error('Client error:', error);
});

process.on('unhandledRejection', error => {
    logger.error('Unhandled promise rejection:', error);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    try {
        const [action, itemId] = interaction.customId.split('_');
        
        // Validate and rate limit
        await Validator.validateCommand(interaction, {
            requiredRoles: permissions.commands[action] || ['player']
        });

        // Check cooldown
        const cooldownTime = checkCooldown(interaction.user.id, action, 5);
        if (cooldownTime > 0) {
            return interaction.reply({
                content: `Please wait ${cooldownTime.toFixed(1)} seconds before using this again.`,
                ephemeral: true
            });
        }

        // Handle action
        if (action === 'dashboard') {
            const stats = await ServerMonitor.getServerStatus();
            const dashboard = ServerMonitor.createDashboard(stats);
            await interaction.reply({ embeds: [dashboard] });
        }

        if (action === 'buy') {
            const store = require('./modules/store');
            const points = require('./modules/points');
            const item = store.items[itemId];
            
            const userPoints = await points.getPoints(interaction.user.id);
            if (await points.deductPoints(interaction.user.id, item.price)) {
                // Execute server command
                const rcon = require('./utils/rcon');
                await rcon.sendCommand(item.command.replace('%player%', interaction.user.id));
                
                await interaction.reply({
                    content: `Successfully purchased ${item.emoji} ${item.name}!`,
                    ephemeral: true
                });
            }
        }
        
        if (action === 'wheel_spin') {
            const wheel = require('./modules/wheel');
            const points = require('./modules/points');
            const config = require('./config/wheel.json');

            // Validate points
            const userPoints = await points.getPoints(interaction.user.id);
            if (userPoints < config.spinCost) {
                return interaction.reply({
                    content: `Insufficient points. Required: ${config.spinCost}`,
                    ephemeral: true
                });
            }

            // Check server status
            const serverStatus = await ServerMonitor.getStatus();
            if (!serverStatus.online) {
                return interaction.reply({
                    content: 'Server is offline. Try again later.',
                    ephemeral: true
                });
            }

            // Process spin
            await points.deductPoints(interaction.user.id, config.spinCost);
            
            try {
                const prize = await wheel.spin();
                const rcon = require('./utils/rcon');

                // Award prize based on type
                switch(prize.type) {
                    case 'item':
                        await rcon.sendCommand(`additem ${interaction.user.id} ${prize.id} ${prize.amount}`);
                        break;
                    case 'points':
                        await points.addPoints(interaction.user.id, prize.amount);
                        break;
                    case 'status':
                        await rcon.sendCommand(`addstatus ${interaction.user.id} ${prize.id}`);
                        break;
                }

                // Log transaction
                logger.info('Wheel spin successful', {
                    userId: interaction.user.id,
                    prize: prize.name,
                    type: prize.type,
                    cost: config.spinCost
                });

                // Track spin history
                await db.spins.create({
                    userId: interaction.user.id,
                    prize: prize.name,
                    type: prize.type,
                    cost: config.spinCost,
                    timestamp: new Date()
                });

                const embed = new MessageEmbed()
                    .setTitle('🎰 Wheel Spin Result')
                    .setDescription(`You won: ${prize.name}!`)
                    .setColor('#FFD700')
                    .addField('Prize Type', prize.type, true)
                    .addField('Cost', `${config.spinCost} points`, true)
                    .setTimestamp();

                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });

            } catch (error) {
                // Refund points on error
                await points.addPoints(interaction.user.id, config.spinCost);
                logger.error('Wheel spin failed', error);
                
                return interaction.reply({
                    content: '❌ Error processing wheel spin. Points refunded.',
                    ephemeral: true
                });
            }
        }
    } catch (error) {
        logger.error('Interaction failed', {
            error: error.message,
            userId: interaction.user.id,
            action: action
        });

        await interaction.reply({
            content: error.message,
            ephemeral: true
        });
    }
});

// Server status monitoring
setInterval(async () => {
    try {
        const status = await ServerMonitor.getStatus();
        cache.set('serverStatus', status);
        
        if (!status.online && cache.get('wasOnline')) {
            logger.warn('Server went offline');
            client.channels.cache.get(config.logChannel)?.send('⚠️ Server went offline');
        }
        
        cache.set('wasOnline', status.online);
    } catch (error) {
        logger.error('Status check failed:', error);
    }
}, 60000);

// Initialize bot
(async () => {
    try {
        await client.login(process.env.DISCORD_TOKEN);
        logger.info('Bot started successfully');
    } catch (error) {
        logger.error('Failed to start bot:', error);
        process.exit(1);
    }
})();

// Command handler with permissions
client.on('messageCreate', async message => {
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        // Check if command is restricted to specific channels
        const channelConfig = await fs.readFile(path.join(__dirname, 'config/channels.json'), 'utf8');
        const { publicChannels, adminChannels } = JSON.parse(channelConfig);
        
        const isAdmin = message.member.roles.cache.some(role => 
            permissions.roles.admin.includes(role.name));
        const isPublicChannel = publicChannels.includes(message.channel.id);
        const isAdminChannel = adminChannels.includes(message.channel.id);

        // Validate channel permissions
        if (!isAdmin && !isPublicChannel && !isAdminChannel) {
            return message.reply('Command not allowed in this channel');
        }

        // Check command cooldown
        const cooldownTime = checkCooldown(message.author.id, command.name, 5);
        if (cooldownTime > 0) {
            return message.reply(`Please wait ${cooldownTime.toFixed(1)} seconds`);
        }

        // Check if command requires account linking
        if (command.requiresLink && 
            !await Validator.validateLinkedAccount(message.author.id)) {
            return message.reply('You must link your account first (!link)');
        }

        // Check points requirement for wheel/store commands
        if (command.pointsCost) {
            const points = await require('./modules/points').getPoints(message.author.id);
            if (points < command.pointsCost) {
                return message.reply(`Insufficient points. Required: ${command.pointsCost}`);
            }
        }

        // Cache check
        const cacheKey = `${command.name}-${message.author.id}`;
        const cachedResult = cache.get(cacheKey);
        if (cachedResult && command.cacheDuration) {
            return message.reply(cachedResult);
        }

        // Execute command
        const result = await command.execute(message, args, client);
        
        // Cache result if needed
        if (command.cacheDuration) {
            cache.set(cacheKey, result, command.cacheDuration);
        }

        // Special handling for wheel command
        if (command.name === 'wheel') {
            const points = require('./modules/points');
            await points.deductPoints(message.author.id, command.pointsCost);
            
            // Check if server is online before giving rewards
            const serverStatus = await ServerMonitor.getStatus();
            if (!serverStatus.online) {
                await points.addPoints(message.author.id, command.pointsCost);
                return message.reply('Server is offline. Points refunded.');
            }

            // Process wheel rewards
            const reward = await require('./modules/wheel').processReward(result);
            if (reward.requiresServer) {
                await rcon.sendCommand(`additem ${message.author.id} ${reward.itemId} ${reward.amount}`);
            }

            // Track activity
            await db.activities.create({
                userId: message.author.id,
                type: 'WHEEL_SPIN',
                reward: reward.name,
                points: command.pointsCost,
                timestamp: new Date()
            });
        }

        // Process command result
        if (typeof result === 'string') {
            await message.reply(result);
        } else if (result?.embed) {
            await message.channel.send({ embeds: [result.embed] });
        }

        // Track command usage
        await db.commands.create({
            userId: message.author.id,
            command: command.name,
            args: args,
            success: true,
            executionTime: Date.now() - startTime
        });

    } catch (error) {
        logger.error('Command execution failed:', {
            command: command.name,
            error: error.message,
            user: message.author.id
        });

        // Refund points if wheel command failed
        if (command.name === 'wheel') {
            const points = require('./modules/points');
            await points.addPoints(message.author.id, command.pointsCost);
        }

        message.reply('An error occurred while processing your command.');
    }
});

// Initialize database
const db = require('./utils/database');
db.connect().catch(error => {
    logger.error('Database connection failed:', error);
    process.exit(1);
});

// Initialize RCON connection
const rcon = require('./utils/rcon');
rcon.connect().catch(error => {
    logger.error('RCON connection failed:', error);
});

// Initialize server monitoring
const monitor = new ServerMonitor({
    checkInterval: 60000,
    backupInterval: 21600000, // 6 hours
    healthCheckEnabled: true
});

monitor.on('serverOffline', () => {
    logger.warn('Server offline detected');
    client.channels.cache.get(config.logChannel)?.send('⚠️ Server offline');
});

// Set up graceful shutdown
const shutdown = async () => {
    logger.info('Shutting down services...');
    await Promise.all([
        rcon.disconnect(),
        db.disconnect(),
        monitor.stop()
    ]);
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Error handlers
process.on('unhandledRejection', (error) => {
    logger.error('Unhandled rejection:', error);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception:', error);
    shutdown();
});

// Custom error types
class BotError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'BotError';
        this.code = code;
    }
}

// Process monitor
const processMonitor = {
    start: () => {
        setInterval(() => {
            const usage = process.memoryUsage();
            if (usage.heapUsed > 1024 * 1024 * 512) { // 512MB
                logger.warn('High memory usage detected', usage);
            }
        }, 300000); // 5 minutes
    },
    
    checkHealth: () => ({
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
    })
};

// Bot status monitor
const botMonitor = {
    start: () => {
        client.on('ready', () => {
            setInterval(() => {
                const status = {
                    guilds: client.guilds.cache.size,
                    users: client.users.cache.size,
                    ping: client.ws.ping
                };
                cache.set('botStatus', status);
            }, 60000);
        });
    },

    checkServices: async () => {
        const health = {
            database: await db.ping(),
            rcon: await rcon.ping(),
            redis: await cache.ping(),
            process: processMonitor.checkHealth()
        };
        return health;
    }
};

// Environment checks
const checkEnvironment = () => {
    const required = ['DISCORD_TOKEN', 'PZ_SERVER_HOST', 'PZ_SERVER_RCON_PORT'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length) {
        throw new BotError(`Missing environment variables: ${missing.join(', ')}`, 'ENV_ERROR');
    }
};

// Start sequence
(async () => {
    try {
        // Pre-flight checks
        checkEnvironment();
        logger.info('Environment validated');

        // Initialize core services in order
        await db.connect();
        logger.info('Database connected');

        await rcon.connect();
        logger.info('RCON connected');

        await monitor.start();
        logger.info('Server monitor started');

        // Start monitoring systems
        processMonitor.start();
        botMonitor.start();

        // Login and set activity
        await client.login(process.env.DISCORD_TOKEN);
        client.user.setActivity('Project Zomboid', { type: 'WATCHING' });

        // Start heartbeat
        setInterval(async () => {
            const health = await botMonitor.checkServices();
            cache.set('serviceHealth', health);
            
            if (!health.rcon || !health.database) {
                logger.error('Critical service failure', health);
                
                // Attempt service recovery
                if (!health.rcon) {
                    try {
                        await rcon.reconnect();
                        logger.info('RCON reconnected');
                    } catch (error) {
                        logger.error('RCON recovery failed', error);
                    }
                }
                
                // Notify status channel
                const statusChannel = client.channels.cache.get(config.statusChannel);
                if (statusChannel) {
                    await statusChannel.send('⚠️ Service disruption detected');
                }
            }
        }, 300000);

        // Set up status channels
        const statusChannel = client.channels.cache.get(config.statusChannel);
        if (statusChannel) {
            // Initial status message
            const statusEmbed = new MessageEmbed()
                .setTitle('🤖 Bot Status')
                .setDescription('Services initialized successfully')
                .addField('Database', '✅ Connected', true)
                .addField('RCON', '✅ Connected', true)
                .addField('Monitor', '✅ Active', true)
                .setColor('#00FF00')
                .setTimestamp();
            
            await statusChannel.send({ embeds: [statusEmbed] });

            // Periodic status updates
            setInterval(async () => {
                const health = await botMonitor.checkServices();
                const status = new MessageEmbed()
                    .setTitle('📊 Service Status')
                    .addField('Uptime', `${Math.floor(process.uptime() / 3600)}h`, true)
                    .addField('Memory', `${Math.round(health.process.memory.heapUsed / 1024 / 1024)}MB`, true)
                    .addField('Ping', `${client.ws.ping}ms`, true)
                    .setColor(health.rcon && health.database ? '#00FF00' : '#FF0000')
                    .setTimestamp();
                
                await statusChannel.send({ embeds: [status] });
            }, 1800000); // 30 minutes
        }

        // Ready event
        client.emit('ready', true);
        logger.info('Bot fully operational');

        // Set up activity rotation
        const activities = [
            { name: 'Project Zomboid', type: 'WATCHING' },
            { name: `${client.guilds.cache.size} servers`, type: 'WATCHING' },
            { name: 'for !help', type: 'LISTENING' }
        ];
        let activityIndex = 0;

        setInterval(() => {
            const activity = activities[activityIndex];
            client.user.setActivity(activity.name, { type: activity.type });
            activityIndex = (activityIndex + 1) % activities.length;
        }, 300000);

    } catch (error) {
        logger.error('Fatal error during initialization:', error);
        await shutdown();
    }
})();

// Export bot instance
module.exports = {
    client,
    monitor,
    botMonitor,
    processMonitor,
    utils: {
        logger,
        cache,
        rcon,
        db
    }
};

// Start services
Promise.all([
    db.connect(),
    rcon.connect(),
    monitor.start(),
    processMonitor.start(),
    botMonitor.start()
])
.then(() => {
    logger.info('All services started');
    return client.login(process.env.DISCORD_TOKEN);
})
.catch(error => {
    logger.error('Service startup failed:', error);
    process.exit(1);
});

// Final error boundary
process.on('exit', code => {
    logger.info(`Process exiting with code: ${code}`);
    
    // Cleanup handlers
    Promise.all([
        db.disconnect(),
        rcon.disconnect(),
        monitor.stop(),
        processMonitor.stop(),
        dashboard.stop()
    ]).catch(error => {
        logger.error('Cleanup failed:', error);
    });
});

// Initialize dashboard
const dashboard = require('./modules/dashboard');
dashboard.start({
    port: process.env.DASHBOARD_PORT || 3000,
    secret: process.env.DASHBOARD_SECRET,
    baseUrl: process.env.DASHBOARD_URL
});

// Export complete bot instance with dashboard
module.exports = {
    ...module.exports,
    dashboard,
    status: () => ({
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        services: {
            database: db.isConnected(),
            rcon: rcon.isConnected(),
            monitor: monitor.isRunning(),
            dashboard: dashboard.isRunning()
        }
    }),
    shutdown: async () => {
        logger.info('Initiating graceful shutdown...');
        await Promise.all([
            dashboard.stop(),
            monitor.stop(),
            db.disconnect(),
            rcon.disconnect()
        ]);
        process.exit(0);
    }
};
