import mongoose from 'mongoose';

export const getCategoryBreakdownPipeline = (userId: string, dateFrom?: Date, dateTo?: Date) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) return [];
  const match: any = { userId: new mongoose.Types.ObjectId(userId), isTransfer: false };
  if (dateFrom) match.date = { ...match.date, $gte: dateFrom };
  if (dateTo) match.date = { ...match.date, $lte: dateTo };
  return [
    { $match: match },
    { $addFields: { amountNum: { $toDouble: '$amount' } } },
    {
      $group: {
        _id: { 
          category: '$category',
          month: { $month: '$date' },
          year: { $year: '$date' }
        },
        totalAmount: { $sum: { $abs: '$amountNum' } },
        transactionCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: '$_id.category',
        month: '$_id.month',
        year: '$_id.year',
        totalAmount: { $toString: { $round: ['$totalAmount', 2] } },
        transactionCount: 1,
      },
    },

    { $sort: { totalAmount: -1 } },
  ];
};
