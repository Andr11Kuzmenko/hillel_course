import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { toast } from 'react-toastify'
import { useMarket } from '../context/MarketContext.jsx'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import HoldingForm from '../components/HoldingForm.jsx'
import PriceChange from '../components/PriceChange.jsx'
import { formatDate, formatPrice, formatRelative } from '../utils/format.js'

const COLORS = ['#7b93ff', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7', '#ec4899', '#84cc16']

function PortfolioPage() {
  const { coins } = useMarket()
  const [holdings, setHoldings] = useLocalStorage('hw51-portfolio', [])

  const rows = useMemo(
    () =>
      holdings.map((h) => {
        const coin = coins.find((c) => c.id === h.coinId)
        const price = coin?.current_price ?? h.buyPrice
        const value = price * h.amount
        const cost = h.buyPrice * h.amount
        return { ...h, coin, price, value, cost, pnl: value - cost, pnlPct: ((value - cost) / cost) * 100 }
      }),
    [holdings, coins],
  )

  const totals = useMemo(() => {
    const value = rows.reduce((s, r) => s + r.value, 0)
    const cost = rows.reduce((s, r) => s + r.cost, 0)
    return { value, cost, pnl: value - cost, pnlPct: cost ? ((value - cost) / cost) * 100 : 0 }
  }, [rows])

  const allocation = useMemo(() => {
    const map = new Map()
    rows.forEach((r) => {
      const name = r.coin?.symbol.toUpperCase() ?? r.coinId
      map.set(name, (map.get(name) ?? 0) + r.value)
    })
    return [...map].map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
  }, [rows])

  const handleAdd = (holding) => {
    setHoldings((prev) => [holding, ...prev])
    const coin = coins.find((c) => c.id === holding.coinId)
    toast.success(`${coin?.name ?? holding.coinId} додано в портфель`)
  }

  const handleRemove = (id) => {
    setHoldings((prev) => prev.filter((h) => h.id !== id))
    toast.info('Позицію видалено')
  }

  return (
    <>
      <section className="kpis">
        <div className="card kpi">
          <span className="muted">Вартість портфеля</span>
          <strong>{formatPrice(totals.value)}</strong>
        </div>
        <div className="card kpi">
          <span className="muted">Вкладено</span>
          <strong>{formatPrice(totals.cost)}</strong>
        </div>
        <div className="card kpi">
          <span className="muted">Прибуток / збиток</span>
          <strong className={totals.pnl >= 0 ? 'up' : 'down'}>
            {formatPrice(totals.pnl)} <PriceChange value={totals.pnlPct} />
          </strong>
        </div>
      </section>

      <div className="grid-2">
        <section className="card">
          <h2>Нова позиція</h2>
          <HoldingForm coins={coins} onAdd={handleAdd} />
        </section>
        <section className="card">
          <h2>Розподіл активів</h2>
          {allocation.length ? (
            <div className="chart-box">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={allocation} dataKey="value" nameKey="name" innerRadius="50%" outerRadius="80%" paddingAngle={2}>
                    {allocation.map((a, i) => (
                      <Cell key={a.name} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatPrice(v)} contentStyle={{ background: '#1f2430', border: 'none' }} itemStyle={{ color: '#e8ebf2' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="muted">Додайте першу позицію, щоб побачити діаграму.</p>
          )}
        </section>
      </div>

      <section className="card">
        <h2>Позиції</h2>
        {rows.length === 0 ? (
          <p className="muted">Портфель порожній.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Монета</th>
                  <th className="num">Кількість</th>
                  <th className="num hide-sm">Купівля</th>
                  <th className="num">Вартість</th>
                  <th className="num">P/L</th>
                  <th className="hide-sm">Дата</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <Link to={`/coin/${r.coinId}`}>{r.coin?.name ?? r.coinId}</Link>
                      {r.note && <div className="muted small">{r.note}</div>}
                    </td>
                    <td className="num">{r.amount}</td>
                    <td className="num hide-sm">{formatPrice(r.buyPrice)}</td>
                    <td className="num">{formatPrice(r.value)}</td>
                    <td className="num">
                      <PriceChange value={r.pnlPct} />
                    </td>
                    <td className="hide-sm">
                      {formatDate(r.date)}
                      <div className="muted small">додано {formatRelative(r.createdAt)}</div>
                    </td>
                    <td>
                      <button type="button" className="ghost" aria-label="Видалити" onClick={() => handleRemove(r.id)}>
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

export default PortfolioPage
