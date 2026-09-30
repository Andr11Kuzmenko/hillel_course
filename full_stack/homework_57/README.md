# HW 57. Розробка HTTP сервера з використанням чистого Node.js

## Завдання

Створити HTTP сервер лише на вбудованому модулі `http` (без Express та інших бібліотек):

- сервер слухає порт `process.env.PORT || 3000`;
- обробляє GET- та POST-запити на визначені маршрути;
- на GET-запити повертає статично згенеровані HTML-сторінки;
- обробляє дані з тіла POST-запиту (JSON та `application/x-www-form-urlencoded`);
- для невідомих маршрутів повертає сторінку 404, для недозволеного методу — 405 (із заголовком `Allow`).

## Маршрути

| Метод | Шлях        | Відповідь                                                       |
|-------|-------------|-----------------------------------------------------------------|
| GET   | `/`         | Головна сторінка з формою                                        |
| GET   | `/about`    | Сторінка «Про нас»                                              |
| GET   | `/contact`  | Сторінка «Контакти»                                             |
| POST  | `/submit`   | HTML-сторінка з отриманими даними форми (form або JSON)          |
| GET   | `/api/data` | JSON-підказка + query-параметри                                  |
| POST  | `/api/data` | JSON `201` з отриманими даними; некоректний JSON — `400`         |

Додатково: екранування HTML (захист від XSS), ліміт розміру тіла (413), непідтримуваний Content-Type (415),
обробка помилок (500), коректне завершення за `SIGINT`/`SIGTERM`.

## Запуск

```bash
cd full_stack/homework_57
npm start               # http://localhost:3000
PORT=8080 npm start     # інший порт
```

## Перевірка

```bash
curl http://localhost:3000/about
curl -X POST -d "name=Anna&email=anna@example.com&message=Hi" http://localhost:3000/submit
curl -X POST -H "Content-Type: application/json" -d '{"a":1}' http://localhost:3000/api/data
curl -i http://localhost:3000/unknown          # 404
curl -i -X DELETE http://localhost:3000/about  # 405
```
