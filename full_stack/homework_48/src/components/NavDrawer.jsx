import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
} from '@mui/material'
import { PAGES } from '../data/pages.jsx'

export const DRAWER_WIDTH = 240

export default function NavDrawer({ page, onChange, mobileOpen, onClose, categories, category, onCategoryChange }) {
  const content = (
    <Box>
      <Toolbar />
      <List>
        {PAGES.map((p) => (
          <ListItem key={p.id} disablePadding>
            <ListItemButton
              selected={page === p.id}
              onClick={() => {
                onChange(p.id)
                onClose()
              }}
            >
              <ListItemIcon>{p.icon}</ListItemIcon>
              <ListItemText primary={p.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List subheader={<ListSubheader>Категорії</ListSubheader>}>
        {['Усі', ...categories].map((c) => (
          <ListItemButton
            key={c}
            selected={category === c}
            onClick={() => {
              onCategoryChange(c)
              onClose()
            }}
          >
            <ListItemText primary={c} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )

  const paperSx = { '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }

  return (
    <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
      {/* Мобільна версія — тимчасовий Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, ...paperSx }}
      >
        {content}
      </Drawer>
      {/* Десктоп — постійний Drawer */}
      <Drawer variant="permanent" open sx={{ display: { xs: 'none', md: 'block' }, ...paperSx }}>
        {content}
      </Drawer>
    </Box>
  )
}
