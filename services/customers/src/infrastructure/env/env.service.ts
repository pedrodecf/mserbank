import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from './env';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  get<T extends keyof Env>(key: T) {
    return this.configService.get<T>(key, { infer: true });
  }

  getOrThrow<K extends keyof Env>(key: K): Env[K] {
    const value = this.get(key);
    if (value === undefined || (typeof value === 'string' && value.trim() === '')) {
      throw new Error(`Environment variable "${key}" not set.`);
    }
    return value as Env[K];
  }
}
