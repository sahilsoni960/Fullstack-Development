import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface CompanySearchProps {
  companies: string[];
  value: string[];
  onChange: (value: string[]) => void;
  loading?: boolean;
}

const CompanySearch: React.FC<CompanySearchProps> = ({ companies, value, onChange, loading }) => {
  return (
    <Autocomplete
      multiple
      options={companies}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      renderInput={(params) => <TextField {...params} label="Select Companies" variant="outlined" />}
      sx={{ minWidth: 300 }}
      loading={loading}
    />
  );
};

export default CompanySearch; 