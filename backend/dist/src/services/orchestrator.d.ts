import { Event, AIResponse, SearchEventsRequest } from '../types/index.js';
export declare class DateAIOrchestrator {
    private readonly cacheConfig;
    private withTimeout;
    searchEvents(params: SearchEventsRequest): Promise<Event[]>;
    generateDatePlan(params: {
        location: string;
        preferences: string;
        budget?: number;
        date?: string;
    }): Promise<{
        suggestions: AIResponse;
        events: Event[];
        insights: AIResponse;
    }>;
    private deduplicateEvents;
    private sortEvents;
}
export declare const orchestrator: DateAIOrchestrator;
//# sourceMappingURL=orchestrator.d.ts.map