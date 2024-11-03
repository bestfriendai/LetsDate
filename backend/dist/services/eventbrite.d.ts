import { Event, SearchEventsRequest, IEventService } from '../types/index.js';
export declare class EventbriteService implements IEventService {
    private readonly apiKey?;
    private readonly baseURL;
    private readonly cacheConfig;
    constructor();
    private get isAvailable();
    private get axiosInstance();
    private formatLocation;
    searchEvents(params: SearchEventsRequest): Promise<Event[]>;
    private transformEvents;
    private transformEvent;
}
export declare const eventbriteService: EventbriteService;
//# sourceMappingURL=eventbrite.d.ts.map