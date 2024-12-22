const { AppError } = require('../utils/errorHandler');

class ConfigValidator {
    validateServerConfig(config) {
        const requiredFields = [
            'ZOMBOID_SERVER_PATH',
            'ADMIN_PASSWORD',
            'RCON_PASSWORD',
            'SERVER_NAME'
        ];

        const missingFields = requiredFields.filter(field => !process.env[field]);
        if (missingFields.length > 0) {
            throw new AppError(`Missing required configuration: ${missingFields.join(', ')}`, 500);
        }

        // Validate paths
        if (!this.isValidPath(process.env.ZOMBOID_SERVER_PATH)) {
            throw new AppError('Invalid server path', 500);
        }

        // Validate port ranges
        const port = parseInt(process.env.SERVER_PORT);
        if (isNaN(port) || port < 1024 || port > 65535) {
            throw new AppError('Invalid server port', 500);
        }
    }

    isValidPath(path) {
        try {
            return require('fs').existsSync(path);
        } catch {
            return false;
        }
    }
}

module.exports = new ConfigValidator();
