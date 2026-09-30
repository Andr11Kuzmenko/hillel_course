export const notFound = (req, res) => {
  res.status(404).type('text/plain').send(`Not Found: ${req.method} ${req.originalUrl}`);
};
