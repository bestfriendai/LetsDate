import express from 'express';
import cors from 'cors';
import type { Event } from '../types';

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json());

// Handle both GET and POST requests
app.all('/api/events/search', async (req, res) => {
  let query: string;
  let date: string | undefined;
  let location: { lat: number; lon: number; radius?: number };

  // Parse parameters based on request method
  if (req.method === 'GET') {
    query = req.query.query as string;
    date = req.query.date as string;
    location = {
      lat: parseFloat(req.query.lat as string),
      lon: parseFloat(req.query.lon as string),
      radius: req.query.radius ? parseFloat(req.query.radius as string) : undefined
    };
  } else {
    // POST request
    const body = req.body;
    query = body.query;
    date = body.date;
    location = body.location;
  }

  if (!query || !location || isNaN(location.lat) || isNaN(location.lon)) {
    return res.status(400).json({
      error: 'Missing required parameters',
      details: 'Location and query are required'
    });
  }

  try {
    const response = await fetch('https://backend-hut5d7gx1-bestfriendais-projects.vercel.app/api/events/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, date, location })
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json(error);
    }

    const events: Event[] = await response.json();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});