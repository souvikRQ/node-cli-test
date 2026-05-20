// Token expiration times
export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: '15m',      // Access token expires in 15 minutes
  REFRESH_TOKEN: '24h',     // Refresh token expires in 24 hours (1 day)
};

// Token types
export const TOKEN_TYPE = {
  ACCESS: 'access',
  REFRESH: 'refresh',
};

// JWT configuration
export const JWT_CONFIG = {
  ACCESS_TOKEN_SECRET: process.env.JWT_SECRET || 'your_access_token_secret',
  REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_SECRET || 'your_refresh_token_secret',
};
