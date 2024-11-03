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
import geocodeRoutes from './api/geocode.js';
import type {
  AsyncRequestHandler,
  SyncRequestHandler,
  HealthCheckResponse,
  SearchEventsRequest,
  DatePlanRequest
} from './types/index.js';

const app = express();

// Configure CORS with specific options
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        /\.vercel\.app$/,  // Allow all vercel.app subdomains
        /\.netlify\.app$/,  // Allow all netlify.app subdomains
        /\.netlify\.com$/,  // Allow all netlify.com subdomains
        /localhost:[0-9]+$/  // Allow all localhost ports
      ]
    : true, // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // Cache preflight request results for 24 hours
};

// Use CORS middleware with configured options
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Add CSP middleware
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    `
      default-src 'self';
      script-src 'self' 'unsafe-inline';
      connect-src 'self' *.netlify.app *.netlify.com;
      img-src 'self' data: blob:;
      frame-src 'self';
      style-src 'self' 'unsafe-inline';
      font-src 'self';
    `.replace(/\s{2,}/g, ' ').trim()
  );
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request timeout middleware - increased timeout for Netlify serverless
const timeoutMiddleware: SyncRequestHandler = (req, res, next) => {
  req.setTimeout(30000, () => {
    res.status(408).json({ error: 'Request timeout' });
  });
  next();
};

app.use(timeoutMiddleware);

// Validate environment variables middleware
const validateEnvMiddleware: SyncRequestHandler = (req, res, next) => {
  try {
    validateEnvVariables([
      'EVENTBRITE_API_KEY',
      'TICKETMASTER_API_KEY',
      'RAPIDAPI_KEY',
      'ANTHROPIC_API_KEY',
      'PERPLEXITY_API_KEY'
    ]);
    next();
  } catch (err) {
    console.error('Environment validation error:', err);
    const error = err as Error;
    res.status(500).json({
      error: 'Server configuration error',
      message: process.env.NODE_ENV === 'development' ? error?.message || 'Unknown error' : 'Internal server error'
    });
  }
};

// Health check endpoint - optimized for quick response
const healthCheck: SyncRequestHandler<HealthCheckResponse> = (req, res) => {
  const availableServices = [
    'EVENTBRITE_API_KEY',
    'TICKETMASTER_API_KEY',
    'RAPIDAPI_KEY',
    'ANTHROPIC_API_KEY',
    'PERPLEXITY_API_KEY'
  ].reduce((acc: Record<string, boolean>, key) => {
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
const searchEvents: AsyncRequestHandler = async (req, res) => {
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Operation timed out')), 25000)
  );

  try {
    // Support both GET and POST requests
    const params = req.method === 'GET' ? {
      query: req.query.query as string,
      location: {
        lat: parseFloat(req.query.lat as string),
        lon: parseFloat(req.query.lon as string),
        radius: req.query.radius ? parseFloat(req.query.radius as string) : undefined
      },
      date: req.query.date as string | undefined,
      categories: req.query.categories as string[] | undefined
    } : req.body as SearchEventsRequest;
    
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
  } catch (err) {
    console.error('Error searching events:', err);
    const error = err as Error;
    res.status(error.message === 'Operation timed out' ? 408 : 500).json({ 
      error: error.message === 'Operation timed out' ? 'Request timeout' : 'Failed to search events',
      details: process.env.NODE_ENV === 'development' ? error?.message || 'Unknown error' : undefined
    });
  }
};

app.get('/api/events/search', validateEnvMiddleware, searchEvents);
app.post('/api/events/search', validateEnvMiddleware, searchEvents);

// Generate date plan endpoint - with increased timeout
const generateDatePlan: AsyncRequestHandler = async (req, res) => {
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Operation timed out')), 25000)
  );

  try {
    const { location, preferences, budget, date } = req.body as DatePlanRequest;
    
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
  } catch (err) {
    console.error('Error generating date plan:', err);
    const error = err as Error;
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
const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err);
  const error = err as Error;
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