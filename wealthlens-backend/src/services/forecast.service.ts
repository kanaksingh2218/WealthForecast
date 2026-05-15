import { Decimal } from 'decimal.js';
import { ForecastInput, ForecastDataPoint } from 'wealthlens-shared';

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_EVEN });

export class ForecastService {
  static computeForecast(input: ForecastInput): ForecastDataPoint[] {
    const points: ForecastDataPoint[] = [];
    const horizonMonths = input.horizonYears * 12;

    let currentPortfolio = new Decimal(input.startingNetWorth);
    let monthlyIncome = new Decimal(input.monthlyIncome);

    let currentMonthlyExpenses = Object.values(input.monthlyExpenses).reduce(
      (sum, val) => sum.plus(new Decimal(val)),
      new Decimal(0)
    );

    const annualInflationRate = new Decimal(input.annualInflationRate).div(100);
    const monthlyInflationRate = annualInflationRate.div(12);

    const annualReturnRate = new Decimal(input.annualReturnRate).div(100);
    const monthlyReturnRate = annualReturnRate.div(12);

    let cumulativeSavings = new Decimal(0);
    const now = new Date();

    for (let m = 0; m <= horizonMonths; m++) {
      const year = now.getFullYear() + Math.floor(m / 12);
      const month = (now.getMonth() + m) % 12 + 1;

      const monthlySavings = monthlyIncome.minus(currentMonthlyExpenses);

      const yearsElapsed = new Decimal(m).div(12);
      const inflationFactor = new Decimal(1).plus(annualInflationRate).pow(yearsElapsed);
      const realWealth = currentPortfolio.div(inflationFactor);

      points.push({
        month,
        year,
        nominalWealth: currentPortfolio.toFixed(2),
        realWealth: realWealth.toFixed(2),
        cumulativeSavings: cumulativeSavings.toFixed(2),
        portfolioValue: currentPortfolio.toFixed(2),
        inflationAdjustedExpenses: currentMonthlyExpenses.toFixed(2),
      });

      const growth = currentPortfolio.mul(monthlyReturnRate);
      currentPortfolio = currentPortfolio.plus(growth).plus(monthlySavings);

      cumulativeSavings = cumulativeSavings.plus(monthlySavings);

      currentMonthlyExpenses = currentMonthlyExpenses.mul(new Decimal(1).plus(monthlyInflationRate));
    }

    return points;
  }

  static findFIDate(input: ForecastInput, points: ForecastDataPoint[]): { month: number, year: number } | null {
    for (const p of points) {
      const annualExp = new Decimal(p.inflationAdjustedExpenses).mul(12);
      const target = annualExp.mul(25);

      if (new Decimal(p.portfolioValue).gte(target)) {
        return { month: p.month, year: p.year };
      }
    }
    return null;
  }
}
