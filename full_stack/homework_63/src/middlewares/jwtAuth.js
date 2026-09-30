import { extractToken, verifyToken } from '../utils/jwt.js';
import { HttpError } from '../utils/HttpError.js';

/**
 * Глобальна мідлвара: якщо є валідний JWT — додає req.user та res.locals.currentUser
 * (щоб шаблони знали, чи користувач залогінений). Нічого не блокує.
 */
export const attachUser = (req, res, next) => {
  const token = extractToken(req);
  if (token) {
    try {
      const payload = verifyToken(token);
      req.user = { id: Number(payload.sub), email: payload.email, name: payload.name };
    } catch {
      req.user = null;
    }
  }
  res.locals.currentUser = req.user || null;
  next();
};

/**
 * Захищає маршрут: вимагає валідний JWT (cookie `token` або Authorization: Bearer).
 * Браузер перенаправляється на сторінку входу, API-клієнт отримує 401.
 */
export const requireJwt = (req, res, next) => {
  if (req.user) return next();

  if (req.accepts(['json', 'html']) === 'html' && req.method === 'GET') {
    return res.redirect(`/auth/login?next=${encodeURIComponent(req.originalUrl)}`);
  }
  next(new HttpError(401, 'Valid JWT is required (cookie "token" or Authorization: Bearer <jwt>)'));
};
