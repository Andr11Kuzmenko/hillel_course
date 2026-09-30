import PropTypes from 'prop-types'
import './Input.css'

function Input({ label, name, type = 'text', placeholder = 'Введіть значення', value, onChange, required = false }) {
  return (
    <label className="field">
      {label && <span className="field__label">{label}</span>}
      <input
        className="field__input"
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </label>
  )
}

Input.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'tel', 'search']),
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  required: PropTypes.bool,
}

export default Input
