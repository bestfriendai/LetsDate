import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';

const NOMINATIM_API = 'https://nominatim.openstreetmap.org';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
}

const nominatimApi = axios.create({
  baseURL: NOMINATIM_API,
  headers: {
    'User-Agent': 'DateAI/2.0 (https://mydateapp.vercel.app)',
    'Accept-Language': 'en-US,en;q=0.9',
  },
  timeout: 10000,
});

// Configure retry behavior
axiosRetry(nominatimApi, {
  retries: MAX_RETRIES,
  retryDelay: (retryCount) => {
    return retryCount * RETRY_DELAY;
  },
  retryCondition: (error: AxiosError): boolean => {
    if (axiosRetry.isNetworkOrIdempotentRequestError(error)) {
      return true;
    }
    return error.response?.status ? error.response.status >= 500 : false;
  },
});

// Add response interceptor for rate limiting
nominatimApi.interceptors.response.use(undefined, async (error: AxiosError) => {
  if (error.response?.status === 429 && error.config) {
    const retryAfter = parseInt(error.response.headers['retry-after'] as string, 10) || 1;
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
    // Convert InternalAxiosRequestConfig back to AxiosRequestConfig
    const config: AxiosRequestConfig = {
      ...error.config,
      headers: { ...error.config.headers }
    };
    return nominatimApi(config);
  }
  return Promise.reject(error);
});

export async function searchLocations(query: string): Promise<NominatimResult[]> {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await nominatimApi.get<NominatimResult[]>('/search', {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        limit: 5,
      },
    });
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error('Error fetching locations:', {
      message: error.message,
      query,
      status: error.response?.status,
      data: error.response?.data
    });
    return [];
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<NominatimResult | null> {
  try {
    const response = await nominatimApi.get<NominatimResult>('/reverse', {
      params: {
        lat,
        lon,
        format: 'json',
        addressdetails: 1,
        zoom: 18,
      },
    });
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error('Error reverse geocoding:', {
      message: error.message,
      coordinates: { lat, lon },
      status: error.response?.status,
      data: error.response?.data
    });
    return null;
  }
}

export const nominatimService = {
  searchLocations,
  reverseGeocode
} as const;