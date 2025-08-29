import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CompanySearch from '../components/CompanySearch';
import CompanyCard from '../components/CompanyCard';
import type { NewsArticle, SummarizeResponse } from '../services/api';
import { fetchCompanies, fetchNews, fetchSummary } from '../services/api';

const Dashboard: React.FC = () => {
  const [companies, setCompanies] = useState<string[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [news, setNews] = useState<Record<string, NewsArticle[]>>({});
  const [loadingNews, setLoadingNews] = useState(false);
  const [summaries, setSummaries] = useState<Record<string, SummarizeResponse>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Record<string, boolean>>({});

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
    // Do not run if the news object is empty
    if (Object.keys(news).length === 0) {
      return;
    }

    // Set loading state for all summaries
    const initialLoadingState: Record<string, boolean> = {};
    Object.keys(news).forEach(company => {
      initialLoadingState[company] = true;
    });
    setLoadingSummaries(initialLoadingState);

    // Fetch all summaries concurrently
    const summaryPromises = Object.entries(news).map(([company, articles]) =>
      fetchSummary(company, articles).catch(err => {
        console.error(`Failed to fetch summary for ${company}:`, err);
        return null; // Prevent one failure from breaking the entire chain
      })
    );

    // When all summaries have been fetched (or failed), update the state
    Promise.all(summaryPromises).then(summaryResults => {
      const finalSummaries: Record<string, SummarizeResponse> = {};
      const finalLoadingState: Record<string, boolean> = {};

      Object.keys(news).forEach((company, index) => {
        const summary = summaryResults[index];
        if (summary) {
          finalSummaries[company] = summary;
        }
        finalLoadingState[company] = false; // Mark this company as no longer loading
      });

      // Update state once with all the results
      setSummaries(finalSummaries);
      setLoadingSummaries(finalLoadingState);
    });
  }, [news]); // This effect is now correctly dependent on the news data

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Select Companies</Typography>
        <CompanySearch
          companies={companies}
          value={selectedCompanies}
          onChange={setSelectedCompanies}
          loading={loadingCompanies}
        />
      </Box>
      <Box>
        <Typography variant="h6">Company News & Summaries</Typography>
        {loadingNews && selectedCompanies.length > 0 ? (
          <Typography>Loading news...</Typography>
        ) : (
          selectedCompanies.map((company) => (
            <CompanyCard
              key={company}
              company={company}
              articles={news[company] || []}
              summary={summaries[company]}
              isLoadingSummary={loadingSummaries[company]}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;