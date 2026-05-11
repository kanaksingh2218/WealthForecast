import { redis } from '../config/redis';

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  static async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  static async invalidatePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  static generateKey(userId: string, prefix: string, params: any = {}): string {
    const paramStr = JSON.stringify(params);
    return `wl:${prefix}:${userId}:${paramStr}`;
  }
}
