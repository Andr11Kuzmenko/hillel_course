import { API_TOKEN } from '../config.js';
import { HttpError } from '../utils/HttpError.js';

/**
 * Аутентифікація для змінюючих запитів /users.
 * Приймається або Passport-сесія (req.isAuthenticated()), або статичний API-токен
 * у заголовку `Authorization: Bearer <API_TOKEN>`.
 */
export const authenticate = (req, res, next) => {
  if (req.isAuthenticated?.()) return next();

  const [scheme, token] = (req.get('Authorization') || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new HttpError(401, 'Authentication required: log in or send Authorization: Bearer <token>'));
  }
  if (token !== API_TOKEN) {
    return next(new HttpError(401, 'Invalid token'));
  }
  next();
};
