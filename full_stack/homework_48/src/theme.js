import { createTheme } from '@mui/material/styles'

// Кастомна тема: власна палітра для світлого та темного режимів,
// типографіка, скруглення та перевизначення стилів окремих компонентів.
export function getTheme(mode) {
  const isDark = mode === 'dark'

  return createTheme({
    palette: {
      mode,
      primary: { main: isDark ? '#8ab4ff' : '#2f5bd3' },
      secondary: { main: isDark ? '#ffb86b' : '#e8710a' },
      background: isDark
        ? { default: '#121418', paper: '#1c1f26' }
        : { default: '#f4f6fb', paper: '#ffffff' },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: ({ theme }) => ({ borderBottom: `1px solid ${theme.palette.divider}` }),
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            transition: 'transform .2s, box-shadow .2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,.12)' },
          },
        },
      },
      MuiButton: { defaultProps: { disableElevation: true } },
    },
  })
}
