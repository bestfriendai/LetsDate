import axios from 'axios';
import { APIErrorHandler, CacheManager, RateLimiter } from '../utils/index.js';
export class RealTimeEventsService {
    apiKey;
    baseURL = 'https://real-time-events-search.p.rapidapi.com';
    cacheConfig = {
        duration: 5 * 60 * 1000, // 5 minutes
        key: 'realtime'
    };
    constructor() {
        this.apiKey = process.env.RAPIDAPI_KEY;
        if (!this.apiKey) {
            console.warn('RapidAPI key not found. RealTimeEvents service will be unavailable.');
        }
    }
    get isAvailable() {
        return !!this.apiKey;
    }
    get axiosInstance() {
        if (!this.isAvailable) {
            throw new Error('RealTimeEvents service is not available - missing API key');
        }
        return axios.create({
            baseURL: this.baseURL,
            headers: {
                'X-RapidAPI-Key': this.apiKey,
                'X-RapidAPI-Host': 'real-time-events-search.p.rapidapi.com',
                'Content-Type': 'application/json'
            }
        });
    }
    formatLocation(location) {
        if (typeof location === 'string') {
            return { location };
        }
        return {
            location: `${location.lat},${location.lon}`,
            lat: location.lat.toString(),
            lon: location.lon.toString()
        };
    }
    async searchEvents(params) {
        if (!this.isAvailable) {
            console.warn('RealTimeEvents search skipped - service not available');
            return [];
        }
        const cacheKey = `realtime:search:${JSON.stringify(params)}`;
        const cachedResult = CacheManager.get(cacheKey);
        if (cachedResult)
            return cachedResult;
        // Rate limiting: 100 requests per minute
        await RateLimiter.waitForRateLimit('realtime', 100, 60 * 1000);
        try {
            const response = await APIErrorHandler.withRetry(async () => {
                const locationParams = this.formatLocation(params.location);
                const queryParams = {
                    q: params.query,
                    ...locationParams,
                    radius: params.location.radius?.toString() || '50', // Default to 50km radius
                    date_range: params.date || 'upcoming',
                    sort: 'relevance',
                    limit: '20',
                    ...(params.categories && { category: params.categories.join(',') })
                };
                console.log('RealTimeEvents API request:', `${this.baseURL}/events`, queryParams);
                const { data } = await this.axiosInstance.get('/events', { params: queryParams });
                return data;
            }, 3, 'realtime');
            if (!response.events || !Array.isArray(response.events)) {
                console.warn('RealTimeEvents returned invalid response format:', response);
                return [];
            }
            const events = this.transformEvents(response.events);
            CacheManager.set(cacheKey, events, this.cacheConfig);
            return events;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('RealTimeEvents search failed:', {
                    status: error.response?.status,
                    message: error.response?.data?.message || error.message,
                    url: error.config?.url,
                    params: error.config?.params
                });
            }
            else {
                console.error('RealTimeEvents search failed:', error);
            }
            return [];
        }
    }
    transformEvents(events) {
        return events
            .map(event => this.transformEvent(event))
            .filter((event) => event !== null);
    }
    transformEvent(event) {
        try {
            if (!event.id || !event.title) {
                console.warn('Skipping invalid event:', event);
                return null;
            }
            const address = event.venue?.address || '';
            const transformedEvent = {
                id: event.id,
                name: event.title,
                description: event.description,
                start: event.start_time || event.date,
                end: event.end_time,
                location: address,
                venue: event.venue?.name,
                url: event.ticket_url || event.registration_url,
                imageUrl: event.image_url || event.cover_image,
                price: event.price ? {
                    min: parseFloat(event.price.min || 0),
                    max: parseFloat(event.price.max || 0),
                    currency: event.price.currency || 'USD'
                } : undefined,
                category: event.category || event.type,
                source: 'realtime'
            };
            return transformedEvent;
        }
        catch (error) {
            console.error('Failed to transform event:', error, event);
            return null;
        }
    }
}
export const realTimeEventsService = new RealTimeEventsService();
//# sourceMappingURL=realTimeEvents.js.map