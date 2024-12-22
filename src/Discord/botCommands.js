const { SlashCommandBuilder } = require('@discordjs/builders');
const gameIntegration = require('../server/gameIntegration');
const { checkPermission } = require('../security/permissions');

const commands = {
    serverStatus: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Get server status'),
        
    restartServer: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Restart the server')
        .setDefaultPermission(false),
        
    playerList: new SlashCommandBuilder()
        .setName('players')
        .setDescription('List online players')
};

async function handleCommand(interaction) {
    const command = interaction.commandName;
    const userId = interaction.user.id;

    if (!checkPermission(userId, command)) {
        await interaction.reply('You do not have permission to use this command.');
        return;
    }

    try {
        switch (command) {
            case 'status':
                const status = await gameIntegration.sendCommand('status');
                await interaction.reply(status);
                break;
            // Add more command handlers
        }
    } catch (error) {
        console.error('Command error:', error);
        await interaction.reply('An error occurred while processing the command.');
    }
}

module.exports = { commands, handleCommand };
