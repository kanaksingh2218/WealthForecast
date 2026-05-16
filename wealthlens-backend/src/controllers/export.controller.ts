import { Request, Response, NextFunction } from 'express';
import { ExportService } from '../services/export.service';

export const exportTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const buffer = await ExportService.generateExcelReport(userId);
    
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=WealthLens_Report.xlsx'
    );
    
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};
