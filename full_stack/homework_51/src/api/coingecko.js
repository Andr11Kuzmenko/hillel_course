import axios from 'axios'

// Екземпляр axios з базовою адресою та таймаутом
const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 8000,
  headers: { Accept: 'application/json' },
})

// Інтерцептор: перетворює помилки на зрозумілі повідомлення
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Не вдалося отримати дані'
    if (error.code === 'ECONNABORTED') message = 'Перевищено час очікування відповіді'
    else if (error.response?.status === 429) message = 'Перевищено ліміт запитів до CoinGecko'
    else if (error.response) message = `Помилка сервера: ${error.response.status}`
    else if (error.request) message = 'Немає з\'єднання з сервером'
    return Promise.reject(new Error(message))
  },
)

export async function fetchMarkets({ currency = 'usd', perPage = 20 } = {}) {
  const { data } = await api.get('/coins/markets', {
    params: {
      vs_currency: currency,
      order: 'market_cap_desc',
      per_page: perPage,
      page: 1,
      sparkline: false,
      price_change_percentage: '24h,7d',
    },
  })
  return data
}

export async function fetchMarketChart(id, { currency = 'usd', days = 7 } = {}) {
  const { data } = await api.get(`/coins/${id}/market_chart`, {
    params: { vs_currency: currency, days },
  })
  // [[timestamp, price], ...] -> [{ time, price }]
  return data.prices.map(([time, price]) => ({ time, price }))
}

export default api
