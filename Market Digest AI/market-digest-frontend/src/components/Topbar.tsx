import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '../theme/ColorModeContext';

const Topbar: React.FC = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  return (
    <AppBar position="static" elevation={6} sx={{ mb: 1.5 }}>
      <Toolbar disableGutters sx={{ px: { xs: 2, md: 3 }, minHeight: { xs: 68, md: 76 }, gap: 2, pt: { xs: 1, md: 1.25 }, pb: { xs: 0.75, md: 0.75 } }}>
        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            letterSpacing: 0.6,
            whiteSpace: 'nowrap',
            fontSize: { xs: '1.6rem', sm: '1.8rem', md: '2rem' },
            lineHeight: 1.2,
          }}
        >
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              px: { xs: 2, md: 2.5 },
              py: { xs: 0.5, md: 0.75 },
              borderRadius: 9999,
              background: 'linear-gradient(135deg, #1E88E5 0%, #1976D2 100%)',
              color: '#FFFFFF',
              boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
              textShadow: '0 1px 1px rgba(0,0,0,0.15)'
            }}
          >
            Company News Dashboard
          </Box>
        </Typography>

        <Box sx={{ flex: 1 }} />

        {/* Theme toggle on the right */}
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
          <WbSunnyIcon sx={{ color: theme.palette.text.primary }} />
          <Switch
            checked={theme.palette.mode === 'dark'}
            onChange={colorMode.toggleColorMode}
            color="primary"
            inputProps={{ 'aria-label': 'toggle dark mode' }}
          />
          <NightsStayIcon sx={{ color: theme.palette.text.secondary }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
