import PropTypes from 'prop-types'

function ResponseView({ data }) {
  return (
    <div className="response">
      <h3>Відповідь сервера (id: {data.id})</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

ResponseView.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
}

export default ResponseView
