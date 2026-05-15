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
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';

const app = express();

// Security and Performance Middleware
app.use(helmet());
app.use(compression());

// Rate limiting for production security

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
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

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);


app.listen(env.PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});
