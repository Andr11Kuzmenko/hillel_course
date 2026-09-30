import Grid from '@mui/material/Grid2'
import { Alert } from '@mui/material'
import CourseCard from './CourseCard.jsx'

export default function CourseGrid({ courses, ...handlers }) {
  if (courses.length === 0) {
    return <Alert severity="info">Курсів не знайдено</Alert>
  }

  return (
    <Grid container spacing={3}>
      {courses.map((course) => (
        <Grid key={course.id} size={{ xs: 12, sm: 6, lg: 4 }}>
          <CourseCard course={course} {...handlers} />
        </Grid>
      ))}
    </Grid>
  )
}
