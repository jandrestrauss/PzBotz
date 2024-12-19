module.exports = {
    name: 'status',
    description: 'Get server status',
    async execute(message, args, client) {
        const rcon = require('../utils/rcon');
        try {
            const response = await rcon.sendCommand('status');
            message.channel.send(`Server Status: ${response}`);
        } catch (error) {
            message.channel.send('Failed to get server status.');
        }
    }
};