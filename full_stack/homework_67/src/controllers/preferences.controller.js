import { THEME_COOKIE, THEMES } from '../config.js';
import { HttpError } from '../utils/HttpError.js';

const ONE_YEAR = 1000 * 60 * 60 * 24 * 365;

const safeRedirect = (value) => (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/');

const setTheme = (req, res, next, theme) => {
  if (!THEMES.includes(theme)) {
    return next(new HttpError(400, `Theme must be one of: ${THEMES.join(', ')}`));
  }
  res.cookie(THEME_COOKIE, theme, { maxAge: ONE_YEAR, sameSite: 'lax' });

  if (req.accepts(['json', 'html']) === 'json') return res.json({ theme });
  res.redirect(safeRedirect(req.query.redirect || req.body?.redirect));
};

// GET /preferences — поточні налаштування
export const getPreferences = (req, res) => {
  res.json({ theme: res.locals.theme, cookies: req.cookies });
};

// GET /preferences/theme/:theme?redirect=/users — зручно для посилань у шаблонах
export const setThemeByParam = (req, res, next) => setTheme(req, res, next, req.params.theme);

// POST /preferences/theme  { theme: "dark" }
export const setThemeByBody = (req, res, next) => setTheme(req, res, next, req.body?.theme);

// DELETE /preferences — скинути налаштування
export const resetPreferences = (req, res) => {
  res.clearCookie(THEME_COOKIE);
  res.json({ message: 'Preferences reset' });
};
