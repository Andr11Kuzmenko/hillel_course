/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const INITIAL_USERS = [
  { id: 1, name: 'Олена Коваль', email: 'olena@example.com', role: 'Адміністратор', active: true },
  { id: 2, name: 'Іван Петренко', email: 'ivan@example.com', role: 'Розробник', active: true },
  { id: 3, name: 'Марія Шевченко', email: 'maria@example.com', role: 'Дизайнер', active: false },
  { id: 4, name: 'Андрій Бондар', email: 'andrii@example.com', role: 'Тестувальник', active: true },
]

// Значення за замовчуванням описує форму контексту. Воно використовується,
// якщо компонент буде відрендерено поза AppProvider, тому функції-заглушки
// попереджають розробника в консолі замість того, щоб "мовчки" нічого не робити.
const warnNoProvider = (name) => () =>
  console.warn(`AppContext: "${name}" викликано поза AppProvider`)

export const defaultAppContext = {
  users: [],
  currentUser: null,
  theme: 'light',
  toggleTheme: warnNoProvider('toggleTheme'),
  selectUser: warnNoProvider('selectUser'),
  addUser: warnNoProvider('addUser'),
  removeUser: warnNoProvider('removeUser'),
  toggleUserActive: warnNoProvider('toggleUserActive'),
  updateUser: warnNoProvider('updateUser'),
}

export const AppContext = createContext(defaultAppContext)
AppContext.displayName = 'AppContext'

export function AppProvider({ children }) {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [currentUserId, setCurrentUserId] = useState(INITIAL_USERS[0].id)
  const [theme, setTheme] = useState('light')

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  const selectUser = useCallback((id) => setCurrentUserId(id), [])

  const addUser = useCallback((user) => {
    const newUser = { id: Date.now(), active: true, ...user }
    setUsers((prev) => [...prev, newUser])
    setCurrentUserId(newUser.id)
  }, [])

  const removeUser = useCallback((id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
    setCurrentUserId((prev) => (prev === id ? null : prev))
  }, [])

  const toggleUserActive = useCallback((id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u)))
  }, [])

  const updateUser = useCallback((id, changes) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...changes } : u)))
  }, [])

  const currentUser = users.find((u) => u.id === currentUserId) ?? null

  const value = useMemo(
    () => ({
      users,
      currentUser,
      theme,
      toggleTheme,
      selectUser,
      addUser,
      removeUser,
      toggleUserActive,
      updateUser,
    }),
    [users, currentUser, theme, toggleTheme, selectUser, addUser, removeUser, toggleUserActive, updateUser],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Кастомний хук: компоненти не імпортують сам контекст напряму
export function useAppContext() {
  return useContext(AppContext)
}
