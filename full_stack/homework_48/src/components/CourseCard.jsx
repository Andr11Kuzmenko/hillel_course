import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Rating,
  Stack,
  Tooltip,
  Typography,
  Avatar,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const CATEGORY_COLORS = { Frontend: 'primary', Backend: 'success', Design: 'secondary', DevOps: 'warning' }

export default function CourseCard({ course, onToggleFavorite, onEdit, onDelete }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{course.title[0]}</Avatar>}
        action={
          <Tooltip title={course.favorite ? 'Прибрати з обраних' : 'Додати до обраних'}>
            <IconButton onClick={() => onToggleFavorite(course.id)} color="secondary">
              {course.favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
        }
        title={<Typography variant="h6">{course.title}</Typography>}
        subheader={course.author}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} alignItems="center">
          <Chip label={course.category} color={CATEGORY_COLORS[course.category] ?? 'default'} size="small" />
          <Chip label={`${course.lessons} уроків`} size="small" variant="outlined" />
        </Stack>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating value={course.rating} precision={0.1} readOnly size="small" />
          <Typography variant="body2" color="text.secondary">
            {course.rating.toFixed(1)}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Typography variant="h6" color="primary">
          {course.price.toLocaleString('uk-UA')} ₴
        </Typography>
        <Box>
          <Button size="small" startIcon={<EditIcon />} onClick={() => onEdit(course)}>
            Змінити
          </Button>
          <IconButton size="small" color="error" onClick={() => onDelete(course)} aria-label="Видалити">
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  )
}
