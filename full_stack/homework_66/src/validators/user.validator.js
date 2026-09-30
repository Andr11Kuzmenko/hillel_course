const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const USER_ROLES = ['reader', 'editor', 'admin'];
const ALLOWED = ['name', 'email', 'age', 'city', 'role', 'hobbies'];

/**
 * Валідує та нормалізує дані користувача.
 * partial = false — повний документ (insert/replace): name та email обов'язкові.
 * partial = true — часткове оновлення (update): лише передані поля, хоча б одне.
 * Невідомі поля відкидаються (захист від запису довільних полів / операторів).
 */
export const validateUser = (input, { partial = false } = {}) => {
  const errors = [];
  const value = {};

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { errors: ['body must be a JSON object'], value };
  }

  const unknown = Object.keys(input).filter((k) => !ALLOWED.includes(k));
  if (unknown.length) errors.push(`unknown fields: ${unknown.join(', ')}`);

  const has = (k) => input[k] !== undefined;

  if (has('name') || !partial) {
    if (typeof input.name !== 'string' || input.name.trim().length < 2) errors.push('name is required (min 2 chars)');
    else value.name = input.name.trim();
  }
  if (has('email') || !partial) {
    if (typeof input.email !== 'string' || !EMAIL_RE.test(input.email)) errors.push('email must be a valid email');
    else value.email = input.email.trim().toLowerCase();
  }
  if (has('age')) {
    const age = Number(input.age);
    if (!Number.isInteger(age) || age < 0 || age > 150) errors.push('age must be an integer between 0 and 150');
    else value.age = age;
  }
  if (has('city')) {
    if (typeof input.city !== 'string' || !input.city.trim()) errors.push('city must be a non-empty string');
    else value.city = input.city.trim();
  }
  if (has('role')) {
    if (!USER_ROLES.includes(input.role)) errors.push(`role must be one of: ${USER_ROLES.join(', ')}`);
    else value.role = input.role;
  }
  if (has('hobbies')) {
    if (!Array.isArray(input.hobbies) || !input.hobbies.every((h) => typeof h === 'string')) {
      errors.push('hobbies must be an array of strings');
    } else value.hobbies = input.hobbies.map((h) => h.trim()).filter(Boolean);
  }

  if (partial && !errors.length && !Object.keys(value).length) errors.push('at least one field is required');

  return { errors, value };
};
