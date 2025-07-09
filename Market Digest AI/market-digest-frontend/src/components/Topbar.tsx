import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

const Topbar: React.FC = () => {
  const theme = useTheme();
  return (
    <AppBar
      position="static"
      elevation={4}
      sx={{
        mb: 3,
        background: 'linear-gradient(90deg, #23255A 0%, #5B5FE9 100%)',
        boxShadow: '0 2px 16px 0 rgba(91,95,233,0.10)',
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        px: 3,
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            fontWeight: 800,
            color: theme.palette.secondary.main,
            letterSpacing: 1,
          }}
        >
          Company News Dashboard
        </Typography>
        {/* User actions placeholder (profile, notifications, etc.) */}
        <Box />
      </Toolbar>
    </AppBar>
  );
};

export default Topbar; 