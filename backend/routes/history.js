const express = require('express');
const { ApiError } = require('../middlewares/errorHandler');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

/**
 * @route GET /api/history/:userId
 * @desc  Fetch prescription history for the authenticated user
 * @access Private (JWT required)
 */
router.get('/:userId', authMiddleware, async (req, res, next) => {
    try {
        const userId = req.params.userId === 'me' ? req.user.id : parseInt(req.params.userId, 10);

        // Authorization: users can only access their own history
        if (userId !== req.user.id) {
            throw new ApiError(403, 'Forbidden: You can only view your own history');
        }

        // Mock data — replace this block with a real PostgreSQL query when DB is ready
        const mockRecords = [
            {
                id: 1,
                disease: 'Viral Pharyngitis',
                confidence: 0.89,
                symptoms: ['sore throat', 'fever'],
                medicines: ['Ibuprofen 400mg', 'Throat Lozenges'],
                prescriptionHash: '0xabc123def456789hashrecordblock001',
                createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            },
            {
                id: 2,
                disease: 'Allergic Rhinitis',
                confidence: 0.95,
                symptoms: ['runny nose', 'sneezing', 'itchy eyes'],
                medicines: ['Loratadine 10mg', 'Nasal Saline Spray'],
                prescriptionHash: '0x987fed654cba321hashrecordblock002',
                createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
            },
        ];

        res.status(200).json({
            status: 'success',
            results: mockRecords.length,
            records: mockRecords,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
