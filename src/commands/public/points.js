const Command = require('../base/Command');
const pointsSystem = require('../../services/pointsSystem');
const { MessageEmbed } = require('discord.js');

class PointsCommand extends Command {
    constructor() {
        super('points', 'Check your points or view leaderboard');
    }

    async execute(message, args) {
        if (args[0] === 'top') {
            return this.showLeaderboard(message);
        }
        
        const points = pointsSystem.getPoints(message.author.id);
        return message.reply(`You have ${points} points.`);
    }

    async showLeaderboard(message) {
        const topPoints = pointsSystem.getTopPoints();
        const embed = new MessageEmbed()
            .setTitle('Points Leaderboard')
            .setColor('#FFD700');

        for (const [userId, points] of topPoints) {
            try {
                const user = await message.client.users.fetch(userId);
                embed.addField(user.username, `${points} points`);
            } catch (error) {
                embed.addField('Unknown User', `${points} points`);
            }
        }

        return message.reply({ embeds: [embed] });
    }
}

module.exports = new PointsCommand();
