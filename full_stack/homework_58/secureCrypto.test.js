import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as sc from './secureCrypto.js'

test('sha256 відомого значення', () => {
  assert.equal(sc.hash('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
})

test('HMAC: вірний і підроблений підпис', () => {
  const sig = sc.createHmac('msg', 'key')
  assert.equal(sc.verifyHmac('msg', 'key', sig), true)
  assert.equal(sc.verifyHmac('msg2', 'key', sig), false)
  assert.equal(sc.verifyHmac('msg', 'key', 'abc'), false)
})

test('паролі: scrypt і pbkdf2', async () => {
  for (const algorithm of ['scrypt', 'pbkdf2']) {
    const stored = await sc.hashPassword('correct horse', { algorithm })
    assert.equal(await sc.verifyPassword('correct horse', stored), true)
    assert.equal(await sc.verifyPassword('wrong horse', stored), false)
  }
  assert.notEqual(await sc.hashPassword('same-password'), await sc.hashPassword('same-password'))
  await assert.rejects(sc.hashPassword('short'))
  assert.equal(await sc.verifyPassword('x', 'garbage'), false)
})

test('AES-256-GCM: round-trip, унікальний IV, виявлення змін', () => {
  const key = sc.generateKey()
  const a = sc.encrypt('секрет', key)
  assert.notEqual(a, sc.encrypt('секрет', key))
  assert.equal(sc.decrypt(a, key), 'секрет')
  assert.throws(() => sc.decrypt(a, sc.generateKey()), /розшифрувати/)
  assert.throws(() => sc.decrypt(sc.encrypt('x', key, 'a'), key, 'b'), /розшифрувати/)
  assert.throws(() => sc.encrypt('x', Buffer.alloc(16)), TypeError)
})

test('токени', () => {
  assert.equal(sc.generateToken(32, 'hex').length, 64)
  assert.notEqual(sc.generateToken(), sc.generateToken())
  assert.match(sc.generateOtp(6), /^\d{6}$/)
  assert.throws(() => sc.generateToken(4), RangeError)
})
