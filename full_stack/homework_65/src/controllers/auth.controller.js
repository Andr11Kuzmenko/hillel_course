import passport from '../auth/passport.js';
import * as Account from '../models/accounts.model.js';
import { HttpError } from '../utils/HttpError.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// HTML-потік (рендер/редирект) — для GET-запитів браузера та відправки HTML-форм;
// для JSON-запитів — відповіді у форматі JSON
const isHtml = (req) =>
  req.method === 'GET' ? req.accepts(['html', 'json']) === 'html' : Boolean(req.is('urlencoded'));

const safeNext = (value) =>
  typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/profile';

export const showRegister = (req, res) => {
  res.render('auth/register', { title: 'Register', error: null, values: {} });
};

export const showLogin = (req, res) => {
  res.render('auth/login', { title: 'Login', error: null, values: {}, next: req.query.next || '' });
};

// POST /auth/register — створення акаунта (insertOne в колекцію accounts) + автоматичний вхід
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body ?? {};
    const errors = [];
    if (typeof email !== 'string' || !EMAIL_RE.test(email)) errors.push('email must be a valid email');
    if (typeof password !== 'string' || password.length < 6) errors.push('password must be at least 6 characters');
    const exists = !errors.length && Boolean(await Account.findByEmail(email));
    if (exists) errors.push('user with this email already exists');

    if (errors.length) {
      if (isHtml(req)) {
        return res
          .status(400)
          .render('auth/register', { title: 'Register', error: errors.join('; '), values: { name, email } });
      }
      return next(new HttpError(exists ? 409 : 400, 'Registration failed', errors));
    }

    const account = await Account.create({ name, email, password });
    req.login(account, (err) => {
      if (err) return next(err);
      if (isHtml(req)) return res.redirect('/profile');
      res.status(201).json({ message: 'Registered and logged in', user: Account.toPublic(account) });
    });
  } catch (err) {
    next(err);
  }
};

// POST /auth/login — passport.authenticate('local') з власним callback,
// щоб однаково підтримати HTML-форми та JSON
export const login = (req, res, next) => {
  passport.authenticate('local', (err, account, info) => {
    if (err) return next(err);

    if (!account) {
      const message = info?.message || 'Invalid email or password';
      if (isHtml(req)) {
        return res.status(401).render('auth/login', {
          title: 'Login',
          error: message,
          values: { email: req.body?.email },
          next: req.body?.next || '',
        });
      }
      return next(new HttpError(401, message));
    }

    req.login(account, (loginErr) => {
      if (loginErr) return next(loginErr);
      if (isHtml(req)) return res.redirect(safeNext(req.body?.next));
      res.json({ message: 'Logged in', user: Account.toPublic(account) });
    });
  })(req, res, next);
};

// GET|POST /auth/logout
export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    if (isHtml(req)) return res.redirect('/auth/login');
    res.json({ message: 'Logged out' });
  });
};

// GET /profile — профіль (ensureAuthenticated)
export const profile = (req, res) => {
  if (req.accepts(['html', 'json']) === 'json') return res.json({ user: req.user });
  res.render('profile', { title: 'Profile', user: req.user, visits: req.session.visits });
};

// GET /protected — приклад захищеного маршруту (ensureAuthenticated)
export const protectedPage = (req, res) => {
  if (req.accepts(['html', 'json']) === 'json') {
    return res.json({ message: `Hello, ${req.user.name}! This is a protected route.`, user: req.user });
  }
  res.render('protected', { title: 'Protected', user: req.user });
};
