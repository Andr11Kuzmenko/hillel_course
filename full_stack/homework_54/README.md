# HW 54. Базові операції з буфером у Node.js: перетворення між Base64 та Hex

## Завдання

Використовуючи вбудований клас `Buffer`, реалізувати функції перетворення даних:

- `stringToBase64(text)` / `base64ToString(base64)`
- `stringToHex(text)` / `hexToString(hex)`
- `base64ToHex(base64)` / `hexToBase64(hex)` — напряму через буфер (працює й для бінарних даних)

Кожна функція перевіряє вхідні дані: не рядок — `TypeError`, некоректний Base64/Hex — `Error` з описом.
Реалізація — у `converter.js`, демонстрація — у `index.js`, тести — у `converter.test.js`.

## Запуск

```bash
cd full_stack/homework_54
npm start   # демонстрація
npm test    # тести (node:test)
```

Залежностей немає — потрібен лише Node.js 18+.
