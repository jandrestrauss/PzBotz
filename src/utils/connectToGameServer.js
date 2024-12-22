const Rcon = require('rcon');
const logger = require('../utils/logger');

async function connectToGameServer() {
    return new Promise((resolve, reject) => {
        const rcon = new Rcon('localhost', 25575, 'password');
        
        rcon.on('auth', () => {
            logger.info('Authenticated with game server.');
            resolve(rcon);
        }).on('error', (error) => {
            logger.error('Error connecting to game server:', error);
            reject(error);
        }).on('end', () => {
            logger.info('Connection to game server closed.');
        });

        rcon.connect();
    });
}

module.exports = { connectToGameServer };
