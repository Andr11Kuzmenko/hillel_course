import http from 'node:http'
import { homePage, aboutPage, contactPage, submitPage, errorPage } from './pages.js'

const PORT = Number(process.env.PORT) || 3000
const MAX_BODY_SIZE = 1024 * 1024 // 1 МБ

// ---------- Допоміжні функції відповіді ----------

function sendHtml(res, status, html, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', ...headers })
  res.end(html)
}

function sendJson(res, status, data, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers })
  res.end(JSON.stringify(data))
}

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

// ---------- Читання та парсинг тіла запиту ----------

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY_SIZE) {
        reject(new HttpError(413, 'Тіло запиту занадто велике'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

async function parseBody(req) {
  const raw = await readBody(req)
  const contentType = (req.headers['content-type'] || '').split(';')[0].trim()

  if (contentType === 'application/json') {
    if (!raw) return {}
    try {
      return JSON.parse(raw)
    } catch {
      throw new HttpError(400, 'Некоректний JSON')
    }
  }
  if (contentType === 'application/x-www-form-urlencoded') {
    return Object.fromEntries(new URLSearchParams(raw))
  }
  if (contentType === 'text/plain' || contentType === '') {
    return { text: raw }
  }
  throw new HttpError(415, `Непідтримуваний Content-Type: ${contentType}`)
}

// ---------- Маршрути ----------
// Структура: { [pathname]: { [METHOD]: handler } }

const routes = {
  '/': {
    GET: (req, res) => sendHtml(res, 200, homePage()),
  },
  '/about': {
    GET: (req, res) => sendHtml(res, 200, aboutPage()),
  },
  '/contact': {
    GET: (req, res) => sendHtml(res, 200, contactPage()),
  },
  '/submit': {
    POST: async (req, res) => {
      const data = await parseBody(req)
      console.log('  /submit отримано:', data)
      sendHtml(res, 200, submitPage(data))
    },
  },
  '/api/data': {
    GET: (req, res, url) =>
      sendJson(res, 200, { message: 'Надішліть POST-запит з JSON', query: Object.fromEntries(url.searchParams) }),
    POST: async (req, res) => {
      const data = await parseBody(req)
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        throw new HttpError(400, 'Очікується JSON-об\'єкт')
      }
      sendJson(res, 201, { success: true, received: data, receivedAt: new Date().toISOString() })
    },
  },
}

// ---------- Сервер ----------

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  const pathname = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname
  const isApi = pathname.startsWith('/api/')
  console.log(`${new Date().toISOString()} ${req.method} ${url.pathname}`)

  try {
    const route = routes[pathname]
    if (!route) throw new HttpError(404, `Сторінку ${pathname} не знайдено`)

    const handler = route[req.method]
    if (!handler) {
      res.setHeader('Allow', Object.keys(route).join(', '))
      throw new HttpError(405, `Метод ${req.method} не дозволений для ${pathname}`)
    }

    await handler(req, res, url)
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500
    const message = error instanceof HttpError ? error.message : 'Внутрішня помилка сервера'
    if (status === 500) console.error(error)
    if (res.headersSent) return res.end()

    const titles = { 400: 'Bad Request', 404: 'Not Found', 405: 'Method Not Allowed', 413: 'Payload Too Large', 415: 'Unsupported Media Type', 500: 'Internal Server Error' }
    if (isApi) sendJson(res, status, { success: false, error: message })
    else sendHtml(res, status, errorPage(status, titles[status] || 'Error', message))
  }
})

server.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`)
})

// Коректне завершення роботи
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    console.log(`\n${signal}: зупиняємо сервер...`)
    server.close(() => process.exit(0))
  })
}
