import { format, formatDistanceToNow } from 'date-fns'
import { uk } from 'date-fns/locale'

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
const usdSmall = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 6 })
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 })

export const formatPrice = (value) => (Math.abs(value) < 1 ? usdSmall : usd).format(value ?? 0)
export const formatCompact = (value) => `$${compact.format(value ?? 0)}`
export const formatPercent = (value) => `${value > 0 ? '+' : ''}${(value ?? 0).toFixed(2)}%`

export const formatDate = (date, pattern = 'd MMM yyyy') => format(new Date(date), pattern, { locale: uk })
export const formatRelative = (date) => formatDistanceToNow(new Date(date), { addSuffix: true, locale: uk })
