module.exports = {
    name: 'health',
    description: 'Get server health',
    async execute(message, args, client) {
        const rcon = require('../utils/rcon');
        try {
            const response = await rcon.sendCommand('health');
            message.channel.send(`Server Health: ${response}`);
        } catch (error) {
            message.channel.send('Failed to get server health.');
        }
    }
};