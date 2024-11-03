import { Event, SearchEventsRequest, IEventService } from '../types/index.js';
export declare class RealTimeEventsService implements IEventService {
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
export declare const realTimeEventsService: RealTimeEventsService;
//# sourceMappingURL=realTimeEvents.d.ts.map