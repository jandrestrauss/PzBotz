module.exports = {
    testConfig: {
        discord: {
            token: process.env.DISCORD_TOKEN,
            testChannelId: process.env.TEST_CHANNEL_ID
        },
        server: {
            rconHost: process.env.RCON_HOST,
            rconPort: process.env.RCON_PORT,
            rconPassword: process.env.RCON_PASSWORD
        }
    }
};
