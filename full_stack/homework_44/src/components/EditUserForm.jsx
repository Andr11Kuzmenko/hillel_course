import { useState } from 'react'
import { useAppContext } from '../context/AppContext.jsx'

export default function EditUserForm() {
  const { currentUser, updateUser } = useAppContext()
  const [name, setName] = useState(currentUser.name)
  const [email, setEmail] = useState(currentUser.email)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    updateUser(currentUser.id, { name: name.trim(), email: email.trim() })
  }

  return (
    <form className="edit-form" onSubmit={handleSubmit}>
      <h3>Редагувати</h3>
      <input value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button type="submit" className="btn">
        Зберегти
      </button>
    </form>
  )
}
