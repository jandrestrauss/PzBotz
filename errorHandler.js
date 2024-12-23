const uuid = require('uuid');

// Global error handler middleware
class ErrorHandler {
  static async handleError(err, req, res, next) {
    const errorId = uuid.v4();
    
    // Log error details
    console.error({
      errorId,
      timestamp: new Date(),
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method
    });

    // Send appropriate response
    res.status(err.status || 500).json({
      error: {
        message: process.env.NODE_ENV === 'production' 
          ? 'An unexpected error occurred' 
          : err.message,
        errorId,
        status: err.status || 500
      }
    });
  }
}

// Custom error class
class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

module.exports = { ErrorHandler, AppError };
