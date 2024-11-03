import { Router } from 'express';
import { nominatimService } from '../services/nominatim.js';

const router = Router();

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const results = await nominatimService.searchLocations(q);
    res.json(results);
  } catch (err) {
    console.error('Error in geocode search:', err);
    res.status(500).json({ 
      error: 'Failed to search locations', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
});

router.get('/reverse', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon || typeof lat !== 'string' || typeof lon !== 'string') {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);

    if (isNaN(parsedLat) || isNaN(parsedLon)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude values' });
    }

    const result = await nominatimService.reverseGeocode(parsedLat, parsedLon);
    if (!result) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json(result);
  } catch (err) {
    console.error('Error in reverse geocoding:', err);
    res.status(500).json({ 
      error: 'Failed to reverse geocode', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
});

export default router;
