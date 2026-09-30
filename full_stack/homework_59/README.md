# HW 59. Асинхронне стиснення та розпакування Gzip у JavaScript

## Завдання

Використовуючи вбудовані модулі `zlib`, `fs` та `stream`, реалізувати асинхронні функції (у `gzip.js`):

- `compressFile(input, output?)` — потокове стиснення файлу через `stream/promises.pipeline`
  (`createReadStream -> createGzip -> createWriteStream`), за замовчуванням у `<input>.gz`;
- `decompressFile(input, output?)` — потокове розпакування (`createGunzip`);
- `compressString(text)` / `decompressToString(buffer)` — стиснення в пам'яті через `util.promisify(zlib.gzip/gunzip)`.

Обробка помилок: перевірка існування вхідного файлу, некоректні аргументи, пошкоджені/не-gzip дані;
при збої частково записаний вихідний файл видаляється.

`index.js` створює тестовий файл у тимчасовій папці, стискає та розпаковує його, порівнює розміри й вміст,
демонструє стиснення рядків у пам'яті та обробку помилок, після чого прибирає тимчасові файли.

## Запуск

```bash
cd full_stack/homework_59
npm start
```

Залежностей немає — потрібен лише Node.js 18+.
