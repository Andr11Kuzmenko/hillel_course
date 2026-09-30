import session from 'express-session';
import { SESSION_SECRET, IS_PROD } from '../config.js';

// Сесії зберігаються в пам'яті (MemoryStore) — достатньо для навчального проєкту.
// У сесії Passport зберігає id залогіненого користувача (req.session.passport.user).
export const sessionMiddleware = session({
  name: 'sid',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: IS_PROD, maxAge: 1000 * 60 * 60 * 24 },
});

/**
 * Рахує кількість запитів у межах сесії та час останнього візиту.
 */
export const trackVisits = (req, res, next) => {
  req.session.visits = (req.session.visits || 0) + 1;
  req.session.lastVisit = new Date().toISOString();
  next();
};
