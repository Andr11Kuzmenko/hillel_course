// In-memory "база даних" статей
const articles = [
  {
    id: 1,
    title: 'Getting started with Express',
    content: 'Express is a minimal and flexible Node.js web application framework.',
    author: 'Olena Kovalenko',
    tags: ['node', 'express'],
    createdAt: '2026-09-01',
  },
  {
    id: 2,
    title: 'Middlewares explained',
    content: 'Middleware functions have access to the request, response and the next function.',
    author: 'Taras Shevchuk',
    tags: ['express', 'middleware'],
    createdAt: '2026-09-10',
  },
  {
    id: 3,
    title: 'Templating with PUG and EJS',
    content: 'Template engines let you render dynamic HTML on the server side.',
    author: 'Iryna Bondar',
    tags: ['pug', 'ejs', 'templates'],
    createdAt: '2026-09-20',
  },
];

let nextId = articles.length + 1;

export const findAll = () => articles;

export const findById = (id) => articles.find((a) => a.id === Number(id));

const normalizeTags = (tags) =>
  Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

export const create = ({ title, content, author, tags }) => {
  const article = {
    id: nextId++,
    title,
    content,
    author: author || 'Anonymous',
    tags: normalizeTags(tags),
    createdAt: new Date().toISOString().slice(0, 10),
  };
  articles.push(article);
  return article;
};

export const update = (id, { title, content, author, tags }) => {
  const article = findById(id);
  if (!article) return null;
  Object.assign(article, {
    title,
    content,
    author: author || article.author,
    tags: tags !== undefined ? normalizeTags(tags) : article.tags,
  });
  return article;
};

export const remove = (id) => {
  const index = articles.findIndex((a) => a.id === Number(id));
  if (index === -1) return null;
  return articles.splice(index, 1)[0];
};
