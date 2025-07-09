import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import type { NewsArticle, SummarizeResponse } from '../services/api';

interface CompanyCardProps {
  company: string;
  articles: NewsArticle[];
  summary?: SummarizeResponse;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, articles, summary }) => {
  const theme = useTheme();
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
                        {article.sourceName} • {new Date(article.publishedAt).toLocaleString()}
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
            {summary ? (
              <>
                <Typography variant="body1" sx={{ mb: 1, color: theme.palette.secondary.main, fontWeight: 600, whiteSpace: 'pre-line' }} paragraph>
                  {summary.summary}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>Key Points:</Typography>
                <ul style={{ marginTop: 4, marginBottom: 8, paddingLeft: 18 }}>
                  {summary.keyPoints.map((kp, i) => (
                    <li key={i} style={{ color: theme.palette.text.primary, marginBottom: 2 }}>{kp}</li>
                  ))}
                </ul>
                <Typography variant="body2" color="text.secondary">Sentiment: {summary.sentiment}</Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">No summary available.</Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CompanyCard; 