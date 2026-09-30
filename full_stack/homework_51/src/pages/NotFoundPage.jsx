import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="card center">
      <h1>404</h1>
      <p>Сторінку не знайдено.</p>
      <Link to="/">← На головну</Link>
    </section>
  )
}

export default NotFoundPage
