import { redis } from '../config/redis';

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  }
  static async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch { return; }
  }
  static async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) await redis.del(...keys);
    } catch { return; }
  }
  static generateKey(userId: string, prefix: string, params: any = {}): string {
    return 'wl:' + prefix + ':' + userId + ':' + JSON.stringify(params);
  }
}
