import { useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
// Removed Sidebar
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import { ColorModeContext } from './theme/ColorModeContext';
// Removed LayoutContext

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
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
      mode,
      primary: { main: '#4285F4', contrastText: '#000000' },
      secondary: { main: '#34A853', contrastText: '#000000' },
      success: { main: '#34A853' },
      error: { main: '#EA4335' },
      warning: { main: '#FBBC05' },
      info: { main: '#00BCD4' },
      background: {
        default: mode === 'dark' ? '#000000' : '#F6F7FA',
        paper: mode === 'dark' ? '#0A0A0A' : '#FFFFFF',
      },
      text: {
        primary: mode === 'dark' ? '#FFFFFF' : '#111827',
        secondary: mode === 'dark' ? '#FFFFFF' : '#4B5563',
      },
      divider: mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: 'Roboto Flex, Inter, Roboto, Arial, sans-serif',
      fontSize: 15,
      h6: { fontWeight: 800, letterSpacing: 0.2, fontSize: '1.15rem' },
      h5: { fontWeight: 900, letterSpacing: 0.3, fontSize: '1.35rem' },
      subtitle1: { fontWeight: 800, letterSpacing: 0.15, fontSize: '1.02rem' },
      subtitle2: { fontWeight: 700, letterSpacing: 0.15, fontSize: '0.98rem' },
      body1: { fontSize: '1.05rem' },
      body2: { fontSize: '0.98rem' },
      button: { fontWeight: 700, textTransform: 'none' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { backgroundColor: mode === 'dark' ? '#000000' : '#F6F7FA' }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: mode === 'dark' ? '#0A0A0A' : '#FFFFFF',
            border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(17,24,39,0.06)',
            boxShadow: mode === 'dark' ? '0 8px 24px rgba(0,0,0,0.55)' : '0 8px 24px rgba(17,24,39,0.08)',
          },
        },
      },
      MuiCardContent: { styleOverrides: { root: { padding: 24 } } },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: mode === 'dark' ? '#000000' : '#FFFFFF',
            borderBottom: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)'
          },
        },
      },
      MuiPaper: { styleOverrides: { root: { background: mode === 'dark' ? '#0A0A0A' : '#FFFFFF' } } },
      MuiDivider: { styleOverrides: { root: { borderColor: mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)' } } },
      MuiSwitch: {
        styleOverrides: {
          track: { backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(17,24,39,0.24)' },
          thumb: { backgroundColor: mode === 'dark' ? '#FFFFFF' : '#FFFFFF' },
          switchBase: {
            '&.Mui-checked + .MuiSwitch-track': { backgroundColor: '#EC407A' },
            '&.Mui-checked .MuiSwitch-thumb': { backgroundColor: '#FFFFFF' },
          },
        },
      },
      MuiChip: { styleOverrides: { root: { borderRadius: 10 } } },
    },
  }), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={modernTheme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: modernTheme.palette.background.default, flexDirection: 'column' }}>
          <Topbar />
          <Box
            sx={{
              flex: 1,
              // Reduce top padding to tighten space before the search row
              pt: { xs: 1, md: 1.25 },
              px: { xs: 2, md: 3 },
              pb: { xs: 2, md: 3 },
              backgroundColor: modernTheme.palette.background.default,
              backgroundImage: {
                xs: undefined,
                md: modernTheme.palette.mode === 'dark'
                  ? 'radial-gradient(900px 500px at 5% -10%, rgba(66,133,244,0.10) 0%, rgba(0,0,0,0) 60%), radial-gradient(800px 450px at 105% 0%, rgba(234,67,53,0.08) 0%, rgba(0,0,0,0) 60%), radial-gradient(950px 520px at -10% 110%, rgba(52,168,83,0.07) 0%, rgba(0,0,0,0) 65%)'
                  : undefined,
              },
              backgroundAttachment: { md: 'fixed, fixed, fixed' },
              backgroundRepeat: 'no-repeat',
              minHeight: '100vh',
            }}
          >
            <Dashboard />
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
