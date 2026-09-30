import { HttpError } from '../utils/HttpError.js';

const wantsHtml = (req) => req.method === 'GET' && req.accepts(['html', 'json']) === 'html';

/**
 * Пропускає лише автентифікованих (через Passport-сесію) користувачів.
 * Браузер перенаправляється на сторінку входу, API-клієнт отримує 401.
 */
export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  if (wantsHtml(req)) {
    return res.redirect(`/auth/login?next=${encodeURIComponent(req.originalUrl)}`);
  }
  next(new HttpError(401, 'Authentication required. Please log in via POST /auth/login'));
};

/**
 * Для сторінок входу/реєстрації: залогінений користувач одразу йде в профіль.
 */
export const ensureGuest = (req, res, next) => {
  if (req.isAuthenticated() && wantsHtml(req)) return res.redirect('/profile');
  next();
};

/**
 * Передає поточного користувача в шаблони.
 */
export const exposeUser = (req, res, next) => {
  res.locals.currentUser = req.user || null;
  next();
};
