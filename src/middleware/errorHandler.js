const logger = require('../utils/logger');

class ErrorHandler {
    static async handleError(error, req, res, next) {
        logger.error('Unhandled error:', error);

        if (res.headersSent) {
            return next(error);
        }

        const statusCode = error.statusCode || 500;
        const message = process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : error.message;

        res.status(statusCode).json({
            error: {
                message,
                code: error.code || 'INTERNAL_ERROR',
                timestamp: new Date().toISOString()
            }
        });

        // Log critical errors to Discord if configured
        if (statusCode === 500 && global.discord) {
            await this.notifyDiscord(error);
        }
    }

    static async notifyDiscord(error) {
        try {
            const channel = await global.discord.channels.fetch(process.env.ERROR_CHANNEL_ID);
            if (channel) {
                await channel.send({
                    embeds: [{
                        title: 'Critical Error',
                        description: `\`\`\`\n${error.stack}\n\`\`\``,
                        color: 0xff0000,
                        timestamp: new Date()
                    }]
                });
            }
        } catch (e) {
            logger.error('Failed to send error notification to Discord:', e);
        }
    }
}

module.exports = ErrorHandler;
