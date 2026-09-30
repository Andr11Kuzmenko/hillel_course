import { Link } from 'react-router'
import { users } from '../data/users.js'

function Users() {
  return (
    <section className="card">
      <h1>👥 Користувачі</h1>
      <p className="muted">Оберіть користувача, щоб перейти на динамічний маршрут /users/:id</p>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
            <span className="muted"> — {user.role}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Users
