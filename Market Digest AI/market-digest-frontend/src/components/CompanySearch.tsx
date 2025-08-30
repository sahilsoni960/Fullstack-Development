import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';

interface CompanySearchProps {
  companies: string[];
  value: string[];
  onChange: (value: string[]) => void;
  loading?: boolean;
}

const CompanySearch: React.FC<CompanySearchProps> = ({ companies, value, onChange, loading }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Autocomplete
      multiple
      options={companies}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Select companies…"
          variant="outlined"
          size="medium"
          InputLabelProps={{ shrink: false }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
              borderRadius: 2,
              '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(17,24,39,0.12)' },
              '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.22)' : 'rgba(17,24,39,0.18)' },
              '&.Mui-focused fieldset': { borderColor: isDark ? '#34A853' : '#1976D2' },
            },
            '& .MuiInputBase-input::placeholder': { color: isDark ? 'rgba(255,255,255,0.80)' : '#6B7280', opacity: 1 },
          }}
          fullWidth
        />
      )}
      sx={{ minWidth: 300, flex: 1 }}
      loading={loading}
      disableCloseOnSelect
      fullWidth
    />
  );
};

export default CompanySearch;
