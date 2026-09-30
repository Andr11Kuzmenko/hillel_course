import { useAppContext } from '../context/AppContext.jsx'
import UserDetails from './UserDetails.jsx'

export default function MainContent() {
  const { currentUser } = useAppContext()

  return (
    <main className="main">
      {currentUser ? (
        <UserDetails />
      ) : (
        <p className="muted">Оберіть користувача зі списку ліворуч.</p>
      )}
    </main>
  )
}
