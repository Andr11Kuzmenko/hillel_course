import { useState } from 'react'
import Button from './components/Button.jsx'
import Input from './components/Input.jsx'
import './App.css'

const initialForm = { name: '', email: '', password: '', age: '' }

function App() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(null)
  const [clicks, setClicks] = useState(0)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(form)
  }

  const handleReset = () => {
    setForm(initialForm)
    setSubmitted(null)
  }

  return (
    <div className="container">
      <h1>Компоненти Button та Input</h1>

      <section className="card">
        <h2>Форма реєстрації</h2>
        <form onSubmit={handleSubmit}>
          <Input label="Ім'я" name="name" placeholder="Іван" value={form.name} onChange={handleChange} required />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="ivan@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Пароль"
            name="password"
            type="password"
            placeholder="Мінімум 6 символів"
            value={form.password}
            onChange={handleChange}
          />
          <Input label="Вік" name="age" type="number" placeholder="18" value={form.age} onChange={handleChange} />

          <div className="actions">
            <Button text="Надіслати" type="submit" />
            <Button text="Очистити" variant="secondary" onClick={handleReset} />
          </div>
        </form>

        {submitted && (
          <pre className="result">{JSON.stringify({ ...submitted, password: '***' }, null, 2)}</pre>
        )}
      </section>

      <section className="card">
        <h2>Різні варіанти кнопок</h2>
        <div className="actions">
          <Button />
          <Button text={`Натиснуто: ${clicks}`} onClick={() => setClicks((c) => c + 1)} />
          <Button text="Скинути лічильник" variant="danger" onClick={() => setClicks(0)} />
          <Button text="Неактивна" disabled />
        </div>
        <p className="muted">
          Перша кнопка не отримала жодних props і використовує значення за замовчуванням.
        </p>
      </section>

      <section className="card">
        <h2>Input із значеннями за замовчуванням</h2>
        <Input />
      </section>
    </div>
  )
}

export default App
