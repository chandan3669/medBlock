/**
 * Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    // Default to 500 if status code is not set
    statusCode = statusCode || 500;

    // Clean up message, hide internal stack traces in production
    message = message || 'Internal Server Error';

    // Log the error internally
    console.error(`[Error] ${statusCode} - ${message}`, err.stack);

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message: process.env.NODE_ENV === 'production' && statusCode === 500
            ? 'Internal Server Error'
            : message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

/**
 * Custom Error class to throw controlled HTTP errors across services
 */
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    errorHandler,
    ApiError
};
