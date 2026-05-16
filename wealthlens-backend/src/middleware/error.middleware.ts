import { Request, Response, NextFunction } from 'express';

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_FILE_FORMAT = 'INVALID_FILE_FORMAT',
  DUPLICATE_TRANSACTIONS = 'DUPLICATE_TRANSACTIONS',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  FORECAST_COMPUTE_ERROR = 'FORECAST_COMPUTE_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class AppError extends Error {
  public code: ErrorCode;
  public statusCode: number;
  public details?: any;

  constructor(code: ErrorCode, message: string, statusCode: number, details?: any) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[Error] ${err.message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  const statusCode = err.statusCode || 500;

  const code = err.code || ErrorCode.INTERNAL_ERROR;
  const message = err.message || 'An unexpected error occurred';

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      statusCode,
      details: err.details,
    },
  });
};
