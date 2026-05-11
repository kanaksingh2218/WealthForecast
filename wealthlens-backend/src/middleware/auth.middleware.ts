import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError, ErrorCode } from '../middleware/error.middleware';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return next(new AppError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_PUBLIC_KEY, { algorithms: ['RS256'] });
    (req as any).user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError(ErrorCode.UNAUTHORIZED, 'Token expired', 401));
    }
    return next(new AppError(ErrorCode.UNAUTHORIZED, 'Invalid token', 401));
  }
};
