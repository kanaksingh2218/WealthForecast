import mongoose from 'mongoose';

export const getTrendPipeline = (userId: string, category?: string) => {
  const match: any = {
    userId: new mongoose.Types.ObjectId(userId),
    isTransfer: false,
  };

  if (category) {
    match.category = category;
  }

  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  match.date = { $gte: twelveMonthsAgo };

  return [
    { $match: match },
    {
      $group: {
        _id: {
          month: { $month: '$date' },
          year: { $year: '$date' },
          category: '$category',
        },
        total: { $sum: { $abs: { $toDouble: '$amount' } } },
      },
    },
    {
      $project: {
        _id: 0,
        period: {
          $concat: [
            { $toString: '$_id.year' },
            '-',
            { $cond: [{ $lt: ['$_id.month', 10] }, '0', ''] },
            { $toString: '$_id.month' },
          ],
        },
        category: '$_id.category',
        amount: { $toString: { $round: ['$total', 2] } },
      },
    },
    { $sort: { period: 1 } },
  ];
};
