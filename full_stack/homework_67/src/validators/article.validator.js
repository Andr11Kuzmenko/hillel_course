const ALLOWED = ['title', 'content', 'author', 'category', 'tags', 'views', 'likes', 'published', 'publishedAt'];

const toTags = (tags) =>
  Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',') : null;

/**
 * Валідує та нормалізує дані статті (див. validateUser — ті самі правила partial).
 */
export const validateArticle = (input, { partial = false } = {}) => {
  const errors = [];
  const value = {};

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { errors: ['body must be a JSON object'], value };
  }

  const unknown = Object.keys(input).filter((k) => !ALLOWED.includes(k));
  if (unknown.length) errors.push(`unknown fields: ${unknown.join(', ')}`);

  const has = (k) => input[k] !== undefined;

  if (has('title') || !partial) {
    if (typeof input.title !== 'string' || input.title.trim().length < 3) errors.push('title is required (min 3 chars)');
    else value.title = input.title.trim();
  }
  if (has('content') || !partial) {
    if (typeof input.content !== 'string' || !input.content.trim()) errors.push('content is required');
    else value.content = input.content.trim();
  }
  for (const key of ['author', 'category']) {
    if (has(key)) {
      if (typeof input[key] !== 'string' || !input[key].trim()) errors.push(`${key} must be a non-empty string`);
      else value[key] = input[key].trim();
    }
  }
  if (has('tags')) {
    const tags = toTags(input.tags);
    if (!tags || !tags.every((t) => typeof t === 'string')) errors.push('tags must be an array of strings or a comma-separated string');
    else value.tags = [...new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean))];
  }
  for (const key of ['views', 'likes']) {
    if (has(key)) {
      const n = Number(input[key]);
      if (!Number.isInteger(n) || n < 0) errors.push(`${key} must be a non-negative integer`);
      else value[key] = n;
    }
  }
  if (has('published')) {
    if (typeof input.published !== 'boolean') errors.push('published must be a boolean');
    else value.published = input.published;
  }
  if (has('publishedAt')) {
    const date = new Date(input.publishedAt);
    if (Number.isNaN(date.getTime())) errors.push('publishedAt must be a valid date');
    else value.publishedAt = date;
  }

  if (partial && !errors.length && !Object.keys(value).length) errors.push('at least one field is required');

  return { errors, value };
};

// Значення за замовчуванням для нової статті (insert/replace)
export const articleDefaults = () => ({
  author: 'Anonymous',
  category: 'General',
  tags: [],
  views: 0,
  likes: 0,
  published: true,
  publishedAt: new Date(),
});
