import { THEME_COOKIE, THEMES } from '../config.js';

/**
 * Читає налаштування користувача з cookies і передає їх у шаблони через res.locals.
 */
export const loadPreferences = (req, res, next) => {
  const theme = req.cookies?.[THEME_COOKIE];
  res.locals.theme = THEMES.includes(theme) ? theme : 'light';
  res.locals.currentPath = req.originalUrl;
  next();
};
