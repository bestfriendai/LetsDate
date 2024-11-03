# DateAI Backend

Backend service for DateAI, providing event search and date planning capabilities through multiple service integrations.

## Features

- Event search across multiple providers (Eventbrite, Ticketmaster, RealTime Events)
- AI-powered date suggestions (Anthropic Claude)
- Date insights and analysis (Perplexity AI)
- Graceful degradation when services are unavailable
- CORS support for frontend integration
- Rate limiting and caching
- Circuit breaker pattern for service resilience

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- A Vercel account for deployment

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Event APIs
EVENTBRITE_API_KEY=your_key_here
TICKETMASTER_API_KEY=your_key_here
TICKETMASTER_SECRET=your_secret_here
RAPIDAPI_KEY=your_key_here

# AI APIs
ANTHROPIC_API_KEY=your_key_here
PERPLEXITY_API_KEY=your_key_here
```

Note: The service will work even if some API keys are missing, with graceful degradation of functionality.

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The server will be available at http://localhost:3001

## API Endpoints

### Health Check
```
GET /api/health
```
Returns the status of all integrated services.

### Search Events
```
POST /api/events/search
Content-Type: application/json

{
  "query": "concerts",
  "location": "New York",
  "date": "2024-02-14",  // optional
  "categories": ["Music"] // optional
}
```

### Generate Date Plan
```
POST /api/date/plan
Content-Type: application/json

{
  "location": "New York",
  "preferences": "romantic dinner",
  "budget": 200,         // optional
  "date": "2024-02-14"  // optional
}
```

## Deployment to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Build the project:
```bash
npm run build
```

3. Deploy to Vercel:
```bash
npm run deploy
```

4. Set up environment variables in Vercel:
- Go to your project settings in the Vercel dashboard
- Add all the environment variables from your `.env` file
- Redeploy if necessary

## Error Handling

The service implements several error handling strategies:

- Circuit breaker pattern for external services
- Rate limiting to prevent API quota exhaustion
- Caching to improve performance and reduce API calls
- Graceful degradation when services are unavailable

## Architecture

The backend follows a modular architecture:

- `/src/services`: Individual service implementations
- `/src/types`: TypeScript type definitions
- `/src/utils`: Utility functions and error handling
- `server.ts`: Main Express application

Each service is designed to work independently, allowing the system to function even when some services are unavailable.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC