// In-memory "база даних" користувачів
const users = [
  { id: 1, name: 'Olena Kovalenko', email: 'olena@example.com', age: 28, city: 'Kyiv' },
  { id: 2, name: 'Taras Shevchuk', email: 'taras@example.com', age: 34, city: 'Lviv' },
  { id: 3, name: 'Iryna Bondar', email: 'iryna@example.com', age: 22, city: 'Odesa' },
  { id: 4, name: 'Mykola Melnyk', email: 'mykola@example.com', age: 41, city: 'Kharkiv' },
];

let nextId = users.length + 1;

export const findAll = () => users;

export const findById = (id) => users.find((u) => u.id === Number(id));

export const create = ({ name, email, age, city }) => {
  const user = { id: nextId++, name, email, age: age !== undefined ? Number(age) : null, city: city ?? null };
  users.push(user);
  return user;
};

export const update = (id, { name, email, age, city }) => {
  const user = findById(id);
  if (!user) return null;
  Object.assign(user, { name, email, age: age !== undefined ? Number(age) : user.age, city: city ?? user.city });
  return user;
};

export const remove = (id) => {
  const index = users.findIndex((u) => u.id === Number(id));
  if (index === -1) return null;
  return users.splice(index, 1)[0];
};
