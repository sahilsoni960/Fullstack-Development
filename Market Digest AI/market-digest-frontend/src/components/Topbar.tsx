import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Topbar: React.FC = () => {
  return (
    <AppBar position="static" elevation={6} sx={{ mb: 3, px: 3 }}>
      <Toolbar sx={{ minHeight: { xs: 68, md: 76 } }}>
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
              // Simple blue pill
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
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
