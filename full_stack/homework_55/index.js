import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as fm from './fileManager.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const WORK_DIR = path.join(__dirname, 'tmp-sandbox')

const step = (n, text) => console.log(`\n[${n}] ${text}`)

function printListing(items) {
  console.table(items.map(({ name, type, size }) => ({ name, type, 'size (bytes)': size })))
}

async function main() {
  console.log('=== HW 55: Асинхронна робота з файлами (fs/promises) ===')
  console.log('Робоча директорія:', WORK_DIR)

  try {
    step(1, 'Створюємо директорію (разом з вкладеною)')
    await fm.createDir(path.join(WORK_DIR, 'backup'))
    console.log('Директорія існує:', await fm.exists(WORK_DIR))

    const notes = path.join(WORK_DIR, 'notes.txt')

    step(2, 'Створюємо файл notes.txt')
    await fm.createFile(notes, 'Рядок 1: створено файл\n')
    console.log(await fm.readFromFile(notes))

    step(3, 'Дописуємо дані у файл (appendFile)')
    await fm.appendToFile(notes, 'Рядок 2: дописано\n')
    await fm.appendToFile(notes, `Рядок 3: ${new Date().toISOString()}\n`)
    console.log(await fm.readFromFile(notes))

    step(4, 'Паралельно створюємо кілька файлів (Promise.all)')
    await Promise.all(
      ['a.json', 'b.json', 'c.json'].map((name, i) =>
        fm.writeToFile(path.join(WORK_DIR, name), JSON.stringify({ id: i + 1, name }, null, 2))
      )
    )
    const parsed = JSON.parse(await fm.readFromFile(path.join(WORK_DIR, 'b.json')))
    console.log('Вміст b.json як об\'єкт:', parsed)

    step(5, 'Копіюємо notes.txt у backup/')
    const copyPath = await fm.copy(notes, path.join(WORK_DIR, 'backup', 'notes.copy.txt'))
    console.log('Копія створена:', path.relative(__dirname, copyPath))

    step(6, 'Перейменовуємо a.json -> first.json')
    await fm.renameFile(path.join(WORK_DIR, 'a.json'), path.join(WORK_DIR, 'first.json'))

    step(7, 'Інформація про файл (stat)')
    console.log(await fm.getInfo(notes))

    step(8, 'Вміст директорії (readdir + stat)')
    printListing(await fm.listDir(WORK_DIR))

    step(9, 'Видаляємо c.json')
    await fm.deleteFile(path.join(WORK_DIR, 'c.json'))
    printListing(await fm.listDir(WORK_DIR))

    step(10, 'Обробка помилок')
    const failing = [
      () => fm.readFromFile(path.join(WORK_DIR, 'missing.txt')), // ENOENT
      () => fm.createFile(notes, 'дублікат'), // EEXIST
      () => fm.deleteFile(path.join(WORK_DIR, 'nothing.txt')), // ENOENT
      () => fm.copy(notes, copyPath), // EEXIST (COPYFILE_EXCL)
    ]
    for (const fn of failing) {
      try {
        await fn()
      } catch (error) {
        console.log(`  Перехоплено [${error.code}]: ${error.message}`)
      }
    }
  } catch (error) {
    console.error('Неочікувана помилка сценарію:', error.message)
    process.exitCode = 1
  } finally {
    step(11, 'Прибирання: видаляємо робочу директорію')
    await fm.removeDir(WORK_DIR)
    console.log('Директорія існує:', await fm.exists(WORK_DIR))
  }
}

main()
