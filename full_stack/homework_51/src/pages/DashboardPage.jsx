import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useMarket } from '../context/MarketContext.jsx'
import CoinIcon from '../components/CoinIcon.jsx'
import PriceChange from '../components/PriceChange.jsx'
import Loader from '../components/Loader.jsx'
import { formatCompact, formatPercent, formatPrice } from '../utils/format.js'

const SORTS = {
  market_cap: (a, b) => b.market_cap - a.market_cap,
  price: (a, b) => b.current_price - a.current_price,
  change: (a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0),
  volume: (a, b) => b.total_volume - a.total_volume,
}

function DashboardPage() {
  const { coins, loading } = useMarket()
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('market_cap')
  const navigate = useNavigate()

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return coins
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
      .sort(SORTS[sortBy])
  }, [coins, query, sortBy])

  const summary = useMemo(() => {
    const totalCap = coins.reduce((s, c) => s + (c.market_cap ?? 0), 0)
    const sorted = [...coins].sort(SORTS.change)
    return { totalCap, best: sorted[0], worst: sorted[sorted.length - 1] }
  }, [coins])

  const changeChart = useMemo(
    () =>
      coins.slice(0, 12).map((c) => ({
        name: c.symbol.toUpperCase(),
        change: Number((c.price_change_percentage_24h ?? 0).toFixed(2)),
      })),
    [coins],
  )

  if (loading && coins.length === 0) return <Loader />

  return (
    <>
      <section className="kpis">
        <div className="card kpi">
          <span className="muted">Капіталізація (топ {coins.length})</span>
          <strong>{formatCompact(summary.totalCap)}</strong>
        </div>
        {summary.best && (
          <div className="card kpi">
            <span className="muted">Лідер зростання 24г</span>
            <strong>
              {summary.best.name} <PriceChange value={summary.best.price_change_percentage_24h} />
            </strong>
          </div>
        )}
        {summary.worst && (
          <div className="card kpi">
            <span className="muted">Найбільше падіння 24г</span>
            <strong>
              {summary.worst.name} <PriceChange value={summary.worst.price_change_percentage_24h} />
            </strong>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Зміна ціни за 24 години (топ-12)</h2>
        <div className="chart-box small">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={changeChart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a3142" />
              <XAxis dataKey="name" tick={{ fill: '#9aa3b5', fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `${v}%`} tick={{ fill: '#9aa3b5', fontSize: 12 }} width={48} />
              <Tooltip formatter={(v) => formatPercent(v)} contentStyle={{ background: '#1f2430', border: 'none' }} />
              <Bar dataKey="change" radius={[4, 4, 0, 0]}>
                {changeChart.map((d) => (
                  <Cell key={d.name} fill={d.change >= 0 ? '#22c55e' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card">
        <div className="toolbar">
          <h2>Ринок</h2>
          <input type="search" placeholder="Пошук монети..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="market_cap">За капіталізацією</option>
            <option value="price">За ціною</option>
            <option value="change">За зміною 24г</option>
            <option value="volume">За обсягом</option>
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Монета</th>
                <th className="num">Ціна</th>
                <th className="num">24г</th>
                <th className="num hide-sm">Капіталізація</th>
                <th className="num hide-sm">Обсяг</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((c) => (
                <tr key={c.id} onClick={() => navigate(`/coin/${c.id}`)} className="clickable">
                  <td>
                    <Link to={`/coin/${c.id}`} className="coin-cell" onClick={(e) => e.stopPropagation()}>
                      <CoinIcon coin={c} />
                      <span>{c.name}</span>
                      <span className="muted">{c.symbol.toUpperCase()}</span>
                    </Link>
                  </td>
                  <td className="num">{formatPrice(c.current_price)}</td>
                  <td className="num">
                    <PriceChange value={c.price_change_percentage_24h} />
                  </td>
                  <td className="num hide-sm">{formatCompact(c.market_cap)}</td>
                  <td className="num hide-sm">{formatCompact(c.total_volume)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 && <p className="muted center">Нічого не знайдено</p>}
        </div>
      </section>
    </>
  )
}

export default DashboardPage
