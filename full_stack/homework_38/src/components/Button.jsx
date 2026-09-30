import PropTypes from 'prop-types'
import './Button.css'

function Button({ text = 'Кнопка', type = 'button', variant = 'primary', disabled = false, onClick }) {
  return (
    <button
      type={type}
      className={`button button--${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

Button.propTypes = {
  text: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
}

export default Button
