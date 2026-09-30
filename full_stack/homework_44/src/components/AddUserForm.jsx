import { useState } from 'react'
import { useAppContext } from '../context/AppContext.jsx'

const ROLES = ['Розробник', 'Дизайнер', 'Тестувальник', 'Менеджер', 'Адміністратор']

export default function AddUserForm() {
  const { addUser } = useAppContext()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState(ROLES[0])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    addUser({ name: name.trim(), email: email.trim(), role })
    setName('')
    setEmail('')
    setRole(ROLES[0])
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>Додати користувача</h3>
      <input placeholder="Ім'я" value={name} onChange={(e) => setName(e.target.value)} required />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        {ROLES.map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>
      <button type="submit" className="btn">
        Додати
      </button>
    </form>
  )
}
