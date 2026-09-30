import { Link, useLocation } from 'react-router'

function NotFound() {
  const location = useLocation()

  return (
    <section className="card not-found">
      <h1>404</h1>
      <p>
        Сторінку <code>{location.pathname}</code> не знайдено.
      </p>
      <Link className="btn" to="/">
        На головну
      </Link>
    </section>
  )
}

export default NotFound
