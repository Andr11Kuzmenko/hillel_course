import { GENDERS } from '../validationSchema.js'

const LABELS = {
  name: "Ім'я",
  email: 'Email',
  password: 'Пароль',
  age: 'Вік',
  phone: 'Телефон',
  gender: 'Стать',
  agree: 'Згода з умовами',
}

const formatValue = (key, value) => {
  if (key === 'password') return '•'.repeat(value.length)
  if (key === 'gender') return GENDERS.find((g) => g.value === value)?.label ?? value
  if (key === 'agree') return value ? 'Так' : 'Ні'
  return String(value)
}

export default function SubmittedData({ data, onClose }) {
  return (
    <section className="result">
      <h2>✅ Реєстрація успішна</h2>
      <dl>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="result__row">
            <dt>{LABELS[key] ?? key}</dt>
            <dd>{formatValue(key, value)}</dd>
          </div>
        ))}
      </dl>
      <button type="button" className="btn btn--secondary" onClick={onClose}>
        Сховати
      </button>
    </section>
  )
}
