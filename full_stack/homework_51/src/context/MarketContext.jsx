import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { fetchMarkets } from '../api/coingecko.js'
import { FALLBACK_COINS } from '../data/fallbackCoins.js'

const MarketContext = createContext(null)

export function MarketProvider({ children }) {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFallback, setIsFallback] = useState(false)
  const [updatedAt, setUpdatedAt] = useState(null)

  const load = useCallback(async ({ silent = false } = {}) => {
    setLoading(true)
    try {
      const data = await fetchMarkets({ perPage: 30 })
      setCoins(data)
      setIsFallback(false)
      if (!silent) toast.success('Курси оновлено', { toastId: 'markets-ok' })
    } catch (err) {
      setCoins((prev) => (prev.length ? prev : FALLBACK_COINS))
      setIsFallback(true)
      toast.warn(`${err.message}. Показано резервні дані.`, { toastId: 'markets-fail' })
    } finally {
      setUpdatedAt(Date.now())
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load({ silent: true })
  }, [load])

  const value = useMemo(
    () => ({ coins, loading, isFallback, updatedAt, refresh: load }),
    [coins, loading, isFallback, updatedAt, load],
  )

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>
}

MarketProvider.propTypes = { children: PropTypes.node }

// eslint-disable-next-line react-refresh/only-export-components
export function useMarket() {
  const ctx = useContext(MarketContext)
  if (!ctx) throw new Error('useMarket must be used inside MarketProvider')
  return ctx
}
