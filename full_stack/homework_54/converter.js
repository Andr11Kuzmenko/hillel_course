import { Buffer } from 'node:buffer'

// Регулярні вирази для перевірки коректності вхідних даних
const BASE64_RE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
const HEX_RE = /^(?:[0-9a-fA-F]{2})*$/

function assertString(value, name = 'value') {
  if (typeof value !== 'string') {
    throw new TypeError(`${name} має бути рядком, отримано: ${value === null ? 'null' : typeof value}`)
  }
}

export function isBase64(value) {
  return typeof value === 'string' && BASE64_RE.test(value)
}

export function isHex(value) {
  return typeof value === 'string' && HEX_RE.test(value)
}

function assertBase64(value) {
  assertString(value, 'base64')
  if (!isBase64(value)) throw new Error(`Некоректний Base64-рядок: "${value}"`)
}

function assertHex(value) {
  assertString(value, 'hex')
  if (!isHex(value)) throw new Error(`Некоректний Hex-рядок: "${value}" (дозволено 0-9, a-f, парна довжина)`)
}

// Рядок (UTF-8) -> Base64
export function stringToBase64(text) {
  assertString(text, 'text')
  return Buffer.from(text, 'utf8').toString('base64')
}

// Base64 -> рядок (UTF-8)
export function base64ToString(base64) {
  assertBase64(base64)
  return Buffer.from(base64, 'base64').toString('utf8')
}

// Рядок (UTF-8) -> Hex
export function stringToHex(text) {
  assertString(text, 'text')
  return Buffer.from(text, 'utf8').toString('hex')
}

// Hex -> рядок (UTF-8)
export function hexToString(hex) {
  assertHex(hex)
  return Buffer.from(hex, 'hex').toString('utf8')
}

// Base64 -> Hex (без проміжного перетворення в текст — працює і для бінарних даних)
export function base64ToHex(base64) {
  assertBase64(base64)
  return Buffer.from(base64, 'base64').toString('hex')
}

// Hex -> Base64
export function hexToBase64(hex) {
  assertHex(hex)
  return Buffer.from(hex, 'hex').toString('base64')
}
