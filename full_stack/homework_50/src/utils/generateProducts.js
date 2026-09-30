export const CATEGORIES = ['Електроніка', 'Книги', 'Одяг', 'Дім', 'Спорт', 'Іграшки', 'Краса']

const ADJECTIVES = ['Супер', 'Мега', 'Ультра', 'Компактний', 'Преміум', 'Еко', 'Смарт', 'Класичний']
const NOUNS = ['гаджет', 'набір', 'комплект', 'девайс', 'аксесуар', 'предмет', 'виріб', 'пристрій']

// Детермінований генератор псевдовипадкових чисел (mulberry32),
// щоб при кожному запуску список був однаковим.
function createRandom(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function generateProducts(count = 5000, seed = 42) {
  const random = createRandom(seed)
  const pick = (arr) => arr[Math.floor(random() * arr.length)]

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `${pick(ADJECTIVES)} ${pick(NOUNS)} #${i + 1}`,
    category: pick(CATEGORIES),
    price: Math.round((5 + random() * 995) * 100) / 100,
    rating: Math.round((1 + random() * 4) * 10) / 10,
    stock: Math.floor(random() * 200),
  }))
}
