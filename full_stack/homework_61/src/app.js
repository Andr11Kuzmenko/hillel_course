import express from 'express';
import rootRouter from './routes/root.routes.js';
import usersRouter from './routes/users.routes.js';
import articlesRouter from './routes/articles.routes.js';
import sessionRouter from './routes/session.routes.js';
import { sessionMiddleware, trackVisits } from './middlewares/session.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Глобальні мідлвари
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(trackVisits);

// Маршрути (мідлвари для кожної групи підключено всередині роутерів)
app.use('/', rootRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/session', sessionRouter);

// 404 та централізований обробник помилок
app.use(notFound);
app.use(errorHandler);

export default app;
