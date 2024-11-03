import axios from 'axios';
import { APIErrorHandler, CacheManager, RateLimiter } from '../utils/index.js';
import { Event, SearchEventsRequest, IEventService, Coordinates } from '../types/index.js';

export class EventbriteService implements IEventService {
  private readonly apiKey?: string;
  private readonly baseURL = 'https://www.eventbriteapi.com/v3';
  private readonly cacheConfig = {
    duration: 5 * 60 * 1000, // 5 minutes
    key: 'eventbrite'
  };

  constructor() {
    console.log('Initializing Eventbrite service...');
    console.log('Environment variables:', {
      NODE_ENV: process.env.NODE_ENV,
      EVENTBRITE_API_KEY: process.env.EVENTBRITE_API_KEY ? 'Set' : 'Not set'
    });

    this.apiKey = process.env.EVENTBRITE_API_KEY;
    if (!this.apiKey) {
      console.warn('Eventbrite API key not found. Eventbrite service will be unavailable.');
    } else {
      console.log('Eventbrite API key found, service is available');
    }
  }

  private get isAvailable(): boolean {
    const available = !!this.apiKey;
    console.log('Eventbrite service availability:', available);
    return available;
  }

  private get axiosInstance() {
    if (!this.isAvailable) {
      throw new Error('Eventbrite service is not available - missing API key');
    }

    return axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 seconds timeout for Vercel
    });
  }

  private formatLocation(location: string | Coordinates): string {
    if (typeof location === 'string') {
      return location;
    }
    return `${location.lat},${location.lon}`;
  }

  async searchEvents(params: SearchEventsRequest): Promise<Event[]> {
    console.log('Eventbrite searchEvents called with params:', params);
    
    if (!this.isAvailable) {
      console.warn('Eventbrite search skipped - service not available');
      return [];
    }

    const cacheKey = `eventbrite:search:${JSON.stringify(params)}`;
    const cachedResult = CacheManager.get<Event[]>(cacheKey);
    if (cachedResult) {
      console.log('Returning cached Eventbrite results');
      return cachedResult;
    }

    // Rate limiting: 1000 requests per hour
    await RateLimiter.waitForRateLimit('eventbrite', 1000, 60 * 60 * 1000);

    try {
      console.log('Making Eventbrite API request...');
      const response = await APIErrorHandler.withRetry(
        async () => {
          const formattedLocation = this.formatLocation(params.location);
          const queryParams = new URLSearchParams({
            'q': params.query,
            'location.address': formattedLocation,
            'location.within': '10km',
            'expand': 'venue,ticket_availability,category',
            ...(params.categories?.length && { 'categories': params.categories[0] }),
            ...(params.date && { 'start_date.range_start': params.date })
          });

          console.log('Eventbrite API request:', `${this.baseURL}/events/search?${queryParams}`);
          
          const { data } = await this.axiosInstance.get(
            `/events/search?${queryParams}`
          );
          console.log('Eventbrite API response received:', {
            totalEvents: data.events?.length || 0
          });
          return data;
        },
        3,
        'eventbrite'
      );

      const events = this.transformEvents(response.events);
      console.log('Transformed Eventbrite events:', {
        count: events.length
      });
      
      CacheManager.set(cacheKey, events, this.cacheConfig);
      return events;
    } catch (error) {
      console.error('Eventbrite search failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }
      return [];
    }
  }

  private transformEvents(events: any[]): Event[] {
    return events.map(event => this.transformEvent(event));
  }

  private transformEvent(event: any): Event {
    return {
      id: event.id,
      name: event.name.text,
      description: event.description?.text,
      start: event.start.utc,
      end: event.end?.utc,
      location: event.venue?.address?.localized_address_display || '',
      venue: event.venue?.name,
      url: event.url,
      imageUrl: event.logo?.url,
      price: event.ticket_availability?.minimum_ticket_price && {
        min: parseFloat(event.ticket_availability.minimum_ticket_price.value),
        max: event.ticket_availability.maximum_ticket_price ? 
          parseFloat(event.ticket_availability.maximum_ticket_price.value) : undefined,
        currency: event.ticket_availability.minimum_ticket_price.currency
      },
      category: event.category?.name,
      source: 'eventbrite'
    };
  }
}

export const eventbriteService = new EventbriteService();