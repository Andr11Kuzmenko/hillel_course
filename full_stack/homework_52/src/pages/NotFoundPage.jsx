import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="empty">
      <h1>404</h1>
      <p>Сторінку не знайдено.</p>
      <Link to="/" className="btn primary">
        На головну
      </Link>
    </section>
  )
}

export default NotFoundPage
