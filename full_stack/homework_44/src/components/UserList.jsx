import { useAppContext } from '../context/AppContext.jsx'
import UserItem from './UserItem.jsx'

export default function UserList() {
  const { users } = useAppContext()

  if (users.length === 0) {
    return <p className="muted">Список порожній</p>
  }

  return (
    <ul className="user-list">
      {users.map((user) => (
        <UserItem key={user.id} user={user} />
      ))}
    </ul>
  )
}
