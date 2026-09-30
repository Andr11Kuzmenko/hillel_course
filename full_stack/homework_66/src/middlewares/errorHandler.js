/**
 * Централізований обробник помилок.
 * Для браузера (Accept: text/html) рендерить сторінку помилки (PUG), інакше — JSON.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let status = err.status || err.statusCode || 500;
  let message = err.message;

  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON body';
  } else if (err.code === 11000) {
    // MongoDB: порушення унікального індексу
    status = 409;
    message = `Duplicate value: ${JSON.stringify(err.keyValue ?? {})}`;
  } else if (['MongoServerSelectionError', 'MongoNetworkError', 'MongoNotConnectedError'].includes(err.name)) {
    status = 503;
    message = 'Database is unavailable';
  }

  if (status >= 500) {
    console.error(err);
    if (status === 500) message = 'Internal Server Error';
  }

  res.status(status);

  if (req.accepts(['json', 'html']) === 'html') {
    return res.render('error', { title: `Error ${status}`, status, message, details: err.details });
  }

  res.json({ error: message, ...(err.details && { details: err.details }) });
};
