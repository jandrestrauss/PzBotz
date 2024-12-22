const { MessageEmbed } = require('discord.js');
const logger = require('../utils/logger');

class StoreManager {
    constructor(bot) {
        this.bot = bot;
        this.packages = {
            small: { points: 1000, price: 5 },    // $5 for 1000 points
            medium: { points: 2500, price: 10 },  // $10 for 2500 points
            large: { points: 5500, price: 20 },   // $20 for 5500 points (10% bonus)
            mega: { points: 12000, price: 40 }    // $40 for 12000 points (20% bonus)
        };
    }

    getStoreEmbed() {
        const embed = new MessageEmbed()
            .setTitle('Server Points Store')
            .setDescription('Purchase points to spend in-game!')
            .setColor('#00ff00')
            .addFields(
                { name: '🪙 Small Package', value: `${this.packages.small.points} points - $${this.packages.small.price}`, inline: true },
                { name: '💰 Medium Package', value: `${this.packages.medium.points} points - $${this.packages.medium.price}`, inline: true },
                { name: '💎 Large Package', value: `${this.packages.large.points} points - $${this.packages.large.price} (10% bonus)`, inline: true },
                { name: '👑 Mega Package', value: `${this.packages.mega.points} points - $${this.packages.mega.price} (20% bonus)`, inline: true }
            )
            .setFooter({ text: 'Use !buy <package> to make a purchase' });
        
        return embed;
    }

    async createPayment(userId, package) {
        const packageInfo = this.packages[package];
        if (!packageInfo) {
            throw new Error('Invalid package selected');
        }

        try {
            const user = await this.bot.client.users.fetch(userId);
            const payment = await this.bot.paystack.initializePayment(
                userId, 
                {
                    ...packageInfo,
                    name: package
                },
                user.email || await this.promptForEmail(user)
            );

            return {
                success: true,
                reference: payment.reference,
                amount: packageInfo.price,
                points: packageInfo.points,
                url: payment.accessUrl
            };
        } catch (error) {
            logger.error('Payment creation error:', error);
            throw error;
        }
    }

    async promptForEmail(user) {
        // Create DM to ask for email
        const dm = await user.createDM();
        await dm.send('Please provide your email address to continue with the purchase:');
        
        try {
            const response = await dm.awaitMessages({
                filter: m => m.author.id === user.id && m.content.includes('@'),
                max: 1,
                time: 300000,
                errors: ['time']
            });
            
            return response.first().content.trim();
        } catch (error) {
            throw new Error('Email prompt timeout');
        }
    }

    async processPayment(paymentId) {
        try {
            // TODO: Implement payment verification
            const payment = await this.verifyPayment(paymentId);
            if (payment.status === 'completed') {
                await this.awardPoints(payment.userId, payment.points);
                return true;
            }
            return false;
        } catch (error) {
            logger.error('Payment processing error:', error);
            return false;
        }
    }

    async awardPoints(userId, points) {
        try {
            await this.bot.database.addUserPoints(userId, points);
            const user = await this.bot.client.users.fetch(userId);
            
            const embed = new MessageEmbed()
                .setTitle('Points Added!')
                .setDescription(`Added ${points} points to your account`)
                .setColor('#00ff00');
            
            await user.send({ embeds: [embed] });
            logger.info(`Awarded ${points} points to user ${userId}`);
        } catch (error) {
            logger.error('Error awarding points:', error);
            throw error;
        }
    }

    // Transaction history
    async getUserTransactions(userId) {
        return await this.bot.database.getUserTransactions(userId);
    }
}

module.exports = StoreManager;
