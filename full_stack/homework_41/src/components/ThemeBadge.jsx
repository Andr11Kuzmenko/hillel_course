import { use } from 'react'
import PropTypes from 'prop-types'
import { ThemeContext } from '../context/ThemeContext.js'

/**
 * На відміну від useContext, хук use() можна викликати умовно
 * (наприклад, всередині if) — тут контекст читається лише коли show = true.
 */
function ThemeBadge({ show }) {
  if (!show) {
    return <span className="muted">Бейдж теми приховано</span>
  }

  const theme = use(ThemeContext)
  return <span className={`badge badge--${theme}`}>Поточна тема: {theme}</span>
}

ThemeBadge.propTypes = {
  show: PropTypes.bool.isRequired,
}

export default ThemeBadge
