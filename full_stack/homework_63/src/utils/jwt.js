import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN, IS_PROD, TOKEN_COOKIE } from '../config.js';

export const signToken = (account) =>
  jwt.sign({ sub: String(account.id), email: account.email, name: account.name }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

export const tokenCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: IS_PROD,
  maxAge: 1000 * 60 * 60, // 1 година — як і термін дії токена за замовчуванням
};

// Токен з cookie або з заголовка Authorization: Bearer <jwt>
export const extractToken = (req) => {
  if (req.cookies?.[TOKEN_COOKIE]) return req.cookies[TOKEN_COOKIE];
  const [scheme, token] = (req.get('Authorization') || '').split(' ');
  return scheme === 'Bearer' && token ? token : null;
};
