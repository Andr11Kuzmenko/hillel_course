// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  res
    .status(status)
    .type('text/plain')
    .send(status >= 500 ? 'Internal Server Error' : err.message);
};
