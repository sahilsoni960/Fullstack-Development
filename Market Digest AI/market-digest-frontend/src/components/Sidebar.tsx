import { useContext } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import { useTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { ColorModeContext } from '../theme/ColorModeContext';
import { LayoutContext } from '../theme/LayoutContext';

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 76;

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, active: true },
];

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const colorMode = useContext(ColorModeContext);
  const layout = useContext(LayoutContext);
  const drawerWidth = layout.sidebarOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: isDark
            ? 'linear-gradient(180deg, rgba(28,28,28,0.72) 0%, rgba(14,14,14,0.62) 100%)'
            : '#FFFFFF',
          backdropFilter: isDark ? 'blur(10px)' : 'none',
          WebkitBackdropFilter: isDark ? 'blur(10px)' : 'none',
          color: theme.palette.text.primary,
          borderRight: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(17,24,39,0.08)',
          transition: 'width 0.2s ease',
        },
        display: { xs: 'none', sm: 'block' },
      }}
      open
    >
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', gap: 1 }}>
        {layout.sidebarOpen ? (
          <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: 0.5, mb: 1 }}>
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                background: 'linear-gradient(135deg, #1E88E5 0%, #1976D2 100%)',
                color: '#FFFFFF',
                boxShadow: '0 6px 16px rgba(0,0,0,0.35)',
                whiteSpace: 'nowrap',
                fontSize: '1.1rem',
                lineHeight: 1.2,
                maxWidth: '100%'
              }}
            >
              Market Digest AI
            </Box>
          </Typography>
        ) : (
          <Box sx={{ height: 40 }} />
        )}
        <Divider sx={{ mb: 1 }} />
        <List sx={{ flexGrow: 1 }}>
          {navItems.map((item) => {
            const button = (
              <ListItemButton
                selected={item.active}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 2,
                  mb: 1,
                  px: layout.sidebarOpen ? 2 : 1.25,
                  justifyContent: layout.sidebarOpen ? 'flex-start' : 'center',
                  color: item.active ? theme.palette.text.primary : theme.palette.text.secondary,
                  background: item.active ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,24,39,0.06)') : 'transparent',
                  border: item.active ? (isDark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(17,24,39,0.12)') : '1px solid transparent',
                  '&:hover, &:focus': {
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(17,24,39,0.04)',
                    color: theme.palette.text.primary,
                    outline: isDark ? '1px solid rgba(255,255,255,0.16)' : '1px solid rgba(17,24,39,0.12)'
                  },
                  '&:active': {
                    transform: 'translateY(0.5px)',
                  },
                  transition: 'outline 0.15s ease, background 0.15s ease, transform 0.05s ease',
                  '& .MuiTouchRipple-child': { backgroundColor: isDark ? 'rgba(66,133,244,0.35)' : 'rgba(25,118,210,0.25)' },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: layout.sidebarOpen ? 36 : 'auto' }}>{item.icon}</ListItemIcon>
                {layout.sidebarOpen && (
                  <ListItemText primary={<Typography sx={{ fontWeight: item.active ? 800 : 600 }}>{item.label}</Typography>} />
                )}
              </ListItemButton>
            );
            return (
              <ListItem key={item.label} disablePadding>
                {layout.sidebarOpen ? button : <Tooltip title={item.label} placement="right">{button}</Tooltip>}
              </ListItem>
            );
          })}
        </List>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto', justifyContent: layout.sidebarOpen ? 'flex-start' : 'center' }}>
          <WbSunnyIcon sx={{ color: theme.palette.text.primary }} />
          <Switch
            checked={theme.palette.mode === 'dark'}
            onChange={colorMode.toggleColorMode}
            color="primary"
            slotProps={{ input: { 'aria-label': 'toggle dark mode' } }}
          />
          {layout.sidebarOpen && <NightsStayIcon sx={{ color: isDark ? theme.palette.text.secondary : theme.palette.text.primary }} />}
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
