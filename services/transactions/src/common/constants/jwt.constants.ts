export const JWT_CONSTANTS = {
  SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
} as const;
