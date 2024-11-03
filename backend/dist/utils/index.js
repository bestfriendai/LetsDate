export function validateEnvVariables(requiredVars) {
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
}
// Updated implementation for APIErrorHandler
export class APIErrorHandler {
    static handle(error) {
        console.error('API Error:', error);
        // Implement proper error handling logic here
    }
    static async withRetry(fn, retries = 3, key) {
        try {
            return await fn();
        }
        catch (error) {
            if (retries > 0) {
                console.log(`Retrying ${key}... Attempts left: ${retries - 1}`);
                return this.withRetry(fn, retries - 1, key);
            }
            throw error;
        }
    }
}
// Updated implementation for CacheManager
export class CacheManager {
    static cache = new Map();
    static set(key, value, config) {
        this.cache.set(config.key, {
            value,
            expiry: Date.now() + config.duration
        });
    }
    static get(key) {
        const item = this.cache.get(key);
        if (item && item.expiry > Date.now()) {
            return item.value;
        }
        this.cache.delete(key);
        return null;
    }
}
// Updated implementation for RateLimiter
export class RateLimiter {
    static limits = new Map();
    static async waitForRateLimit(key, limit, interval) {
        const now = Date.now();
        const lastCallTime = this.limits.get(key) || 0;
        const timeToWait = Math.max(0, interval - (now - lastCallTime));
        if (timeToWait > 0) {
            await new Promise(resolve => setTimeout(resolve, timeToWait));
        }
        this.limits.set(key, Date.now());
    }
    static limit(key) {
        // Simple implementation, you might want to enhance this based on your needs
        return true;
    }
}
// Circuit Breaker implementation
export class CircuitBreaker {
    static circuits = new Map();
    static DEFAULT_THRESHOLD = 5;
    static RESET_TIMEOUT = 60000; // 1 minute
    static HALF_OPEN_TIMEOUT = 30000; // 30 seconds
    static async execute(key, fn, options = {}) {
        const circuit = this.getCircuit(key);
        if (circuit.state === 'OPEN') {
            const timeInOpen = Date.now() - circuit.lastFailure;
            if (timeInOpen >= (options.resetTimeout || this.RESET_TIMEOUT)) {
                circuit.state = 'HALF_OPEN';
            }
            else {
                throw new Error(`Circuit breaker is OPEN for ${key}`);
            }
        }
        try {
            const result = await fn();
            if (circuit.state === 'HALF_OPEN') {
                circuit.state = 'CLOSED';
                circuit.failures = 0;
                circuit.successThreshold = 0;
            }
            return result;
        }
        catch (error) {
            circuit.failures++;
            circuit.lastFailure = Date.now();
            if (circuit.failures >= (options.failureThreshold || this.DEFAULT_THRESHOLD)) {
                circuit.state = 'OPEN';
            }
            throw error;
        }
    }
    static isOpen(key) {
        const circuit = this.circuits.get(key);
        return circuit?.state === 'OPEN';
    }
    static recordFailure(key) {
        const circuit = this.getCircuit(key);
        circuit.failures++;
        circuit.lastFailure = Date.now();
        if (circuit.failures >= this.DEFAULT_THRESHOLD) {
            circuit.state = 'OPEN';
        }
    }
    static getCircuit(key) {
        if (!this.circuits.has(key)) {
            this.circuits.set(key, {
                state: 'CLOSED',
                failures: 0,
                lastFailure: 0,
                successThreshold: 0
            });
        }
        return this.circuits.get(key);
    }
    static reset(key) {
        this.circuits.delete(key);
    }
    static getState(key) {
        return this.circuits.has(key) ? this.circuits.get(key).state : 'NOT_FOUND';
    }
}
//# sourceMappingURL=index.js.map