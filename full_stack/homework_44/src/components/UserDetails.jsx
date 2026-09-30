import { useAppContext } from '../context/AppContext.jsx'
import EditUserForm from './EditUserForm.jsx'

export default function UserDetails() {
  const { currentUser, toggleUserActive } = useAppContext()

  return (
    <section className="card">
      <h2>{currentUser.name}</h2>
      <dl className="details">
        <dt>Email</dt>
        <dd>{currentUser.email}</dd>
        <dt>Роль</dt>
        <dd>{currentUser.role}</dd>
        <dt>Статус</dt>
        <dd>
          {currentUser.active ? 'Активний' : 'Неактивний'}{' '}
          <button type="button" className="btn btn--small" onClick={() => toggleUserActive(currentUser.id)}>
            Змінити
          </button>
        </dd>
      </dl>
      {/* key скидає локальний стан форми при зміні обраного користувача */}
      <EditUserForm key={currentUser.id} />
    </section>
  )
}
