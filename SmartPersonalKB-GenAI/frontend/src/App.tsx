import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NoteIcon from '@mui/icons-material/Note';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Notes from './Notes';
import Snippets from './Snippets';
import Documents from './Documents';
import LLM from './LLM';
import Dashboard from './Dashboard';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const drawerWidth = 220;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Notes', icon: <NoteIcon />, path: '/notes' },
  { text: 'Snippets', icon: <CodeIcon />, path: '/snippets' },
  { text: 'Documents', icon: <DescriptionIcon />, path: '/documents' },
  { text: 'LLM Q&A', icon: <QuestionAnswerIcon />, path: '/llm' },
  { text: 'Scheduler', icon: <ScheduleIcon />, path: '/scheduler' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffe066', // yellow accent
      contrastText: '#232946',
    },
    secondary: {
      main: '#845ec2', // purple accent
      contrastText: '#fff',
    },
    success: {
      main: '#43e97b', // green accent
      contrastText: '#232946',
    },
    background: {
      default: 'linear-gradient(135deg, #5f2c82 0%, #49a09d 100%)',
      paper: 'rgba(35,41,70,0.95)', // deep blue, semi-transparent
    },
    text: {
      primary: '#ffffff',
      secondary: '#e0e0e0',
    },
    action: {
      active: '#ff6f91', // pink accent for icons
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Open Sans, Arial, sans-serif',
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 16,
  },
});

// Placeholder page components
function Scheduler() {
  return <Typography variant="h4">Scheduler</Typography>;
}

function Settings() {
  return <Typography variant="h4">Settings</Typography>;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #5f2c82 0%, #49a09d 100%)' }}>
          <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'rgba(35,41,70,0.95)', boxShadow: 0 }}>
            <Toolbar>
              <IconButton color="inherit" edge="start" sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                SmartPersonalKB-GenAI
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: 'border-box',
                bgcolor: 'rgba(35,41,70,0.95)',
                color: '#fff',
                borderRight: 'none',
              },
            }}
          >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
              <List>
                {navItems.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton component={Link} to={item.path} sx={{ '&.Mui-selected': { bgcolor: '#845ec2', color: '#fff' } }}>
                      <ListItemIcon sx={{ color: '#ffe066' }}>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, bgcolor: 'transparent', p: 3 }}>
            <Toolbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/snippets" element={<Snippets />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/llm" element={<LLM />} />
              <Route path="/scheduler" element={<Scheduler />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}
