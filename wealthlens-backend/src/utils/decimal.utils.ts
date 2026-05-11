import { Decimal } from 'decimal.js';

// Banker's rounding for calculations
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_EVEN });

export const toDecimal = (value: string | number): Decimal => new Decimal(value);

export const formatDecimal = (value: Decimal): string => value.toFixed(2);

export const add = (a: string, b: string): string => 
  new Decimal(a).plus(new Decimal(b)).toFixed(2);

export const subtract = (a: string, b: string): string => 
  new Decimal(a).minus(new Decimal(b)).toFixed(2);

export const multiply = (a: string, b: number | string): string => 
  new Decimal(a).times(new Decimal(b)).toFixed(2);

export const divide = (a: string, b: number | string): string => 
  new Decimal(a).dividedBy(new Decimal(b)).toFixed(2);
