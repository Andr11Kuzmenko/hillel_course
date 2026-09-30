import { mkdir, writeFile, readFile, stat, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { compressFile, decompressFile, compressString, decompressToString } from './gzip.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const WORK_DIR = path.join(__dirname, 'tmp-gzip')

const kb = (bytes) => `${(bytes / 1024).toFixed(2)} KB`
const ratio = (original, compressed) => `${((1 - compressed / original) * 100).toFixed(1)}%`

async function main() {
  console.log('=== HW 59: Асинхронне стиснення та розпакування Gzip ===\n')

  try {
    await mkdir(WORK_DIR, { recursive: true })

    // 1. Створюємо тестовий файл (текст з повтореннями добре стискається)
    const source = path.join(WORK_DIR, 'sample.txt')
    const lines = Array.from(
      { length: 5000 },
      (_, i) => `Рядок ${i + 1}: Node.js zlib + streams — асинхронне стиснення даних. ${'lorem ipsum '.repeat(3)}`
    )
    await writeFile(source, lines.join('\n'), 'utf8')

    // 2. Стиснення файлу потоком
    let start = performance.now()
    const gzPath = await compressFile(source)
    console.log(`[1] Стиснуто: ${path.basename(source)} -> ${path.basename(gzPath)} за ${(performance.now() - start).toFixed(1)} мс`)

    // 3. Розпакування в новий файл
    start = performance.now()
    const restored = await decompressFile(gzPath, path.join(WORK_DIR, 'sample.restored.txt'))
    console.log(`[2] Розпаковано: ${path.basename(gzPath)} -> ${path.basename(restored)} за ${(performance.now() - start).toFixed(1)} мс`)

    // 4. Порівняння розмірів і вмісту
    const [original, compressed, unpacked] = await Promise.all([source, gzPath, restored].map((f) => stat(f)))
    console.table({
      'Оригінал': { файл: path.basename(source), розмір: kb(original.size) },
      'Gzip': { файл: path.basename(gzPath), розмір: kb(compressed.size) },
      'Розпакований': { файл: path.basename(restored), розмір: kb(unpacked.size) },
    })
    console.log('Ступінь стиснення:', ratio(original.size, compressed.size))
    const [a, b] = await Promise.all([readFile(source), readFile(restored)])
    console.log('Вміст збігається з оригіналом:', a.equals(b))

    // 5. Стиснення рядків у пам'яті
    const text = 'Привіт, gzip! '.repeat(200)
    const packed = await compressString(text)
    const unpackedText = await decompressToString(packed)
    console.log(`\n[3] У пам'яті: ${Buffer.byteLength(text)} байт -> ${packed.length} байт (${ratio(Buffer.byteLength(text), packed.length)}),`, 'round-trip OK:', unpackedText === text)
    console.log('    Перші байти gzip (сигнатура 1f 8b):', packed.subarray(0, 4))

    // 6. Обробка помилок
    console.log('\n[4] Обробка помилок:')
    const notGzip = path.join(WORK_DIR, 'not-gzip.gz')
    await writeFile(notGzip, 'це не gzip')
    const failing = [
      ['Неіснуючий файл', () => compressFile(path.join(WORK_DIR, 'missing.txt'))],
      ['Файл не у форматі gzip', () => decompressFile(notGzip, path.join(WORK_DIR, 'out.txt'))],
      ['Некоректний Buffer', () => decompressToString(Buffer.from('garbage'))],
      ['Не рядок', () => compressString(42)],
    ]
    for (const [label, fn] of failing) {
      try {
        await fn()
        console.log(`  ${label}: помилки немає (неочікувано)`)
      } catch (error) {
        console.log(`  ${label}: ${error.message}`)
      }
    }
  } catch (error) {
    console.error('Неочікувана помилка:', error)
    process.exitCode = 1
  } finally {
    await rm(WORK_DIR, { recursive: true, force: true })
    console.log('\nТимчасові файли видалено.')
  }
}

main()
