const { AppError } = require('../utils/errorHandler');

class Validator {
    validateServerConfig(config) {
        const required = ['serverName', 'maxPlayers', 'adminPassword'];
        for (const field of required) {
            if (!config[field]) {
                throw new AppError(`Missing required field: ${field}`, 400);
            }
        }
        
        if (config.maxPlayers < 1 || config.maxPlayers > 100) {
            throw new AppError('Invalid maxPlayers value', 400);
        }
    }

    validateBackupConfig(config) {
        if (!config.path || !config.interval) {
            throw new AppError('Missing backup configuration', 400);
        }

        if (config.interval < 3600000) { // Minimum 1 hour
            throw new AppError('Backup interval too short', 400);
        }
    }
}

module.exports = new Validator();
