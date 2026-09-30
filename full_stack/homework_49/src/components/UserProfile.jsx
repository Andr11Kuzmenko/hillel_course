import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

export const API_URL = 'https://jsonplaceholder.typicode.com/users'

function UserProfile({ userId = 1 }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    async function loadUser() {
      setLoading(true)
      setError(null)
      setUser(null)
      try {
        const response = await fetch(`${API_URL}/${userId}`)
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }
        const data = await response.json()
        if (!ignore) setUser(data)
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadUser()
    return () => {
      ignore = true
    }
  }, [userId])

  if (loading) {
    return (
      <p role="status" className="loading">
        Завантаження...
      </p>
    )
  }

  if (error) {
    return (
      <p role="alert" className="error">
        Помилка: {error}
      </p>
    )
  }

  if (!user) return null

  return (
    <article className="card" data-testid="user-profile">
      <h2>{user.name}</h2>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Телефон:</strong> {user.phone}
      </p>
      {user.website && (
        <p>
          <strong>Сайт:</strong> {user.website}
        </p>
      )}
      {user.address && (
        <p>
          <strong>Місто:</strong> {user.address.city}
        </p>
      )}
      {user.company && (
        <p>
          <strong>Компанія:</strong> {user.company.name}
        </p>
      )}
    </article>
  )
}

UserProfile.propTypes = {
  userId: PropTypes.number,
}

export default UserProfile
