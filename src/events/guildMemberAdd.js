module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
        if (!channel) return;
        channel.send(`Welcome to the server, ${member}! Feel free to ask any questions.`);
    }
};