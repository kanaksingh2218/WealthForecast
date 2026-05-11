import { z } from 'zod';

export const ForecastInputSchema = z.object({
  userId: z.string(),
  startingNetWorth: z.string().regex(/^-?\d+(\.\d+)?$/),
  monthlyIncome: z.string().regex(/^-?\d+(\.\d+)?$/),
  monthlyExpenses: z.record(z.string(), z.string().regex(/^-?\d+(\.\d+)?$/)),
  annualReturnRate: z.number().min(0).max(100),
  annualInflationRate: z.number().min(0).max(100),
  horizonYears: z.number().min(1).max(40),
  scenarioName: z.string().min(1).max(80),
});

export type ForecastInputType = z.infer<typeof ForecastInputSchema>;
