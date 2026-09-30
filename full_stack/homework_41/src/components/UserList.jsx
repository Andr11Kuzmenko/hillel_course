import { use } from 'react'
import PropTypes from 'prop-types'

function UserList({ usersPromise }) {
  const users = use(usersPromise)

  return (
    <ul className="user-list">
      {users.map((user) => (
        <li key={user.id}>
          <strong>{user.name}</strong> <span className="muted">— {user.role}</span>
        </li>
      ))}
    </ul>
  )
}

UserList.propTypes = {
  usersPromise: PropTypes.instanceOf(Promise).isRequired,
}

export default UserList
