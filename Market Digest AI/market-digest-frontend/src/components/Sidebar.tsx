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
import DashboardIcon from '@mui/icons-material/Dashboard';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import { useTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { ColorModeContext } from '../App';

const drawerWidth = 240;

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, active: true },
  // Add more nav items here as needed
];

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(135deg, #23255A 0%, #181A2A 100%)',
          color: theme.palette.text.primary,
          borderRight: 'none',
        },
        display: { xs: 'none', sm: 'block' },
      }}
      open
    >
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 1, mb: 2, color: theme.palette.secondary.main }}>
          Market Digest AI
        </Typography>
        <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
        <List sx={{ flexGrow: 1 }}>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                selected={item.active}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  color: item.active ? theme.palette.secondary.main : theme.palette.text.secondary,
                  background: item.active ? 'rgba(255,214,0,0.08)' : 'transparent',
                  '&:hover, &:focus': {
                    background: 'rgba(255,214,0,0.15)',
                    color: theme.palette.secondary.main,
                  },
                  transition: 'all 0.2s',
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: item.active ? 700 : 500 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
        {/* Dark mode toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
          <WbSunnyIcon sx={{ color: theme.palette.secondary.main }} />
          <Switch
            checked={theme.palette.mode === 'dark'}
            onChange={colorMode.toggleColorMode}
            color="secondary"
            inputProps={{ 'aria-label': 'toggle dark mode' }}
          />
          <NightsStayIcon sx={{ color: theme.palette.text.secondary }} />
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 