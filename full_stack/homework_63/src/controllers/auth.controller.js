import * as Account from '../models/accounts.model.js';
import { signToken, tokenCookieOptions } from '../utils/jwt.js';
import { TOKEN_COOKIE } from '../config.js';
import { HttpError } from '../utils/HttpError.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// HTML-потік (рендер/редирект) — для GET-запитів браузера та відправки HTML-форм;
// для JSON-запитів — відповіді у форматі JSON
const isHtml = (req) =>
  req.method === 'GET' ? req.accepts(['html', 'json']) === 'html' : Boolean(req.is('urlencoded'));
const safeNext = (value) => (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/protected');

const issueToken = (res, account) => {
  const token = signToken(account);
  res.cookie(TOKEN_COOKIE, token, tokenCookieOptions);
  return token;
};

export const showRegister = (req, res) => {
  res.render('auth/register', { title: 'Register', error: null, values: {} });
};

export const showLogin = (req, res) => {
  res.render('auth/login', { title: 'Login', error: null, values: {}, next: req.query.next || '' });
};

export const register = async (req, res, next) => {
  const { name, email, password } = req.body ?? {};
  const errors = [];
  if (typeof email !== 'string' || !EMAIL_RE.test(email)) errors.push('email must be a valid email');
  if (typeof password !== 'string' || password.length < 6) errors.push('password must be at least 6 characters');
  if (!errors.length && Account.findByEmail(email)) errors.push('user with this email already exists');

  if (errors.length) {
    if (isHtml(req)) {
      return res.status(400).render('auth/register', { title: 'Register', error: errors.join('; '), values: { name, email } });
    }
    return next(new HttpError(errors.includes('user with this email already exists') ? 409 : 400, 'Registration failed', errors));
  }

  try {
    const account = await Account.create({ name, email, password });
    const token = issueToken(res, account);
    if (isHtml(req)) return res.redirect('/protected');
    res.status(201).json({ message: 'Registered', user: Account.toPublic(account), token });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body ?? {};
  try {
    const account = email && Account.findByEmail(email);
    const ok = account && typeof password === 'string' && (await Account.verifyPassword(account, password));

    if (!ok) {
      if (isHtml(req)) {
        return res
          .status(401)
          .render('auth/login', { title: 'Login', error: 'Invalid email or password', values: { email }, next: req.body?.next || '' });
      }
      return next(new HttpError(401, 'Invalid email or password'));
    }

    const token = issueToken(res, account);
    if (isHtml(req)) return res.redirect(safeNext(req.body?.next));
    res.json({ message: 'Logged in', user: Account.toPublic(account), token });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie(TOKEN_COOKIE, { httpOnly: true, sameSite: 'lax' });
  if (isHtml(req)) return res.redirect('/auth/login');
  res.json({ message: 'Logged out' });
};

// GET /auth/me — дані з токена (захищено requireJwt)
export const me = (req, res) => {
  const account = Account.findById(req.user.id);
  res.json({ user: account ? Account.toPublic(account) : req.user });
};

// GET /protected — захищена сторінка (захищено requireJwt)
export const protectedPage = (req, res) => {
  if (req.accepts(['html', 'json']) === 'json') {
    return res.json({ message: `Hello, ${req.user.name}! This is a protected route.`, user: req.user });
  }
  res.render('protected', { title: 'Protected', user: req.user });
};
