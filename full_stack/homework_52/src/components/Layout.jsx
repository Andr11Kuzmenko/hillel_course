import { Link, NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCartCount } from '../features/cart/cartSlice.js'
import { selectIsFallback, selectProductsError } from '../features/products/productsSlice.js'

function Layout() {
  const cartCount = useSelector(selectCartCount)
  const isFallback = useSelector(selectIsFallback)
  const error = useSelector(selectProductsError)

  return (
    <div className="app">
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            🛍️ MiniShop
          </Link>
          <nav className="nav">
            <NavLink to="/" end>
              Каталог
            </NavLink>
            <NavLink to="/orders">Замовлення</NavLink>
            <NavLink to="/cart" className="cart-link">
              Кошик
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </NavLink>
          </nav>
        </div>
      </header>
      {isFallback && (
        <div className="banner" role="alert">
          Не вдалося завантажити товари з fakestoreapi.com ({error}). Показано демонстраційні дані.
        </div>
      )}
      <main className="container main">
        <Outlet />
      </main>
      <footer className="footer">Homework 52 · React + Redux Toolkit</footer>
    </div>
  )
}

export default Layout
