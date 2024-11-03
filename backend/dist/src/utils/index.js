// Error Handling
export class APIErrorHandler {
    static handle(error, source) {
        if (error.response) {
            return {
                message: error.response.data?.message || 'API request failed',
                code: error.response.data?.code || 'API_ERROR',
                status: error.response.status,
                source,
                details: error.response.data
            };
        }
        return {
            message: error.message || 'Unknown error occurred',
            code: 'UNKNOWN_ERROR',
            status: 500,
            source
        };
    }
    static async withRetry(operation, maxAttempts = 3, source) {
        let lastError = null;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await operation();
            }
            catch (error) {
                lastError = error;
                if (attempt === maxAttempts)
                    break;
                // Exponential backoff
                const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        throw APIErrorHandler.handle(lastError, source);
    }
}
// Caching
export class CacheManager {
    static cache = new Map();
    static set(key, data, config) {
        const timestamp = Date.now();
        const expiry = timestamp + config.duration;
        this.cache.set(config.key || key, {
            data,
            timestamp,
            expiry
        });
    }
    static get(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }
    static invalidate(pattern) {
        const regex = new RegExp(pattern);
        for (const [key] of this.cache) {
            if (regex.test(key)) {
                this.cache.delete(key);
            }
        }
    }
    static clear() {
        this.cache.clear();
    }
}
// Rate Limiting
export class RateLimiter {
    static limits = new Map();
    static async checkLimit(key, maxRequests, windowMs = 60000) {
        const now = Date.now();
        const limit = this.limits.get(key) || { count: 0, resetTime: now + windowMs };
        if (now > limit.resetTime) {
            limit.count = 0;
            limit.resetTime = now + windowMs;
        }
        if (limit.count >= maxRequests) {
            return false;
        }
        limit.count++;
        this.limits.set(key, limit);
        return true;
    }
    static async waitForRateLimit(key, maxRequests, windowMs = 60000) {
        while (!(await this.checkLimit(key, maxRequests, windowMs))) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}
// Circuit Breaker
export class CircuitBreaker {
    static circuits = new Map();
    static FAILURE_THRESHOLD = 5;
    static RESET_TIMEOUT = 60000; // 1 minute
    static isOpen(service) {
        const circuit = this.circuits.get(service);
        if (!circuit)
            return false;
        if (circuit.state === 'open') {
            const now = Date.now();
            if (now - circuit.lastFailure >= this.RESET_TIMEOUT) {
                circuit.state = 'half-open';
                return false;
            }
            return true;
        }
        return false;
    }
    static recordSuccess(service) {
        const circuit = this.circuits.get(service);
        if (circuit) {
            circuit.failures = 0;
            circuit.state = 'closed';
        }
    }
    static recordFailure(service) {
        const now = Date.now();
        const circuit = this.circuits.get(service) || {
            failures: 0,
            lastFailure: now,
            state: 'closed'
        };
        circuit.failures++;
        circuit.lastFailure = now;
        if (circuit.failures >= this.FAILURE_THRESHOLD) {
            circuit.state = 'open';
        }
        this.circuits.set(service, circuit);
    }
}
// Environment Variables Validation
export function validateEnvVariables(required) {
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
        // Log warning for all missing variables
        console.warn(`Warning: Missing environment variables: ${missing.join(', ')}`);
    }
}
//# sourceMappingURL=index.js.map