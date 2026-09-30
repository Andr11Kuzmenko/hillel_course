import { useState } from 'react'
import ResponseView from './ResponseView.jsx'

const API_URL = 'https://jsonplaceholder.typicode.com/posts'

const initialForm = {
  name: '',
  message: '',
  topic: 'question',
  subscribe: false,
}

/**
 * Контрольований компонент: значення кожного поля форми зберігаються у стані
 * React і оновлюються через onChange. Під час відправки дані надсилаються
 * POST-запитом за допомогою fetch.
 */
function FeedbackForm() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [response, setResponse] = useState(null)
  const [requestError, setRequestError] = useState('')

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validate = () => {
    const nextErrors = {}
    if (form.name.trim().length < 2) nextErrors.name = "Ім'я має містити щонайменше 2 символи"
    if (form.message.trim().length < 5) nextErrors.message = 'Повідомлення має містити щонайменше 5 символів'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setStatus('loading')
    setRequestError('')
    setResponse(null)

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({ ...form, userId: 1 }),
      })

      if (!res.ok) {
        throw new Error(`Сервер повернув помилку: ${res.status}`)
      }

      const data = await res.json()
      setResponse(data)
      setStatus('success')
      setForm(initialForm)
    } catch (error) {
      setRequestError(error.message || 'Не вдалося надіслати дані')
      setStatus('error')
    }
  }

  const isLoading = status === 'loading'

  return (
    <section className="card">
      <h2>Контрольована форма</h2>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <label className="form__field">
          <span>Ім&apos;я</span>
          <input
            className="input"
            type="text"
            name="name"
            placeholder="Ваше ім'я"
            value={form.name}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.name && <small className="error">{errors.name}</small>}
        </label>

        <label className="form__field">
          <span>Повідомлення</span>
          <textarea
            className="input"
            name="message"
            rows={3}
            placeholder="Текст повідомлення"
            value={form.message}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.message && <small className="error">{errors.message}</small>}
        </label>

        <label className="form__field">
          <span>Тема</span>
          <select name="topic" value={form.topic} onChange={handleChange} disabled={isLoading}>
            <option value="question">Питання</option>
            <option value="bug">Повідомити про помилку</option>
            <option value="idea">Пропозиція</option>
          </select>
        </label>

        <label className="form__checkbox">
          <input
            type="checkbox"
            name="subscribe"
            checked={form.subscribe}
            onChange={handleChange}
            disabled={isLoading}
          />
          <span>Підписатися на новини</span>
        </label>

        <button className="btn" type="submit" disabled={isLoading}>
          {isLoading ? 'Надсилання...' : 'Надіслати'}
        </button>
      </form>

      <div className="preview">
        <h3>Поточний стан форми</h3>
        <pre>{JSON.stringify(form, null, 2)}</pre>
      </div>

      {status === 'error' && <p className="error">Помилка: {requestError}</p>}
      {status === 'success' && response && <ResponseView data={response} />}
    </section>
  )
}

export default FeedbackForm
