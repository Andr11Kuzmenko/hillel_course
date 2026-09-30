import { useRef, useState } from 'react'

/**
 * Неконтрольований компонент для порівняння: значення зберігається в DOM,
 * а React читає його лише в момент відправки через useRef.
 */
function UncontrolledForm() {
  const inputRef = useRef(null)
  const [submittedValue, setSubmittedValue] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmittedValue(inputRef.current.value)
    inputRef.current.value = ''
    inputRef.current.focus()
  }

  return (
    <section className="card">
      <h2>Неконтрольований компонент (useRef)</h2>
      <form className="inline-form" onSubmit={handleSubmit}>
        <input className="input" ref={inputRef} defaultValue="" placeholder="Введіть текст" />
        <button className="btn" type="submit">
          Прочитати значення
        </button>
      </form>
      {submittedValue && (
        <p>
          Отримане значення: <strong>{submittedValue}</strong>
        </p>
      )}
    </section>
  )
}

export default UncontrolledForm
