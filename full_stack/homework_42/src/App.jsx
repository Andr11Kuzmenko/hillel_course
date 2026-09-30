import DataFetcher from './components/DataFetcher.jsx'
import './App.css'

function App() {
  return (
    <div className="container">
      <h1>useEffect + Axios</h1>
      <p className="muted">
        Дані завантажуються з{' '}
        <a href="https://jsonplaceholder.typicode.com/posts" target="_blank" rel="noreferrer">
          JSONPlaceholder
        </a>{' '}
        під час першого монтування компонента.
      </p>
      <DataFetcher />
    </div>
  )
}

export default App
