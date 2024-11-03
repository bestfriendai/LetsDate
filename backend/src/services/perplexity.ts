import axios from 'axios';
import { APIErrorHandler, CacheManager, RateLimiter } from '../utils/index.js';
import { DateInsightParams, AIResponse, IAIService } from '../types/index.js';

export class PerplexityService implements IAIService {
  private readonly apiKey?: string;
  private readonly baseURL = 'https://api.perplexity.ai';
  private readonly cacheConfig = {
    duration: 30 * 60 * 1000, // 30 minutes
    key: 'perplexity'
  };

  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY;
    if (!this.apiKey) {
      console.warn('Perplexity API key not found. Date insights service will be unavailable.');
    }
  }

  private get isAvailable(): boolean {
    return !!this.apiKey;
  }

  private get axiosInstance() {
    if (!this.isAvailable) {
      throw new Error('Perplexity service is not available - missing API key');
    }

    return axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
  }

  async generateSuggestion(params: DateInsightParams): Promise<AIResponse> {
    if (!this.isAvailable) {
      return {
        message: 'Date insights service is currently unavailable',
        error: 'Service unavailable - missing API key'
      };
    }

    const cacheKey = `perplexity:insights:${JSON.stringify(params)}`;
    const cachedResult = CacheManager.get<AIResponse>(cacheKey);
    if (cachedResult) return cachedResult;

    // Rate limiting: 60 requests per minute
    await RateLimiter.waitForRateLimit('perplexity', 60, 60 * 1000);

    try {
      const response = await APIErrorHandler.withRetry(
        async () => {
          const { data } = await this.axiosInstance.post('/chat/completions', {
            model: 'sonar-medium-online',
            messages: [{
              role: 'user',
              content: this.constructPrompt(params)
            }],
            temperature: 0.7
          });
          return data;
        },
        3,
        'perplexity'
      );

      const result = this.transformResponse(response);
      CacheManager.set(cacheKey, result, this.cacheConfig);
      return result;
    } catch (error) {
      console.error('Perplexity insights failed:', error);
      return {
        message: 'Failed to generate date insights',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private constructPrompt(params: DateInsightParams): string {
    return `Analyze this date idea and provide detailed insights:

Date Idea: ${params.dateIdea}
Location: ${params.location}

Please provide:
1. Detailed analysis of the date idea
2. Potential challenges or considerations
3. Personalized recommendations
4. Alternative suggestions that align with the same theme
5. Tips for making the experience more memorable
6. Local insights specific to the location

Focus on practical, actionable insights that will help make the date successful.`;
  }

  private transformResponse(response: any): AIResponse {
    try {
      const content = response.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('Invalid AI response format');
      }

      return {
        message: content,
        error: undefined
      };
    } catch (error) {
      return {
        message: 'Failed to parse AI response',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const perplexityService = new PerplexityService();