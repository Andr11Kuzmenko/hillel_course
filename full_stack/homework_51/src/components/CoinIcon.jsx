import PropTypes from 'prop-types'

function CoinIcon({ coin, size = 28 }) {
  if (coin.image) {
    return <img src={coin.image} alt={coin.name} width={size} height={size} className="coin-icon" />
  }
  return (
    <span className="coin-icon placeholder" style={{ width: size, height: size }}>
      {coin.symbol?.[0]?.toUpperCase()}
    </span>
  )
}

CoinIcon.propTypes = {
  coin: PropTypes.shape({ image: PropTypes.string, name: PropTypes.string, symbol: PropTypes.string }).isRequired,
  size: PropTypes.number,
}

export default CoinIcon
