# HW 56. Асинхронність в дії з вивченням Node.js

## Завдання

Продемонструвати ключові механізми асинхронності Node.js з поясненнями в коментарях і виводом у консоль:

1. **Event Loop** — порядок виконання: синхронний код → `process.nextTick` → мікрозадачі промісів
   (`then`, `queueMicrotask`) → `setImmediate` / `setTimeout` → I/O-колбеки (`fs.readFile`).
2. **Callbacks → Promises** — error-first колбеки, ручна обгортка `new Promise`, `util.promisify`.
3. **Комбінатори промісів** — `Promise.all`, `Promise.allSettled`, `Promise.race` (у т.ч. як таймаут), `Promise.any`.
4. **async/await** — послідовне vs паралельне виконання, `try/catch/finally`, retry з затримкою, `for await...of`.
5. **EventEmitter** — `on`, `once`, `off`, `emit`, подія `error`, наслідування класу та `events.once()`.

Весь код — у `index.js`.

## Запуск

```bash
cd full_stack/homework_56
npm start
```

Залежностей немає — потрібен лише Node.js 18+.
