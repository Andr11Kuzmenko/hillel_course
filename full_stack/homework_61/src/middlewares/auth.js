import { API_TOKEN } from '../config.js';
import { HttpError } from '../utils/HttpError.js';

/**
 * Аутентифікація за заголовком `Authorization: Bearer <token>`.
 */
export const authenticate = (req, res, next) => {
  const header = req.get('Authorization') || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new HttpError(401, 'Authorization header with Bearer token is required'));
  }
  if (token !== API_TOKEN) {
    return next(new HttpError(401, 'Invalid token'));
  }

  req.user = { authenticated: true };
  next();
};
