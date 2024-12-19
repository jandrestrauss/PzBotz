const { MessageEmbed } = require('discord.js');
const linkingManager = require('../modules/linkingManager');

module.exports = {
    name: 'link',
    description: 'Link your Steam account',
    async execute(message) {
        try {
            const linkCode = linkingManager.generateLinkCode(message.author.id);
            await linkingManager.sendLinkInstructions(message.author, linkCode);
            
            await message.reply('Check your DMs for linking instructions! 📬');
        } catch (error) {
            message.reply('Failed to send DM. Please enable DMs from server members.');
        }
    }
};