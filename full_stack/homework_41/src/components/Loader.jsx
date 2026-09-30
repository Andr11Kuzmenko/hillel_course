import PropTypes from 'prop-types'

function Loader({ text = 'Завантаження...' }) {
  return (
    <div className="loader">
      <span className="loader__spinner" />
      <span>{text}</span>
    </div>
  )
}

Loader.propTypes = {
  text: PropTypes.string,
}

export default Loader
