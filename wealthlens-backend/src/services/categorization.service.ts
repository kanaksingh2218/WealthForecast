import { CategoryCode } from 'wealthlens-shared';
import { CategoryRule } from '../models/CategoryRule.model';

export interface CategorizationResult {
  category: CategoryCode;
  subcategory?: string;
  merchantName?: string;
  confidence: number; // 0 to 1
}

export class CategorizationService {
  /**
   * Categorizes a transaction based on description/merchant name
   */
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
          // Skip invalid regex
        }
      } else {
        match = target.includes(pattern);
      }

      if (match) {
        return {
          category: rule.category,
          subcategory: rule.subcategory,
          merchantName: rule.merchantName || merchantName,
          confidence: 1.0, // Rule match is high confidence
        };
      }
    }

    // Phase 2: ML Tagging would go here. 
    // Phase 1 fallback: Uncategorized
    return {
      category: 'Uncategorized',
      confidence: 0.5, // Low confidence flags for review
    };
  }

  /**
   * Saves a rule for future use when a user categorizes a transaction
   */
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
