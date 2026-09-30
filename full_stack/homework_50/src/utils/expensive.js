// Навмисно "дорога" функція: імітує складні обчислення (наприклад, розрахунок
// персональної знижки або рейтингу). Без useMemo вона виконувалась би на КОЖЕН рендер.
export function slowScore(product) {
  let acc = 0
  for (let i = 0; i < 300; i++) {
    acc += Math.sqrt(product.price * i + product.rating) % 7
  }
  return acc
}

export function filterAndSortProducts(products, { query, category, sortBy }) {
  const q = query.trim().toLowerCase()

  const filtered = products.filter((p) => {
    if (category !== 'all' && p.category !== category) return false
    if (q && !p.title.toLowerCase().includes(q)) return false
    return true
  })

  const withScore = filtered.map((p) => ({ ...p, score: Math.round(slowScore(p) * 10) / 10 }))

  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
    score: (a, b) => b.score - a.score,
    title: (a, b) => a.title.localeCompare(b.title, 'uk'),
  }

  return withScore.sort(sorters[sortBy] ?? sorters['price-asc'])
}

export function computeStats(products) {
  if (products.length === 0) return { count: 0, avgPrice: 0, avgRating: 0, totalStock: 0 }
  const sum = products.reduce(
    (acc, p) => {
      acc.price += p.price
      acc.rating += p.rating
      acc.stock += p.stock
      return acc
    },
    { price: 0, rating: 0, stock: 0 },
  )
  return {
    count: products.length,
    avgPrice: sum.price / products.length,
    avgRating: sum.rating / products.length,
    totalStock: sum.stock,
  }
}
