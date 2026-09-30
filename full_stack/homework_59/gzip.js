import { createReadStream, createWriteStream } from 'node:fs'
import { access, stat, unlink } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
import { promisify } from 'node:util'
import zlib from 'node:zlib'

const gzipAsync = promisify(zlib.gzip)
const gunzipAsync = promisify(zlib.gunzip)

async function assertReadableFile(filePath) {
  if (typeof filePath !== 'string' || !filePath) throw new TypeError('Шлях до файлу має бути непорожнім рядком')
  try {
    await access(filePath)
  } catch {
    throw new Error(`Вхідний файл не знайдено: ${filePath}`)
  }
  if (!(await stat(filePath)).isFile()) throw new Error(`Шлях не є файлом: ${filePath}`)
}

// Якщо pipeline впав посередині — прибираємо частково записаний вихідний файл
async function removeQuietly(filePath) {
  await unlink(filePath).catch(() => {})
}

/**
 * Потокове стиснення файлу: readStream -> gzip -> writeStream.
 * Файл не завантажується в пам'ять повністю, тож підходить і для великих файлів.
 */
export async function compressFile(inputPath, outputPath = `${inputPath}.gz`, { level = zlib.constants.Z_BEST_COMPRESSION } = {}) {
  await assertReadableFile(inputPath)
  try {
    await pipeline(createReadStream(inputPath), zlib.createGzip({ level }), createWriteStream(outputPath))
    return outputPath
  } catch (error) {
    await removeQuietly(outputPath)
    throw new Error(`Помилка стиснення "${inputPath}": ${error.message}`, { cause: error })
  }
}

/** Потокове розпакування: readStream -> gunzip -> writeStream. */
export async function decompressFile(inputPath, outputPath = inputPath.replace(/\.gz$/, '')) {
  await assertReadableFile(inputPath)
  if (outputPath === inputPath) throw new Error('Вихідний файл збігається з вхідним')
  try {
    await pipeline(createReadStream(inputPath), zlib.createGunzip(), createWriteStream(outputPath))
    return outputPath
  } catch (error) {
    await removeQuietly(outputPath)
    throw new Error(`Помилка розпакування "${inputPath}": ${error.message}`, { cause: error })
  }
}

/** Стиснення рядка в пам'яті -> Buffer (gzip). */
export async function compressString(text) {
  if (typeof text !== 'string') throw new TypeError('text має бути рядком')
  return gzipAsync(Buffer.from(text, 'utf8'))
}

/** Розпакування Buffer (gzip) -> рядок. */
export async function decompressToString(buffer) {
  if (!Buffer.isBuffer(buffer)) throw new TypeError('Очікується Buffer')
  try {
    return (await gunzipAsync(buffer)).toString('utf8')
  } catch (error) {
    throw new Error(`Дані не є коректним gzip: ${error.message}`, { cause: error })
  }
}
