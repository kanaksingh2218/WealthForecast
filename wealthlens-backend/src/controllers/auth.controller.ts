import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';
import { env } from '../config/env';
import { AppError, ErrorCode } from '../middleware/error.middleware';

const generateTokens = (userId: string) => {
  const secret = env.JWT_PRIVATE_KEY || env.COOKIE_SECRET;
  const accessToken = jwt.sign({ id: userId }, secret, {
    expiresIn: env.JWT_ACCESS_EXPIRY as any,
  });
  const refreshToken = jwt.sign({ id: userId }, secret, {
    expiresIn: env.JWT_REFRESH_EXPIRY as any,
  });
  return { accessToken, refreshToken };
};
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, displayName } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError(ErrorCode.CONFLICT, 'Email already registered', 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash, displayName });

    const { accessToken, refreshToken } = generateTokens(user.id);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    
    user.refreshTokenHash = refreshTokenHash;
    await user.save();

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15m
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30d
    });

    res.status(201).json({
      success: true,
      data: { user: { id: user.id, email: user.email, displayName: user.displayName } },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, 'Invalid email or password', 401);
    }

    const { accessToken, refreshToken } = generateTokens(user.id);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    user.refreshTokenHash = refreshTokenHash;
    await user.save();

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: { user: { id: user.id, email: user.email, displayName: user.displayName } },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 'No refresh token provided', 401);
    }

    const decoded = jwt.verify(refreshToken, env.JWT_PRIVATE_KEY || env.COOKIE_SECRET) as any;    
    const user = await User.findById(decoded.id).select('+refreshTokenHash');

    if (!user || !user.refreshTokenHash || !(await bcrypt.compare(refreshToken, user.refreshTokenHash))) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 'Invalid refresh token', 401);
    }

    const tokens = generateTokens(user.id);
    const newRefreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);

    user.refreshTokenHash = newRefreshTokenHash;
    await user.save();

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true });
  } catch (error) {
    next(new AppError(ErrorCode.UNAUTHORIZED, 'Session expired', 401));
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (userId) {
      await User.findByIdAndUpdate(userId, { refreshTokenHash: null });
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
