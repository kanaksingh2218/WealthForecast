import ExcelJS from 'exceljs';
import { Transaction } from '../models/Transaction.model';
import logger from '../config/logger';

export class ExportService {

  static async generateExcelReport(userId: string): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Transactions');

    sheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Merchant', key: 'merchantName', width: 25 },
      { header: 'Source', key: 'source', width: 10 },
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    transactions.forEach(t => {
      sheet.addRow({
        date: t.date.toISOString().split('T')[0],
        description: t.description,
        amount: parseFloat(t.amount),
        category: t.category,
        merchantName: t.merchantName || '',
        source: t.source,
      });
    });

    sheet.getColumn('amount').numFmt = '#,##0.00';

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
