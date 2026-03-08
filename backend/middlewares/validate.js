const Joi = require('joi');
const { ApiError } = require('./errorHandler');

const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            return next(new ApiError(400, `Validation Error: ${errorMessage}`));
        }

        next();
    };
};

module.exports = validateRequest;
