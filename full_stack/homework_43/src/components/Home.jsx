import { Link } from 'react-router'

function Home() {
  return (
    <section className="card">
      <h1>🏠 Головна сторінка</h1>
      <p>Ласкаво просимо! Це головна сторінка застосунку з маршрутизацією на React Router.</p>
      <p>
        Перегляньте <Link to="/users">список користувачів</Link> або{' '}
        <Link to="/some/unknown/page">неіснуючу сторінку</Link>, щоб побачити 404.
      </p>
    </section>
  )
}

export default Home
