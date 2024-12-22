const requiredEnvVars = [
    'DISCORD_TOKEN',
    'GAME_SERVER_IP',
    'GAME_SERVER_PORT',
    'RCON_PASSWORD',
    'DB_CONNECTION_STRING',
    'JWT_SECRET'
];

function validateEnv() {
    const missing = requiredEnvVars.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}`
        );
    }
}

const config = {
    discord: {
        token: process.env.DISCORD_TOKEN,
        guildId: process.env.DISCORD_GUILD_ID
    },
    game: {
        host: process.env.GAME_SERVER_IP,
        port: parseInt(process.env.GAME_SERVER_PORT),
        rconPassword: process.env.RCON_PASSWORD
    },
    database: {
        url: process.env.DB_CONNECTION_STRING,
        maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS) || 10
    }
};

module.exports = { config, validateEnv };
