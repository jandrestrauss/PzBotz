const { exec } = require('child_process');
const logger = require('../utils/logger');

function pingServer(serverAddress) {
    return new Promise((resolve, reject) => {
        exec(`ping -c 4 ${serverAddress}`, (error, stdout, stderr) => {
            if (error) {
                logger.error('Error pinging server:', error);
                return reject(error);
            }
            resolve(stdout);
        });
    });
}

module.exports = { pingServer };
