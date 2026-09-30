import bcrypt from 'bcryptjs';

// In-memory сховище облікових записів для автентифікації (паролі — лише у вигляді хешу)
const accounts = [];
let nextId = 1;

export const findByEmail = (email) =>
  accounts.find((a) => a.email === String(email).toLowerCase().trim());

export const findById = (id) => accounts.find((a) => a.id === Number(id));

export const create = async ({ name, email, password }) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const account = {
    id: nextId++,
    name: name?.trim() || email.split('@')[0],
    email: email.toLowerCase().trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  accounts.push(account);
  return account;
};

export const verifyPassword = (account, password) => bcrypt.compare(password, account.passwordHash);

// Публічне представлення без хешу пароля
export const toPublic = ({ passwordHash, ...rest }) => rest; // eslint-disable-line no-unused-vars
