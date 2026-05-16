import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import helmet from 'helmet';
import compression from 'compression';
import pinoHttp from 'pino-http';
import { rateLimit } from 'express-rate-limit';

import { env } from './config/env';
import { connectDB } from './config/db';
import { redis } from './config/redis';
import logger from './config/logger';
import { errorHandler } from './middleware/error.middleware';
import { setupSwagger } from './config/swagger';

import importRoutes from './routes/import.routes';
import transactionRoutes from './routes/transactions.routes';
import analyticsRoutes from './routes/analytics.routes';
import forecastRoutes from './routes/forecast.routes';
import authRoutes from './routes/auth.routes';
import subscriptionRoutes from './routes/subscription.routes';
import exportRoutes from './routes/export.routes';

const app = express();

setupSwagger(app);

app.use(pinoHttp({ logger }));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

connectDB();

app.use(cors({
  origin: env.ALLOWED_ORIGINS.split(','),
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser(env.COOKIE_SECRET));

app.use('/api/import', importRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/export', exportRoutes);

app.get('/health', async (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  let redisStatus = 'disconnected';
  try {
    const ping = await redis.ping();
    if (ping === 'PONG') redisStatus = 'connected';
  } catch (e) {
    redisStatus = 'error';
  }
  const isHealthy = mongoStatus === 'connected' && redisStatus === 'connected';
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    services: { mongodb: mongoStatus, redis: redisStatus }
  });
});

app.use(errorHandler);

app.listen(env.PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});
