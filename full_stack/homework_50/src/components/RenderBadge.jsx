import PropTypes from 'prop-types'

function RenderBadge({ count }) {
  return (
    <span className="render-badge" title="Кількість рендерів компонента">
      рендерів: {count}
    </span>
  )
}

RenderBadge.propTypes = { count: PropTypes.number.isRequired }

export default RenderBadge
