import FeedbackForm from './components/FeedbackForm.jsx'
import UncontrolledForm from './components/UncontrolledForm.jsx'
import './App.css'

function App() {
  return (
    <div className="container">
      <h1>React під контролем: від стану до запитів</h1>
      <FeedbackForm />
      <UncontrolledForm />
    </div>
  )
}

export default App
