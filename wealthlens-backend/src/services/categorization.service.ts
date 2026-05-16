import { CategoryCode } from 'wealthlens-shared';
import { CategoryRule } from '../models/CategoryRule.model';
import { AIService } from './ai.service';


export interface CategorizationResult {
  category: CategoryCode;
  subcategory?: string;
  merchantName?: string;
  confidence: number;
}

export class CategorizationService {

  static async categorize(
    userId: string,
    description: string,
    merchantName?: string
  ): Promise<CategorizationResult> {
    const rules = await CategoryRule.find({ userId });
    const target = (merchantName || description).toLowerCase();

    for (const rule of rules) {
      const pattern = rule.pattern.toLowerCase();
      let match = false;

      if (rule.isRegex) {
        try {
          const regex = new RegExp(rule.pattern, 'i');
          match = regex.test(target);
        } catch (e) {
        }
      } else {
        match = target.includes(pattern);
      }

      if (match) {
        return {
          category: rule.category,
          subcategory: rule.subcategory,
          merchantName: rule.merchantName || merchantName,
          confidence: 1.0,
        };
      }
    }

    const aiResult = await AIService.categorizeTransaction(description, merchantName);

    if (aiResult.confidence > 0.6) {
      return {
        category: aiResult.category,
        subcategory: aiResult.subcategory,
        merchantName: merchantName,
        confidence: aiResult.confidence,
      };
    }

    return {
      category: 'Uncategorized',
      confidence: 0.5,
    };
  }



  static async learnRule(
    userId: string,
    pattern: string,
    category: CategoryCode,
    subcategory?: string,
    merchantName?: string
  ) {
    await CategoryRule.findOneAndUpdate(
      { userId, pattern },
      { category, subcategory, merchantName, isRegex: false },
      { upsert: true, new: true }
    );
  }
}
