export const PORT = Number(process.env.PORT) || 3000;
export const API_TOKEN = process.env.API_TOKEN || 'secret-token';
export const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-session-secret';
export const IS_PROD = process.env.NODE_ENV === 'production';

export const THEME_COOKIE = 'theme';
export const THEMES = ['light', 'dark'];
