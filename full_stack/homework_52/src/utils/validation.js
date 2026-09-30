export const EMPTY_CHECKOUT = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  address: '',
  payment: 'cash', // 'cash' | 'card'
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
  comment: '',
  agree: false,
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^\+?\d{10,13}$/

function isExpiryValid(value, now = new Date()) {
  const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value)
  if (!m) return false
  const month = Number(m[1])
  const year = 2000 + Number(m[2])
  const lastDay = new Date(year, month, 0, 23, 59, 59)
  return lastDay >= now
}

// Повертає об'єкт помилок { field: message }. Порожній об'єкт — форма валідна.
export function validateCheckout(values, now = new Date()) {
  const errors = {}
  const phoneDigits = values.phone.replace(/[\s()-]/g, '')

  if (values.fullName.trim().length < 3) errors.fullName = "Введіть ім'я та прізвище (мін. 3 символи)"
  else if (!/^[\p{L}\s'-]+$/u.test(values.fullName.trim())) errors.fullName = "Ім'я може містити лише літери"

  if (!values.email.trim()) errors.email = 'Введіть email'
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Некоректний email'

  if (!phoneDigits) errors.phone = 'Введіть номер телефону'
  else if (!PHONE_RE.test(phoneDigits)) errors.phone = 'Формат: +380XXXXXXXXX'

  if (values.city.trim().length < 2) errors.city = 'Вкажіть місто'
  if (values.address.trim().length < 5) errors.address = 'Вкажіть адресу або відділення (мін. 5 символів)'

  if (values.payment === 'card') {
    const digits = values.cardNumber.replace(/\s/g, '')
    if (!/^\d{16}$/.test(digits)) errors.cardNumber = 'Номер картки — 16 цифр'
    if (!isExpiryValid(values.cardExpiry, now)) errors.cardExpiry = 'Формат MM/YY, картка не прострочена'
    if (!/^\d{3}$/.test(values.cardCvv)) errors.cardCvv = 'CVV — 3 цифри'
  }

  if (values.comment.length > 300) errors.comment = 'Максимум 300 символів'
  if (!values.agree) errors.agree = 'Потрібна згода з умовами'

  return errors
}

export function formatCardNumber(value) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
}

export function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}
