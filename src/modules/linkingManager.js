const crypto = require('crypto');
const { MessageEmbed } = require('discord.js');

class LinkingManager {
    constructor() {
        this.pendingLinks = new Map();
    }

    generateLinkCode(discordId) {
        const code = crypto.randomBytes(3).toString('hex').toUpperCase();
        this.pendingLinks.set(code, {
            discordId,
            timestamp: Date.now(),
            expires: Date.now() + 300000 // 5 minutes
        });
        return code;
    }

    async sendLinkInstructions(user, linkCode) {
        const embed = new MessageEmbed()
            .setTitle('🔗 Account Linking')
            .setColor('#00ff00')
            .setDescription('Follow these steps to link your account:')
            .addField('Step 1', 'Join the game server')
            .addField('Step 2', `Type this code in the game chat: \`!link ${linkCode}\``)
            .addField('Step 3', 'Wait for confirmation')
            .addField('⏱️ Time Limit', '5 minutes')
            .setFooter({ text: 'Code expires in 5 minutes' });

        await user.send({ embeds: [embed] });
    }

    async handleIngameMessage(playerName, message) {
        if (!message.startsWith('!link')) return;
        
        const code = message.split(' ')[1];
        const linkData = this.pendingLinks.get(code);

        if (!linkData) return;
        if (Date.now() > linkData.expires) {
            this.pendingLinks.delete(code);
            return 'Link code expired';
        }

        await this.completeLink(linkData.discordId, playerName);
        this.pendingLinks.delete(code);
        return 'Account linked successfully!';
    }
}

module.exports = new LinkingManager();