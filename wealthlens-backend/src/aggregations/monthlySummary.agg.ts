import mongoose from 'mongoose';

export const getMonthlySummaryPipeline = (userId: string) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) return [];
  return [
    { $match: { userId: new mongoose.Types.ObjectId(userId), isTransfer: false } },
    { $addFields: { amountNum: { $toDouble: '$amount' } } },
    {
      $group: {
        _id: { month: { $month: '$date' }, year: { $year: '$date' } },
        totalIncome: { $sum: { $cond: [{ $gt: ['$amountNum', 0] }, '$amountNum', 0] } },
        totalExpenses: { $sum: { $cond: [{ $lt: ['$amountNum', 0] }, { $abs: '$amountNum' }, 0] } },
      },
    },
    {
      $project: {
        _id: 0,
        month: '$_id.month',
        year: '$_id.year',
        totalIncome: { $toString: { $round: ['$totalIncome', 2] } },
        totalExpenses: { $toString: { $round: ['$totalExpenses', 2] } },
        netSavings: { $toString: { $round: [{ $subtract: ['$totalIncome', '$totalExpenses'] }, 2] } },
        savingsRate: {
          $cond: [
            { $gt: ['$totalIncome', 0] },
            { $multiply: [{ $divide: [{ $subtract: ['$totalIncome', '$totalExpenses'] }, '$totalIncome'] }, 100] },
            0,
          ],
        },
      },
    },
    { $sort: { year: 1, month: 1 } },
  ];
};
