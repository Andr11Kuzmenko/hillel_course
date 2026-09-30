import { useEffect, useState } from 'react'
import axios from 'axios'
import { apiClient } from '../api/client.js'
import PostCard from './PostCard.jsx'

const LIMIT_OPTIONS = [5, 10, 20]

/**
 * Завантажує пости з JSONPlaceholder за допомогою axios всередині useEffect.
 * Запит стартує при першому монтуванні та при зміні limit / reloadKey.
 * AbortController скасовує запит, якщо компонент розмонтовано або
 * параметри змінилися до завершення попереднього запиту.
 */
function DataFetcher() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [limit, setLimit] = useState(10)
  const [reloadKey, setReloadKey] = useState(0)
  const [simulateError, setSimulateError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const fetchPosts = async () => {
      setLoading(true)
      setError(null)

      try {
        const url = simulateError ? '/unknown-endpoint' : '/posts'
        const response = await apiClient.get(url, {
          params: { _limit: limit },
          signal: controller.signal,
        })
        setPosts(response.data)
      } catch (err) {
        if (axios.isCancel(err)) return // запит скасовано — нічого не робимо

        const message = err.response
          ? `Помилка сервера: ${err.response.status} ${err.response.statusText || ''}`.trim()
          : err.message
        setError(message)
        setPosts([])
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchPosts()

    return () => controller.abort()
  }, [limit, reloadKey, simulateError])

  return (
    <section className="card">
      <div className="toolbar">
        <label>
          Кількість постів:{' '}
          <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            {LIMIT_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label>
          <input type="checkbox" checked={simulateError} onChange={(e) => setSimulateError(e.target.checked)} />{' '}
          Імітувати помилку
        </label>
        <button className="btn" type="button" onClick={() => setReloadKey((k) => k + 1)} disabled={loading}>
          Оновити
        </button>
      </div>

      {loading && (
        <div className="loader">
          <span className="loader__spinner" /> Завантаження даних...
        </div>
      )}

      {!loading && error && (
        <div className="error-box">
          <p className="error">{error}</p>
          <button className="btn" type="button" onClick={() => setReloadKey((k) => k + 1)}>
            Спробувати ще раз
          </button>
        </div>
      )}

      {!loading && !error && posts.length === 0 && <p className="muted">Даних немає.</p>}

      {!loading && !error && posts.length > 0 && (
        <ul className="post-list">
          {posts.map((post) => (
            <PostCard key={post.id} id={post.id} title={post.title} body={post.body} />
          ))}
        </ul>
      )}
    </section>
  )
}

export default DataFetcher
