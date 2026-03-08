const express = require('express');
const axios = require('axios');
const { ApiError } = require('../middlewares/errorHandler');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

/**
 * @route POST /api/predict
 * @desc  Validate symptoms → call FastAPI ML service → return prediction
 * @access Private (JWT required)
 */
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
            throw new ApiError(400, 'Please provide an array of symptoms');
        }

        const ML_SERVICE_URL = process.env.FASTAPI_ML_URL || 'http://localhost:8000';

        try {
            const mlResponse = await axios.post(
                `${ML_SERVICE_URL}/predict`,
                { symptoms },
                { timeout: 5000 }
            );

            return res.status(200).json({
                status: 'success',
                ...mlResponse.data,
            });
        } catch (mlError) {
            console.error('[ML Service Error]', mlError.message);

            // Dev fallback mock — returns a fake result so you can test the UI end-to-end
            if (process.env.NODE_ENV === 'development') {
                console.log('[DEV] Using mock ML response');
                return res.status(200).json({
                    status: 'success',
                    disease: 'Common Cold (Mock)',
                    confidence: 0.92,
                    medicines: ['Paracetamol 500mg', 'Rest & Hydration', 'Throat Lozenges'],
                    prescriptionHash:
                        '0x' + Math.random().toString(16).slice(2) + Date.now().toString(16),
                });
            }

            if (mlError.code === 'ECONNABORTED' || mlError.code === 'ETIMEDOUT') {
                throw new ApiError(504, 'AI Analysis service timed out. Please try again.');
            }

            throw new ApiError(503, 'AI Diagnosis service is currently unavailable.');
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
