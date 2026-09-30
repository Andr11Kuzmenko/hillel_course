import { useState } from 'react'
import CounterDisplay from './CounterDisplay.jsx'

/** Stateful-компонент: лічильник зі станом count та кроком step. */
function Counter() {
  const [count, setCount] = useState(0)
  const [step, setStep] = useState(1)

  return (
    <section className="card">
      <h2>Лічильник (Stateful)</h2>
      <CounterDisplay value={count} label="Поточне значення" />

      <div className="counter-controls">
        <button className="btn" type="button" onClick={() => setCount((c) => c - step)}>
          −{step}
        </button>
        <button className="btn" type="button" onClick={() => setCount((c) => c + step)}>
          +{step}
        </button>
        <button className="btn btn--danger" type="button" onClick={() => setCount(0)}>
          Скинути
        </button>
        <label>
          Крок:{' '}
          <select value={step} onChange={(event) => setStep(Number(event.target.value))}>
            {[1, 5, 10].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  )
}

export default Counter
