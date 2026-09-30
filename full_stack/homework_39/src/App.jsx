import TaskList from './components/TaskList.jsx'
import Counter from './components/Counter.jsx'
import './App.css'

function App() {
  return (
    <div className="container">
      <h1>Stateful vs Stateless компоненти</h1>
      <p className="muted">
        <strong>TaskList</strong> і <strong>Counter</strong> — stateful (керують станом через useState).{' '}
        <strong>TaskItem</strong>, <strong>TaskStats</strong> і <strong>CounterDisplay</strong> — stateless
        (лише відображають дані з props).
      </p>
      <TaskList />
      <Counter />
    </div>
  )
}

export default App
