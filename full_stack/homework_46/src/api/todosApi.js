const BASE_URL = 'https://jsonplaceholder.typicode.com/todos'

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    ...options,
  })
  if (!response.ok) {
    throw new Error(`Помилка сервера: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

export const todosApi = {
  getAll: (limit = 10) => request(`${BASE_URL}?_limit=${limit}`),
  create: (todo) => request(BASE_URL, { method: 'POST', body: JSON.stringify(todo) }),
  update: (id, changes) =>
    request(`${BASE_URL}/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }),
  remove: (id) => request(`${BASE_URL}/${id}`, { method: 'DELETE' }),
}
