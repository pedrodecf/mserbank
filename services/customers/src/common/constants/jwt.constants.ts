export const JWT_CONSTANTS = {
  SECRET: process.env.JWT_SECRET || 'secret-key',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
} as const;
