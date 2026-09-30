import PropTypes from 'prop-types'
import { useRenderCount } from '../hooks/useRenderCount.js'
import RenderBadge from './RenderBadge.jsx'

// НЕ мемоізований компонент — для порівняння: він рендериться разом з App завжди.
function Counter({ count, onIncrement, theme, onToggleTheme }) {
  const renders = useRenderCount('Counter', true)

  return (
    <section className="panel counter">
      <header className="panel-header">
        <h2>Незалежний стан</h2>
        <RenderBadge count={renders} />
      </header>
      <p>
        Лічильник і тема не впливають на список товарів. Натисніть кнопки та подивіться на
        лічильники рендерів: список, фільтри й статистика не перерендерюються.
      </p>
      <div className="filters-row">
        <button type="button" onClick={onIncrement}>
          Лічильник: {count}
        </button>
        <button type="button" onClick={onToggleTheme}>
          Тема: {theme === 'light' ? '☀️ світла' : '🌙 темна'}
        </button>
      </div>
    </section>
  )
}

Counter.propTypes = {
  count: PropTypes.number.isRequired,
  onIncrement: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
}

export default Counter
