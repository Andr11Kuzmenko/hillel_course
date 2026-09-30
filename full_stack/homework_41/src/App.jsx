import { Suspense, useState } from 'react'
import { fetchMessage, fetchUsers } from './api/messages.js'
import { ThemeContext } from './context/ThemeContext.js'
import MessageComponent from './components/MessageComponent.jsx'
import UserList from './components/UserList.jsx'
import ThemeBadge from './components/ThemeBadge.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import Loader from './components/Loader.jsx'
import './App.css'

// Promise створюється поза рендером і лише один раз — інакше кожен рендер
// створював би новий Promise, а use() знову призупиняв би компонент (нескінченний цикл).
const usersPromise = fetchUsers()

function App() {
  const [theme, setTheme] = useState('light')
  const [showBadge, setShowBadge] = useState(true)
  // Лінива ініціалізація: Promise створюється один раз при монтуванні,
  // а нові — лише в обробниках подій.
  const [messagePromise, setMessagePromise] = useState(() => fetchMessage())
  const [failingPromise, setFailingPromise] = useState(() => fetchMessage({ shouldFail: true }))

  const reloadMessage = () => setMessagePromise(fetchMessage())
  const retryFailing = () => setFailingPromise(fetchMessage({ shouldFail: Math.random() < 0.5 }))

  return (
    <ThemeContext value={theme}>
      <div className={`app app--${theme}`}>
        <div className="container">
          <header className="header">
            <h1>Хук use() в React 19</h1>
            <div className="header__controls">
              <button
                className="btn"
                type="button"
                onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
              >
                Змінити тему
              </button>
              <label>
                <input type="checkbox" checked={showBadge} onChange={(e) => setShowBadge(e.target.checked)} />{' '}
                Показати бейдж
              </label>
              <ThemeBadge show={showBadge} />
            </div>
          </header>

          <section className="card">
            <h2>1. Читання Promise через use()</h2>
            <ErrorBoundary>
              <Suspense fallback={<Loader text="Завантаження повідомлення..." />}>
                <MessageComponent messagePromise={messagePromise} />
              </Suspense>
            </ErrorBoundary>
            <button className="btn" type="button" onClick={reloadMessage}>
              Завантажити нове повідомлення
            </button>
          </section>

          <section className="card">
            <h2>2. Відхилений Promise + ErrorBoundary</h2>
            <p className="muted">
              Перший запит завжди завершується помилкою. Повторна спроба — з імовірністю 50%.
            </p>
            <ErrorBoundary onReset={retryFailing}>
              <Suspense fallback={<Loader text="Спроба завантаження..." />}>
                <MessageComponent messagePromise={failingPromise} />
              </Suspense>
            </ErrorBoundary>
          </section>

          <section className="card">
            <h2>3. Список користувачів</h2>
            <Suspense fallback={<Loader text="Завантаження користувачів..." />}>
              <UserList usersPromise={usersPromise} />
            </Suspense>
          </section>
        </div>
      </div>
    </ThemeContext>
  )
}

export default App
