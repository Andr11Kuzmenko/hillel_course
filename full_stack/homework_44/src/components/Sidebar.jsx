import UserList from './UserList.jsx'
import AddUserForm from './AddUserForm.jsx'

// Sidebar не використовує контекст сам — він просто компонує дочірні компоненти.
// Завдяки контексту йому не потрібно "прокидати" жодних props.
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar__title">Користувачі</h2>
      <UserList />
      <AddUserForm />
    </aside>
  )
}
