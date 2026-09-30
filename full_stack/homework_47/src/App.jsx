import { useState } from 'react'
import Form from './components/Form.jsx'
import SubmittedData from './components/SubmittedData.jsx'

export default function App() {
  const [submitted, setSubmitted] = useState(null)

  return (
    <div className="app">
      <h1>Formik + Yup</h1>
      <Form onSuccess={setSubmitted} />
      {submitted && <SubmittedData data={submitted} onClose={() => setSubmitted(null)} />}
    </div>
  )
}
