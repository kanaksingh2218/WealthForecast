import mongoose, { Schema, Document } from 'mongoose';
import { CategoryCode } from 'wealthlens-shared';

export interface ICategoryRule extends Document {
  userId: mongoose.Types.ObjectId;
  pattern: string;
  isRegex: boolean;
  category: CategoryCode;
  subcategory?: string;
  merchantName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategoryRuleSchema = new Schema<ICategoryRule>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    pattern: {
      type: String,
      required: true,
      trim: true,
    },
    isRegex: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
    },
    merchantName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Unique rule per user and pattern
CategoryRuleSchema.index({ userId: 1, pattern: 1 }, { unique: true });

export const CategoryRule = mongoose.model<ICategoryRule>('CategoryRule', CategoryRuleSchema);
