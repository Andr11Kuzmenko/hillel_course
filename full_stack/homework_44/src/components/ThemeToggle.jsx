import { useAppContext } from '../context/AppContext.jsx'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useAppContext()

  return (
    <button type="button" className="btn btn--ghost" onClick={toggleTheme}>
      {theme === 'light' ? '🌙 Темна тема' : '☀️ Світла тема'}
    </button>
  )
}
