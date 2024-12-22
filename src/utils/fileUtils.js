const fs = require('fs');
const logger = require('../utils/logger');

function readFileContent(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (error, data) => {
            if (error) {
                logger.error('Error reading file:', error);
                return reject(error);
            }
            resolve(data);
        });
    });
}

module.exports = { readFileContent };
