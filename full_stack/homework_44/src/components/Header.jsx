import { useAppContext } from '../context/AppContext.jsx'
import ThemeToggle from './ThemeToggle.jsx'

export default function Header() {
  const { currentUser, users } = useAppContext()
  const activeCount = users.filter((u) => u.active).length

  return (
    <header className="header">
      <h1 className="header__title">Команда</h1>
      <div className="header__info">
        <span>
          Активних: {activeCount} / {users.length}
        </span>
        <span className="header__current">
          {currentUser ? `Обрано: ${currentUser.name}` : 'Користувача не обрано'}
        </span>
        <ThemeToggle />
      </div>
    </header>
  )
}
