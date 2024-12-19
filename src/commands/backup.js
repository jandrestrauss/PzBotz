module.exports = {
    name: 'backup',
    description: 'Backup the server',
    async execute(message, args, client) {
        const rcon = require('../utils/rcon');
        try {
            const response = await rcon.sendCommand('save-all');
            message.channel.send('Server backup initiated.');
        } catch (error) {
            message.channel.send('Failed to initiate server backup.');
        }
    }
};