import express from 'express';
import rootRouter from './routes/root.routes.js';
import usersRouter from './routes/users.routes.js';
import articlesRouter from './routes/articles.routes.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());

app.use('/', rootRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
