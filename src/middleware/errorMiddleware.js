const logger = require('../utils/logger');

const errorMiddleware = {
    async handleCommandError(error, message) {
        logger.error('Command error:', error);
        await message.reply('An error occurred while processing your command.');
        
        if (process.env.NODE_ENV === 'development') {
            await message.channel.send(`Debug: ${error.message}`);
        }
    },

    async handleWebError(error, req, res, next) {
        logger.error('Web error:', error);

        if (res.headersSent) {
            return next(error);
        }

        res.status(error.status || 500).json({
            error: process.env.NODE_ENV === 'production' 
                ? 'Internal server error' 
                : error.message
        });
    },

    handleUncaughtErrors() {
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught exception:', error);
            process.exit(1);
        });

        process.on('unhandledRejection', (error) => {
            logger.error('Unhandled rejection:', error);
        });
    }
};

module.exports = errorMiddleware;
