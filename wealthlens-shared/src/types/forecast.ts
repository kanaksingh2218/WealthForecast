import { CategoryCode } from '../constants/categoryTaxonomy';

export interface ForecastInput {
  userId: string;
  startingNetWorth: string; // Decimal string
  monthlyIncome: string; // Decimal string
  monthlyExpenses: Record<string, string>; // CategoryCode -> Decimal string
  annualReturnRate: number;
  annualInflationRate: number;
  horizonYears: number;
  scenarioName: string;
}

export interface ForecastDataPoint {
  month: number;
  year: number;
  nominalWealth: string; // Decimal string
  realWealth: string; // Decimal string
  cumulativeSavings: string; // Decimal string
  portfolioValue: string; // Decimal string
  inflationAdjustedExpenses: string; // Decimal string
}
