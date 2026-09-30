import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as c from './converter.js'

test('round-trip для тексту', () => {
  for (const text of ['Hello', 'Привіт 👋', '']) {
    assert.equal(c.base64ToString(c.stringToBase64(text)), text)
    assert.equal(c.hexToString(c.stringToHex(text)), text)
  }
})

test('відомі значення', () => {
  assert.equal(c.stringToBase64('Hello'), 'SGVsbG8=')
  assert.equal(c.stringToHex('Hello'), '48656c6c6f')
  assert.equal(c.base64ToHex('SGVsbG8='), '48656c6c6f')
  assert.equal(c.hexToBase64('48656C6C6F'), 'SGVsbG8=')
})

test('валідація', () => {
  assert.throws(() => c.stringToBase64(1), TypeError)
  assert.throws(() => c.base64ToString('a$b='), /Base64/)
  assert.throws(() => c.hexToString('abc'), /Hex/)
  assert.throws(() => c.hexToBase64('xy'), /Hex/)
})
