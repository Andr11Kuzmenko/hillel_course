const MESSAGES = [
  'Привіт! Цей текст прийшов з "сервера" через Promise.',
  'Хук use() дозволяє читати значення Promise прямо під час рендеру.',
  'Поки Promise не виконано, React показує fallback з <Suspense>.',
  'Якщо Promise відхилено, помилку перехоплює найближчий ErrorBoundary.',
]

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Імітує асинхронний запит до сервера: повертає Promise, який
 * виконується через `delay` мс або відхиляється, якщо shouldFail = true.
 */
export async function fetchMessage({ delay = 1500, shouldFail = false } = {}) {
  await wait(delay)

  if (shouldFail) {
    throw new Error('Не вдалося завантажити повідомлення (імітація помилки сервера)')
  }

  const text = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
  return {
    id: Date.now(),
    text,
    receivedAt: new Date().toLocaleTimeString('uk-UA'),
  }
}

/** Імітує запит списку користувачів. */
export async function fetchUsers(delay = 2000) {
  await wait(delay)
  return [
    { id: 1, name: 'Олена Коваль', role: 'Frontend' },
    { id: 2, name: 'Андрій Шевченко', role: 'Backend' },
    { id: 3, name: 'Марія Бондар', role: 'QA' },
  ]
}
