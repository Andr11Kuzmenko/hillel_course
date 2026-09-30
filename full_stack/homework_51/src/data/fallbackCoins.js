// Резервні дані на випадок недоступності API (ліміт запитів, офлайн тощо)
export const FALLBACK_COINS = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 64250, market_cap: 1265000000000, total_volume: 28500000000, price_change_percentage_24h: 1.84, price_change_percentage_7d_in_currency: 4.2, high_24h: 64900, low_24h: 62800, circulating_supply: 19700000, image: '' },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3120, market_cap: 375000000000, total_volume: 14200000000, price_change_percentage_24h: -0.72, price_change_percentage_7d_in_currency: 2.1, high_24h: 3180, low_24h: 3060, circulating_supply: 120200000, image: '' },
  { id: 'tether', symbol: 'usdt', name: 'Tether', current_price: 1, market_cap: 118000000000, total_volume: 45000000000, price_change_percentage_24h: 0.01, price_change_percentage_7d_in_currency: 0.02, high_24h: 1.001, low_24h: 0.999, circulating_supply: 118000000000, image: '' },
  { id: 'binancecoin', symbol: 'bnb', name: 'BNB', current_price: 575, market_cap: 84000000000, total_volume: 1600000000, price_change_percentage_24h: 0.95, price_change_percentage_7d_in_currency: -1.3, high_24h: 582, low_24h: 566, circulating_supply: 146000000, image: '' },
  { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 148, market_cap: 69000000000, total_volume: 2900000000, price_change_percentage_24h: 3.4, price_change_percentage_7d_in_currency: 8.9, high_24h: 151, low_24h: 141, circulating_supply: 467000000, image: '' },
  { id: 'ripple', symbol: 'xrp', name: 'XRP', current_price: 0.58, market_cap: 32500000000, total_volume: 1200000000, price_change_percentage_24h: -1.2, price_change_percentage_7d_in_currency: -3.5, high_24h: 0.6, low_24h: 0.57, circulating_supply: 56000000000, image: '' },
  { id: 'cardano', symbol: 'ada', name: 'Cardano', current_price: 0.44, market_cap: 15600000000, total_volume: 380000000, price_change_percentage_24h: 0.6, price_change_percentage_7d_in_currency: 1.1, high_24h: 0.45, low_24h: 0.43, circulating_supply: 35500000000, image: '' },
  { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', current_price: 0.12, market_cap: 17400000000, total_volume: 950000000, price_change_percentage_24h: 2.7, price_change_percentage_7d_in_currency: 6.4, high_24h: 0.125, low_24h: 0.116, circulating_supply: 145000000000, image: '' },
  { id: 'polkadot', symbol: 'dot', name: 'Polkadot', current_price: 6.1, market_cap: 8800000000, total_volume: 210000000, price_change_percentage_24h: -2.1, price_change_percentage_7d_in_currency: -4.8, high_24h: 6.3, low_24h: 6.0, circulating_supply: 1440000000, image: '' },
  { id: 'litecoin', symbol: 'ltc', name: 'Litecoin', current_price: 72, market_cap: 5400000000, total_volume: 340000000, price_change_percentage_24h: 0.3, price_change_percentage_7d_in_currency: 1.9, high_24h: 73.5, low_24h: 70.8, circulating_supply: 75000000, image: '' },
]

// Генерує правдоподібний ряд цін (випадкове блукання) для графіка, якщо API недоступне
export function generateFallbackChart(basePrice, days) {
  const points = Math.min(days * 24, 24 * 90) / (days > 30 ? 24 : 1)
  const step = (days * 24 * 60 * 60 * 1000) / points
  const now = Date.now()
  let price = basePrice * 0.92
  return Array.from({ length: Math.round(points) }, (_, i) => {
    price = Math.max(price * (1 + (Math.random() - 0.48) * 0.02), basePrice * 0.5)
    return { time: now - (points - i) * step, price }
  })
}
