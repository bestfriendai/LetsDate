import axios from 'axios';
import { APIErrorHandler, CacheManager, RateLimiter } from '../utils/index.js';
export class TicketmasterService {
    apiKey;
    baseURL = 'https://app.ticketmaster.com/discovery/v2';
    cacheConfig = {
        duration: 5 * 60 * 1000, // 5 minutes
        key: 'ticketmaster'
    };
    constructor() {
        this.apiKey = process.env.TICKETMASTER_API_KEY;
        if (!this.apiKey) {
            console.warn('Ticketmaster API key not found. Ticketmaster service will be unavailable.');
        }
    }
    get isAvailable() {
        return !!this.apiKey;
    }
    get axiosInstance() {
        if (!this.isAvailable) {
            throw new Error('Ticketmaster service is not available - missing API key');
        }
        return axios.create({
            baseURL: this.baseURL,
            headers: {
                'Accept': 'application/json'
            }
        });
    }
    formatLocation(location) {
        if (typeof location === 'string') {
            return { city: location };
        }
        return { latlong: `${location.lat},${location.lon}` };
    }
    async searchEvents(params) {
        if (!this.isAvailable) {
            console.warn('Ticketmaster search skipped - service not available');
            return [];
        }
        const cacheKey = `ticketmaster:search:${JSON.stringify(params)}`;
        const cachedResult = CacheManager.get(cacheKey);
        if (cachedResult)
            return cachedResult;
        // Rate limiting: 5000 requests per day (roughly 208 per hour)
        await RateLimiter.waitForRateLimit('ticketmaster', 200, 60 * 60 * 1000);
        try {
            const response = await APIErrorHandler.withRetry(async () => {
                const locationParams = this.formatLocation(params.location);
                const queryParams = {
                    apikey: this.apiKey,
                    keyword: params.query,
                    ...locationParams,
                    startDateTime: params.date,
                    classificationName: params.categories?.join(','),
                    sort: 'date,asc',
                    size: 20,
                    radius: locationParams.latlong ? params.location.radius || 50 : undefined,
                    unit: 'miles'
                };
                console.log('Ticketmaster API request:', `${this.baseURL}/events.json`, queryParams);
                const { data } = await this.axiosInstance.get('/events.json', { params: queryParams });
                return data;
            }, 3, 'ticketmaster');
            const events = this.transformEvents(response._embedded?.events || []);
            CacheManager.set(cacheKey, events, this.cacheConfig);
            return events;
        }
        catch (error) {
            console.error('Ticketmaster search failed:', error);
            return [];
        }
    }
    transformEvents(events) {
        return events.map(event => this.transformEvent(event));
    }
    transformEvent(event) {
        const venue = event._embedded?.venues?.[0];
        const price = event.priceRanges?.[0];
        const address = venue ? [
            venue.address?.line1,
            venue.city?.name,
            venue.state?.stateCode,
            venue.postalCode
        ].filter(Boolean).join(', ') : '';
        return {
            id: event.id,
            name: event.name,
            description: event.description || event.info,
            start: event.dates.start.dateTime || event.dates.start.localDate,
            end: event.dates.end?.dateTime || event.dates.end?.localDate,
            location: address,
            venue: venue?.name,
            url: event.url,
            imageUrl: event.images?.find((img) => img.ratio === '16_9' && img.width > 1000)?.url
                || event.images?.[0]?.url,
            price: price && {
                min: price.min,
                max: price.max,
                currency: price.currency
            },
            category: event.classifications?.[0]?.segment?.name,
            source: 'ticketmaster'
        };
    }
}
export const ticketmasterService = new TicketmasterService();
//# sourceMappingURL=ticketmaster.js.map