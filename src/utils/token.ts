import * as jwt from 'jsonwebtoken';
import { TOKEN_EXPIRY, JWT_CONFIG } from '../constants/token';

export interface TokenPayload {
  id: string;
  email: string;
}

export interface TokenObject {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

/**
 * Generate both access and refresh tokens
 * @param payload - Token payload containing user id and email
 * @returns TokenObject with accessToken, refreshToken, and expiresIn
 */
export const generateTokens = (payload: TokenPayload): TokenObject => {
  // Generate access token (expires in 15 minutes)
  const accessToken = jwt.sign(
    payload,
    JWT_CONFIG.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: TOKEN_EXPIRY.ACCESS_TOKEN,
    } as jwt.SignOptions
  );

  // Generate refresh token (expires in 24 hours)
  const refreshToken = jwt.sign(
    payload,
    JWT_CONFIG.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: TOKEN_EXPIRY.REFRESH_TOKEN,
    } as jwt.SignOptions
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: TOKEN_EXPIRY.ACCESS_TOKEN,
  };
};

/**
 * Verify access token
 * @param token - Access token to verify
 * @returns Decoded token payload
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(
      token,
      JWT_CONFIG.ACCESS_TOKEN_SECRET as string
    ) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

/**
 * Verify refresh token
 * @param token - Refresh token to verify
 * @returns Decoded token payload
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(
      token,
      JWT_CONFIG.REFRESH_TOKEN_SECRET as string
    ) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};
