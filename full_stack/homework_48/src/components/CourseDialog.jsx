import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  InputAdornment,
} from '@mui/material'

const EMPTY = { title: '', author: '', category: '', price: '', lessons: '', rating: '5' }

function validate(v) {
  const errors = {}
  if (v.title.trim().length < 3) errors.title = 'Мінімум 3 символи'
  if (!v.author.trim()) errors.author = 'Вкажіть автора'
  if (!v.category) errors.category = 'Оберіть категорію'
  if (!(Number(v.price) > 0)) errors.price = 'Ціна має бути більшою за 0'
  if (!Number.isInteger(Number(v.lessons)) || Number(v.lessons) < 1) errors.lessons = 'Ціле число ≥ 1'
  const r = Number(v.rating)
  if (Number.isNaN(r) || r < 0 || r > 5) errors.rating = 'Від 0 до 5'
  return errors
}

// Діалог монтується заново для кожного відкриття (key у батьківському компоненті),
// тож початкові значення можна брати прямо з props.
export default function CourseDialog({ open, course, categories, onClose, onSave }) {
  const [values, setValues] = useState(() =>
    course ? { ...course, price: String(course.price), lessons: String(course.lessons), rating: String(course.rating) } : EMPTY,
  )
  const [touched, setTouched] = useState({})
  const errors = validate(values)
  const isValid = Object.keys(errors).length === 0

  const handleChange = (e) => setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  const handleBlur = (e) => setTouched((prev) => ({ ...prev, [e.target.name]: true }))
  const fieldProps = (name) => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: Boolean(touched[name] && errors[name]),
    helperText: touched[name] ? errors[name] : ' ',
    fullWidth: true,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValid) {
      setTouched(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])))
      return
    }
    onSave({
      ...course,
      title: values.title.trim(),
      author: values.author.trim(),
      category: values.category,
      price: Number(values.price),
      lessons: Number(values.lessons),
      rating: Number(values.rating),
    })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ component: 'form', onSubmit: handleSubmit, noValidate: true }}>
      <DialogTitle>{course ? 'Редагувати курс' : 'Новий курс'}</DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ pt: 1 }}>
          <TextField label="Назва" autoFocus {...fieldProps('title')} />
          <TextField label="Автор" {...fieldProps('author')} />
          <TextField select label="Категорія" {...fieldProps('category')}>
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Ціна"
              type="number"
              {...fieldProps('price')}
              slotProps={{ input: { endAdornment: <InputAdornment position="end">₴</InputAdornment> } }}
            />
            <TextField label="Уроків" type="number" {...fieldProps('lessons')} />
            <TextField label="Рейтинг" type="number" {...fieldProps('rating')} slotProps={{ htmlInput: { step: 0.1, min: 0, max: 5 } }} />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Скасувати</Button>
        <Button type="submit" variant="contained" disabled={!isValid}>
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  )
}
