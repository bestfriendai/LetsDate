import axios from 'axios';
import { APIErrorHandler, CacheManager, RateLimiter } from '../utils/index.js';
import { 
  DateInsightParams,
  AIResponse,
  IAIService 
} from '../types/index.js';

export class AnthropicService implements IAIService {
  private readonly apiKey?: string;
  private readonly baseURL = 'https://api.anthropic.com/v1';
  private readonly cacheConfig = {
    duration: 30 * 60 * 1000, // 30 minutes
    key: 'anthropic'
  };

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY;
    if (!this.apiKey) {
      console.warn('Anthropic API key not found. AI suggestions service will be unavailable.');
    }
  }

  private get isAvailable(): boolean {
    return !!this.apiKey;
  }

  private get axiosInstance() {
    if (!this.isAvailable) {
      throw new Error('Anthropic service is not available - missing API key');
    }

    return axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2024-02-01'
      }
    });
  }

  async generateSuggestion(params: DateInsightParams): Promise<AIResponse> {
    if (!this.isAvailable) {
      return {
        message: 'AI suggestions service is currently unavailable',
        error: 'Service unavailable - missing API key'
      };
    }

    const cacheKey = `anthropic:suggestions:${JSON.stringify(params)}`;
    const cachedResult = CacheManager.get<AIResponse>(cacheKey);
    if (cachedResult) return cachedResult;

    // Rate limiting: 50 requests per minute
    await RateLimiter.waitForRateLimit('anthropic', 50, 60 * 1000);

    try {
      const response = await APIErrorHandler.withRetry(
        async () => {
          const { data } = await this.axiosInstance.post('/messages', {
            model: 'claude-3-opus-20240229',
            max_tokens: 1000,
            messages: [{
              role: 'user',
              content: this.constructPrompt(params)
            }],
            temperature: 0.7
          });
          return data;
        },
        3,
        'anthropic'
      );

      const result = this.transformResponse(response);
      CacheManager.set(cacheKey, result, this.cacheConfig);
      return result;
    } catch (error) {
      console.error('Anthropic suggestions failed:', error);
      return {
        message: 'Failed to generate AI suggestions',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private constructPrompt(params: DateInsightParams): string {
    return `Generate personalized date suggestions for the following:

Date Idea: ${params.dateIdea}
Location: ${params.location}

Please provide:
1. A detailed analysis of this date idea
2. Consider:
   - Local attractions and culture
   - Best time to visit
   - Potential challenges or considerations
   - Tips for making it special
3. Suggest complementary activities or alternatives
4. Include both practical advice and creative suggestions

Format the response in a clear, structured way that's easy to read and implement.`;
  }

  private transformResponse(response: any): AIResponse {
    try {
      const content = response.content?.[0]?.text || response.choices?.[0]?.message?.content;
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

export const anthropicService = new AnthropicService();