import mongoose, { Schema, Document } from 'mongoose';
import { AccountBalance as IAccountBalance } from 'wealthlens-shared';

export interface IAccountDocument extends Omit<IAccountBalance, 'accountId' | 'userId'>, Document {
  userId: mongoose.Types.ObjectId;
}

const AccountSchema = new Schema<IAccountDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    type: {
      type: String,
      required: true,
      enum: ['checking', 'savings', 'credit', 'investment', 'loan', 'other'],
    },
    currency: {
      type: String,
      required: true,
      enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'],
    },
    balance: {
      type: String,
      required: true,
    },
    balanceDate: {
      type: Date,
      required: true,
    },
    isManual: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        (ret as any).accountId = ret._id;
        delete (ret as any)._id;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

export const Account = mongoose.model<IAccountDocument>('Account', AccountSchema);