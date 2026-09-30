# HW 58. Розробка захищених криптографічних функцій у JavaScript

## Завдання

Використовуючи вбудований модуль `node:crypto` (без сторонніх бібліотек), реалізувати набір безпечних функцій:

| Функція | Опис |
|---|---|
| `hash(data, algorithm = 'sha256')` | Хеш рядка/буфера (hex) |
| `createHmac(message, secret)` / `verifyHmac(...)` | Підпис HMAC-SHA256 і перевірка через `timingSafeEqual` |
| `hashPassword(password, { algorithm })` / `verifyPassword(password, stored)` | Хешування паролів `scrypt` або `pbkdf2` з випадковою сіллю (16 байт); порівняння у постійному часі |
| `encrypt(text, key, aad?)` / `decrypt(payload, key, aad?)` | AES-256-GCM з випадковим IV (12 байт) для кожного шифрування та перевіркою auth tag |
| `generateKey()` / `deriveKey(passphrase, salt)` | Випадковий 256-бітний ключ або ключ з пароля (scrypt) |
| `generateToken()`, `generateUUID()`, `generateOtp()` | Криптографічно стійкі випадкові значення |

Принципи безпеки: жодних `Math.random`, сіль і IV завжди випадкові, порівняння секретів — `crypto.timingSafeEqual`,
автентифіковане шифрування (GCM), повідомлення про помилку розшифрування не розкриває причину, валідація вхідних даних.

Реалізація — `secureCrypto.js`, демонстрація — `index.js`, тести — `secureCrypto.test.js`.

## Запуск

```bash
cd full_stack/homework_58
npm start   # демонстрація
npm test    # тести (node:test)
```

Залежностей немає — потрібен лише Node.js 18+.
