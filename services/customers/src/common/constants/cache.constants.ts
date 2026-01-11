export const CACHE_PREFIXES = {
  USER: 'user',
  USER_BALANCE: 'user:balance',
} as const;

export const CACHE_TTL = {
  ONE_HOUR: 60 * 60,
  ONE_DAY: 60 * 60 * 24,
} as const;

export const REQUEST_TIMEOUT = {
  ONE_SECOND: 1000,
  TEN_SECONDS: 10000,
} as const;
