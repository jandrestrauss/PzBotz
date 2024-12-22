const metrics = require('../monitoring/advancedMetrics');

class EnhancedError extends Error {
    constructor(message, code, data = {}) {
        super(message);
        this.code = code;
        this.data = data;
        this.timestamp = new Date();
        
        metrics.metrics.application.set('errors', 
            (metrics.metrics.application.get('errors') || 0) + 1
        );
    }

    static handle(error, req, res, next) {
        console.error('Error occurred:', error);
        
        if (error instanceof EnhancedError) {
            return res.status(error.code).json({
                error: error.message,
                timestamp: error.timestamp,
                data: error.data
            });
        }

        return res.status(500).json({
            error: 'Internal Server Error',
            timestamp: new Date()
        });
    }
}

module.exports = EnhancedError;
