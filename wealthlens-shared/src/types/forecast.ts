import { CategoryCode } from '../constants/categoryTaxonomy';

export interface ForecastInput {
  userId: string;
  startingNetWorth: string;
  monthlyIncome: string;
  monthlyExpenses: Record<string, string>;
  annualReturnRate: number;
  annualInflationRate: number;
  annualIncomeGrowthRate?: number;
  horizonYears: number;
  scenarioName: string;

}

export interface ForecastDataPoint {
  month: number;
  year: number;
  nominalWealth: string;
  realWealth: string;
  cumulativeSavings: string;
  portfolioValue: string;
  inflationAdjustedExpenses: string;
}
