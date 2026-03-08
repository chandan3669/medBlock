require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middlewares/errorHandler');

// Route Imports
const authRoutes = require('./routes/auth');
const predictRoutes = require('./routes/predict');
const historyRoutes = require('./routes/history');
const verifyRoutes = require('./routes/verify');

const app = express();

// --- Security, Performance & Logging Middlewares ---
app.use(helmet()); // Sets robust security headers

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://your-production-frontend.com'
        : 'http://localhost:3000',
    credentials: true
}));

app.use(express.json({ limit: '1mb' })); // Limit body payload
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // HTTP request logger
} else {
    app.use(morgan('combined'));
}

// Global API Rate Limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window`
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { status: 'error', message: 'Too many requests from this IP, please try again later.' }
});

app.use('/api/', apiLimiter);

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/verify', verifyRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Centralized Error Handler (Must be last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`🚀 API Gateway running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
