import { Link, useNavigate, useParams } from 'react-router'
import { users } from '../data/users.js'

function UserDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = users.find((item) => item.id === Number(id))

  if (!user) {
    return (
      <section className="card">
        <h1>Користувача не знайдено</h1>
        <p>
          Користувача з id <strong>{id}</strong> не існує.
        </p>
        <Link to="/users">← До списку користувачів</Link>
      </section>
    )
  }

  return (
    <section className="card">
      <h1>{user.name}</h1>
      <p className="muted">Параметр маршруту id = {id}</p>
      <dl className="details">
        <dt>Посада</dt>
        <dd>{user.role}</dd>
        <dt>Email</dt>
        <dd>{user.email}</dd>
        <dt>Місто</dt>
        <dd>{user.city}</dd>
      </dl>
      <button className="btn" type="button" onClick={() => navigate(-1)}>
        ← Назад
      </button>
    </section>
  )
}

export default UserDetails
