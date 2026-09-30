import { memo } from 'react'
import PropTypes from 'prop-types'
import { useRenderCount } from '../hooks/useRenderCount.js'
import RenderBadge from './RenderBadge.jsx'

function Stats({ stats, computeTime, favoritesCount }) {
  const renders = useRenderCount('Stats', true)

  return (
    <section className="panel stats">
      <header className="panel-header">
        <h2>Статистика</h2>
        <RenderBadge count={renders} />
      </header>
      <dl>
        <div>
          <dt>Знайдено</dt>
          <dd>{stats.count}</dd>
        </div>
        <div>
          <dt>Середня ціна</dt>
          <dd>{stats.avgPrice.toFixed(2)} ₴</dd>
        </div>
        <div>
          <dt>Середній рейтинг</dt>
          <dd>{stats.avgRating.toFixed(2)}</dd>
        </div>
        <div>
          <dt>На складі</dt>
          <dd>{stats.totalStock}</dd>
        </div>
        <div>
          <dt>Обране</dt>
          <dd>{favoritesCount}</dd>
        </div>
        <div>
          <dt>Час фільтрації</dt>
          <dd>{computeTime.toFixed(1)} мс</dd>
        </div>
      </dl>
    </section>
  )
}

Stats.propTypes = {
  stats: PropTypes.shape({
    count: PropTypes.number,
    avgPrice: PropTypes.number,
    avgRating: PropTypes.number,
    totalStock: PropTypes.number,
  }).isRequired,
  computeTime: PropTypes.number.isRequired,
  favoritesCount: PropTypes.number.isRequired,
}

export default memo(Stats)
