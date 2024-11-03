import { json } from '@remix-run/node';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import type { Event } from '../../types';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('query');
  const date = url.searchParams.get('date');
  const lat = url.searchParams.get('lat');
  const lon = url.searchParams.get('lon');
  const radius = url.searchParams.get('radius');

  if (!query || !lat || !lon) {
    throw json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/events/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        date,
        location: {
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          radius: radius ? parseFloat(radius) : undefined
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw json(error, { status: response.status });
    }

    const events: Event[] = await response.json();
    return json(events, {
      headers: {
        'Cache-Control': 'public, max-age=60',
        'Vary': 'Origin'
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    throw json({ error: 'Failed to fetch events' }, { status: 500 });
  }
};

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const body = await request.json();
  const { query, date, location } = body;

  if (!query || !location) {
    return json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/events/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, date, location })
    });

    if (!response.ok) {
      const error = await response.json();
      return json(error, { status: response.status });
    }

    const events: Event[] = await response.json();
    return json(events, {
      headers: {
        'Cache-Control': 'public, max-age=60',
        'Vary': 'Origin'
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return json({ error: 'Failed to fetch events' }, { status: 500 });
  }
};