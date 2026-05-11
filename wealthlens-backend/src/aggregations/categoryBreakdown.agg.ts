import mongoose from 'mongoose';

export const getCategoryBreakdownPipeline = (userId: string, dateFrom?: Date, dateTo?: Date) => {
  const match: any = {
    userId: new mongoose.Types.ObjectId(userId),
    isTransfer: false,
    amount: { $lt: "0" } // Only expenses
  };

  if (dateFrom || dateTo) {
    match.date = {};
    if (dateFrom) match.date.$gte = dateFrom;
    if (dateTo) match.date.$lte = dateTo;
  }

  return [
    { $match: match },
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: { $abs: { $toDouble: '$amount' } } },
        transactionCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        totalAmount: { $toString: { $round: ['$totalAmount', 2] } },
        transactionCount: 1,
      },
    },
    { $sort: { totalAmount: -1 } },
  ];
};
