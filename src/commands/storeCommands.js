const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'store',
    commands: {
        store: {
            description: 'View the points store',
            execute: async (message, args, bot) => {
                const embed = bot.store.getStoreEmbed();
                message.channel.send({ embeds: [embed] });
            }
        },
        
        buy: {
            description: 'Purchase points package',
            execute: async (message, args, bot) => {
                if (!args[0]) {
                    return message.reply('Please specify a package: small, medium, large, or mega');
                }

                try {
                    const payment = await bot.store.createPayment(message.author.id, args[0]);
                    
                    const embed = new MessageEmbed()
                        .setTitle('Purchase Points')
                        .setDescription(`Click the link below to purchase ${payment.points} points for $${payment.amount}`)
                        .addField('Payment Link', payment.url)
                        .setColor('#00ff00');
                    
                    message.author.send({ embeds: [embed] });
                    message.reply('Check your DMs for payment information!');
                } catch (error) {
                    message.reply('Error processing your purchase. Please try again later.');
                }
            }
        },

        history: {
            description: 'View your transaction history',
            execute: async (message, args, bot) => {
                const transactions = await bot.store.getUserTransactions(message.author.id);
                
                const embed = new MessageEmbed()
                    .setTitle('Transaction History')
                    .setDescription(transactions.length ? 'Your recent transactions:' : 'No transactions found')
                    .setColor('#0099ff');

                transactions.slice(0, 10).forEach(t => {
                    embed.addField(
                        `${t.type} - ${t.createdAt.toLocaleDateString()}`,
                        `Points: ${t.points}\nAmount: $${t.amount}\nStatus: ${t.status}`
                    );
                });

                message.channel.send({ embeds: [embed] });
            }
        }
    }
};
