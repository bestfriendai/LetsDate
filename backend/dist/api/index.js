import * as dotenv from 'dotenv';
// Load environment variables before any other imports
dotenv.config();
import app from '../src/server.js';
// Export a function that Vercel can use as a serverless function
export default async function handler(req, res) {
    try {
        // Add CORS headers based on environment
        const allowedOrigin = process.env.NODE_ENV === 'production'
            ? 'https://mydateapp.vercel.app'
            : 'http://localhost:5173';
        // Set CORS headers based on origin
        const requestOrigin = req.headers.origin;
        if (requestOrigin === allowedOrigin) {
            res.setHeader('Access-Control-Allow-Origin', requestOrigin);
        }
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Max-Age', '86400');
        // Set security headers
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Content-Security-Policy', "default-src 'self'; connect-src *; img-src * data: blob:; style-src 'self' 'unsafe-inline';");
        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }
        // Parse body for POST requests
        if (req.method === 'POST' && !req.body && req.headers['content-type']?.includes('application/json')) {
            try {
                req.body = JSON.parse(req.body);
            }
            catch (e) {
                console.warn('Failed to parse request body:', e);
            }
        }
        // Validate required environment variables
        const requiredEnvVars = [
            'EVENTBRITE_API_KEY',
            'TICKETMASTER_API_KEY',
            'RAPIDAPI_KEY',
            'ANTHROPIC_API_KEY',
            'PERPLEXITY_API_KEY'
        ];
        const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);
        if (missingEnvVars.length > 0) {
            console.error('Missing required environment variables:', missingEnvVars);
            throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
        }
        // Forward the request to our Express app
        await new Promise((resolve, reject) => {
            app(req, res, (result) => {
                if (result instanceof Error) {
                    return reject(result);
                }
                return resolve(result);
            });
        });
    }
    catch (err) {
        console.error('Serverless function error:', err);
        const error = err;
        const isDev = process.env.NODE_ENV === 'development';
        res.status(500).json({
            error: 'Internal Server Error',
            message: isDev ? error?.message || 'Unknown error' : 'An error occurred',
            ...(isDev && { stack: error?.stack }),
            timestamp: new Date().toISOString(),
            requestId: req.headers['x-request-id'] || req.headers['x-vercel-id']
        });
    }
}
//# sourceMappingURL=index.js.map