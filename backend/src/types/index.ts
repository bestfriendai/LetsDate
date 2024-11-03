import type { Request, Response, NextFunction } from 'express';

export interface Event {
  id: string;
  name: string;
  description?: string;
  start: string;
  end?: string;
  location: string;
  venue?: string;
  url?: string;
  imageUrl?: string;
  ticketing_url?: string;
  price?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  category?: string;
  source: string;
}

export interface AIResponse {
  message: string;
  error?: string;
}

export interface DateInsightParams {
  dateIdea: string;
  location: string;
}

export interface APIError {
  message: string;
  code: string;
  status: number;
  source: string;
  details?: any;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

export interface CacheConfig {
  duration: number;
  key?: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
  radius?: number;
}

export interface BaseSearchParams {
  query: string;
  location: string | Coordinates;
  date?: string;
  categories?: string[];
}

export interface EventbriteResponse {
  events: Array<{
    id: string;
    name: {
      text: string;
    };
    description?: {
      text: string;
    };
    start: {
      utc: string;
    };
    end?: {
      utc: string;
    };
    venue?: {
      name: string;
      address: {
        localized_address_display: string;
      };
    };
    url: string;
    logo_url?: string;
    ticket_availability?: {
      minimum_ticket_price?: {
        value: number;
        currency: string;
      };
      maximum_ticket_price?: {
        value: number;
        currency: string;
      };
    };
    category?: {
      name: string;
    };
  }>;
}

export interface IEventService {
  searchEvents(params: BaseSearchParams): Promise<Event[]>;
}

export interface IAIService {
  generateSuggestion(params: DateInsightParams): Promise<AIResponse>;
}

// Custom request handler types
export type AsyncRequestHandler<T = any> = (
  req: Request,
  res: Response<T>,
  next: NextFunction
) => Promise<void>;

export type SyncRequestHandler<T = any> = (
  req: Request,
  res: Response<T>,
  next: NextFunction
) => void;

export interface SearchEventsRequest {
  query: string;
  location: string | Coordinates;
  date?: string;
  categories?: string[];
}

export interface DatePlanRequest {
  location: string;
  preferences: string;
  budget?: number;
  date?: string;
}

export interface HealthCheckResponse {
  status: string;
  services: Record<string, boolean>;
  env: string;
}