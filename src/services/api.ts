import axios from 'axios';
import { Event } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000'
  : (process.env.VITE_API_URL || 'https://dateai-backend.netlify.app');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Enable sending cookies in cross-origin requests
});

export interface ReverseGeocodeResult {
  display_name: string;
  lat: string;
  lon: string;
  // Add other properties as needed
}

export interface SearchEventsParams {
  query: string;
  location?: {
    lat: number;
    lon: number;
    radius?: number;
  };
  date?: string;
  categories?: string[];
}

export async function reverseGeocode(lat: number, lon: number): Promise<ReverseGeocodeResult | null> {
  try {
    const response = await api.get<ReverseGeocodeResult>('/api/geocode/reverse', {
      params: { lat, lon },
    });
    return response.data;
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return null;
  }
}

export async function searchEvents(params: SearchEventsParams): Promise<Event[]> {
  try {
    const response = await api.get<Event[]>('/api/events/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching events:', error);
    throw error;
  }
}

export default {
  reverseGeocode,
  searchEvents,
};