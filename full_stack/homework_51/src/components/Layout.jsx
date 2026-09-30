import { NavLink, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useMarket } from '../context/MarketContext.jsx'
import { formatRelative } from '../utils/format.js'

function Layout() {
  const { updatedAt, isFallback, loading, refresh } = useMarket()

  return (
    <div className="app">
      <header className="topbar">
        <NavLink to="/" className="logo">
          ◈ CryptoBoard
        </NavLink>
        <nav>
          <NavLink to="/" end>
            Ринок
          </NavLink>
          <NavLink to="/portfolio">Портфель</NavLink>
        </nav>
        <div className="topbar-status">
          {isFallback && <span className="tag warn">резервні дані</span>}
          {updatedAt && <span className="muted">оновлено {formatRelative(updatedAt)}</span>}
          <button type="button" onClick={() => refresh()} disabled={loading}>
            {loading ? '...' : '↻ Оновити'}
          </button>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer muted">Дані: CoinGecko API · Homework 51</footer>
      <ToastContainer position="bottom-right" autoClose={3500} newestOnTop theme="colored" />
    </div>
  )
}

export default Layout
