import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/error.middleware';
import importRoutes from './routes/import.routes';
import transactionRoutes from './routes/transactions.routes';
import analyticsRoutes from './routes/analytics.routes';
import forecastRoutes from './routes/forecast.routes';
import authRoutes from './routes/auth.routes';

const app = express();

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

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});
