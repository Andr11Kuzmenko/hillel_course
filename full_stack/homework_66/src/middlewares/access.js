import { HttpError } from '../utils/HttpError.js';

const ROLES = ['reader', 'editor', 'admin'];

// Які ролі мають доступ до якого HTTP-методу
const PERMISSIONS = {
  GET: ['reader', 'editor', 'admin'],
  POST: ['editor', 'admin'],
  PUT: ['editor', 'admin'],
  PATCH: ['editor', 'admin'],
  DELETE: ['admin'],
};

/**
 * Перевірка прав доступу за заголовком `X-User-Role`.
 * Для GET-запитів без заголовка (браузер) роль за замовчуванням — `reader`.
 */
export const checkArticleAccess = (req, res, next) => {
  let role = (req.get('X-User-Role') || '').toLowerCase();

  if (!role && req.method === 'GET') role = 'reader';

  if (!role) {
    return next(new HttpError(401, 'X-User-Role header is required'));
  }
  if (!ROLES.includes(role)) {
    return next(new HttpError(403, `Unknown role "${role}"`));
  }

  const allowed = PERMISSIONS[req.method] || [];
  if (!allowed.includes(role)) {
    return next(new HttpError(403, `Role "${role}" is not allowed to ${req.method} articles`));
  }

  req.role = role;
  next();
};
