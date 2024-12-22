// ...existing code...

const logger = require('../logging/loggingSystem');

const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
};

// ...existing code...

module.exports = errorHandler;
