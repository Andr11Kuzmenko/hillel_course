// Статично згенеровані HTML-сторінки

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function layout(title, content) {
  return `<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; color: #222; }
    nav a { margin-right: 1rem; }
    form { display: grid; gap: .75rem; max-width: 360px; }
    input, textarea, button { font: inherit; padding: .5rem; }
    table { border-collapse: collapse; }
    td, th { border: 1px solid #ccc; padding: .4rem .8rem; text-align: left; }
  </style>
</head>
<body>
  <nav><a href="/">Головна</a><a href="/about">Про нас</a><a href="/contact">Контакти</a></nav>
  <main>
${content}
  </main>
</body>
</html>`
}

export const homePage = () =>
  layout(
    'Головна',
    `    <h1>HTTP сервер на чистому Node.js</h1>
    <p>Заповніть форму — дані буде надіслано POST-запитом на <code>/submit</code>.</p>
    <form method="POST" action="/submit">
      <label>Ім'я <input name="name" required></label>
      <label>Email <input name="email" type="email" required></label>
      <label>Повідомлення <textarea name="message" rows="4"></textarea></label>
      <button type="submit">Надіслати</button>
    </form>`
  )

export const aboutPage = () =>
  layout(
    'Про нас',
    `    <h1>Про нас</h1>
    <p>Цей сервер написаний без фреймворків — лише вбудований модуль <code>http</code>.</p>`
  )

export const contactPage = () =>
  layout(
    'Контакти',
    `    <h1>Контакти</h1>
    <p>Email: hello@example.com</p>
    <p>Телефон: +380 00 000 00 00</p>`
  )

export const submitPage = (data) => {
  const rows = Object.entries(data)
    .map(([key, value]) => `      <tr><th>${escapeHtml(key)}</th><td>${escapeHtml(typeof value === 'object' ? JSON.stringify(value) : value)}</td></tr>`)
    .join('\n')
  return layout(
    'Дані отримано',
    `    <h1>Дякуємо! Дані отримано</h1>
    <table>
${rows || '      <tr><td>Порожня форма</td></tr>'}
    </table>
    <p><a href="/">Повернутися на головну</a></p>`
  )
}

export const errorPage = (status, title, text) =>
  layout(`${status} — ${title}`, `    <h1>${status} — ${escapeHtml(title)}</h1>\n    <p>${escapeHtml(text)}</p>`)
