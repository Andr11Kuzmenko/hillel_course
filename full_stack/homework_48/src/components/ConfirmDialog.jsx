import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

export default function ConfirmDialog({ course, onCancel, onConfirm }) {
  return (
    <Dialog open={Boolean(course)} onClose={onCancel}>
      <DialogTitle>Видалити курс?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Курс «{course?.title}» буде видалено без можливості відновлення.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Скасувати</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Видалити
        </Button>
      </DialogActions>
    </Dialog>
  )
}
