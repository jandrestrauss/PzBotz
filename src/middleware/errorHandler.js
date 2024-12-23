const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

class ErrorHandler {
    static async handleError(err, req, res, next) {
        const errorId = uuidv4();
        
        // Log error details
        console.error({
            errorId,
            timestamp: new Date(),
            error: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method
        });

        if (res.headersSent) {
            return next(err);
        }

        const statusCode = err.status || 500;
        const message = process.env.NODE_ENV === 'production' 
            ? 'An unexpected error occurred' 
            : err.message;

        res.status(statusCode).json({
            error: {
                message,
                errorId,
                status: statusCode
            }
        });

        // Log critical errors to Discord if configured
        if (statusCode === 500 && global.discord) {
            await this.notifyDiscord(err);
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

class AppError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
}

module.exports = { ErrorHandler, AppError };
