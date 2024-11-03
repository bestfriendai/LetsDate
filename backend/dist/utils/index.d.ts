export declare function validateEnvVariables(requiredVars: string[]): void;
export declare class APIErrorHandler {
    static handle(error: any): void;
    static withRetry<T>(fn: () => Promise<T>, retries: number | undefined, key: string): Promise<T>;
}
export declare class CacheManager {
    private static cache;
    static set<T>(key: string, value: T, config: {
        duration: number;
        key: string;
    }): void;
    static get<T>(key: string): T | null;
}
export declare class RateLimiter {
    private static limits;
    static waitForRateLimit(key: string, limit: number, interval: number): Promise<void>;
    static limit(key: string): boolean;
}
export declare class CircuitBreaker {
    private static circuits;
    private static readonly DEFAULT_THRESHOLD;
    private static readonly RESET_TIMEOUT;
    private static readonly HALF_OPEN_TIMEOUT;
    static execute<T>(key: string, fn: () => Promise<T>, options?: {
        failureThreshold?: number;
        resetTimeout?: number;
    }): Promise<T>;
    static isOpen(key: string): boolean;
    static recordFailure(key: string): void;
    private static getCircuit;
    static reset(key: string): void;
    static getState(key: string): 'CLOSED' | 'OPEN' | 'HALF_OPEN' | 'NOT_FOUND';
}
//# sourceMappingURL=index.d.ts.map