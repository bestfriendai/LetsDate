import { DateInsightParams, AIResponse, IAIService } from '../types/index.js';
export declare class AnthropicService implements IAIService {
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
export declare const anthropicService: AnthropicService;
//# sourceMappingURL=anthropic.d.ts.map