export const CATEGORY_TAXONOMY = {
  Housing: ['Rent/Mortgage', 'Utilities', 'Insurance', 'Maintenance', 'Furnishings'],
  'Food & Drink': ['Groceries', 'Restaurants', 'Coffee', 'Alcohol', 'Delivery'],
  Transport: ['Fuel', 'Public Transit', 'Rideshare', 'Parking', 'Vehicle Maintenance'],
  Healthcare: ['Insurance', 'Pharmacy', 'Doctor Visits', 'Fitness', 'Mental Health'],
  Financial: ['Investments', 'Savings Transfers', 'Loan Payments', 'Fees', 'Taxes'],
  Entertainment: ['Streaming', 'Events', 'Hobbies', 'Travel', 'Gifts'],
  Income: ['Salary', 'Freelance', 'Dividends', 'Rental Income', 'Benefits'],
  Uncategorized: ['Requires Review'],
} as const;

export type CategoryCode = keyof typeof CATEGORY_TAXONOMY;
export type SubcategoryCode<T extends CategoryCode> = (typeof CATEGORY_TAXONOMY)[T][number];
