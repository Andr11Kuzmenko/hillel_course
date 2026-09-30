import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  CssBaseline,
  Fab,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { getTheme } from './theme.js'
import { CATEGORIES, INITIAL_COURSES } from './data/courses.js'
import AppHeader from './components/AppHeader.jsx'
import NavDrawer from './components/NavDrawer.jsx'
import { PAGES } from './data/pages.jsx'
import CourseGrid from './components/CourseGrid.jsx'
import CoursesTable from './components/CoursesTable.jsx'
import CourseDialog from './components/CourseDialog.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'
import StatsBar from './components/StatsBar.jsx'

export default function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setMode] = useState(null) // null = як у системі
  const currentMode = mode ?? (prefersDark ? 'dark' : 'light')
  const theme = useMemo(() => getTheme(currentMode), [currentMode])

  const [courses, setCourses] = useState(INITIAL_COURSES)
  const [page, setPage] = useState('catalog')
  const [category, setCategory] = useState('Усі')
  const [search, setSearch] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dialog, setDialog] = useState({ open: false, course: null, key: 0 })
  const [toDelete, setToDelete] = useState(null)
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' })

  const notify = (message, severity = 'success') => setSnack({ open: true, message, severity })

  const visibleCourses = useMemo(() => {
    const q = search.trim().toLowerCase()
    return courses.filter(
      (c) =>
        (page !== 'favorites' || c.favorite) &&
        (category === 'Усі' || c.category === category) &&
        (c.title.toLowerCase().includes(q) || c.author.toLowerCase().includes(q)),
    )
  }, [courses, page, category, search])

  const toggleFavorite = (id) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c)))
  }

  const openDialog = (course = null) => setDialog((d) => ({ open: true, course, key: d.key + 1 }))
  const closeDialog = () => setDialog((d) => ({ ...d, open: false }))

  const saveCourse = (course) => {
    if (course.id) {
      setCourses((prev) => prev.map((c) => (c.id === course.id ? course : c)))
      notify(`Курс «${course.title}» оновлено`)
    } else {
      setCourses((prev) => [...prev, { ...course, id: Date.now(), favorite: false }])
      notify(`Курс «${course.title}» додано`)
    }
    closeDialog()
  }

  const confirmDelete = () => {
    setCourses((prev) => prev.filter((c) => c.id !== toDelete.id))
    notify(`Курс «${toDelete.title}» видалено`, 'warning')
    setToDelete(null)
  }

  const handlers = { onToggleFavorite: toggleFavorite, onEdit: openDialog, onDelete: setToDelete }
  const pageTitle = PAGES.find((p) => p.id === page)?.label

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppHeader
          mode={currentMode}
          onToggleMode={() => setMode(currentMode === 'light' ? 'dark' : 'light')}
          onMenuClick={() => setMobileOpen(true)}
          favoritesCount={courses.filter((c) => c.favorite).length}
          onFavoritesClick={() => setPage('favorites')}
          onNotify={notify}
        />
        <NavDrawer
          page={page}
          onChange={setPage}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          categories={CATEGORIES}
          category={category}
          onCategoryChange={setCategory}
        />

        <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
          <Toolbar />
          <Container maxWidth="lg" sx={{ py: 3 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', sm: 'center' }}
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography variant="h4">{pageTitle}</Typography>
                <Typography color="text.secondary">
                  {category === 'Усі' ? 'Усі категорії' : `Категорія: ${category}`}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  placeholder="Пошук курсу або автора"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ flexGrow: 1 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => openDialog()}
                  sx={{ display: { xs: 'none', sm: 'inline-flex' }, whiteSpace: 'nowrap' }}
                >
                  Додати курс
                </Button>
              </Stack>
            </Stack>

            <StatsBar courses={courses} />

            {page === 'table' ? (
              <CoursesTable courses={visibleCourses} {...handlers} />
            ) : (
              <CourseGrid courses={visibleCourses} {...handlers} />
            )}
          </Container>
        </Box>
      </Box>

      {/* Кнопка додавання для мобільних */}
      <Fab
        color="primary"
        aria-label="Додати курс"
        onClick={() => openDialog()}
        sx={{ position: 'fixed', right: 16, bottom: 16, display: { sm: 'none' } }}
      >
        <AddIcon />
      </Fab>

      <CourseDialog
        key={dialog.key}
        open={dialog.open}
        course={dialog.course}
        categories={CATEGORIES}
        onClose={closeDialog}
        onSave={saveCourse}
      />
      <ConfirmDialog course={toDelete} onCancel={() => setToDelete(null)} onConfirm={confirmDelete} />

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={(_, reason) => reason !== 'clickaway' && setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  )
}
