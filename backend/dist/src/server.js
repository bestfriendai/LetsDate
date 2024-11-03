import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load environment variables before any other imports
dotenv.config({ path: resolve(__dirname, '../../.env') });
import express from 'express';
import cors from 'cors';
import { validateEnvVariables } from './utils/index.js';
import { orchestrator } from './services/orchestrator.js';
import geocodeRoutes from '../api/geocode.js';
const app = express();
// Configure CORS with specific origin
const allowedOrigins = ['https://mydateapp.vercel.app'];
if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:5173');
}
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    credentials: true,
    maxAge: 86400 // 24 hours
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
// Add CORS headers middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Content-Security-Policy', "default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'self' 'unsafe-inline' 'unsafe-eval'; connect-src * 'self'; img-src * data: blob: 'self'; frame-src *; style-src * 'self' 'unsafe-inline';");
    next();
});
// Request timeout middleware - increased timeout for Vercel serverless
const timeoutMiddleware = (req, res, next) => {
    req.setTimeout(30000, () => {
        res.status(408).json({ error: 'Request timeout' });
    });
    next();
};
app.use(timeoutMiddleware);
// Validate environment variables middleware
const validateEnvMiddleware = (req, res, next) => {
    try {
        validateEnvVariables([
            'EVENTBRITE_API_KEY',
            'TICKETMASTER_API_KEY',
            'RAPIDAPI_KEY',
            'ANTHROPIC_API_KEY',
            'PERPLEXITY_API_KEY'
        ]);
        next();
    }
    catch (err) {
        console.error('Environment validation error:', err);
        const error = err;
        res.status(500).json({
            error: 'Server configuration error',
            message: process.env.NODE_ENV === 'development' ? error?.message || 'Unknown error' : 'Internal server error'
        });
    }
};
// Health check endpoint - optimized for quick response
const healthCheck = (req, res) => {
    const availableServices = [
        'EVENTBRITE_API_KEY',
        'TICKETMASTER_API_KEY',
        'RAPIDAPI_KEY',
        'ANTHROPIC_API_KEY',
        'PERPLEXITY_API_KEY'
    ].reduce((acc, key) => {
        acc[key.toLowerCase()] = !!process.env[key];
        return acc;
    }, {});
    res.json({
        status: 'healthy',
        services: availableServices,
        env: process.env.NODE_ENV || 'development'
    });
};
app.get('/api/health', healthCheck);
// Search events endpoint - with increased timeout
const searchEvents = async (req, res) => {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timed out')), 25000));
    try {
        // Support both GET and POST requests
        const params = req.method === 'GET' ? {
            query: req.query.query,
            location: {
                lat: parseFloat(req.query.lat),
                lon: parseFloat(req.query.lon),
                radius: req.query.radius ? parseFloat(req.query.radius) : undefined
            },
            date: req.query.date,
            categories: req.query.categories
        } : req.body;
        if (!params.location || !params.query) {
            res.status(400).json({
                error: 'Missing required parameters',
                details: 'Location and query are required'
            });
            return;
        }
        const events = await Promise.race([
            orchestrator.searchEvents(params),
            timeoutPromise
        ]);
        res.json(events);
    }
    catch (err) {
        console.error('Error searching events:', err);
        const error = err;
        res.status(error.message === 'Operation timed out' ? 408 : 500).json({
            error: error.message === 'Operation timed out' ? 'Request timeout' : 'Failed to search events',
            details: process.env.NODE_ENV === 'development' ? error?.message || 'Unknown error' : undefined
        });
    }
};
app.get('/api/events/search', validateEnvMiddleware, searchEvents);
app.post('/api/events/search', validateEnvMiddleware, searchEvents);
// Generate date plan endpoint - with increased timeout
const generateDatePlan = async (req, res) => {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timed out')), 25000));
    try {
        const { location, preferences, budget, date } = req.body;
        if (!location || !preferences) {
            res.status(400).json({
                error: 'Missing required parameters',
                details: 'Location and preferences are required'
            });
            return;
        }
        const datePlan = await Promise.race([
            orchestrator.generateDatePlan({
                location,
                preferences,
                budget,
                date
            }),
            timeoutPromise
        ]);
        res.json(datePlan);
    }
    catch (err) {
        console.error('Error generating date plan:', err);
        const error = err;
        res.status(error.message === 'Operation timed out' ? 408 : 500).json({
            error: error.message === 'Operation timed out' ? 'Request timeout' : 'Failed to generate date plan',
            details: process.env.NODE_ENV === 'development' ? error?.message || 'Unknown error' : undefined
        });
    }
};
app.post('/api/date/plan', validateEnvMiddleware, generateDatePlan);
// Register geocoding routes
app.use('/api/geocode', geocodeRoutes);
// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Unhandled error:', err);
    const error = err;
    res.status(500).json({
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error?.message || 'Unknown error' : undefined
    });
};
app.use(errorHandler);
// Export the Express app as a serverless function handler
export default app;
// For local development
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Environment variables:', {
            EVENTBRITE_API_KEY: process.env.EVENTBRITE_API_KEY ? 'Set' : 'Not set',
            TICKETMASTER_API_KEY: process.env.TICKETMASTER_API_KEY ? 'Set' : 'Not set',
            RAPIDAPI_KEY: process.env.RAPIDAPI_KEY ? 'Set' : 'Not set',
            ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not set',
            PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY ? 'Set' : 'Not set'
        });
    });
}
//# sourceMappingURL=server.js.map