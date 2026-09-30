import { useState } from 'react'
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import SchoolIcon from '@mui/icons-material/School'

export default function AppHeader({ mode, onToggleMode, onMenuClick, favoritesCount, onFavoritesClick, onNotify }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const closeMenu = () => setAnchorEl(null)

  return (
    <AppBar position="fixed" color="inherit" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Відкрити меню"
          onClick={onMenuClick}
          sx={{ mr: 1, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <SchoolIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          CourseHub
        </Typography>

        <Tooltip title="Обрані курси">
          <IconButton color="inherit" onClick={onFavoritesClick}>
            <Badge badgeContent={favoritesCount} color="secondary">
              <FavoriteIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Tooltip title={mode === 'light' ? 'Темна тема' : 'Світла тема'}>
          <IconButton color="inherit" onClick={onToggleMode}>
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>

        <Box sx={{ ml: 1 }}>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="Профіль">
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>А</Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
            <MenuItem
              onClick={() => {
                closeMenu()
                onNotify('Профіль ще в розробці', 'info')
              }}
            >
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Профіль
            </MenuItem>
            <MenuItem
              onClick={() => {
                closeMenu()
                onNotify('Ви вийшли з акаунту', 'warning')
              }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Вийти
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
