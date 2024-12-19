const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');
const { checkCooldown } = require('./utils/cooldown');
require('dotenv').config();
const Validator = require('./utils/validator');
const ServerMonitor = require('./modules/serverMonitor');
const permissions = require('./config/permissions');
const cache = require('./utils/cache');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
client.commands = new Collection();

// Command Handler
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Event Handler
const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

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
            const points = require('./modules/points');
            const wheel = require('./modules/wheelManager');
            const userPoints = await points.getPoints(interaction.user.id);
            
            const prize = await wheel.handleSpin(interaction, userPoints);
            if (!prize) {
                return interaction.reply({
                    content: '❌ Insufficient points!',
                    ephemeral: true
                });
            }

            // Log transaction
            logger.info('Wheel spin', {
                userId: interaction.user.id,
                prize: prize.name,
                points: prize.points
            });

            await interaction.reply({
                content: `🎉 You won a ${prize.name}! (${prize.points} points)`,
                ephemeral: true
            });
        }
    } catch (error) {
        await interaction.reply({
            content: error.message,
            ephemeral: true
        });
    }
});

// Initialize server monitoring
ServerMonitor.scheduleBackups();

client.login(process.env.DISCORD_TOKEN);
