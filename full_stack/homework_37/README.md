# HW 37.1. Поглиблене вивчення TypeScript через практичні задачі

Файл `main.ts` містить 10 задач (опис кожної — у коментарі над реалізацією) з демонстрацією через `console.log`:

1. Generics з обмеженнями, `keyof`, indexed access types (`getProperty`, `pluck`).
2. Utility types: `Partial`, `Pick`, `Omit`, `Readonly`, `Required`.
3. `Record`, union-літерали, `keyof typeof`, `as const` (словник перекладів).
4. Discriminated unions та перевірка вичерпності через `never` (площі фігур).
5. Type guards для `unknown` (`value is T`, `typeof`, `in`, `instanceof`).
6. Умовні та відображені типи: `Nullable`, `DeepReadonly`, `Getters`, `UnwrapPromise` (`infer`), `ReturnType`, `Parameters`.
7. Абстрактні класи, інтерфейси, модифікатори доступу, поліморфізм.
8. Перевантаження функцій (`format`, `parse`).
9. Кортежі (іменовані, rest-елементи) та `readonly`.
10. Узагальнений `Repository<T>` з enum-подіями.

Компіляція виконується в режимі `strict`.

## Запуск

```bash
cd full_stack/homework_37
npm install
npm run typecheck   # перевірка типів (tsc --noEmit)
npm start           # компіляція в dist/ і запуск node dist/main.js
```
