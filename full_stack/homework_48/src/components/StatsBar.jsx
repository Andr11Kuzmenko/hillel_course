import Grid from '@mui/material/Grid2'
import { Paper, Typography } from '@mui/material'

export default function StatsBar({ courses }) {
  const total = courses.length
  const avgRating = total ? courses.reduce((s, c) => s + c.rating, 0) / total : 0
  const avgPrice = total ? courses.reduce((s, c) => s + c.price, 0) / total : 0
  const favorites = courses.filter((c) => c.favorite).length

  const items = [
    { label: 'Курсів', value: total },
    { label: 'Обраних', value: favorites },
    { label: 'Середній рейтинг', value: avgRating.toFixed(1) },
    { label: 'Середня ціна', value: `${Math.round(avgPrice).toLocaleString('uk-UA')} ₴` },
  ]

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {items.map((item) => (
        <Grid key={item.label} size={{ xs: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {item.label}
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {item.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}
