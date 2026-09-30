import crypto from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(crypto.scrypt)
const pbkdf2Async = promisify(crypto.pbkdf2)

function assertNonEmptyString(value, name) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError(`${name} має бути непорожнім рядком`)
  }
}

// ---------- Хешування ----------

/** SHA-256 (або інший алгоритм) хеш рядка чи буфера у hex. */
export function hash(data, algorithm = 'sha256') {
  if (typeof data !== 'string' && !Buffer.isBuffer(data)) throw new TypeError('data має бути рядком або Buffer')
  return crypto.createHash(algorithm).update(data).digest('hex')
}

// ---------- HMAC ----------

/** HMAC-SHA256 підпис повідомлення секретним ключем. */
export function createHmac(message, secret) {
  assertNonEmptyString(secret, 'secret')
  return crypto.createHmac('sha256', secret).update(message).digest('hex')
}

/** Перевірка HMAC у постійному часі (захист від timing-атак). */
export function verifyHmac(message, secret, signature) {
  const expected = Buffer.from(createHmac(message, secret), 'hex')
  const actual = Buffer.from(String(signature), 'hex')
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected)
}

// ---------- Хешування паролів ----------
// Формат збереження: алгоритм$параметри$сіль$хеш — усе, що потрібно для перевірки, в одному рядку.

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 }
const PBKDF2 = { iterations: 600_000, keylen: 32, digest: 'sha256' }
const MIN_PASSWORD_LENGTH = 8

export async function hashPassword(password, { algorithm = 'scrypt' } = {}) {
  assertNonEmptyString(password, 'password')
  if (password.length < MIN_PASSWORD_LENGTH) throw new Error(`Пароль має містити щонайменше ${MIN_PASSWORD_LENGTH} символів`)

  const salt = crypto.randomBytes(16)
  if (algorithm === 'scrypt') {
    const { N, r, p, keylen } = SCRYPT
    const key = await scryptAsync(password.normalize('NFKC'), salt, keylen, { N, r, p })
    return `scrypt$${N},${r},${p}$${salt.toString('hex')}$${key.toString('hex')}`
  }
  if (algorithm === 'pbkdf2') {
    const { iterations, keylen, digest } = PBKDF2
    const key = await pbkdf2Async(password.normalize('NFKC'), salt, iterations, keylen, digest)
    return `pbkdf2$${iterations},${digest}$${salt.toString('hex')}$${key.toString('hex')}`
  }
  throw new Error(`Непідтримуваний алгоритм: ${algorithm}`)
}

export async function verifyPassword(password, stored) {
  if (typeof password !== 'string' || typeof stored !== 'string') return false
  const [algorithm, params, saltHex, keyHex] = stored.split('$')
  if (!params || !saltHex || !keyHex) return false

  const salt = Buffer.from(saltHex, 'hex')
  const expected = Buffer.from(keyHex, 'hex')
  let actual

  if (algorithm === 'scrypt') {
    const [N, r, p] = params.split(',').map(Number)
    actual = await scryptAsync(password.normalize('NFKC'), salt, expected.length, { N, r, p })
  } else if (algorithm === 'pbkdf2') {
    const [iterations, digest] = params.split(',')
    actual = await pbkdf2Async(password.normalize('NFKC'), salt, Number(iterations), expected.length, digest)
  } else {
    return false
  }
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected)
}

// ---------- AES-256-GCM ----------
// GCM — автентифіковане шифрування: окрім конфіденційності, auth tag гарантує цілісність даних.
// Ключ — 32 байти; IV — 12 випадкових байтів, новий для КОЖНОГО шифрування.

const AES_ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const AUTH_TAG_LENGTH = 16

export function generateKey() {
  return crypto.randomBytes(32)
}

/** Отримання 32-байтного ключа з пароля (scrypt). */
export function deriveKey(passphrase, salt) {
  assertNonEmptyString(passphrase, 'passphrase')
  return crypto.scryptSync(passphrase, salt, 32)
}

function assertKey(key) {
  if (!Buffer.isBuffer(key) || key.length !== 32) throw new TypeError('Ключ має бути Buffer довжиною 32 байти')
}

/** Повертає рядок "iv:authTag:ciphertext" (base64). */
export function encrypt(plaintext, key, associatedData) {
  assertKey(key)
  if (typeof plaintext !== 'string') throw new TypeError('plaintext має бути рядком')
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(AES_ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH })
  if (associatedData) cipher.setAAD(Buffer.from(associatedData))
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [iv, tag, encrypted].map((b) => b.toString('base64')).join(':')
}

export function decrypt(payload, key, associatedData) {
  assertKey(key)
  const parts = String(payload).split(':')
  if (parts.length !== 3) throw new Error('Некоректний формат зашифрованих даних')
  const [iv, tag, encrypted] = parts.map((p) => Buffer.from(p, 'base64'))
  // Приймаємо лише повний 16-байтний тег: короткий тег полегшує підробку даних
  if (iv.length !== IV_LENGTH || tag.length !== AUTH_TAG_LENGTH) throw new Error('Некоректний IV або auth tag')
  try {
    const decipher = crypto.createDecipheriv(AES_ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH })
    decipher.setAuthTag(tag)
    if (associatedData) decipher.setAAD(Buffer.from(associatedData))
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
  } catch {
    // Не розкриваємо деталей: або невірний ключ, або дані змінено
    throw new Error('Не вдалося розшифрувати: невірний ключ або дані пошкоджено')
  }
}

// ---------- Випадкові значення ----------

/** Криптографічно стійкий токен (base64url за замовчуванням). */
export function generateToken(bytes = 32, encoding = 'base64url') {
  if (!Number.isInteger(bytes) || bytes < 16) throw new RangeError('Токен має містити щонайменше 16 байтів')
  return crypto.randomBytes(bytes).toString(encoding)
}

export function generateUUID() {
  return crypto.randomUUID()
}

/** Числовий одноразовий код (напр. для 2FA) без modulo bias — через crypto.randomInt. */
export function generateOtp(digits = 6) {
  return Array.from({ length: digits }, () => crypto.randomInt(0, 10)).join('')
}
