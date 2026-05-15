import mongoose, { Schema, Document } from 'mongoose';
import { Transaction as ITransaction } from 'wealthlens-shared';

export interface ITransactionDocument extends Omit<ITransaction, 'id' | 'userId'>, Document {
  userId: mongoose.Types.ObjectId;
}

const TransactionSchema = new Schema<ITransactionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    amount: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'INR',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    merchantName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    category: {
      type: String,
      required: true,
      default: 'Uncategorized',
    },
    subcategory: {
      type: String,
    },
    source: {
      type: String,
      required: true,
      enum: ['csv', 'ofx', 'qif', 'plaid', 'manual'],
    },
    hash: {
      type: String,
      required: true,
    },
    isTransfer: {
      type: Boolean,
      required: true,
      default: false,
    },
    importBatchId: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        (ret as any).id = ret._id;
        delete (ret as any)._id;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);


TransactionSchema.index({ userId: 1, date: -1, category: 1 });

TransactionSchema.index({ userId: 1, hash: 1 }, { unique: true });

export const Transaction = mongoose.model<ITransactionDocument>('Transaction', TransactionSchema);
