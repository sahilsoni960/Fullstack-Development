import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import INFA_LOGO from '../../logos/INFA-logo.png';

interface CompanySearchProps {
  companies: string[];
  value: string[];
  onChange: (value: string[]) => void;
  loading?: boolean;
}

/**
 * Known domains map for popular companies.
 * Extend this map as needed. Fallback will try {company}.com.
 */
const KNOWN_DOMAINS: Record<string, string> = {
  apple: 'apple.com',
  microsoft: 'microsoft.com',
  google: 'google.com',
  alphabet: 'google.com',
  amazon: 'amazon.com',
  'meta platforms': 'meta.com',
  meta: 'meta.com',
  facebook: 'facebook.com',
  tesla: 'tesla.com',
  netflix: 'netflix.com',
  nvidia: 'nvidia.com',
  ibm: 'ibm.com',
  intel: 'intel.com',
  oracle: 'oracle.com',
  adobe: 'adobe.com',
  salesforce: 'salesforce.com',
  uber: 'uber.com',
  airbnb: 'airbnb.com',
  spotify: 'spotify.com',
  paypal: 'paypal.com',
  samsung: 'samsung.com',
  sony: 'sony.com',
};

/**
 * Attempt to guess the primary domain from a company name.
 */
const guessDomainFromCompany = (name: string): string | undefined => {
  const norm = name.trim().toLowerCase();
  if (KNOWN_DOMAINS[norm]) return KNOWN_DOMAINS[norm];

  // Heuristic fallback: remove non-alphanumerics/spaces and append .com
  const simplified = norm
    .replace(/\(.*?\)/g, '') // remove parenthetical notes e.g., Alphabet (Google)
    .replace(/[^a-z0-9 ]+/g, '')
    .trim()
    .replace(/\s+/g, '');
  if (!simplified) return undefined;
  return `${simplified}.com`;
};

/**
 * Build a logo URL using Clearbit Logo service (no key needed for basic logos).
 * Falls back gracefully to letter avatar if the image fails to load.
 */
const getLogoUrl = (companyName: string): string | undefined => {
  // Use custom local logo only for Informatica
  if (companyName.trim().toLowerCase() === 'informatica') return INFA_LOGO;

  const domain = guessDomainFromCompany(companyName);
  return domain ? `https://logo.clearbit.com/${domain}` : undefined;
};

/**
 * Produce initials for a fallback avatar (1–2 letters).
 */
const getInitials = (name: string): string => {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

const CompanySearch: React.FC<CompanySearchProps> = ({ companies, value, onChange, loading }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Autocomplete
      multiple
      options={companies}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      disableCloseOnSelect
      fullWidth
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
            '& .MuiInputBase-input': {
              fontFamily: theme.typography.fontFamily,
              fontSize: '0.95rem',
              lineHeight: 1.5,
            },
            '& .MuiInputBase-input::placeholder': {
              color: isDark ? 'rgba(255,255,255,0.80)' : '#6B7280',
              opacity: 1,
            },
          }}
          fullWidth
        />
      )}
      renderOption={(props, option) => {
        const logo = getLogoUrl(option);
        const hasLogo = Boolean(logo);
        return (
          <Box
            component="li"
            {...props}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 0.75,
            }}
          >
            <Avatar
              src={logo}
              alt={option}
              imgProps={{ style: { objectFit: 'contain', backgroundColor: 'transparent' } }}
              sx={{
                width: 24,
                height: 24,
                fontSize: 12,
                bgcolor: hasLogo ? 'transparent' : (isDark ? 'primary.dark' : 'primary.light'),
              }}
            >
              {!hasLogo ? getInitials(option) : null}
            </Avatar>
            <Typography
              variant="body1"
              sx={{
                fontFamily: theme.typography.fontFamily,
                fontSize: '0.95rem',
                color: isDark ? 'rgba(255,255,255,0.92)' : 'rgba(17,24,39,0.92)',
              }}
            >
              {option}
            </Typography>
          </Box>
        );
      }}
      renderTags={(selected, getTagProps) =>
        selected.map((option, index) => {
          const logo = getLogoUrl(option);
          const hasLogo = Boolean(logo);
          return (
            <Chip
              {...getTagProps({ index })}
              key={option}
              variant="outlined"
              size="small"
              avatar={
                <Avatar
                  src={logo}
                  alt={option}
                  imgProps={{ style: { objectFit: 'contain', backgroundColor: 'transparent' } }}
                  sx={{
                    width: 20,
                    height: 20,
                    fontSize: 10,
                    bgcolor: hasLogo ? 'transparent' : undefined,
                  }}
                >
                  {!hasLogo ? getInitials(option) : null}
                </Avatar>
              }
              label={option}
              sx={{
                '& .MuiChip-label': {
                  fontFamily: theme.typography.fontFamily,
                  fontSize: '0.85rem',
                },
              }}
            />
          );
        })
      }
      sx={{
        minWidth: 300,
        flex: 1,
        '& .MuiAutocomplete-listbox': {
          paddingTop: 0,
          paddingBottom: 0,
        },
      }}
      loading={loading}
    />
  );
};

export default CompanySearch;
