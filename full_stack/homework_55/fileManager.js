import { mkdir, writeFile, appendFile, readFile, copyFile, rename, unlink, readdir, stat, rm, access } from 'node:fs/promises'
import { constants } from 'node:fs'
import path from 'node:path'

// Усі функції асинхронні (async/await) і перехоплюють помилки через try/catch,
// додаючи до повідомлення контекст операції, після чого прокидають помилку далі.

function wrapError(action, target, error) {
  const wrapped = new Error(`Не вдалося ${action} "${target}": ${error.code ?? error.message}`)
  wrapped.code = error.code
  wrapped.cause = error
  return wrapped
}

export async function exists(target) {
  try {
    await access(target, constants.F_OK)
    return true
  } catch {
    return false
  }
}

export async function createDir(dirPath) {
  try {
    await mkdir(dirPath, { recursive: true })
    return dirPath
  } catch (error) {
    throw wrapError('створити директорію', dirPath, error)
  }
}

export async function createFile(filePath, content = '') {
  try {
    // прапорець 'wx' — помилка EEXIST, якщо файл уже існує (не перезаписуємо випадково)
    await writeFile(filePath, content, { encoding: 'utf8', flag: 'wx' })
    return filePath
  } catch (error) {
    throw wrapError('створити файл', filePath, error)
  }
}

export async function writeToFile(filePath, content) {
  try {
    await writeFile(filePath, content, 'utf8')
  } catch (error) {
    throw wrapError('записати у файл', filePath, error)
  }
}

export async function appendToFile(filePath, content) {
  try {
    await appendFile(filePath, content, 'utf8')
  } catch (error) {
    throw wrapError('дописати у файл', filePath, error)
  }
}

export async function readFromFile(filePath) {
  try {
    return await readFile(filePath, 'utf8')
  } catch (error) {
    throw wrapError('прочитати файл', filePath, error)
  }
}

export async function copy(src, dest) {
  try {
    await copyFile(src, dest, constants.COPYFILE_EXCL)
    return dest
  } catch (error) {
    throw wrapError('скопіювати файл', `${src} -> ${dest}`, error)
  }
}

export async function renameFile(oldPath, newPath) {
  try {
    await rename(oldPath, newPath)
    return newPath
  } catch (error) {
    throw wrapError('перейменувати файл', `${oldPath} -> ${newPath}`, error)
  }
}

export async function deleteFile(filePath) {
  try {
    await unlink(filePath)
  } catch (error) {
    throw wrapError('видалити файл', filePath, error)
  }
}

export async function getInfo(target) {
  try {
    const stats = await stat(target)
    return {
      name: path.basename(target),
      type: stats.isDirectory() ? 'directory' : 'file',
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
    }
  } catch (error) {
    throw wrapError('отримати інформацію про', target, error)
  }
}

export async function listDir(dirPath) {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true })
    // Отримуємо stat для всіх елементів паралельно
    return await Promise.all(entries.map((entry) => getInfo(path.join(dirPath, entry.name))))
  } catch (error) {
    throw wrapError('прочитати директорію', dirPath, error)
  }
}

export async function removeDir(dirPath) {
  try {
    await rm(dirPath, { recursive: true, force: true })
  } catch (error) {
    throw wrapError('видалити директорію', dirPath, error)
  }
}
