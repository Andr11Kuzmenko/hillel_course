import { describe, expect, it } from 'vitest'
import { EMPTY_CHECKOUT, formatCardNumber, formatExpiry, validateCheckout } from './validation.js'

const valid = {
  ...EMPTY_CHECKOUT,
  fullName: 'Тарас Шевченко',
  email: 'taras@example.com',
  phone: '+380501234567',
  city: 'Київ',
  address: 'вул. Хрещатик, 1',
  agree: true,
}

describe('validateCheckout', () => {
  it('порожня форма має помилки в обовʼязкових полях', () => {
    const errors = validateCheckout(EMPTY_CHECKOUT)
    expect(Object.keys(errors)).toEqual(expect.arrayContaining(['fullName', 'email', 'phone', 'city', 'address', 'agree']))
  })

  it('валідна форма без помилок', () => {
    expect(validateCheckout(valid)).toEqual({})
  })

  it('перевіряє дані картки', () => {
    const now = new Date(2026, 0, 1)
    expect(Object.keys(validateCheckout({ ...valid, payment: 'card' }, now))).toEqual(['cardNumber', 'cardExpiry', 'cardCvv'])
    expect(
      validateCheckout({ ...valid, payment: 'card', cardNumber: '4242 4242 4242 4242', cardExpiry: '12/27', cardCvv: '123' }, now),
    ).toEqual({})
    expect(validateCheckout({ ...valid, payment: 'card', cardNumber: '4242424242424242', cardExpiry: '12/25', cardCvv: '123' }, now)).toHaveProperty('cardExpiry')
  })

  it('форматує номер картки та термін дії', () => {
    expect(formatCardNumber('4242abc424242424242999')).toBe('4242 4242 4242 4242')
    expect(formatExpiry('1227')).toBe('12/27')
  })
})
