// Детермінований генератор тестових користувачів
const FIRST = ['Oleh', 'Anna', 'Ivan', 'Maria', 'Petro', 'Oksana', 'Roman', 'Natalia', 'Bohdan', 'Viktoriia'];
const LAST = ['Koval', 'Hnatiuk', 'Marchenko', 'Boiko', 'Tkachuk', 'Levchenko', 'Polishchuk', 'Karpenko'];
const CITIES = ['Kyiv', 'Lviv', 'Odesa', 'Kharkiv', 'Dnipro', 'Zaporizhzhia', 'Vinnytsia', 'Poltava'];
const ROLES = ['reader', 'reader', 'reader', 'editor', 'admin'];
const HOBBIES = ['reading', 'travel', 'music', 'running', 'chess', 'cooking', 'photography', 'gaming', 'yoga'];

export const generateUsers = (count) =>
  Array.from({ length: count }, (_, i) => ({
    name: `${FIRST[i % FIRST.length]} ${LAST[Math.floor(i / FIRST.length) % LAST.length]}`,
    email: `user${i + 1}@generated.test`,
    age: 16 + ((i * 13) % 60),
    city: CITIES[(i * 3) % CITIES.length],
    role: ROLES[i % ROLES.length],
    hobbies: [HOBBIES[i % HOBBIES.length], HOBBIES[(i * 5 + 2) % HOBBIES.length]].filter((h, k, arr) => arr.indexOf(h) === k),
    createdAt: new Date(Date.UTC(2025, i % 12, 1 + (i % 28))),
  }));
