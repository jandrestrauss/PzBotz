const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkPermissions } = require('../utils/permissions');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Server control commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('restart')
                .setDescription('Schedule a server restart')
                .addIntegerOption(option =>
                    option.setName('delay')
                        .setDescription('Delay in minutes')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Get detailed server status')),

    async execute(interaction) {
        if (!await checkPermissions(interaction.user.id, 'ADMIN')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'restart':
                const delay = interaction.options.getInteger('delay');
                await handleServerRestart(interaction, delay);
                break;
            case 'status':
                await handleServerStatus(interaction);
                break;
        }
    }
};
