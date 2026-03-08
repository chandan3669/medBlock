const jwt = require('jsonwebtoken');
const { ApiError } = require('./errorHandler');

/**
 * Shared JWT Authentication Middleware
 * Verifies the Bearer token from Authorization header
 */
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, 'No token provided, authorization denied');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    } catch (error) {
        // Distinguish JWT-specific errors from ApiErrors
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(401, 'Token is invalid or expired'));
    }
};

module.exports = authMiddleware;
