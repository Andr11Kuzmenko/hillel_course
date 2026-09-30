import { NavLink, Outlet } from 'react-router'

const links = [
  { to: '/', label: 'Головна', end: true },
  { to: '/about', label: 'Про нас' },
  { to: '/users', label: 'Користувачі' },
  { to: '/contact', label: 'Контакти' },
]

function Layout() {
  return (
    <>
      <header className="header">
        <nav className="nav container">
          <span className="nav__logo">MyApp</span>
          <ul className="nav__list">
            {links.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) => (isActive ? 'nav__link nav__link--active' : 'nav__link')}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="container">
        <Outlet />
      </main>
    </>
  )
}

export default Layout
