import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cookieParser from 'cookie-parser';
import rootRouter from './routes/root.routes.js';
import usersRouter from './routes/users.routes.js';
import articlesRouter from './routes/articles.routes.js';
import sessionRouter from './routes/session.routes.js';
import preferencesRouter from './routes/preferences.routes.js';
import authRouter from './routes/auth.routes.js';
import protectedRouter from './routes/protected.routes.js';
import { sessionMiddleware, trackVisits } from './middlewares/session.js';
import { loadPreferences } from './middlewares/preferences.js';
import { attachUser } from './middlewares/jwtAuth.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Шаблонізатори: PUG — за замовчуванням, EJS — підключається за розширенням файлу (.ejs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Статичні файли (favicon.ico, css) з папки public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Глобальні мідлвари
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(trackVisits);
app.use(loadPreferences);
app.use(attachUser);

// Маршрути
app.use('/', rootRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/session', sessionRouter);
app.use('/preferences', preferencesRouter);
app.use('/auth', authRouter);
app.use('/protected', protectedRouter);

// 404 та централізований обробник помилок
app.use(notFound);
app.use(errorHandler);

export default app;
