const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ApiError } = require('../middlewares/errorHandler');

const router = express.Router();

// In-memory mock user store (replace with real DB query when PostgreSQL is ready)
const MOCK_USERS = [];

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1d' }
    );
};

/**
 * @route POST /api/auth/register
 * @access Public
 */
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new ApiError(400, 'Please provide name, email, and password');
        }

        if (MOCK_USERS.find((u) => u.email === email)) {
            throw new ApiError(400, 'User with this email already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            id: MOCK_USERS.length + 1,
            name,
            email,
            password: hashedPassword,
        };

        MOCK_USERS.push(newUser);

        const token = generateToken(newUser);

        res.status(201).json({
            status: 'success',
            token,
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route POST /api/auth/login
 * @access Public
 */
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError(400, 'Please provide email and password');
        }

        const user = MOCK_USERS.find((u) => u.email === email);

        if (!user) {
            throw new ApiError(401, 'Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new ApiError(401, 'Invalid email or password');
        }

        const token = generateToken(user);

        res.status(200).json({
            status: 'success',
            token,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
