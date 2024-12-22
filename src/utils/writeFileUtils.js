const fs = require('fs');
const logger = require('../utils/logger');

function writeFileContent(filePath, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, 'utf8', (error) => {
            if (error) {
                logger.error('Error writing file:', error);
                return reject(error);
            }
            resolve();
        });
    });
}

module.exports = { writeFileContent };
