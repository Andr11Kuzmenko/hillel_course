import * as sc from './secureCrypto.js'

const title = (text) => console.log(`\n--- ${text} ---`)

async function main() {
  console.log('=== HW 58: Захищені криптографічні функції (node:crypto) ===')

  title('1. Хешування SHA-256')
  console.log('sha256("hello")   =', sc.hash('hello'))
  console.log('sha256("hello!")  =', sc.hash('hello!'), '(мала зміна -> зовсім інший хеш)')
  console.log('sha512("hello")   =', sc.hash('hello', 'sha512').slice(0, 64) + '...')

  title('2. HMAC-SHA256')
  const secret = 'super-secret-key'
  const message = JSON.stringify({ userId: 42, role: 'user' })
  const signature = sc.createHmac(message, secret)
  console.log('Підпис:', signature)
  console.log('Перевірка оригіналу:', sc.verifyHmac(message, secret, signature))
  console.log('Перевірка підробленого:', sc.verifyHmac(message.replace('user', 'admin'), secret, signature))

  title('3. Хешування паролів (scrypt / pbkdf2 + сіль + timingSafeEqual)')
  const password = 'Str0ng-P@ssw0rd'
  const h1 = await sc.hashPassword(password)
  const h2 = await sc.hashPassword(password)
  const h3 = await sc.hashPassword(password, { algorithm: 'pbkdf2' })
  console.log('scrypt #1:', h1.slice(0, 60) + '...')
  console.log('scrypt #2:', h2.slice(0, 60) + '...', '(інша сіль -> інший хеш)')
  console.log('pbkdf2   :', h3.slice(0, 60) + '...')
  console.log('Вірний пароль (scrypt):', await sc.verifyPassword(password, h1))
  console.log('Вірний пароль (pbkdf2):', await sc.verifyPassword(password, h3))
  console.log('Невірний пароль:', await sc.verifyPassword('wrong-password', h1))
  try {
    await sc.hashPassword('123')
  } catch (error) {
    console.log('Короткий пароль:', error.message)
  }

  title('4. AES-256-GCM шифрування')
  const key = sc.generateKey()
  const secretText = 'Номер картки: 4111 1111 1111 1111'
  const encrypted = sc.encrypt(secretText, key)
  console.log('Зашифровано:', encrypted)
  console.log('Ще раз (новий IV):', sc.encrypt(secretText, key))
  console.log('Розшифровано:', sc.decrypt(encrypted, key))

  const [iv, tag, data] = encrypted.split(':')
  const tamperedData = Buffer.from(data, 'base64')
  tamperedData[0] ^= 1
  const cases = [
    ['Невірний ключ', () => sc.decrypt(encrypted, sc.generateKey())],
    ['Змінені дані', () => sc.decrypt([iv, tag, tamperedData.toString('base64')].join(':'), key)],
    ['Невірний AAD', () => sc.decrypt(sc.encrypt('text', key, 'user:1'), key, 'user:2')],
  ]
  for (const [label, fn] of cases) {
    try {
      fn()
    } catch (error) {
      console.log(`${label}: ${error.message}`)
    }
  }
  const salt = 'fixed-demo-salt'
  const derived = sc.deriveKey('my passphrase', salt)
  console.log('Ключ з пароля (scrypt) + AAD:', sc.decrypt(sc.encrypt('привіт', derived, 'ctx'), derived, 'ctx'))

  title('5. Випадкові токени')
  console.log('Токен (base64url):', sc.generateToken())
  console.log('Токен (hex, 16 байт):', sc.generateToken(16, 'hex'))
  console.log('UUID v4:', sc.generateUUID())
  console.log('OTP-код:', sc.generateOtp())
}

main().catch((error) => {
  console.error('Помилка:', error)
  process.exitCode = 1
})
