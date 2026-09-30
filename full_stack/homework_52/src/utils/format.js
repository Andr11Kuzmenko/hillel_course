const currency = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'USD' })

export const formatPrice = (value) => currency.format(value ?? 0)
