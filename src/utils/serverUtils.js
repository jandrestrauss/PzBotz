const { exec } = require('child_process');
const logger = require('../utils/logger');

function isServerRunning() {
    return new Promise((resolve, reject) => {
        exec('pgrep -f server_process_name', (error, stdout, stderr) => {
            if (error) {
                logger.error('Error checking server status:', error);
                return resolve(false);
            }
            resolve(stdout.trim().length > 0);
        });
    });
}

module.exports = { isServerRunning };
