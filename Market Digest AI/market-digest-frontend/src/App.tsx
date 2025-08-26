import { useMemo, useState, createContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const modernTheme = useMemo(() => createTheme({
    palette: {
      ...{
        mode,
        primary: {
          main: '#5B5FE9', // deep blue/purple
          contrastText: mode === 'dark' ? '#fff' : '#181A2A',
        },
        secondary: {
          main: '#FFD600', // gold/yellow accent
          contrastText: mode === 'dark' ? '#222' : '#181A2A',
        },
        background: {
          default: mode === 'dark' ? '#181A2A' : '#f5f5f5',
          paper: mode === 'dark' ? 'rgba(36, 38, 58, 0.95)' : '#fff',
        },
        text: {
          primary: mode === 'dark' ? '#fff' : '#181A2A',
          secondary: mode === 'dark' ? '#B0B3C6' : '#555',
        },
      },
    },
    shape: {
      borderRadius: 18,
    },
    typography: {
      fontFamily: 'Inter, Roboto, Arial, sans-serif',
      h6: {
        fontWeight: 700,
        letterSpacing: 0.5,
      },
      h5: {
        fontWeight: 800,
        letterSpacing: 0.5,
      },
      button: {
        fontWeight: 700,
        textTransform: 'none',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 4px 32px 0 rgba(91,95,233,0.10)',
            background: mode === 'dark'
              ? 'linear-gradient(135deg, #23255A 0%, #181A2A 100%)'
              : 'linear-gradient(135deg, #fff 0%, #f5f5f5 100%)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            fontWeight: 700,
            fontSize: '1rem',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: mode === 'dark' ? 'rgba(36, 38, 58, 0.95)' : '#fff',
          },
        },
      },
    },
  }), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={modernTheme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <Box sx={{ flex: 1, p: 0, display: 'flex', flexDirection: 'column' }}>
            <Topbar />
            <Box
              sx={{
                flex: 1,
                p: 3,
                background: mode === 'dark'
                  ? 'linear-gradient(135deg, #23255A 0%, #181A2A 100%)'
                  : 'linear-gradient(135deg, #fff 0%, #f5f5f5 100%)',
                minHeight: '100vh',
              }}
            >
              <Dashboard />
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
