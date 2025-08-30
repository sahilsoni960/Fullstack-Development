import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CompanySearch from '../components/CompanySearch';
import CompanyCard from '../components/CompanyCard';
import type { NewsArticle, SummarizeResponse } from '../services/api';
import { fetchCompanies, fetchNews, fetchSummary } from '../services/api';

const Dashboard: React.FC = () => {
  const [companies, setCompanies] = useState<string[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('md:selectedCompanies') || '[]'); } catch { return []; }
  });
  const [showSummaries, setShowSummaries] = useState<boolean>(() => {
    const v = localStorage.getItem('md:showSummaries');
    return v === null ? true : v !== 'false';
  });
  const [news, setNews] = useState<Record<string, NewsArticle[]>>({});
  const [loadingNews, setLoadingNews] = useState(false);
  const [summaries, setSummaries] = useState<Record<string, SummarizeResponse>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Record<string, boolean>>({});

  // Persist selection and flags
  useEffect(() => {
    localStorage.setItem('md:selectedCompanies', JSON.stringify(selectedCompanies));
  }, [selectedCompanies]);
  useEffect(() => {
    localStorage.setItem('md:showSummaries', String(showSummaries));
  }, [showSummaries]);

  // Effect 1: Fetch the list of all available companies on initial load
  useEffect(() => {
    setLoadingCompanies(true);
    fetchCompanies()
      .then(setCompanies)
      .catch(() => setCompanies([]))
      .finally(() => setLoadingCompanies(false));
  }, []);

  // Effect 2: Fetch news whenever the list of selected companies changes
  useEffect(() => {
    if (selectedCompanies.length === 0) {
      setNews({});
      setSummaries({});
      return;
    }

    setLoadingNews(true);
    setSummaries({}); // Clear old summaries immediately

    fetchNews(selectedCompanies)
      .then(setNews) // This will trigger the next useEffect
      .catch(() => setNews({}))
      .finally(() => setLoadingNews(false));
  }, [selectedCompanies]);

  // Effect 3: Fetch summaries whenever the news data changes
  useEffect(() => {
    if (Object.keys(news).length === 0) {
      return;
    }

    const initialLoadingState: Record<string, boolean> = {};
    Object.keys(news).forEach(company => {
      initialLoadingState[company] = true;
    });
    setLoadingSummaries(initialLoadingState);

    const summaryPromises = Object.entries(news).map(([company, articles]) =>
      fetchSummary(company, articles).catch(err => {
        console.error(`Failed to fetch summary for ${company}:`, err);
        return null;
      })
    );

    Promise.all(summaryPromises).then(summaryResults => {
      const finalSummaries: Record<string, SummarizeResponse> = {};
      const finalLoadingState: Record<string, boolean> = {};

      Object.keys(news).forEach((company, index) => {
        const summary = summaryResults[index];
        if (summary) {
          finalSummaries[company] = summary;
        }
        finalLoadingState[company] = false;
      });

      setSummaries(finalSummaries);
      setLoadingSummaries(finalLoadingState);
    });
  }, [news]);

  return (
    <Box>
      {/* Controls row: Company picker and toggles */}
      <Box sx={{ mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
          <CompanySearch
            companies={companies}
            value={selectedCompanies}
            onChange={setSelectedCompanies}
            loading={loadingCompanies}
          />
          <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: { sm: 'auto' } }}>
            <Chip
              label={showSummaries ? 'Summaries: On' : 'Summaries: Off'}
              color={showSummaries ? 'secondary' : 'default'}
              onClick={() => setShowSummaries(v => !v)}
              variant={showSummaries ? 'filled' : 'outlined'}
              sx={{
                borderColor: 'rgba(255,255,255,0.2)',
                height: 40,
                px: 1.5,
                '& .MuiChip-label': { fontSize: '0.95rem', fontWeight: 800, px: 0.5 },
                borderRadius: 9999,
                boxShadow: showSummaries ? '0 4px 12px rgba(0,0,0,0.25)' : 'none'
              }}
            />
          </Stack>
        </Stack>
        {/* Animated separator for visual rhythm */}
        <Box className="rainbow-separator-h" sx={{ mt: 2 }} />
      </Box>

      {/* Cards list */}
      <Box>
        {loadingNews && selectedCompanies.length > 0 ? (
          <Typography>Loading news...</Typography>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
            {selectedCompanies.map((company) => (
              <CompanyCard
                key={company}
                company={company}
                articles={news[company] || []}
                summary={summaries[company]}
                isLoadingSummary={loadingSummaries[company]}
                showSummary={showSummaries}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
