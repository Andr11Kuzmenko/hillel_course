import { useState } from 'react'
import UserProfile from './components/UserProfile.jsx'

function App() {
  const [userId, setUserId] = useState(1)

  return (
    <main className="app">
      <h1>Профіль користувача</h1>
      <div className="controls">
        {[1, 2, 3, 999].map((id) => (
          <button
            key={id}
            type="button"
            className={id === userId ? 'active' : ''}
            onClick={() => setUserId(id)}
          >
            {id === 999 ? 'Неіснуючий (999)' : `User #${id}`}
          </button>
        ))}
      </div>
      <UserProfile userId={userId} />
    </main>
  )
}

export default App
