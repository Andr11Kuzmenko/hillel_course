console.log('#37. Поглиблене вивчення TypeScript через практичні задачі')

/*
 * #1
 *
 * Задача: Розробити узагальнену функцію `getProperty`, яка безпечно повертає значення властивості об'єкта за ключем.
 *
 * Мета: Навчитися використовувати generics з обмеженнями (`extends`) та оператор `keyof`,
 * щоб компілятор не дозволяв звертатися до неіснуючих властивостей.
 *
 * Вимоги до реалізації:
 * 1. Функція приймає два параметри: `obj` типу `T` та `key` типу `K`, де `K extends keyof T`.
 * 2. Тип значення, що повертається, — `T[K]` (indexed access type).
 * 3. Додатково реалізувати функцію `pluck`, яка з масиву об'єктів повертає масив значень за ключем.
 * 4. Виклик з неіснуючим ключем має давати помилку компіляції.
 *
 */

function getProperty<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

function pluck<T extends object, K extends keyof T>(items: readonly T[], key: K): T[K][] {
  return items.map((item) => item[key])
}

const book = { title: 'TypeScript Deep Dive', pages: 350, available: true }
console.log(getProperty(book, 'title')) // 'TypeScript Deep Dive' (тип string)
console.log(getProperty(book, 'pages')) // 350 (тип number)
// getProperty(book, 'author') // Помилка компіляції: '"author"' не є ключем типу
console.log(
  pluck(
    [
      { id: 1, name: 'Anna' },
      { id: 2, name: 'Oleh' },
    ],
    'name'
  )
) // ['Anna', 'Oleh']

/*
 * #2
 *
 * Задача: Реалізувати функцію `updateEntity`, що оновлює сутність частковими даними, та функцію `toPreview`,
 * яка формує короткий опис сутності.
 *
 * Мета: Попрактикуватися з вбудованими utility types: `Partial`, `Pick`, `Omit`, `Readonly`, `Required`.
 *
 * Вимоги до реалізації:
 * 1. Оголосити інтерфейс `Product` з полями: id, title, price, description (необов'язкове), createdAt.
 * 2. `updateEntity` приймає `Readonly<Product>` та `Partial<Omit<Product, 'id' | 'createdAt'>>` і повертає новий об'єкт
 *    (не мутуючи вихідний). Поля `id` та `createdAt` змінювати заборонено на рівні типів.
 * 3. `toPreview` повертає `Pick<Product, 'id' | 'title'>`.
 * 4. `withDefaults` повертає `Required<Product>`, підставляючи порожній опис, якщо його немає.
 *
 */

interface Product {
  id: number
  title: string
  price: number
  description?: string
  createdAt: Date
}

type ProductUpdate = Partial<Omit<Product, 'id' | 'createdAt'>>
type ProductPreview = Pick<Product, 'id' | 'title'>

function updateEntity(product: Readonly<Product>, changes: ProductUpdate): Product {
  return { ...product, ...changes }
}

function toPreview({ id, title }: Product): ProductPreview {
  return { id, title }
}

function withDefaults(product: Product): Required<Product> {
  return { ...product, description: product.description ?? '' }
}

const laptop: Product = { id: 1, title: 'Laptop', price: 1200, createdAt: new Date('2026-01-01') }
const discounted = updateEntity(laptop, { price: 999 })
// updateEntity(laptop, { id: 5 }) // Помилка компіляції: 'id' відсутній у ProductUpdate
console.log(laptop.price, '->', discounted.price) // 1200 -> 999
console.log(toPreview(discounted)) // { id: 1, title: 'Laptop' }
console.log(withDefaults(laptop).description === '') // true

/*
 * #3
 *
 * Задача: Створити типізований словник перекладів і функцію `translate`.
 *
 * Мета: Використати `Record`, union-типи літералів та `keyof typeof` для побудови типів на основі значень.
 *
 * Вимоги до реалізації:
 * 1. Оголосити const-об'єкт `translations` з ключами-мовами ('uk', 'en') та словниками фраз (`as const`).
 * 2. Тип `Language` отримати як `keyof typeof translations`.
 * 3. Тип `PhraseKey` отримати з ключів словника англійської мови.
 * 4. Функція `translate(lang, key)` повертає переклад; неіснуючі мова або ключ — помилка компіляції.
 * 5. Функція `countByRole` повертає `Record<Role, number>` — кількість користувачів кожної ролі (включно з нулями).
 *
 */

const translations = {
  uk: { hello: 'Привіт', bye: 'До побачення' },
  en: { hello: 'Hello', bye: 'Goodbye' },
} as const

type Language = keyof typeof translations
type PhraseKey = keyof (typeof translations)['en']

function translate(lang: Language, key: PhraseKey): string {
  return translations[lang][key]
}

type Role = 'admin' | 'editor' | 'viewer'

function countByRole(users: ReadonlyArray<{ name: string; role: Role }>): Record<Role, number> {
  const result: Record<Role, number> = { admin: 0, editor: 0, viewer: 0 }
  for (const user of users) {
    result[user.role] += 1
  }
  return result
}

console.log(translate('uk', 'hello')) // 'Привіт'
console.log(translate('en', 'bye')) // 'Goodbye'
// translate('de', 'hello') // Помилка компіляції
console.log(
  countByRole([
    { name: 'A', role: 'admin' },
    { name: 'B', role: 'viewer' },
    { name: 'C', role: 'viewer' },
  ])
) // { admin: 1, editor: 0, viewer: 2 }

/*
 * #4
 *
 * Задача: Реалізувати функцію `calculateArea` для різних геометричних фігур.
 *
 * Мета: Опанувати discriminated unions (розмічені об'єднання), звуження типів та перевірку вичерпності через `never`.
 *
 * Вимоги до реалізації:
 * 1. Оголосити типи `Circle`, `Rectangle`, `Triangle`, кожен з полем-дискримінантом `kind`.
 * 2. Тип `Shape` — об'єднання цих типів.
 * 3. `calculateArea` використовує `switch (shape.kind)` і повертає площу, округлену до 2 знаків.
 * 4. У гілці `default` реалізувати функцію `assertNever(x: never): never`, щоб додавання нової фігури
 *    без обробки давало помилку компіляції.
 *
 */

type Circle = { kind: 'circle'; radius: number }
type Rectangle = { kind: 'rectangle'; width: number; height: number }
type Triangle = { kind: 'triangle'; base: number; height: number }
type Shape = Circle | Rectangle | Triangle

function assertNever(value: never): never {
  throw new Error(`Непідтримуване значення: ${JSON.stringify(value)}`)
}

function calculateArea(shape: Shape): number {
  let area: number
  switch (shape.kind) {
    case 'circle':
      area = Math.PI * shape.radius ** 2
      break
    case 'rectangle':
      area = shape.width * shape.height
      break
    case 'triangle':
      area = (shape.base * shape.height) / 2
      break
    default:
      return assertNever(shape)
  }
  return Math.round(area * 100) / 100
}

const shapes: Shape[] = [
  { kind: 'circle', radius: 2 },
  { kind: 'rectangle', width: 3, height: 4 },
  { kind: 'triangle', base: 6, height: 5 },
]
shapes.forEach((shape) => console.log(shape.kind, calculateArea(shape))) // 12.57, 12, 15

/*
 * #5
 *
 * Задача: Написати власні type guards для обробки відповіді API невідомого формату.
 *
 * Мета: Навчитися працювати з типом `unknown`, писати користувацькі предикати типів (`value is T`),
 * використовувати `typeof`, `in` та `instanceof` для звуження типів.
 *
 * Вимоги до реалізації:
 * 1. Оголосити інтерфейси `ApiSuccess<T>` ({ status: 'ok', data: T }) та `ApiError` ({ status: 'error', message: string }).
 * 2. Реалізувати `isApiError(value: unknown): value is ApiError`.
 * 3. Реалізувати `isUser(value: unknown): value is { id: number; name: string }`.
 * 4. Функція `handleResponse(value: unknown): string` повертає зрозуміле повідомлення для кожного випадку:
 *    успіх з користувачем, помилка API, екземпляр `Error`, невідомий формат.
 *
 */

interface ApiSuccess<T> {
  status: 'ok'
  data: T
}

interface ApiError {
  status: 'error'
  message: string
}

interface ApiUser {
  id: number
  name: string
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isApiError(value: unknown): value is ApiError {
  return isObject(value) && value.status === 'error' && typeof value.message === 'string'
}

function isUser(value: unknown): value is ApiUser {
  return isObject(value) && typeof value.id === 'number' && typeof value.name === 'string'
}

function isUserSuccess(value: unknown): value is ApiSuccess<ApiUser> {
  return isObject(value) && value.status === 'ok' && 'data' in value && isUser(value.data)
}

function handleResponse(value: unknown): string {
  if (value instanceof Error) return `Виняток: ${value.message}`
  if (isApiError(value)) return `Помилка API: ${value.message}`
  if (isUserSuccess(value)) return `Користувач #${value.data.id}: ${value.data.name}`
  return 'Невідомий формат відповіді'
}

console.log(handleResponse({ status: 'ok', data: { id: 7, name: 'Iryna' } }))
console.log(handleResponse({ status: 'error', message: 'Not found' }))
console.log(handleResponse(new Error('Network down')))
console.log(handleResponse('???'))

/*
 * #6
 *
 * Задача: Створити набір власних умовних (conditional) та відображених (mapped) типів.
 *
 * Мета: Зрозуміти, як працюють `extends ? :`, `infer`, модифікатори `readonly`/`?` та перейменування ключів через `as`.
 *
 * Вимоги до реалізації:
 * 1. `Nullable<T>` — робить кожну властивість `T` такою, що допускає `null`.
 * 2. `DeepReadonly<T>` — рекурсивно робить усі властивості лише для читання.
 * 3. `Getters<T>` — для кожного поля `name` створює метод `getName(): T['name']`.
 * 4. `UnwrapPromise<T>` — через `infer` дістає тип значення з `Promise<T>` (інакше повертає `T`).
 * 5. `ElementType<T>` — тип елемента масиву.
 * 6. `FunctionKeys<T>` — union ключів, значення яких є функціями.
 * 7. Продемонструвати `ReturnType` та `Parameters` на реальній функції та реалізувати `createGetters`.
 *
 */

type Nullable<T> = { [K in keyof T]: T[K] | null }
type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T
type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] }
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T
type ElementType<T> = T extends readonly (infer U)[] ? U : never
type FunctionKeys<T> = { [K in keyof T]: T[K] extends (...args: never[]) => unknown ? K : never }[keyof T]

function createGetters<T extends Record<string, unknown>>(obj: T): Getters<T> {
  const result: Record<string, () => unknown> = {}
  for (const key of Object.keys(obj)) {
    const name = `get${key.charAt(0).toUpperCase()}${key.slice(1)}`
    result[name] = () => obj[key]
  }
  return result as Getters<T>
}

async function fetchScore(userId: number, round: string): Promise<{ userId: number; score: number; round: string }> {
  return { userId, score: 42, round }
}

type FetchScoreResult = UnwrapPromise<ReturnType<typeof fetchScore>> // { userId; score; round }
type FetchScoreArgs = Parameters<typeof fetchScore> // [number, string]

const person = { name: 'Taras', age: 30 }
const personGetters = createGetters(person) // тип: { getName: () => string; getAge: () => number }
console.log(personGetters.getName(), personGetters.getAge())

const emptyPerson: Nullable<typeof person> = { name: null, age: null }
const config: DeepReadonly<{ db: { host: string; ports: number[] } }> = { db: { host: 'localhost', ports: [5432] } }
// config.db.host = 'x' // Помилка компіляції: властивість лише для читання
const tag: ElementType<string[]> = 'ts'
const methodName: FunctionKeys<{ id: number; save(): void; load(): void }> = 'save'
const args: FetchScoreArgs = [1, 'final']

fetchScore(...args).then((res: FetchScoreResult) => {
  console.log('#6 async ->', res, emptyPerson, config.db.ports, tag, methodName)
})

/*
 * #7
 *
 * Задача: Змоделювати систему співробітників за допомогою абстрактного класу та інтерфейсів.
 *
 * Мета: Попрактикуватися з `abstract class`, `implements`, модифікаторами доступу (`private`, `protected`, `readonly`),
 * геттерами та поліморфізмом.
 *
 * Вимоги до реалізації:
 * 1. Інтерфейс `Payable` з методом `calculateSalary(): number`.
 * 2. Інтерфейс `Describable` з методом `describe(): string`.
 * 3. Абстрактний клас `Employee` реалізує обидва інтерфейси, має `readonly id`, `protected baseSalary`,
 *    приватний статичний лічильник співробітників і абстрактний метод `calculateSalary`.
 * 4. Класи `Developer` (бонус за кожну технологію) та `Manager` (бонус за кожного підлеглого) наслідують `Employee`.
 * 5. Функція `totalPayroll(employees: Payable[])` рахує загальний фонд оплати праці.
 *
 */

interface Payable {
  calculateSalary(): number
}

interface Describable {
  describe(): string
}

abstract class Employee implements Payable, Describable {
  private static counter = 0
  readonly id: number

  constructor(
    public readonly name: string,
    protected baseSalary: number
  ) {
    Employee.counter += 1
    this.id = Employee.counter
  }

  static get total(): number {
    return Employee.counter
  }

  abstract calculateSalary(): number

  describe(): string {
    return `#${this.id} ${this.name} (${this.constructor.name}): ${this.calculateSalary()} USD`
  }
}

class Developer extends Employee {
  constructor(
    name: string,
    baseSalary: number,
    private readonly stack: string[]
  ) {
    super(name, baseSalary)
  }

  calculateSalary(): number {
    return this.baseSalary + this.stack.length * 200
  }
}

class Manager extends Employee {
  constructor(
    name: string,
    baseSalary: number,
    private readonly reports: Employee[]
  ) {
    super(name, baseSalary)
  }

  calculateSalary(): number {
    return this.baseSalary + this.reports.length * 300
  }
}

function totalPayroll(employees: readonly Payable[]): number {
  return employees.reduce((sum, e) => sum + e.calculateSalary(), 0)
}

const dev1 = new Developer('Olena', 3000, ['TS', 'React', 'Node'])
const dev2 = new Developer('Ivan', 2500, ['TS'])
const manager = new Manager('Petro', 4000, [dev1, dev2])
// new Employee('X', 1) // Помилка компіляції: не можна створити екземпляр абстрактного класу
const team: Employee[] = [dev1, dev2, manager]
team.forEach((e) => console.log(e.describe()))
console.log('Співробітників:', Employee.total, 'ФОП:', totalPayroll(team))

/*
 * #8
 *
 * Задача: Реалізувати функцію `format` з перевантаженнями (function overloads).
 *
 * Мета: Навчитися описувати кілька сигнатур однієї функції, щоб тип результату залежав від типу аргументу.
 *
 * Вимоги до реалізації:
 * 1. `format(value: number, fractionDigits?: number): string` — форматує число з фіксованою кількістю знаків.
 * 2. `format(value: Date): string` — форматує дату у вигляді `YYYY-MM-DD`.
 * 3. `format(value: string[]): string` — з'єднує масив рядків через кому.
 * 4. Одна реалізація з перевіркою типу аргументу; для невідомого типу — виняток.
 * 5. Додатково: функція `parse` з перевантаженнями, де `parse('number', ...)` повертає `number`,
 *    а `parse('boolean', ...)` — `boolean`.
 *
 */

function format(value: number, fractionDigits?: number): string
function format(value: Date): string
function format(value: string[]): string
function format(value: number | Date | string[], fractionDigits = 2): string {
  if (typeof value === 'number') return value.toFixed(fractionDigits)
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (Array.isArray(value)) return value.join(', ')
  throw new TypeError('Непідтримуваний тип значення')
}

function parse(type: 'number', raw: string): number
function parse(type: 'boolean', raw: string): boolean
function parse(type: 'number' | 'boolean', raw: string): number | boolean {
  if (type === 'number') {
    const n = Number(raw)
    if (Number.isNaN(n)) throw new TypeError(`"${raw}" не є числом`)
    return n
  }
  return raw.trim().toLowerCase() === 'true'
}

console.log(format(Math.PI)) // '3.14'
console.log(format(Math.PI, 4)) // '3.1416'
console.log(format(new Date('2026-09-30T12:00:00Z'))) // '2026-09-30'
console.log(format(['a', 'b', 'c'])) // 'a, b, c'
const parsedNumber: number = parse('number', '42')
const parsedFlag: boolean = parse('boolean', 'TRUE')
console.log(parsedNumber + 1, parsedFlag) // 43 true

/*
 * #9
 *
 * Задача: Реалізувати роботу з кортежами (tuples) та readonly-масивами.
 *
 * Мета: Зрозуміти різницю між масивом і кортежем, іменовані елементи кортежу, необов'язкові та rest-елементи,
 * а також `as const` і `readonly`.
 *
 * Вимоги до реалізації:
 * 1. Тип `Point3D = readonly [x: number, y: number, z: number]`.
 * 2. Функція `distance(a: Point3D, b: Point3D): number` — відстань між точками.
 * 3. Функція `useState<T>(initial: T)` повертає кортеж `[get: () => T, set: (v: T) => void]`.
 * 4. Функція `minMax(values: readonly number[])` повертає кортеж `[min, max]` або `undefined` для порожнього масиву.
 * 5. Тип `LogEntry = [level: 'info' | 'error', message: string, ...tags: string[]]` та функція `printLog`.
 *
 */

type Point3D = readonly [x: number, y: number, z: number]

function distance(a: Point3D, b: Point3D): number {
  const [x1, y1, z1] = a
  const [x2, y2, z2] = b
  return Math.hypot(x2 - x1, y2 - y1, z2 - z1)
}

function useState<T>(initial: T): [get: () => T, set: (value: T) => void] {
  let state = initial
  return [() => state, (value) => (state = value)]
}

function minMax(values: readonly number[]): readonly [min: number, max: number] | undefined {
  if (values.length === 0) return undefined
  return [Math.min(...values), Math.max(...values)] as const
}

type LogEntry = [level: 'info' | 'error', message: string, ...tags: string[]]

function printLog(...[level, message, ...tags]: LogEntry): string {
  return `[${level.toUpperCase()}] ${message}${tags.length ? ` #${tags.join(' #')}` : ''}`
}

const origin: Point3D = [0, 0, 0]
// origin[0] = 1 // Помилка компіляції: кортеж лише для читання
console.log(distance(origin, [1, 2, 2])) // 3
const [getCount, setCount] = useState(0)
setCount(getCount() + 5)
console.log(getCount()) // 5
console.log(minMax([4, -2, 9, 0]), minMax([])) // [-2, 9] undefined
console.log(printLog('error', 'DB connection lost', 'db', 'critical'))

/*
 * #10
 *
 * Задача: Реалізувати узагальнений типізований репозиторій та систему подій з enum-ами.
 *
 * Мета: Об'єднати вивчене: generics з обмеженнями, інтерфейси, enum (числовий і рядковий), utility types
 * та типізовані колбеки.
 *
 * Вимоги до реалізації:
 * 1. Рядковий enum `EntityEvent` ('created', 'updated', 'deleted') та числовий enum `Priority` (Low, Medium, High).
 * 2. Інтерфейс `Entity` з полем `id: number`.
 * 3. Клас `Repository<T extends Entity>` з методами: `add(item: Omit<T, 'id'>): T`, `getById(id): T | undefined`,
 *    `update(id, changes: Partial<Omit<T, 'id'>>): T`, `remove(id): boolean`, `findAll(predicate?)`.
 * 4. Метод `on(event, listener)` для підписки на події; слухач отримує подію та сутність.
 * 5. Якщо сутність для оновлення не знайдена — кинути помилку.
 *
 */

enum EntityEvent {
  Created = 'created',
  Updated = 'updated',
  Deleted = 'deleted',
}

enum Priority {
  Low,
  Medium,
  High,
}

interface Entity {
  id: number
}

interface Task extends Entity {
  title: string
  priority: Priority
  done: boolean
}

type Listener<T> = (event: EntityEvent, item: Readonly<T>) => void

class Repository<T extends Entity> {
  private items = new Map<number, T>()
  private nextId = 1
  private listeners: Listener<T>[] = []

  on(listener: Listener<T>): void {
    this.listeners.push(listener)
  }

  private emit(event: EntityEvent, item: T): void {
    this.listeners.forEach((listener) => listener(event, item))
  }

  add(data: Omit<T, 'id'>): T {
    const item = { ...data, id: this.nextId++ } as T
    this.items.set(item.id, item)
    this.emit(EntityEvent.Created, item)
    return item
  }

  getById(id: number): T | undefined {
    return this.items.get(id)
  }

  update(id: number, changes: Partial<Omit<T, 'id'>>): T {
    const current = this.items.get(id)
    if (!current) throw new Error(`Сутність з id=${id} не знайдена`)
    const updated: T = { ...current, ...changes }
    this.items.set(id, updated)
    this.emit(EntityEvent.Updated, updated)
    return updated
  }

  remove(id: number): boolean {
    const item = this.items.get(id)
    if (!item) return false
    this.items.delete(id)
    this.emit(EntityEvent.Deleted, item)
    return true
  }

  findAll(predicate: (item: T) => boolean = () => true): T[] {
    return [...this.items.values()].filter(predicate)
  }
}

const tasks = new Repository<Task>()
tasks.on((event, task) => console.log(`[event:${event}] ${task.title} (priority: ${Priority[task.priority]})`))

const t1 = tasks.add({ title: 'Вивчити generics', priority: Priority.High, done: false })
tasks.add({ title: 'Повторити enums', priority: Priority.Low, done: false })
tasks.update(t1.id, { done: true })
console.log(tasks.findAll((t) => !t.done).map((t) => t.title)) // ['Повторити enums']
console.log(tasks.remove(2), tasks.remove(99)) // true false
try {
  tasks.update(99, { done: true })
} catch (error) {
  console.log(error instanceof Error ? error.message : error) // 'Сутність з id=99 не знайдена'
}

export {
  getProperty,
  pluck,
  updateEntity,
  toPreview,
  withDefaults,
  translate,
  countByRole,
  calculateArea,
  handleResponse,
  isApiError,
  isUser,
  createGetters,
  Employee,
  Developer,
  Manager,
  totalPayroll,
  format,
  parse,
  distance,
  useState,
  minMax,
  printLog,
  Repository,
  EntityEvent,
  Priority,
}
export type { Product, Shape, Nullable, DeepReadonly, Getters, UnwrapPromise, ElementType, FunctionKeys, Point3D, LogEntry, Task }
