import TodoForm from './components/TodoForm.jsx'
import FilterBar from './components/FilterBar.jsx'
import TodoList from './components/TodoList.jsx'
import TodoStats from './components/TodoStats.jsx'

// До рефакторингу App зберігав todos і filter у useState та передавав
// їх і колбеки через props. Тепер стан живе у Redux store, а кожен
// компонент сам бере потрібні дані через useSelector / useDispatch.
export default function App() {
  return (
    <div className="app">
      <h1>Todo + Redux Toolkit</h1>
      <TodoForm />
      <FilterBar />
      <TodoList />
      <TodoStats />
    </div>
  )
}
