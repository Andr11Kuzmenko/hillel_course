import session from 'express-session';
import { SESSION_SECRET } from '../config.js';

// Сесії зберігаються в пам'яті (MemoryStore) — достатньо для навчального проєкту
export const sessionMiddleware = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 },
});

/**
 * Рахує кількість запитів у межах сесії та час останнього візиту.
 */
export const trackVisits = (req, res, next) => {
  req.session.visits = (req.session.visits || 0) + 1;
  req.session.lastVisit = new Date().toISOString();
  next();
};
