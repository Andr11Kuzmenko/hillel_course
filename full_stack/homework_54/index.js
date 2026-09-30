import { Buffer } from 'node:buffer'
import { stringToBase64, base64ToString, stringToHex, hexToString, base64ToHex, hexToBase64 } from './converter.js'

console.log('=== HW 54: Buffer — Base64 <-> Hex ===\n')

// 1. Базові властивості буфера
const buf = Buffer.from('Привіт, Node.js!', 'utf8')
console.log('Buffer:', buf)
console.log('Довжина рядка (символів):', 'Привіт, Node.js!'.length, '| розмір буфера (байт):', buf.length)
console.log('Перші 4 байти:', buf.subarray(0, 4), '\n')

// 2. Перетворення
const samples = ['Hello, World!', 'Привіт, світ! 👋', '']

for (const text of samples) {
  const b64 = stringToBase64(text)
  const hex = stringToHex(text)
  console.log(`Текст:          "${text}"`)
  console.log(`  -> Base64:    "${b64}"`)
  console.log(`  -> Hex:       "${hex}"`)
  console.log(`  Base64->Hex:  "${base64ToHex(b64)}"  (збігається: ${base64ToHex(b64) === hex})`)
  console.log(`  Hex->Base64:  "${hexToBase64(hex)}"  (збігається: ${hexToBase64(hex) === b64})`)
  console.log(`  Base64->text: "${base64ToString(b64)}"`)
  console.log(`  Hex->text:    "${hexToString(hex)}"\n`)
}

// 3. Бінарні дані (не текст): байти 0x00, 0xff, 0x10, 0x80
console.log('Бінарні дані: hex "00ff1080" -> base64', hexToBase64('00ff1080'), '-> hex', base64ToHex(hexToBase64('00ff1080')), '\n')

// 4. Валідація вхідних даних
const invalidCalls = [
  ['stringToBase64(123)', () => stringToBase64(123)],
  ['base64ToString("abc$")', () => base64ToString('abc$')],
  ['hexToString("abc")', () => hexToString('abc')],
  ['hexToBase64("zz")', () => hexToBase64('zz')],
  ['base64ToHex(null)', () => base64ToHex(null)],
]

console.log('Перевірка валідації:')
for (const [label, fn] of invalidCalls) {
  try {
    fn()
    console.log(`  ${label}: помилки не виникло (неочікувано)`)
  } catch (error) {
    console.log(`  ${label}: ${error.name} — ${error.message}`)
  }
}
