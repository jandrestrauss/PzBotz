require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
const { Rcon } = require('rcon-client');
const axios = require('axios');
const { spawn } = require('child_process');
const client = new Discord.Client();
const prefix = '!';
const RconHandler = require('./src/rconHandler');
const rconClient = new RconHandler();
const os = require('os');
const disk = require('diskusage');
const pidusage = require('pidusage');

// Load configuration values
let config;
(async () => {
    try {
        config = JSON.parse(await fs.readFile(path.join(__dirname, 'config.json'), 'utf8'));
        initializeBot();
    } catch (error) {
        console.error('Error loading configuration:', error);
    }
})();

async function initializeBot() {
    const wheelSpinChannelId = config?.wheelSpinChannelId;
    const deathLogChannelId = config?.deathLogChannelId;
    const deathLogFilePath = config?.deathLogFilePath; // Use absolute path directly
    const pointsFilePath = path.join(__dirname, config?.pointsFilePath);
    const ticketsFilePath = path.join(__dirname, config?.ticketsFilePath);
    const linkedAccountsFilePath = path.join(__dirname, 'linked_accounts.json');
    const modDataFilePath = path.join(__dirname, 'mod_data.bin');

    const shopItems = {
        'wheelspin_ticket': { name: 'Wheel Spin Ticket', price: 500 }
    };

    let userPoints = {};
    let userTickets = {};
    let linkedAccounts = {};

    let lastReadPosition = 0;

    const defaultWheel = [
        { name: 'Skill Recovery Journal', id: 'Base.SkillRecoveryBoundJournal' },
        { name: 'Red Pen', id: 'Base.RedPen' },
        { name: 'Travel Ticket', id: 'FTWR.TravelTicket' },
        { name: 'Petrol Can', id: 'Base.PetrolCan' },
        { name: 'Colt Service 45', id: 'Base.Colt_Service45' },
        { name: 'Bullets 45 LC Box', id: 'Base.Bullets45LCBox' },
        { name: 'Scrap Metal', id: 'Base.ScrapMetal' },
        { name: 'Stone', id: 'Base.Stone' },
        { name: 'Mirror', id: 'Base.Mirror' },
        { name: 'Electronics Scrap', id: 'Base.ElectronicsScrap' },
        { name: 'ALICE Surplus Pack', id: 'Base.Bag_ALICESurpluspack' },
        { name: 'Big Hiking Bag', id: 'Base.Bag_BigHikingBag' },
        { name: 'Emergency Food Supply Box', id: 'EHE.EmergencyFoodSupplyBox' },
        { name: 'Pipe Wrench', id: 'Base.PipeWrench' },
        { name: 'Military Machete', id: 'SOMW.MilitaryMachete' },
        { name: 'Solar Panel', id: 'ISA.SolarPanel' },
        { name: 'Propane Gas Furnace', id: 'TW.PropaneGasFurnace' },
        { name: 'Welding Mask', id: 'Base.WeldingMask' },
        { name: 'Fix A Flat', id: 'FixAFlat.FixAFlat' },
        { name: 'Cmp Syringe With Cure', id: 'LabItems.CmpSyringeWithCure' },
        { name: 'Cmp Syringe With Serum', id: 'LabItems.CmpSyringeWithSerum' },
        { name: '762x54r Box', id: 'Base.762x54rBox' },
        { name: 'Bullets 9mm Box', id: 'Base.Bullets9mmBox' },
        { name: 'Fishing Rod', id: 'Base.FishingRod' },
        { name: 'Gardening Spray Empty', id: 'farming.GardeningSprayEmpty' },
        { name: '82 Porsche 911 Turbo', id: 'Base.82porsche911turbo' },
        { name: 'Van Spiffo', id: 'Base.VanSpiffo' }
    ];

    const premiumWheel = [
        { name: 'Luxury Car', id: 'Base.CarLuxury' },
        { name: 'Sports Car', id: 'Base.SportsCar' },
        { name: 'Helicopter', id: 'Base.BHelicopter' },
        { name: 'Military Vehicle', id: 'Base.87fordF700swat' },
        { name: 'High-End Rifle', id: 'Base.50BMGBox' },
        { name: 'Advanced Solar Panel', id: 'ISA.SolarPanel' },
        { name: 'High-End Machete', id: 'SOMW.MilitaryMachete' },
        { name: 'Advanced Welding Mask', id: 'Base.Hat_WelderMask2' },
        { name: 'Cmp Syringe With Serum', id: 'LabItems.CmpSyringeWithSerum' },
        { name: 'Cmp Syringe With Cure', id: 'LabItems.CmpSyringeWithCure' }
    ];

    let currentWheel = defaultWheel;

    let moduleAccess = {
        shop: true,
        wheelspin: true,
        buyticket: true
    };

    // Load user points, tickets, and linked accounts from persistent storage
    async function loadUserData() {
        try {
            try {
                await fs.access(pointsFilePath);
            } catch {
                await fs.writeFile(pointsFilePath, JSON.stringify({ points: {} }, null, 2));
            }
            userPoints = JSON.parse(await fs.readFile(pointsFilePath, 'utf8'));
            console.log('User points loaded successfully.');
        } catch (error) {
            console.error('Error loading user points:', error);
            userPoints = { points: {} };
        }

        try {
            try {
                await fs.access(ticketsFilePath);
            } catch {
                await fs.writeFile(ticketsFilePath, JSON.stringify({ tickets: {} }, null, 2));
            }
            userTickets = JSON.parse(await fs.readFile(ticketsFilePath, 'utf8'));
            console.log('User tickets loaded successfully.');
        } catch (error) {
            console.error('Error loading user tickets:', error);
            userTickets = { tickets: {} };
        }
        try {
            await fs.access(linkedAccountsFilePath);
            linkedAccounts = JSON.parse(await fs.readFile(linkedAccountsFilePath, 'utf8'));
            console.log('Linked accounts loaded successfully.');
        } catch (error) {
            console.error('Error loading linked accounts:', error);
        }
    }

    // Save user points, tickets, and linked accounts to persistent storage
    async function saveUserData() {
        try {
            await fs.writeFile(pointsFilePath, JSON.stringify(userPoints, null, 2), 'utf8');
            await fs.writeFile(ticketsFilePath, JSON.stringify(userTickets, null, 2), 'utf8');
            await fs.writeFile(linkedAccountsFilePath, JSON.stringify(linkedAccounts, null, 2), 'utf8');
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    // Function to verify if the in-game account exists using BattleMetrics API
    async function verifyInGameAccount(accountName) {
        try {
            const response = await axios.get('https://api.battlemetrics.com/players', {
                params: {
                    'filter[search]': accountName,
                    'filter[server]': '30653650'
                },
                headers: {
                    'Authorization': `Bearer ${process.env.BATTLEMETRICS_API_KEY}`
                }
            });
            const players = response.data.data.map(player => player.attributes.name);
            return players.includes(accountName);
        } catch (error) {
            console.error('Error fetching player list from BattleMetrics:', error);
            return false;
        }
    }

    // Function to read server points from mod data
    async function readServerPoints(userId, accountName) {
        try {
            const modData = await fs.readFile(modDataFilePath);
            const data = JSON.parse(modData);
            return data[userId] && data[userId][accountName] ? data[userId][accountName].points : 0;
        } catch (error) {
            console.error('Error reading server points:', error);
            return 0;
        }
    }

    // Function to assign server points to a user
    async function assignServerPoints(userId, accountName, points) {
        try {
            const modData = await fs.readFile(modDataFilePath);
            const data = JSON.parse(modData);
            if (!data[userId]) data[userId] = {};
            if (!data[userId][accountName]) data[userId][accountName] = { points: 0 };
            data[userId][accountName].points += points;
            await fs.writeFile(modDataFilePath, JSON.stringify(data, null, 2), 'utf8');
            console.log(`Assigned ${points} points to user ${userId} (account: ${accountName})`);
        } catch (error) {
            console.error('Error assigning server points:', error);
        }
    }

    // Function to assign the reward to the user in-game
    function assignRewardToUser(userId, accountName, reward) {
        // Example command to give an item to a player in the game server
        const command = `giveitem ${accountName} ${reward.id}`;
        sendCommandToGameServer(command);
        console.log(`Assigned ${reward.name} (${reward.id}) to user ${userId} (account: ${accountName})`);
    }

    // Function to check if the user is an admin
    function isAdmin(member) {
        return member.hasPermission('ADMINISTRATOR');
    }

    // Function to reload the configuration
    async function reloadConfig() {
        try {
            config = JSON.parse(await fs.readFile(path.join(__dirname, 'config.json'), 'utf8'));
            console.log('Configuration reloaded successfully.');
        } catch (error) {
            console.error('Error reloading configuration:', error);
        }
    }

    // Function to save shop items to a file
    async function saveShopItems() {
        try {
            await fs.writeFile(path.join(__dirname, 'shop_items.json'), JSON.stringify(shopItems, null, 2), 'utf8');
            console.log('Shop items saved successfully.');
        } catch (error) {
            console.error('Error saving shop items:', error);
        }
    }

    // Load shop items from a file
    async function loadShopItems() {
        try {
            const data = await fs.readFile(path.join(__dirname, 'shop_items.json'), 'utf8');
            Object.assign(shopItems, JSON.parse(data));
            console.log('Shop items loaded successfully.');
        } catch (error) {
            console.error('Error loading shop items:', error);
        }
    }

    // Function to connect to the game server using RCON
    async function connectToGameServer() {
        const rcon = new Rcon({
            host: '156.38.164.50', // Replace with your actual server IP
            port: 27015, // Replace with your RCON port
            password: 'Smart123' // Replace with your RCON password
        });

        try {
            await rcon.connect();
            console.log('Connected to game server');
            return rcon;
        } catch (err) {
            console.error('Connection error:', err);
            return null;
        }
    }

    // Function to test the server connection
    async function testServerConnection() {
        const rcon = await connectToGameServer();
        if (rcon) {
            console.log('Test connection successful');
            rcon.end();
        } else {
            console.error('Test connection failed');
        }
    }

    // Function to send a command to the game server
    async function sendCommandToGameServer(command) {
        const rcon = await connectToGameServer();
        if (rcon) {
            try {
                const response = await rcon.send(command);
                console.log('Command response:', response);
            } catch (err) {
                console.error('Error sending command:', err);
            } finally {
                rcon.end();
            }
        }
    }

    // Function to get the current online players
    async function getOnlinePlayers() {
        try {
            const response = await rcon.send('players');
            const players = response.split('\n')
                .filter(line => line.includes('steam id'))
                .map(line => {
                    const matches = line.match(/(.+?)\s*\(steam id/);
                    return matches ? matches[1].trim() : null;
                })
                .filter(Boolean);
            return players;
        } catch (error) {
            console.error('Error getting online players:', error);
            return [];
        }
    }

    // Function to update the bot's status with the number of online players
    async function updateBotStatus() {
        const onlinePlayers = await getOnlinePlayers();
        client.user.setActivity(`${onlinePlayers.length} players online`, { type: 'WATCHING' });
    }

    // Function to monitor player join and disconnect events
    async function monitorPlayerEvents() {
        // Implement your logic to monitor player join and disconnect events
        // This could involve querying the game server or checking logs
        // For demonstration purposes, we'll remove the simulation
        // const channel = client.channels.cache.get(deathLogChannelId);
        // if (channel) {
        //     channel.send('Player1 has joined the game.').catch(console.error);
        //     setTimeout(() => {
        //         channel.send('Player1 has left the game.').catch(console.error);
        //     }, 60000); // Simulate a player leaving after 1 minute
        // }
    }

    // Function to test the API connection to BattleMetrics
    async function testBattleMetricsAPI() {
        try {
            const response = await axios.get('https://api.battlemetrics.com/players', {
                params: {
                    'filter[server]': '30653650'
                },
                headers: {
                    'Authorization': `Bearer ${process.env.BATTLEMETRICS_API_KEY}`
                }
            });
            console.log('BattleMetrics API connection successful. Players:', JSON.stringify(response.data.data.map(player => player.attributes.name)));
        } catch (error) {
            console.error('Error connecting to BattleMetrics API:', error);
        }

    }

    // Function to continuously read from the server console
    async function readServerConsole() {
        try {
            const rcon = await connectToGameServer();
            if (!rcon) {
                console.error('Failed to connect to server console. Retrying in 5 seconds...');
                setTimeout(readServerConsole, 5000);
                return;
            }

            console.log('Connected to server console');

            // Set up event handlers
            rcon.on('connect', () => {
                console.log('Server console connection established');
            });

            rcon.on('authenticated', () => {
                console.log('Authenticated with server console');
                // Subscribe to console output
                rcon.send('servermsg "Discord bot connected to server console"');
            });

            rcon.on('message', (message) => {
                // Log server console messages
                console.log(`Server Console: ${message}`);
                
                // Check for specific message types
                if (message.includes('Player connected')) {
                    // Handle player connection
                    const username = message.split('Player connected')[1].trim();
                    console.log(`Player connected: ${username}`);
                } else if (message.includes('Player disconnected')) {
                    // Handle player disconnection  
                    const username = message.split('Player disconnected')[1].trim();
                    console.log(`Player disconnected: ${username}`);
                }
            });

            rcon.on('error', (error) => {
                console.error('Server console error:', error);
                rcon.end();
            });

            rcon.on('end', () => {
                console.log('Server console connection closed. Reconnecting...');
                setTimeout(readServerConsole, 5000); // Retry connection after 5 seconds
            });

        } catch (error) {
            console.error('Error connecting to server console:', error);
            setTimeout(readServerConsole, 5000); // Retry connection after 5 seconds
        }
    }

    // Start reading from server console when bot initializes
    readServerConsole();

    // Add this to your existing intervals
    setInterval(() => {
        if (!isServerRunning()) {
            console.log('Server not running, attempting to reconnect console...');
            readServerConsole();
        }
    }, 60 * 1000); // Check connection every minute

    // Function to read the death log file and post messages to the death log channel
    async function readDeathLog() {
        try {
            const data = await fs.readFile(deathLogFilePath, 'utf8');
            const deathMessages = data.trim().split('\n').slice(lastReadPosition);
            deathMessages.forEach(message => {
                const formattedMessage = formatDeathMessage(message);
                const channel = client.channels.cache.get(deathLogChannelId);
                if (channel) {
                    channel.send(formattedMessage).catch(console.error);
                }
            });
            lastReadPosition += deathMessages.length;
        } catch (err) {
            console.error('Error reading death log file:', err);
        }
    }

    // Function to format death log messages
    function formatDeathMessage(message) {
        const lines = message.split('\n');
        const formattedLines = lines.map(line => line.trim()).filter(line => line.length > 0);
        const formattedMessage = formattedLines.join('\n');
        return `\`\`\`\n${formattedMessage}\n\`\`\``;
    }

    // Function to save the last read position
    async function saveLastReadPosition() {
        try {
            await fs.writeFile(path.join(__dirname, 'last_read_position.txt'), lastReadPosition.toString(), 'utf8');
        } catch (error) {
            console.error('Error saving last read position:', error);
        }
    }

    // Function to load the last read position
    async function loadLastReadPosition() {
        try {
            const data = await fs.readFile(path.join(__dirname, 'last_read_position.txt'), 'utf8');
            lastReadPosition = parseInt(data, 10) || 0;
        } catch (error) {
            console.error('Error loading last read position:', error);
            lastReadPosition = 0;
        }
    }

    // Function to check if the server process is already running
    async function isServerRunning() {
        const psList = (await import('ps-list')).default;
        const processes = await psList();
        return processes.some(process => process.name.includes('serverExecutableName')); // Replace 'serverExecutableName' with the actual server executable name
    }

    // Function to start the server if it's not already running
    async function startServer() {
        if (await isServerRunning()) {
            console.log('Server is already running.');
            return;
        }

        const serverExecutablePath = 'C:/correct/path/to/serverExecutable'; // Replace with the actual path to the server executable
        const serverProcess = spawn(serverExecutablePath, ['--option1', '--option2']); // Replace with actual server options

        serverProcess.stdout.on('data', (data) => {
            console.log(`Server: ${data}`);
        });

        serverProcess.stderr.on('data', (data) => {
            console.error(`Server Error: ${data}`);
        });

        serverProcess.on('error', (err) => {
            if (err.code === 'ENOENT') {
                console.error(`Server executable not found at path: ${serverExecutablePath}`);
            } else {
                console.error(`Failed to start server: ${err.message}`);
            }
        });

        serverProcess.on('close', (code) => {
            console.log(`Server process exited with code ${code}`);
        });
    }

    // Function to start the server using the server.bat script
    async function startServerUsingBat() {
        const serverBatPath = 'C:/pzserver/server.bat';
        const serverProcess = spawn('cmd.exe', ['/c', serverBatPath]);

        serverProcess.stdout.on('data', (data) => {
            console.log(`Server: ${data}`);
        });

        serverProcess.stderr.on('data', (data) => {
            console.error(`Server Error: ${data}`);
        });

        serverProcess.on('error', (err) => {
            console.error(`Failed to start server using server.bat: ${err.message}`);
        });

        serverProcess.on('close', (code) => {
            console.log(`Server process exited with code ${code}`);
        });
    }

    // Set an interval to refresh the bot's status every minute
    setInterval(updateBotStatus, 60000);

    // Test the BattleMetrics API connection on startup
    testBattleMetricsAPI();

    // Start reading from the server console
    readServerConsole();

    // Test the server connection on startup
    testServerConnection();

    // Start the server if it's not already running
    startServer();

    client.on('message', async message => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        try {
            if (command === 'help') {
                const embed = new Discord.MessageEmbed()
                    .setTitle('Help - Available Commands')
                    .setDescription('Here are the available commands:')
                    .setColor('#7289DA')
                    .addField('Public Commands', `
                        **!bot_info** - Displays information about this bot.
                        **!server_status** - Gets the server status.
                        **!restart_time** - Gets the next automated restart time.
                        **!game_date** - Gets the current in-game date.
                        **!shop** - Displays the list of items available for purchase.
                        **!buyticket** - Buys a wheel spin ticket using in-game server points.
                        **!balance** - Displays the user's current points and wheel spin tickets.
                        **!linkaccount** - Links your Discord account to an in-game account.
                    `)
                    .addField('Admin Commands', `
                        **!set_command_channel** - Sets the command channel for the bot.
                        **!set_log_channel** - Sets the log channel for the bot.
                        **!set_public_channel** - Sets the public channel for the bot.
                        **!get_settings** - Gets the bot settings.
                        **!get_schedules** - Gets the remaining times until schedules to be executed.
                        **!get_ram_cpu** - Gets the total RAM and CPU usage of the machine.
                        **!set_restart_schedule_type** - Sets the server's restart schedule type.
                        **!set_restart_time** - Sets the server's restart time(s).
                        **!set_restart_interval** - Sets the server's restart schedule interval.
                        **!set_mod_update_check_interval** - Sets the workshop mod update check schedule interval.
                        **!set_mod_update_restart_timer** - Sets the restart timer for server when mod update detected.
                        **!toggle_non_public_mod_logging** - Toggles non-public mod logging.
                        **!toggle_server_auto_start** - Toggles the server auto start feature.
                        **!backup_server** - Creates a backup of the server.
                        **!localization** - Get/change current localization.
                        **!addpoints** - Adds points to a user.
                        **!setwheel** - Sets the current wheel for wheel spins.
                        **!addshopitem** - Adds an item to the shop.
                        **!addserverpoints** - Adds server points to a user.
                        **!reloadconfig** - Reloads the bot configuration.
                    `)
                    .addField('Server Commands', `
                        **!server_cmd** - Sends inputs to the server console.
                        **!server_msg** - Broadcasts a message to all players in the server.
                        **!start_server** - Starts the server.
                        **!stop_server** - Saves and stops the server.
                        **!restart_server** - Restarts the server.
                        **!initiate_restart** - Initiates a restart.
                        **!abort_restart** - Aborts an upcoming restart.
                        **!save_server** - Saves the current world.
                        **!add_user** - Adds a new user to the whitelist.
                        **!add_user_to_whitelist** - Adds a single user connected with a password to the whitelist.
                        **!remove_user_from_whitelist** - Removes a single user connected with a password to the whitelist.
                        **!ban_steamid** - Bans a Steam ID.
                        **!unban_steamid** - Unbans a Steam ID.
                        **!ban_user** - Bans a user.
                        **!unban_user** - Unbans a user.
                        **!make_admin** - Gives admin rights to a user.
                        **!remove_admin** - Removes admin rights from a user.
                        **!kick_user** - Kicks a user from the server.
                        **!start_rain** - Starts rain on the server.
                        **!stop_rain** - Stops rain on the server.
                        **!teleport** - Teleports a player.
                        **!add_item** - Gives an item to the player.
                        **!add_xp** - Gives XP to a player.
                        **!chopper** - Places a helicopter event on a random player.
                        **!godmode** - Makes a player invincible.
                        **!invisible** - Makes a player invisible to zombies.
                        **!noclip** - Allows a player to pass through solid objects.
                        **!show_options** - Shows a list of current server options and values.
                        **!reload_options** - Reloads server options.
                        **!change_option** - Changes a server option.
                        **!add_workshop_mod** - Adds a workshop mod from the workshop mod URL.
                        **!remove_workshop_mod** - Removes a workshop mod from the workshop mod URL.
                    `);

                message.channel.send(embed).catch(console.error);
            }

            if (command === 'linkaccount') {
                const accountName = args[0];
                if (!accountName) {
                    message.channel.send('Please provide your in-game account name.').catch(console.error);
                    return;
                }
                const accountExists = await verifyInGameAccount(accountName);
                if (!accountExists) {
                    message.channel.send('The provided in-game account does not exist. Please check the account name and try again.').catch(console.error);
                    return;
                }
                if (!linkedAccounts[message.author.id]) linkedAccounts[message.author.id] = [];
                if (!linkedAccounts[message.author.id].includes(accountName)) {
                    linkedAccounts[message.author.id].push(accountName);
                    await saveUserData();
                    message.channel.send(`Linked your Discord account to in-game account: ${accountName}`).catch(console.error);
                } else {
                    message.channel.send('This in-game account is already linked to your Discord account.').catch(console.error);
                }
            }

            if (command === 'shop' && moduleAccess.shop) {
                const embed = new Discord.MessageEmbed()
                    .setTitle('Shop Items')
                    .setDescription('Available items for purchase:')
                    .setColor('#7289DA')
                    .setThumbnail('https://example.com/shop-icon.png'); // Replace with a relevant image URL

                for (const item in shopItems) {
                    embed.addField(shopItems[item].name, `${shopItems[item].price} coins`, true);
                }

                message.author.send(embed).catch(console.error);
            }

            if (command === 'buyticket' && moduleAccess.buyticket) {
                const userId = message.author.id;
                const accountName = args[0]; // Specify the in-game account name
                if (!linkedAccounts[userId] || !linkedAccounts[userId].includes(accountName)) {
                    message.channel.send('Please link your Discord account to the in-game account using !linkaccount command.').catch(console.error);
                    return;
                }
                const ticketPrice = 500; // Set the price for a wheel spin ticket
                const serverPoints = await readServerPoints(userId, accountName);

                if (serverPoints >= ticketPrice) {
                    await assignServerPoints(userId, accountName, -ticketPrice);
                    if (!userTickets[userId]) userTickets[userId] = {};
                    if (!userTickets[userId][accountName]) userTickets[userId][accountName] = 0;
                    userTickets[userId][accountName] += 1;
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Purchase Successful')
                        .setDescription(`You have bought a wheel spin ticket for ${ticketPrice} points.`)
                        .setColor('#00FF00')
                        .setThumbnail('https://example.com/ticket-icon.png'); // Replace with a relevant image URL

                    message.author.send(embed).catch(console.error);
                    await saveUserData(); // Save user data after purchase
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Purchase Failed')
                        .setDescription('You do not have enough points to buy a wheel spin ticket.')
                        .setColor('#FF0000')
                        .setThumbnail('https://example.com/error-icon.png'); // Replace with a relevant image URL

                    message.author.send(embed).catch(console.error);
                }
            }

            if (command === 'addpoints' && isAdmin(message.member)) {
                const userId = args[0];
                const accountName = args[1]; // Specify the in-game account name
                const points = parseInt(args[2], 10);
                if (isNaN(points) || points <= 0) {
                    message.channel.send('Invalid points value. Please enter a positive number.').catch(console.error);
                    return;
                }
                if (!userPoints[userId]) userPoints[userId] = {};
                if (!userPoints[userId][accountName]) userPoints[userId][accountName] = 0;
                userPoints[userId][accountName] += points;
                message.author.send(`Added ${points} points to user ${userId} (account: ${accountName}).`).catch(console.error);
                await saveUserData(); // Save user data after adding points
            }

            if (command === 'wheelspin' && moduleAccess.wheelspin) {
                if (message.channel.id !== wheelSpinChannelId) {
                    message.channel.send('Wheel spins can only be done in the designated channel.').catch(console.error);
                    return;
                }

                const userId = message.author.id;
                const accountName = args[0]; // Specify the in-game account name
                if (message.author.id === 'your-discord-user-id' || (userTickets[userId] && userTickets[userId][accountName] && userTickets[userId][accountName] > 0)) {
                    if (userTickets[userId][accountName]) userTickets[userId][accountName] -= 1;
                    const reward = currentWheel[Math.floor(Math.random() * currentWheel.length)];
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Wheel Spin Result')
                        .setDescription(`Congratulations ${message.author.username}, you won ${reward.name}!`)
                        .setColor('#FFD700')
                        .setThumbnail('https://example.com/wheel-icon.png'); // Replace with a relevant image URL

                    message.channel.send(embed).catch(console.error);
                    await saveUserData(); // Save user data after wheel spin
                    assignRewardToUser(userId, accountName, reward); // Assign the reward to the user in-game
                } else {
                    message.channel.send('You do not have a wheel spin ticket.').catch(console.error);
                }
            }

            if (command === 'setwheel' && isAdmin(message.member)) {
                const wheelName = args[0];
                if (wheelName === 'default') {
                    currentWheel = defaultWheel;
                    message.channel.send('Switched to the default wheel.').catch(console.error);
                } else if (wheelName === 'premium') {
                    currentWheel = premiumWheel;
                    message.channel.send('Switched to the premium wheel.').catch(console.error);
                } else {
                    message.channel.send('Invalid wheel name.').catch(console.error);
                }
            }

            if (command === 'balance') {
                const userId = message.author.id;
                const accountName = args[0]; // Specify the in-game account name
                const points = await readServerPoints(userId, accountName);
                const tickets = userTickets[userId] && userTickets[userId][accountName] ? userTickets[userId][accountName] : 0;
                const embed = new Discord.MessageEmbed()
                    .setTitle('Balance')
                    .setDescription(`You have ${points} points and ${tickets} wheel spin tickets.`)
                    .setColor('#7289DA')
                    .setThumbnail('https://example.com/balance-icon.png'); // Replace with a relevant image URL

                message.author.send(embed).catch(console.error);
            }

            if (command === 'setmodule' && isAdmin(message.member)) {
                const moduleName = args[0];
                const status = args[1] === 'enable';
                if (moduleAccess.hasOwnProperty(moduleName)) {
                    moduleAccess[moduleName] = status;
                    message.channel.send(`${moduleName} module has been ${status ? 'enabled' : 'disabled'}.`).catch(console.error);
                } else {
                    message.channel.send('Invalid module name.').catch(console.error);
                }
            }

            if (command === 'reloadconfig' && isAdmin(message.member)) {
                await reloadConfig();
                message.channel.send('Configuration reloaded successfully.').catch(console.error);
            }

            if (command === 'addshopitem' && isAdmin(message.member)) {
                const itemName = args[0];
                const itemPrice = parseInt(args[1], 10);
                if (!itemName || isNaN(itemPrice) || itemPrice <= 0) {
                    message.channel.send('Invalid item name or price. Please enter a valid item name and a positive price.').catch(console.error);
                    return;
                }
                shopItems[itemName] = { name: itemName, price: itemPrice };
                await saveShopItems(); // Save shop items after adding a new item
                const embed = new Discord.MessageEmbed()
                    .setTitle('Item Added')
                    .setDescription(`Item ${itemName} added to the shop with a price of ${itemPrice} coins.`)
                    .setColor('#00FF00')
                    .setThumbnail('https://example.com/shop-icon.png'); // Replace with a relevant image URL

                message.channel.send(embed).catch(console.error);
            }

            if (command === 'addserverpoints' && isAdmin(message.member)) {
                const userId = args[0];
                const accountName = args[1]; // Specify the in-game account name
                const points = parseInt(args[2], 10);
                if (isNaN(points) || points <= 0) {
                    message.channel.send('Invalid points value. Please enter a positive number.').catch(console.error);
                    return;
                }
                await assignServerPoints(userId, accountName, points);
                message.channel.send(`Assigned ${points} server points to user ${userId} (account: ${accountName}).`).catch(console.error);
            }

            if (command === 'playerstats') {
                const userId = message.author.id;
                const accountName = args[0]; // Specify the in-game account name
                if (!linkedAccounts[userId] || !linkedAccounts[userId].includes(accountName)) {
                    message.channel.send('Please link your Discord account to the in-game account using !linkaccount command.').catch(console.error);
                    return;
                }
                // Implement logic to fetch and display player statistics
                const playtime = 100; // Replace with actual logic to get playtime
                const kills = 50; // Replace with actual logic to get kills

                const embed = new Discord.MessageEmbed()
                    .setTitle('Player Statistics')
                    .setDescription(`Statistics for ${accountName}`)
                    .setColor('#7289DA')
                    .addField('Playtime', `${playtime} hours`, true)
                    .addField('Kills', `${kills}`, true);

                message.channel.send(embed).catch(console.error);
            }

            // Implementing admin commands
            if (command === 'godmode' && isAdmin(message.member)) {
                const username = args[0];
                if (!username) {
                    message.channel.send('Please provide a username.').catch(console.error);
                    return;
                }
                const command = `godmode ${username}`;
                sendCommandToGameServer(command);
                message.channel.send(`Godmode enabled for ${username}.`).catch(console.error);
            }

            if (command === 'invisible' && isAdmin(message.member)) {
                const username = args[0];
                if (!username) {
                    message.channel.send('Please provide a username.').catch(console.error);
                    return;
                }
                const command = `invisible ${username}`;
                sendCommandToGameServer(command);
                message.channel.send(`${username} is now invisible to zombies.`).catch(console.error);
            }

            if (command === 'noclip' && isAdmin(message.member)) {
                const username = args[0];
                if (!username) {
                    message.channel.send('Please provide a username.').catch(console.error);
                    return;
                }
                const command = `noclip ${username}`;
                sendCommandToGameServer(command);
                message.channel.send(`${username} can now pass through solid objects.`).catch(console.error);
            }

            if (command === 'teleport' && isAdmin(message.member)) {
                const username1 = args[0];
                const username2 = args[1];
                if (!username1 || !username2) {
                    message.channel.send('Please provide both usernames.').catch(console.error);
                    return;
                }
                const command = `teleport ${username1} ${username2}`;
                sendCommandToGameServer(command);
                message.channel.send(`${username1} has been teleported to ${username2}.`).catch(console.error);
            }

            if (command === 'add_item' && isAdmin(message.member)) {
                const username = args[0];
                const item = args[1];
                if (!username || !item) {
                    message.channel.send('Please provide a username and item.').catch(console.error);
                    return;
                }
                const command = `additem ${username} ${item}`;
                sendCommandToGameServer(command);
                message.channel.send(`Item ${item} has been added to ${username}.`).catch(console.error);
            }

            if (command === 'add_xp' && isAdmin(message.member)) {
                const username = args[0];
                const perk = args[1];
                const xp = args[2];
                if (!username || !perk || !xp) {
                    message.channel.send('Please provide a username, perk, and XP amount.').catch(console.error);
                    return;
                }
                const command = `addxp ${username} ${perk} ${xp}`;
                sendCommandToGameServer(command);
                message.channel.send(`${xp} XP has been added to ${username} for ${perk}.`).catch(console.error);
            }

            if (command === 'chopper' && isAdmin(message.member)) {
                const command = `chopper`;
                sendCommandToGameServer(command);
                message.channel.send('Helicopter event placed on a random player.').catch(console.error);
            }

            if (command === 'show_options' && isAdmin(message.member)) {
                const command = `showoptions`;
                sendCommandToGameServer(command);
                message.channel.send('Server options have been displayed in the console.').catch(console.error);
            }

            if (command === 'reload_options' && isAdmin(message.member)) {
                const command = `reloadoptions`;
                sendCommandToGameServer(command);
                message.channel.send('Server options have been reloaded.').catch(console.error);
            }

            if (command === 'change_option' && isAdmin(message.member)) {
                const option = args[0];
                const newOption = args[1];
                if (!option || !newOption) {
                    message.channel.send('Please provide an option and new value.').catch(console.error);
                    return;
                }
                const command = `changeoption ${option} ${newOption}`;
                sendCommandToGameServer(command);
                message.channel.send(`Option ${option} has been changed to ${newOption}.`).catch(console.error);
            }

            if (command === 'add_workshop_mod' && isAdmin(message.member)) {
                const modUrls = args.join(' ');
                if (!modUrls) {
                    message.channel.send('Please provide workshop mod URLs.').catch(console.error);
                    return;
                }
                const command = `addworkshopmod ${modUrls}`;
                sendCommandToGameServer(command);
                message.channel.send('Workshop mod(s) added.').catch(console.error);
            }

            if (command === 'remove_workshop_mod' && isAdmin(message.member)) {
                const modUrls = args.join(' ');
                if (!modUrls) {
                    message.channel.send('Please provide workshop mod URLs.').catch(console.error);
                    return;
                }
                const command = `removeworkshopmod ${modUrls}`;
                sendCommandToGameServer(command);
                message.channel.send('Workshop mod(s) removed.').catch(console.error);
            }

            if (command === 'server_cmd') {
                const serverCommand = args.join(' ');
                await sendCommandToGameServer(serverCommand);
                message.channel.send(`Command sent to server: ${serverCommand}`);
            }
        } catch (error) {
            console.error('Error processing command:', error);
            message.channel.send('An error occurred while processing your command. Please try again later.').catch(console.error);
        }
    });

    // Set an interval to read the death log file periodically
    setInterval(async () => {
        await readDeathLog();
        await saveLastReadPosition();
    }, 60000); // Check every 60 seconds

    // Load user data on startup
    loadUserData();
    loadShopItems(); // Load shop items on startup
    loadLastReadPosition(); // Load last read position on startup

    // Load the bot token from an environment variable
    const botToken = process.env.BOT_TOKEN;
    if (!botToken) {
        console.error('Bot token is not set. Please set the BOT_TOKEN environment variable.');
        process.exit(1);
    }

    client.login(botToken.trim()).catch(error => {
        console.error('Error logging in:', error);
    });

    // Function to schedule regular backups
    async function scheduleBackups() {
        const backupInterval = config?.backupInterval || 1440; // Default to 24 hours
        setInterval(async () => {
            await backupServer();
            console.log('Server backup completed.');
        }, backupInterval * 60 * 1000);
    }

    // Function to clean up old logs
    async function cleanUpLogs() {
        const logRetentionPeriod = config?.logRetentionPeriod || 7; // Default to 7 days
        const logDir = path.join(__dirname, 'logs');
        const files = await fs.readdir(logDir);
        const now = Date.now();

        for (const file of files) {
            const filePath = path.join(logDir, file);
            const stats = await fs.stat(filePath);
            if (now - stats.mtimeMs > logRetentionPeriod * 24 * 60 * 60 * 1000) {
                await fs.unlink(filePath);
                console.log(`Deleted old log file: ${file}`);
            }
        }
    }

    // Function to notify admins of mod updates
    async function notifyModUpdates() {
        const modUpdateChannelId = config?.modUpdateChannelId;
        const channel = client.channels.cache.get(modUpdateChannelId);
        if (channel) {
            channel.send('A mod update has been detected. Please check the server.').catch(console.error);
        }
    }

    // Function to track and display player statistics
    async function trackPlayerStatistics() {
        const statsChannelId = config?.statsChannelId;
        const channel = client.channels.cache.get(statsChannelId);
        if (channel) {
            const stats = await getPlayerStatistics();
            const embed = new Discord.MessageEmbed()
                .setTitle('Player Statistics')
                .setDescription('Current player statistics:')
                .setColor('#7289DA')
                .addField('Total Playtime', `${stats.totalPlaytime} hours`, true)
                .addField('Total Kills', `${stats.totalKills}`, true);

            channel.send(embed).catch(console.error);
        }
    }

    // Function to get player statistics
    async function getPlayerStatistics() {
        try {
            const response = await axios.get('https://api.battlemetrics.com/players', {
                params: {
                    filter: {
                        server: '30653650'
                    }
                },
                headers: {
                    'Authorization': `Bearer ${process.env.BATTLEMETRICS_API_KEY}`
                }
            });
            const players = response.data.data;
            let totalPlaytime = 0;
            let totalKills = 0;

            players.forEach(player => {
                totalPlaytime += player.attributes.timePlayed;
                totalKills += player.attributes.kills;
            });

            return {
                totalPlaytime: (totalPlaytime / 3600).toFixed(2), // Convert seconds to hours
                totalKills
            };
        } catch (error) {
            console.error('Error fetching player statistics:', error);
            return {
                totalPlaytime: 0,
                totalKills: 0
            };
        }
    }

    // Function to backup the server
    async function backupServer() {
        try {
            const backupDir = path.join(__dirname, 'backups');
            await fs.mkdir(backupDir, { recursive: true });
            const backupFilePath = path.join(backupDir, `backup_${Date.now()}.zip`);

            // Implement your logic to create a backup of the server
            // For demonstration purposes, we'll create an empty file
            await fs.writeFile(backupFilePath, '');

            console.log(`Server backup created at ${backupFilePath}`);
        } catch (error) {
            console.error('Error creating server backup:', error);
        }
    }

    // Function to get server health
    async function getServerHealth() {
        try {
            const stats = await getServerStats();
            const players = await getOnlinePlayers();
            
            return {
                status: 'healthy',
                uptime: stats.uptime,
                players: players.length,
                cpuUsage: stats.cpu,
                memoryUsage: stats.memory,
                diskSpace: stats.disk
            };
        } catch (error) {
            console.error('Error getting server health:', error);
            return { status: 'unhealthy' };
        }
    }

    async function getServerStats() {
        try {
            const serverPid = await getServerPID();
            const stats = await pidusage(serverPid);
            const root = '/';
            const diskInfo = await disk.check(root);

            return {
                cpu: Math.round(stats.cpu),
                memory: Math.round(stats.memory / 1024 / 1024), // Convert to MB
                uptime: Math.round(stats.elapsed / 1000 / 60), // Convert to minutes
                disk: Math.round((diskInfo.total - diskInfo.free) / diskInfo.total * 100)
            };
        } catch (error) {
            console.error('Error getting server stats:', error);
            throw error;
        }
    }

    async function getServerPID() {
        try {
            // Read PID from server's .pid file or process list
            // Implementation depends on server setup
            return process.pid; // Placeholder
        } catch (error) {
            console.error('Error getting server PID:', error);
            throw error;
        }
    }

    // Function to check server health
    async function checkServerHealth() {
        const healthChannelId = config?.healthChannelId;
        const channel = client.channels.cache.get(healthChannelId);
        const serverHealth = await getServerHealth();

        if (channel) {
            const embed = new Discord.MessageEmbed()
                .setTitle('Server Health Check')
                .setDescription('Current server health status:')
                .setColor(serverHealth.status === 'healthy' ? '#00FF00' : '#FF0000')
                .addField('CPU Usage', `${serverHealth.cpuUsage}%`, true)
                .addField('Memory Usage', `${serverHealth.memoryUsage}%`, true)
                .addField('Disk Space', `${serverHealth.diskSpace}%`, true);

            channel.send(embed).catch(console.error);
        }
    }

    // Set intervals for automated tasks
    setInterval(cleanUpLogs, 24 * 60 * 60 * 1000); // Clean up logs daily
    setInterval(notifyModUpdates, 60 * 60 * 1000); // Check for mod updates hourly
    setInterval(trackPlayerStatistics, 60 * 60 * 1000); // Track player statistics hourly
    setInterval(checkServerHealth, 60 * 60 * 1000); // Check server health hourly

    // Schedule regular backups
    scheduleBackups();
}

client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    
    // Ensure RCON connection
    if (!rconClient.isConnected) {
        await rconClient.connect();
    }

    // Modify wheelspin command
    if (command === 'wheelspin') {
        // ...existing code...
        const result = await rconClient.sendCommand(`additem ${winner.steamid} ${prize.id} 1`);
        // ...existing code...
    }

    // Modify health check
    if (command === 'health') {
        const serverStatus = await rconClient.sendCommand('status');
        // ...existing code...
    }
});

// Add console monitoring
setInterval(async () => {
    if (!rconClient.isConnected) {
        await rconClient.connect();
    }
    const serverOutput = await rconClient.sendCommand('monitor');
    console.log('Server Output:', serverOutput);
}, 30000);
chec