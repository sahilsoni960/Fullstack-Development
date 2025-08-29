import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import HighlightOff from '@mui/icons-material/HighlightOff';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import type { NewsArticle, SummarizeResponse } from '../services/api';

interface CompanyCardProps {
  company: string;
  articles: NewsArticle[];
  summary?: SummarizeResponse;
  isLoadingSummary?: boolean;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, articles, summary, isLoadingSummary }) => {
  const theme = useTheme();

  const getSentimentStyle = (sentiment: string) => {
    const sentimentLower = sentiment.toLowerCase();
    if (sentimentLower.includes('positive')) {
      return { color: 'success' as const, icon: <CheckCircleOutline /> };
    }
    if (sentimentLower.includes('negative')) {
      return { color: 'error' as const, icon: <HighlightOff /> };
    }
    return { color: 'info' as const, icon: <InfoOutlined /> };
  };

  const renderSummary = () => {
    if (isLoadingSummary) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 100, p: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            Generating AI summary...
          </Typography>
        </Box>
      );
    }

    if (summary && summary.summary) {
      let parsedSummary: { summary: string; sentiment: string; };
      try {
        // Clean the AI response by removing markdown fences before parsing.
        const cleanedJsonString = summary.summary.replace(/```json\n|```/g, '').trim();
        parsedSummary = JSON.parse(cleanedJsonString);
      } catch (error) {
        // If parsing fails, it's likely a raw string. Use it directly.
        // This ensures the UI doesn't break if the AI returns non-JSON text.
        parsedSummary = { summary: summary.summary, sentiment: summary.sentiment || 'Neutral' };
      }

      const sentimentStyle = getSentimentStyle(parsedSummary.sentiment);

      return (
        <Box>
          <Chip
            icon={sentimentStyle.icon}
            label={`Sentiment: ${parsedSummary.sentiment}`}
            color={sentimentStyle.color}
            variant="filled"
            sx={{ mb: 2, fontWeight: 600 }}
          />
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }} paragraph>
            {parsedSummary.summary}
          </Typography>
        </Box>
      );
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 100, p: 2 }}>
            <InfoOutlined sx={{ color: 'text.secondary', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">No summary available.</Typography>
        </Box>
    );
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom>
          {company}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            alignItems: 'flex-start',
          }}
        >
          {/* News Headlines */}
          <Box flex={2} minWidth={0}>
            <Typography variant="subtitle2" gutterBottom>
              Latest News
            </Typography>
            <List dense>
              {articles.map((article, idx) => (
                <ListItem
                  key={idx}
                  component="a"
                  href={article.url}
                  target="_blank"
                  alignItems="flex-start"
                  sx={{
                    p: 0,
                    mb: 1.5,
                    '&:hover .news-headline': { color: 'secondary.main', textDecoration: 'underline' },
                  }}
                >
                  <ListItemText
                    primary={
                      <span
                        className="news-headline"
                        style={{
                          fontFamily: 'Inter, Roboto, Arial, sans-serif',
                          fontWeight: 700,
                          fontSize: '1.08rem',
                          color: theme.palette.text.primary,
                          letterSpacing: '0.01em',
                          transition: 'color 0.2s',
                        }}
                      >
                        {article.title}
                      </span>
                    }
                    secondary={
                      <span
                        style={{
                          fontSize: '0.92rem',
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {new Date(article.publishedAt).toLocaleString()}
                      </span>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 2 }} />
          {/* AI Summary */}
          <Box flex={1} minWidth={250}>
            <Typography variant="subtitle2" gutterBottom>
              AI Summary
            </Typography>
            {renderSummary()}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
