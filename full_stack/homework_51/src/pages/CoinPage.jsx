import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { toast } from 'react-toastify'
import { fetchMarketChart } from '../api/coingecko.js'
import { generateFallbackChart } from '../data/fallbackCoins.js'
import { useMarket } from '../context/MarketContext.jsx'
import CoinIcon from '../components/CoinIcon.jsx'
import PriceChange from '../components/PriceChange.jsx'
import Loader from '../components/Loader.jsx'
import { formatCompact, formatDate, formatPrice } from '../utils/format.js'

const RANGES = [
  { days: 1, label: '24г' },
  { days: 7, label: '7д' },
  { days: 30, label: '30д' },
  { days: 90, label: '90д' },
]

function CoinPage() {
  const { id } = useParams()
  const { coins, loading: marketLoading } = useMarket()
  const coin = coins.find((c) => c.id === id)

  const [days, setDays] = useState(7)
  const [series, setSeries] = useState([])
  const [chartLoading, setChartLoading] = useState(true)
  const [chartFallback, setChartFallback] = useState(false)

  const basePrice = coin?.current_price

  useEffect(() => {
    if (basePrice == null) return
    let ignore = false
    setChartLoading(true)
    fetchMarketChart(id, { days })
      .then((data) => {
        if (ignore) return
        setSeries(data)
        setChartFallback(false)
      })
      .catch((err) => {
        if (ignore) return
        setSeries(generateFallbackChart(basePrice, days))
        setChartFallback(true)
        toast.info(`Графік: ${err.message}. Показано змодельовані дані.`, { toastId: `chart-${id}` })
      })
      .finally(() => {
        if (!ignore) setChartLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [id, days, basePrice])

  const range = useMemo(() => {
    if (!series.length) return null
    const prices = series.map((p) => p.price)
    const first = prices[0]
    const last = prices[prices.length - 1]
    return { min: Math.min(...prices), max: Math.max(...prices), change: ((last - first) / first) * 100 }
  }, [series])

  if (marketLoading && !coin) return <Loader />
  if (!coin) {
    return (
      <section className="card center">
        <h2>Монету «{id}» не знайдено</h2>
        <Link to="/">← До ринку</Link>
      </section>
    )
  }

  const tickPattern = days <= 1 ? 'HH:mm' : 'd MMM'

  return (
    <>
      <Link to="/" className="back">
        ← До ринку
      </Link>
      <section className="card coin-head">
        <CoinIcon coin={coin} size={48} />
        <div>
          <h1>
            {coin.name} <span className="muted">{coin.symbol.toUpperCase()}</span>
          </h1>
          <div className="big-price">
            {formatPrice(coin.current_price)} <PriceChange value={coin.price_change_percentage_24h} />
          </div>
        </div>
      </section>

      <section className="kpis">
        <div className="card kpi">
          <span className="muted">Капіталізація</span>
          <strong>{formatCompact(coin.market_cap)}</strong>
        </div>
        <div className="card kpi">
          <span className="muted">Обсяг 24г</span>
          <strong>{formatCompact(coin.total_volume)}</strong>
        </div>
        <div className="card kpi">
          <span className="muted">Мін / Макс 24г</span>
          <strong>
            {formatPrice(coin.low_24h)} / {formatPrice(coin.high_24h)}
          </strong>
        </div>
      </section>

      <section className="card">
        <div className="toolbar">
          <h2>Динаміка ціни {chartFallback && <span className="tag warn">змодельовано</span>}</h2>
          <div className="segmented">
            {RANGES.map((r) => (
              <button key={r.days} type="button" className={r.days === days ? 'active' : ''} onClick={() => setDays(r.days)}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
        {range && (
          <p className="muted">
            За період: <PriceChange value={range.change} /> · мін {formatPrice(range.min)} · макс {formatPrice(range.max)}
          </p>
        )}
        <div className="chart-box">
          {chartLoading ? (
            <Loader />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7b93ff" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#7b93ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a3142" />
                <XAxis
                  dataKey="time"
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  scale="time"
                  tickFormatter={(t) => formatDate(t, tickPattern)}
                  tick={{ fill: '#9aa3b5', fontSize: 12 }}
                  minTickGap={40}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tickFormatter={(v) => formatCompact(v)}
                  tick={{ fill: '#9aa3b5', fontSize: 12 }}
                  width={64}
                />
                <Tooltip
                  labelFormatter={(t) => formatDate(t, 'd MMMM yyyy, HH:mm')}
                  formatter={(v) => [formatPrice(v), 'Ціна']}
                  contentStyle={{ background: '#1f2430', border: 'none' }}
                />
                <Area type="monotone" dataKey="price" stroke="#7b93ff" strokeWidth={2} fill="url(#priceFill)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </>
  )
}

export default CoinPage
