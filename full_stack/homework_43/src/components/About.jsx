function About() {
  return (
    <section className="card">
      <h1>ℹ️ Про нас</h1>
      <p>
        Сторінка «Про нас». Ми — команда, що вивчає React та React Router. Цей застосунок демонструє
        клієнтську маршрутизацію без перезавантаження сторінки.
      </p>
      <ul>
        <li>BrowserRouter, Routes та Route</li>
        <li>Навігація через NavLink з підсвічуванням активного пункту</li>
        <li>Динамічні маршрути та useParams</li>
        <li>Сторінка 404 для невідомих адрес</li>
      </ul>
    </section>
  )
}

export default About
