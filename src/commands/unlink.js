module.exports = {
    name: 'unlink',
    description: 'Unlink Steam account',
    async execute(message) {
        try {
            await accountManager.unlinkAccount(message.author.id);
            
            // Remove player role
            const playerRole = message.guild.roles.cache.find(role => role.name === 'Player');
            if (playerRole) {
                await message.member.roles.remove(playerRole);
            }

            message.reply('Account unlinked successfully!');
        } catch (error) {
            message.reply(`Error: ${error.message}`);
        }
    }
};