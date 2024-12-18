const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const client = new Discord.Client();
const prefix = '!';

// Load configuration values
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

const shopItems = {
    'item1': { name: 'Item 1', price: 100 },
    'item2': { name: 'Item 2', price: 200 },
    'item3': { name: 'Item 3', price: 300 },
    'wheelspin_ticket': { name: 'Wheel Spin Ticket', price: 500 }
};

let userPoints = {}; // Store user points
let userTickets = {}; // Store user tickets for wheel spins

const wheelSpinChannelId = config.wheelSpinChannelId;
const deathLogChannelId = config.deathLogChannelId;
const deathLogFilePath = path.join(__dirname, config.deathLogFilePath);
const pointsFilePath = path.join(__dirname, config.pointsFilePath);
const ticketsFilePath = path.join(__dirname, config.ticketsFilePath);

let lastReadPosition = 0; // Track the last read position in the death log file

// Define your custom wheel spin items and their IDs
const wheelSpinItems = [
    { name: 'Custom Item 1', id: 'item_id_1' },
    { name: 'Custom Item 2', id: 'item_id_2' },
    { name: 'Custom Item 3', id: 'item_id_3' }
];

// Load user points and tickets from persistent storage
function loadUserData() {
    if (fs.existsSync(pointsFilePath)) {
        userPoints = JSON.parse(fs.readFileSync(pointsFilePath, 'utf8'));
    }
    if (fs.existsSync(ticketsFilePath)) {
        userTickets = JSON.parse(fs.readFileSync(ticketsFilePath, 'utf8'));
    }
}

// Save user points and tickets to persistent storage
function saveUserData() {
    fs.writeFileSync(pointsFilePath, JSON.stringify(userPoints, null, 2), 'utf8');
    fs.writeFileSync(ticketsFilePath, JSON.stringify(userTickets, null, 2), 'utf8');
}

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'shop') {
        let shopMessage = 'Available items:\n';
        for (const item in shopItems) {
            shopMessage += `${shopItems[item].name} - ${shopItems[item].price} coins\n`;
        }
        message.author.send(shopMessage).catch(console.error);
    }

    if (command === 'buy') {
        const itemName = args[0];
        if (shopItems[itemName]) {
            const userId = message.author.id;
            if (!userPoints[userId]) userPoints[userId] = 0;

            if (userPoints[userId] >= shopItems[itemName].price) {
                userPoints[userId] -= shopItems[itemName].price;
                message.author.send(`You have bought ${shopItems[itemName].name} for ${shopItems[itemName].price} coins.`).catch(console.error);
                if (itemName === 'wheelspin_ticket') {
                    if (!userTickets[userId]) userTickets[userId] = 0;
                    userTickets[userId] += 1;
                }
                saveUserData(); // Save user data after purchase
                // Implement your logic to assign the item to the user in-game
            } else {
                message.author.send('You do not have enough points to buy this item.').catch(console.error);
            }
        } else {
            message.author.send('Item not found.').catch(console.error);
        }
    }

    if (command === 'addpoints') {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            const userId = args[0];
            const points = parseInt(args[1], 10);
            if (!userPoints[userId]) userPoints[userId] = 0;
            userPoints[userId] += points;
            message.author.send(`Added ${points} points to user ${userId}.`).catch(console.error);
            saveUserData(); // Save user data after adding points
        } else {
            message.author.send('You do not have permission to use this command.').catch(console.error);
        }
    }

    if (command === 'wheelspin') {
        if (message.channel.id !== wheelSpinChannelId) {
            message.channel.send('Wheel spins can only be done in the designated channel.').catch(console.error);
            return;
        }

        const userId = message.author.id;
        if (message.author.id === 'your-discord-user-id' || (userTickets[userId] && userTickets[userId] > 0)) {
            if (userTickets[userId]) userTickets[userId] -= 1;
            const reward = wheelSpinItems[Math.floor(Math.random() * wheelSpinItems.length)];
            message.channel.send(`Congratulations ${message.author.username}, you won ${reward.name}!`).catch(console.error);
            saveUserData(); // Save user data after wheel spin
            // Implement your logic to assign the reward to the user in-game using reward.id
        } else {
            message.channel.send('You do not have a wheel spin ticket.').catch(console.error);
        }
    }

    // ...existing code...
});

// Function to read the death log file and post messages to the death log channel
function readDeathLog() {
    fs.open(deathLogFilePath, 'r', (err, fd) => {
        if (err) {
            console.error('Error opening death log file:', err);
            return;
        }

        fs.fstat(fd, (err, stats) => {
            if (err) {
                console.error('Error getting file stats:', err);
                fs.close(fd, () => {});
                return;
            }

            if (stats.size > lastReadPosition) {
                const buffer = Buffer.alloc(stats.size - lastReadPosition);
                fs.read(fd, buffer, 0, buffer.length, lastReadPosition, (err, bytesRead) => {
                    if (err) {
                        console.error('Error reading death log file:', err);
                        fs.close(fd, () => {});
                        return;
                    }

                    const deathMessages = buffer.toString('utf8').trim().split('\n');
                    deathMessages.forEach(message => {
                        const channel = client.channels.cache.get(deathLogChannelId);
                        if (channel) {
                            channel.send(message).catch(console.error);
                        }
                    });

                    lastReadPosition += bytesRead;
                    fs.close(fd, () => {});
                });
            } else {
                fs.close(fd, () => {});
            }
        });
    });
}

// Set an interval to read the death log file periodically
setInterval(readDeathLog, 60000); // Check every 60 seconds

// Load the bot token from a secure location
const botToken = fs.readFileSync(path.join(__dirname, 'bot_token.txt'), 'utf8').trim();
client.login(botToken).catch(console.error);

// Load user data on startup
loadUserData();
