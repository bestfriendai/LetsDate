import { Event, AIResponse, DateInsightParams, SearchEventsRequest } from '../types/index.js';
import { eventbriteService } from './eventbrite.js';
import { ticketmasterService } from './ticketmaster.js';
import { realTimeEventsService } from './realTimeEvents.js';
import { anthropicService } from './anthropic.js';
import { perplexityService } from './perplexity.js';
import { CacheManager, CircuitBreaker } from '../utils/index.js';

const SERVICE_TIMEOUT = 15000; // 15 seconds timeout for individual services

export class DateAIOrchestrator {
  private readonly cacheConfig = {
    duration: 5 * 60 * 1000, // 5 minutes
    key: 'orchestrator'
  };

  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number = SERVICE_TIMEOUT): Promise<T> {
    const timeoutPromise = new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error('Service timeout')), timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
  }

  async searchEvents(params: SearchEventsRequest): Promise<Event[]> {
    const cacheKey = `events:${JSON.stringify(params)}`;
    const cachedResult = CacheManager.get<Event[]>(cacheKey);
    if (cachedResult) return cachedResult;

    const eventPromises: Promise<Event[]>[] = [];

    // Eventbrite search with timeout
    if (!CircuitBreaker.isOpen('eventbrite')) {
      eventPromises.push(
        this.withTimeout(eventbriteService.searchEvents(params)).catch(error => {
          CircuitBreaker.recordFailure('eventbrite');
          console.error('Eventbrite search failed:', error);
          return [];
        })
      );
    }

    // Ticketmaster search with timeout
    if (!CircuitBreaker.isOpen('ticketmaster')) {
      eventPromises.push(
        this.withTimeout(ticketmasterService.searchEvents(params)).catch(error => {
          CircuitBreaker.recordFailure('ticketmaster');
          console.error('Ticketmaster search failed:', error);
          return [];
        })
      );
    }

    // RealTime Events search with timeout
    if (!CircuitBreaker.isOpen('realtime')) {
      eventPromises.push(
        this.withTimeout(realTimeEventsService.searchEvents(params)).catch(error => {
          CircuitBreaker.recordFailure('realtime');
          console.error('RealTime Events search failed:', error);
          return [];
        })
      );
    }

    // Use Promise.allSettled to handle partial failures
    const results = await Promise.allSettled(eventPromises);
    const allEvents = results
      .filter((result): result is PromiseFulfilledResult<Event[]> => result.status === 'fulfilled')
      .map(result => result.value)
      .flat();

    // Deduplicate events based on title and date similarity
    const uniqueEvents = this.deduplicateEvents(allEvents);
    
    // Sort events by date
    const sortedEvents = this.sortEvents(uniqueEvents);

    CacheManager.set(cacheKey, sortedEvents, this.cacheConfig);
    return sortedEvents;
  }

  async generateDatePlan(params: {
    location: string;
    preferences: string;
    budget?: number;
    date?: string;
  }): Promise<{
    suggestions: AIResponse;
    events: Event[];
    insights: AIResponse;
  }> {
    const cacheKey = `datePlan:${JSON.stringify(params)}`;
    const cachedResult = CacheManager.get<any>(cacheKey);
    if (cachedResult) return cachedResult;

    const [suggestions, events, insights] = await Promise.allSettled([
      // Get AI suggestions with timeout
      this.withTimeout(
        anthropicService.generateSuggestion({
          dateIdea: params.preferences,
          location: params.location
        })
      ).catch(error => ({
        message: 'Failed to generate suggestions',
        error: error.message
      })),

      // Search for relevant events
      this.searchEvents({
        query: params.preferences,
        location: params.location,
        date: params.date,
        categories: []
      }),

      // Get additional insights with timeout
      this.withTimeout(
        perplexityService.generateSuggestion({
          dateIdea: params.preferences,
          location: params.location
        })
      ).catch(error => ({
        message: 'Failed to get insights',
        error: error.message
      }))
    ]).then(results => results.map(result => 
      result.status === 'fulfilled' ? result.value : {
        message: 'Operation failed',
        error: 'Service timeout'
      }
    ));

    const result = { 
      suggestions: suggestions as AIResponse, 
      events: events as Event[], 
      insights: insights as AIResponse 
    };
    
    CacheManager.set(cacheKey, result, this.cacheConfig);
    return result;
  }

  private deduplicateEvents(events: Event[]): Event[] {
    const seen = new Set<string>();
    return events.filter(event => {
      const key = `${event.name.toLowerCase()}-${event.start}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private sortEvents(events: Event[]): Event[] {
    return events.sort((a, b) => {
      const dateA = new Date(a.start);
      const dateB = new Date(b.start);
      return dateA.getTime() - dateB.getTime();
    });
  }
}

export const orchestrator = new DateAIOrchestrator();