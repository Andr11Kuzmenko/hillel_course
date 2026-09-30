export const getArticles = (req, res) => {
  res.type('text/plain').send('Get articles route');
};

export const postArticles = (req, res) => {
  res.status(201).type('text/plain').send(`Post articles route (title: ${req.body.title})`);
};

export const getArticleById = (req, res) => {
  res.type('text/plain').send(`Get article by Id route: ${req.params.articleId}`);
};

export const putArticleById = (req, res) => {
  res.type('text/plain').send(`Put article by Id route: ${req.params.articleId}`);
};

export const deleteArticleById = (req, res) => {
  res.type('text/plain').send(`Delete article by Id route: ${req.params.articleId}`);
};
