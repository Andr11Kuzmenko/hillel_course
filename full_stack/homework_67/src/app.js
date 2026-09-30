import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from './auth/passport.js';
import rootRouter from './routes/root.routes.js';
import usersRouter from './routes/users.routes.js';
import articlesRouter from './routes/articles.routes.js';
import sessionRouter from './routes/session.routes.js';
import preferencesRouter from './routes/preferences.routes.js';
import authRouter from './routes/auth.routes.js';
import protectedRouter from './routes/protected.routes.js';
import apiRouter from './routes/api.routes.js';
import cursorRouter from './routes/cursor.routes.js';
import statsRouter from './routes/stats.routes.js';
import pagesRouter from './routes/pages.routes.js';
import { sessionMiddleware, trackVisits } from './middlewares/session.js';
import { loadPreferences } from './middlewares/preferences.js';
import { exposeUser } from './middlewares/ensureAuthenticated.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Шаблонізатори: PUG — за замовчуванням, EJS — підключається за розширенням файлу (.ejs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Хелпер для шаблонів: дата у форматі YYYY-MM-DD
app.locals.formatDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '—');

// Статичні файли (favicon.ico, css) з папки public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Парсери
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Сесії + Passport (порядок важливий: session -> passport.initialize -> passport.session)
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use(trackVisits);
app.use(loadPreferences);
app.use(exposeUser);

// Маршрути
app.use('/', rootRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/session', sessionRouter);
app.use('/preferences', preferencesRouter);
app.use('/auth', authRouter);
app.use('/api/cursor', cursorRouter); // курсори: стрімінг і пагінація
app.use('/api/stats', statsRouter); // агрегаційні звіти (JSON)
app.use('/api', apiRouter); // JSON API (READ)
app.use('/', pagesRouter); // /stats, /cursor/users
app.use('/', protectedRouter); // /profile, /protected

// 404 та централізований обробник помилок
app.use(notFound);
app.use(errorHandler);

export default app;
