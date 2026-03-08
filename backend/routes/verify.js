const express = require('express');
const axios = require('axios');
const { ApiError } = require('../middlewares/errorHandler');

const router = express.Router();

/**
 * @route GET /api/verify/:hash
 * @desc  Verify a prescription hash against the Go Blockchain service
 * @access Public
 */
router.get('/:hash', async (req, res, next) => {
    try {
        const { hash } = req.params;

        if (!hash || hash.trim().length < 10) {
            throw new ApiError(400, 'Invalid blockchain hash — must be at least 10 characters');
        }

        const BLOCKCHAIN_SERVICE_URL = process.env.GO_BLOCKCHAIN_URL || 'http://localhost:5000';

        try {
            const bcResponse = await axios.get(
                `${BLOCKCHAIN_SERVICE_URL}/verify/${hash}`,
                { timeout: 5000 }
            );

            return res.status(200).json({
                status: 'success',
                ...bcResponse.data,
            });
        } catch (bcError) {
            console.error('[Blockchain Service Error]', bcError.message);

            // Dev fallback mock
            if (process.env.NODE_ENV === 'development') {
                console.log('[DEV] Using mock Blockchain response');

                if (hash.toLowerCase().includes('invalid')) {
                    throw new ApiError(404, 'Prescription record not found on the blockchain');
                }

                return res.status(200).json({
                    status: 'success',
                    verified: true,
                    disease: 'Common Cold (Mock)',
                    confidence: 0.92,
                    symptoms: ['headache', 'fever', 'cough'],
                    medicines: ['Paracetamol 500mg', 'Rest & Hydration', 'Throat Lozenges'],
                    timestamp: new Date().toISOString(),
                    issuer: 'MedBlock AI System',
                });
            }

            if (bcError.code === 'ECONNABORTED' || bcError.code === 'ETIMEDOUT') {
                throw new ApiError(504, 'Blockchain verification timed out. Please try again.');
            }

            if (bcError.response?.status === 404) {
                throw new ApiError(404, 'Prescription record not found on the blockchain');
            }

            throw new ApiError(503, 'Blockchain Verification service is currently unavailable.');
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
