import { useAppContext } from '../context/AppContext.jsx'

// Найглибший рівень (App → Layout → Sidebar → UserList → UserItem).
// Функції для зміни стану беруться прямо з контексту.
export default function UserItem({ user }) {
  const { currentUser, selectUser, toggleUserActive, removeUser } = useAppContext()
  const isSelected = currentUser?.id === user.id

  return (
    <li className={`user-item ${isSelected ? 'user-item--selected' : ''}`}>
      <button type="button" className="user-item__main" onClick={() => selectUser(user.id)}>
        <span className={`status-dot ${user.active ? 'status-dot--on' : ''}`} />
        <span>
          <strong>{user.name}</strong>
          <small className="muted">{user.role}</small>
        </span>
      </button>
      <div className="user-item__actions">
        <button
          type="button"
          className="btn btn--small"
          onClick={() => toggleUserActive(user.id)}
          title={user.active ? 'Деактивувати' : 'Активувати'}
        >
          {user.active ? '⏸' : '▶'}
        </button>
        <button
          type="button"
          className="btn btn--small btn--danger"
          onClick={() => removeUser(user.id)}
          title="Видалити"
        >
          ✕
        </button>
      </div>
    </li>
  )
}
