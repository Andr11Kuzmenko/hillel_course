import { useMemo, useState } from 'react'
import {
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

const COLUMNS = [
  { id: 'title', label: 'Назва' },
  { id: 'author', label: 'Автор' },
  { id: 'category', label: 'Категорія' },
  { id: 'lessons', label: 'Уроків', numeric: true },
  { id: 'rating', label: 'Рейтинг', numeric: true },
  { id: 'price', label: 'Ціна, ₴', numeric: true },
]

export default function CoursesTable({ courses, onToggleFavorite, onEdit, onDelete }) {
  const [orderBy, setOrderBy] = useState('title')
  const [order, setOrder] = useState('asc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const sorted = useMemo(() => {
    const dir = order === 'asc' ? 1 : -1
    return [...courses].sort((a, b) => {
      const x = a[orderBy]
      const y = b[orderBy]
      return (typeof x === 'number' ? x - y : String(x).localeCompare(String(y), 'uk')) * dir
    })
  }, [courses, order, orderBy])

  const handleSort = (id) => {
    setOrder(orderBy === id && order === 'asc' ? 'desc' : 'asc')
    setOrderBy(id)
  }

  const maxPage = Math.max(0, Math.ceil(sorted.length / rowsPerPage) - 1)
  const currentPage = Math.min(page, maxPage)
  const rows = sorted.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table size="small" sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell />
              {COLUMNS.map((col) => (
                <TableCell key={col.id} align={col.numeric ? 'right' : 'left'}>
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : 'asc'}
                    onClick={() => handleSort(col.id)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell align="right">Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell padding="checkbox">
                  <IconButton size="small" color="secondary" onClick={() => onToggleFavorite(c.id)}>
                    {c.favorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                  </IconButton>
                </TableCell>
                <TableCell>{c.title}</TableCell>
                <TableCell>{c.author}</TableCell>
                <TableCell>
                  <Chip label={c.category} size="small" variant="outlined" />
                </TableCell>
                <TableCell align="right">{c.lessons}</TableCell>
                <TableCell align="right">{c.rating.toFixed(1)}</TableCell>
                <TableCell align="right">{c.price.toLocaleString('uk-UA')}</TableCell>
                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                  <IconButton size="small" onClick={() => onEdit(c)} aria-label="Редагувати">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => onDelete(c)} aria-label="Видалити">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={COLUMNS.length + 2} align="center">
                  Курсів не знайдено
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={sorted.length}
        page={currentPage}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(Number(e.target.value))
          setPage(0)
        }}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Рядків на сторінці:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} з ${count}`}
      />
    </Paper>
  )
}
