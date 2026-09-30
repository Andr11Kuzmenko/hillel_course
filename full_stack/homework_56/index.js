import { readFile } from 'node:fs'
import { promisify } from 'node:util'
import { EventEmitter, once } from 'node:events'
import { setTimeout as sleep } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

const title = (text) => console.log(`\n========== ${text} ==========`)
const thisFile = fileURLToPath(import.meta.url)

/*
 * #1 Порядок виконання в Event Loop
 *
 * 1. Синхронний код виконується першим (call stack).
 * 2. Після кожної операції спочатку обробляється черга process.nextTick,
 *    потім — мікрозадачі промісів (then/catch/finally, queueMicrotask).
 * 3. Далі фази event loop: timers (setTimeout/setInterval) -> poll (I/O колбеки) -> check (setImmediate).
 * 4. Всередині I/O колбека setImmediate ЗАВЖДИ спрацьовує раніше за setTimeout(0),
 *    бо після фази poll одразу йде фаза check.
 *
 * Нюанс: у ES-модулі код верхнього рівня сам виконується як мікрозадача, тому там проміси
 * встигають раніше за nextTick, а порядок setTimeout(0)/setImmediate не гарантований.
 * Щоб показати "класичний" детермінований порядок, запускаємо демо всередині колбека таймера:
 * після фази timers йде check, тож setImmediate гарантовано випереджає новий setTimeout(0).
 */
function eventLoopDemo() {
  title('#1 Event Loop: порядок виконання')

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('1. sync: початок')

      setImmediate(() => console.log('6. setImmediate — фаза check поточної ітерації'))
      setTimeout(() => {
        console.log('7. setTimeout(0) — фаза timers наступної ітерації')

        // I/O-операція: її колбек виконається у фазі poll
        readFile(thisFile, () => {
          console.log('8. readFile callback — фаза poll (I/O)')
          setTimeout(() => {
            console.log('10. setTimeout всередині I/O')
            resolve()
          }, 0)
          setImmediate(() => console.log('9. setImmediate всередині I/O — завжди раніше за setTimeout'))
        })
      }, 0)

      Promise.resolve().then(() => console.log('4. Promise.then — мікрозадача'))
      queueMicrotask(() => console.log('5. queueMicrotask — мікрозадача'))
      process.nextTick(() => console.log('3. process.nextTick — має пріоритет над промісами'))

      console.log('2. sync: кінець')
    }, 0)
  })
}

/*
 * #2 Від колбеків до промісів
 *
 * Класичний Node.js-стиль: колбек (error, result) як останній аргумент ("error-first callback").
 * util.promisify перетворює таку функцію на функцію, що повертає Promise.
 * Також показано ручну обгортку через new Promise.
 */
function divideCallback(a, b, callback) {
  setTimeout(() => {
    if (b === 0) return callback(new Error('Ділення на нуль'))
    callback(null, a / b)
  }, 10)
}

function divideManual(a, b) {
  return new Promise((resolve, reject) => {
    divideCallback(a, b, (err, result) => (err ? reject(err) : resolve(result)))
  })
}

const divideAsync = promisify(divideCallback)
const readFileAsync = promisify(readFile)

async function callbacksToPromisesDemo() {
  title('#2 Callbacks -> Promises (util.promisify)')

  await new Promise((resolve) => {
    divideCallback(10, 2, (err, result) => {
      console.log('callback-стиль: 10 / 2 =', result)
      divideCallback(1, 0, (err2) => {
        console.log('callback-стиль, помилка:', err2.message)
        resolve()
      })
    })
  })

  console.log('ручна обгортка new Promise: 9 / 3 =', await divideManual(9, 3))
  console.log('promisify: 7 / 2 =', await divideAsync(7, 2))
  try {
    await divideAsync(5, 0)
  } catch (error) {
    console.log('promisify, помилка перехоплена:', error.message)
  }
  const source = await readFileAsync(thisFile, 'utf8')
  console.log('promisify(fs.readFile): прочитано рядків у цьому файлі —', source.split('\n').length)
}

/*
 * #3 Комбінатори промісів
 *
 * Promise.all        — чекає всі; відхиляється при першій помилці.
 * Promise.allSettled — чекає всі; повертає статус кожного (fulfilled/rejected).
 * Promise.race       — результат першого завершеного (успіх чи помилка).
 * Promise.any        — перший УСПІШНИЙ; AggregateError, якщо відхилені всі.
 */
function task(name, ms, shouldFail = false) {
  return new Promise((resolve, reject) =>
    setTimeout(() => (shouldFail ? reject(new Error(`${name} впав`)) : resolve(`${name} (${ms}мс)`)), ms)
  )
}

async function combinatorsDemo() {
  title('#3 Promise.all / allSettled / race / any')

  const start = Date.now()
  const all = await Promise.all([task('A', 50), task('B', 30), task('C', 40)])
  console.log('all:', all, `— паралельно за ~${Date.now() - start}мс, а не 120мс`)

  try {
    await Promise.all([task('A', 20), task('B', 10, true)])
  } catch (error) {
    console.log('all з помилкою:', error.message)
  }

  const settled = await Promise.allSettled([task('A', 10), task('B', 20, true)])
  console.log(
    'allSettled:',
    settled.map((r) => (r.status === 'fulfilled' ? `✔ ${r.value}` : `✘ ${r.reason.message}`))
  )

  console.log('race:', await Promise.race([task('Повільний', 60), task('Швидкий', 15)]))

  // Типове застосування race — таймаут для операції
  const withTimeout = (promise, ms) =>
    Promise.race([promise, sleep(ms).then(() => Promise.reject(new Error(`Таймаут ${ms}мс`)))])
  try {
    await withTimeout(task('Довга операція', 200), 50)
  } catch (error) {
    console.log('race як таймаут:', error.message)
  }

  console.log('any:', await Promise.any([task('X', 10, true), task('Y', 30), task('Z', 20)]))
  try {
    await Promise.any([task('X', 10, true), task('Y', 20, true)])
  } catch (error) {
    console.log(`any: ${error.name} —`, error.errors.map((e) => e.message))
  }
}

/*
 * #4 async/await та обробка помилок
 *
 * - послідовне виконання (await у циклі) vs паралельне (Promise.all);
 * - try/catch/finally для асинхронного коду;
 * - повторні спроби (retry) з затримкою;
 * - for await...of для асинхронних ітераторів.
 */
async function fetchUser(id) {
  await sleep(20)
  if (id < 0) throw new RangeError(`Некоректний id: ${id}`)
  return { id, name: `User${id}` }
}

async function retry(fn, attempts = 3, delay = 20) {
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn(i)
    } catch (error) {
      console.log(`  спроба ${i} не вдалася: ${error.message}`)
      if (i === attempts) throw error
      await sleep(delay)
    }
  }
}

async function* ticker(count, ms) {
  for (let i = 1; i <= count; i++) {
    await sleep(ms)
    yield i
  }
}

async function asyncAwaitDemo() {
  title('#4 async/await + обробка помилок')

  let start = Date.now()
  const sequential = []
  for (const id of [1, 2, 3]) sequential.push(await fetchUser(id))
  console.log(`послідовно: ${sequential.length} користувачі за ~${Date.now() - start}мс`)

  start = Date.now()
  const parallel = await Promise.all([1, 2, 3].map(fetchUser))
  console.log(`паралельно: ${parallel.map((u) => u.name).join(', ')} за ~${Date.now() - start}мс`)

  try {
    await fetchUser(-1)
  } catch (error) {
    console.log(`try/catch: ${error.name} — ${error.message}`)
  } finally {
    console.log('finally: виконується завжди')
  }

  const result = await retry(async (attempt) => {
    if (attempt < 3) throw new Error('сервіс тимчасово недоступний')
    return 'успіх з третьої спроби'
  })
  console.log('retry:', result)

  const ticks = []
  for await (const tick of ticker(3, 10)) ticks.push(tick)
  console.log('for await...of:', ticks)
}

/*
 * #5 EventEmitter
 *
 * Більшість асинхронних API Node.js (стріми, http-сервер, процес) побудовані на EventEmitter.
 * Демонструємо: on, once, emit, off, подію 'error', аргументи подій,
 * наслідування від EventEmitter та events.once() для очікування події через await.
 */
class OrderService extends EventEmitter {
  #nextId = 1

  async createOrder(product, qty) {
    if (qty <= 0) {
      this.emit('error', new Error(`Кількість має бути > 0 (отримано ${qty})`))
      return null
    }
    const order = { id: this.#nextId++, product, qty, status: 'created' }
    this.emit('created', order)
    await sleep(20) // імітація обробки
    order.status = 'shipped'
    this.emit('shipped', order)
    return order
  }
}

async function eventEmitterDemo() {
  title('#5 EventEmitter')

  const service = new OrderService()
  const onCreated = (order) => console.log(`[created] #${order.id} ${order.product} x${order.qty}`)

  service.on('created', onCreated)
  service.on('shipped', (order) => console.log(`[shipped] #${order.id} статус: ${order.status}`))
  service.once('created', () => console.log('[once] перше замовлення! (цей обробник спрацює лише раз)'))
  service.on('error', (error) => console.log('[error]', error.message)) // без цього обробника 'error' завершив би процес

  await service.createOrder('Ноутбук', 1)
  await service.createOrder('Мишка', 2)
  await service.createOrder('Клавіатура', 0)

  service.off('created', onCreated)
  console.log('Обробників "created" після off:', service.listenerCount('created'))

  // events.once повертає проміс, що виконається при наступній події
  setTimeout(() => service.emit('ready', 'сервіс готовий'), 10)
  const [message] = await once(service, 'ready')
  console.log('await once(emitter, "ready"):', message)
}

async function main() {
  console.log('=== HW 56: Асинхронність в дії (Node.js) ===')
  await eventLoopDemo()
  await callbacksToPromisesDemo()
  await combinatorsDemo()
  await asyncAwaitDemo()
  await eventEmitterDemo()
  console.log('\nГотово.')
}

main().catch((error) => {
  console.error('Неочікувана помилка:', error)
  process.exitCode = 1
})
