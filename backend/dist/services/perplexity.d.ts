import { DateInsightParams, AIResponse, IAIService } from '../types/index.js';
export declare class PerplexityService implements IAIService {
    private readonly apiKey?;
    private readonly baseURL;
    private readonly cacheConfig;
    constructor();
    private get isAvailable();
    private get axiosInstance();
    generateSuggestion(params: DateInsightParams): Promise<AIResponse>;
    private constructPrompt;
    private transformResponse;
}
export declare const perplexityService: PerplexityService;
//# sourceMappingURL=perplexity.d.ts.map