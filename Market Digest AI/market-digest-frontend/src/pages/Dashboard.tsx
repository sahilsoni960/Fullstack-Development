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

  useEffect(() => {
    setLoadingCompanies(true);
    fetchCompanies()
      .then(setCompanies)
      .catch(() => setCompanies([]))
      .finally(() => setLoadingCompanies(false));
  }, []);

  useEffect(() => {
    if (selectedCompanies.length === 0) {
      setNews({});
      setSummaries({});
      setLoadingSummaries({});
      return;
    }
    setLoadingNews(true);
    fetchNews(selectedCompanies)
      .then((newsData) => {
        setNews(newsData);
        // Fetch summaries for each company
        const newLoadingSummaries: Record<string, boolean> = {};
        const newSummaries: Record<string, SummarizeResponse> = {};
        selectedCompanies.forEach((company) => {
          newLoadingSummaries[company] = true;
        });
        setLoadingSummaries(newLoadingSummaries);
        Promise.all(
          selectedCompanies.map(async (company) => {
            try {
              const summary = await fetchSummary(company, newsData[company] || []);
              newSummaries[company] = summary;
            } catch {
              // fallback: no summary
            } finally {
              newLoadingSummaries[company] = false;
              setLoadingSummaries({ ...newLoadingSummaries });
              setSummaries({ ...newSummaries });
            }
          })
        );
      })
      .catch(() => {
        setNews({});
        setSummaries({});
        setLoadingSummaries({});
      })
      .finally(() => setLoadingNews(false));
  }, [selectedCompanies]);

  return (
    <Box>
      {/* Company search and multi-select */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Select Companies</Typography>
        <CompanySearch
          companies={companies}
          value={selectedCompanies}
          onChange={setSelectedCompanies}
          loading={loadingCompanies}
        />
      </Box>
      {/* News and summaries */}
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
              summary={loadingSummaries[company] ? undefined : summaries[company]}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default Dashboard; 