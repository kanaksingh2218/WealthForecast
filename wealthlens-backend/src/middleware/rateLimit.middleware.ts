import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis';
import { env } from '../config/env';
import { AppError, ErrorCode } from './error.middleware';

export const rateLimitMiddleware = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS || 60000,
  max: env.RATE_LIMIT_MAX_REQUESTS || 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    // @ts-expect-error - ioredis type mismatch in some versions
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  handler: (req, res, next) => {
    next(new AppError(ErrorCode.RATE_LIMIT_EXCEEDED, 'Too many requests', 429));
  },
});
