import OpenAI from 'openai';
import { CategoryCode } from 'wealthlens-shared';
import logger from '../config/logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
});

export class AIService {

  static async categorizeTransaction(
    description: string,
    merchantName?: string
  ): Promise<{ category: CategoryCode; subcategory?: string; confidence: number }> {
    if (!process.env.OPENAI_API_KEY) {
      logger.warn('[AI] No API key found, skipping AI categorization');
      return { category: 'Uncategorized', confidence: 0 };
    }

    try {
      const prompt = `
        As a financial expert, categorize this bank transaction:
        Description: "${description}"
        Merchant: "${merchantName || 'Unknown'}"

        Return ONLY a JSON object in this format:
        {
          "category": "One of: Housing, Transportation, Food, Utilities, Healthcare, Insurance, Savings, Debt, Entertainment, Personal, Miscellaneous",
          "subcategory": "A short 1-2 word subcategory",
          "confidence": 0.0 to 1.0
        }
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      return {
        category: result.category as CategoryCode,
        subcategory: result.subcategory,
        confidence: result.confidence || 0.8,
      };
    } catch (error) {
      logger.error({ err: error }, '[AI] Categorization failed');
      return { category: 'Uncategorized', confidence: 0 };
    }

  }
}
