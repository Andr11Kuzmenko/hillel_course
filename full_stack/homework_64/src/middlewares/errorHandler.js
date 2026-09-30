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
  }
  if (status >= 500) {
    console.error(err);
    message = 'Internal Server Error';
  }

  res.status(status);

  if (req.accepts(['json', 'html']) === 'html') {
    return res.render('error', { title: `Error ${status}`, status, message, details: err.details });
  }

  res.json({ error: message, ...(err.details && { details: err.details }) });
};
