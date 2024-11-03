import { APIError, CacheConfig } from '../types/index.js';
export declare class APIErrorHandler {
    static handle(error: any, source: string): APIError;
    static withRetry<T>(operation: () => Promise<T>, maxAttempts: number | undefined, source: string): Promise<T>;
}
export declare class CacheManager {
    private static cache;
    static set<T>(key: string, data: T, config: CacheConfig): void;
    static get<T>(key: string): T | null;
    static invalidate(pattern: string): void;
    static clear(): void;
}
export declare class RateLimiter {
    private static limits;
    static checkLimit(key: string, maxRequests: number, windowMs?: number): Promise<boolean>;
    static waitForRateLimit(key: string, maxRequests: number, windowMs?: number): Promise<void>;
}
export declare class CircuitBreaker {
    private static circuits;
    private static readonly FAILURE_THRESHOLD;
    private static readonly RESET_TIMEOUT;
    static isOpen(service: string): boolean;
    static recordSuccess(service: string): void;
    static recordFailure(service: string): void;
}
export declare function validateEnvVariables(required: string[]): void;
//# sourceMappingURL=index.d.ts.map