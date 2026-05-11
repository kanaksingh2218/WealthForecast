import mongoose, { Schema, Document } from 'mongoose';
import { ForecastInput } from 'wealthlens-shared';

export interface IScenario extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  inputs: ForecastInput;
  isBaseline: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ScenarioSchema = new Schema<IScenario>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    inputs: {
      startingNetWorth: { type: String, required: true },
      monthlyIncome: { type: String, required: true },
      monthlyExpenses: {
        type: Map,
        of: String,
        required: true,
      },
      annualReturnRate: { type: Number, required: true, min: 0, max: 100 },
      annualInflationRate: { type: Number, required: true, min: 0, max: 100 },
      horizonYears: { type: Number, required: true, min: 1, max: 40 },
    },
    isBaseline: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Scenario = mongoose.model<IScenario>('Scenario', ScenarioSchema);
