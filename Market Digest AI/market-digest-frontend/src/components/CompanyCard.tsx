import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import type { NewsArticle, SummarizeResponse } from '../services/api';

// Accent palette using Google-inspired colors (avoid purple)
const ACCENTS = [
  { name: 'blue',   start: 'rgba(66,133,244,0.32)', end: 'rgba(30,136,229,0.32)',  ring: 'rgba(66,133,244,0.70)' }, // #4285F4
  { name: 'red',    start: 'rgba(234,67,53,0.30)',  end: 'rgba(211,47,47,0.30)',   ring: 'rgba(234,67,53,0.68)' },  // #EA4335
  { name: 'green',  start: 'rgba(52,168,83,0.30)',  end: 'rgba(46,125,50,0.30)',   ring: 'rgba(52,168,83,0.66)' },  // #34A853
  { name: 'yellow', start: 'rgba(251,188,5,0.28)',  end: 'rgba(255,160,0,0.28)',   ring: 'rgba(251,188,5,0.62)' },  // #FBBC05
  { name: 'teal',   start: 'rgba(0,188,212,0.28)',  end: 'rgba(0,151,167,0.28)',   ring: 'rgba(0,188,212,0.60)' },  // #00BCD4
  { name: 'orange', start: 'rgba(255,112,67,0.28)', end: 'rgba(239,108,0,0.28)',   ring: 'rgba(255,112,67,0.60)' }, // #FF7043
];

function hashToIndex(s: string, mod: number) { let h = 0; for (let i=0;i<s.length;i++){ h = (h*31 + s.charCodeAt(i))|0; } return Math.abs(h)%mod; }

// Helper to extract a JSON block from an LLM response (supports ```json ... ``` or raw JSON)
function extractJsonBlock(text: string): string | null {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fence && fence[1]) return fence[1].trim();
  const trimmed = text.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) return trimmed;
  // Try to find any JSON object in the text that parses and contains a summary/sentiment
  const candidates = text.match(/\{[\s\S]*?\}/g);
  if (candidates) {
    for (const c of candidates) {
      try {
        const obj = JSON.parse(c);
        if (obj && (typeof obj.summary === 'string' || typeof obj.sentiment === 'string')) {
          return c;
        }
      } catch { /* ignore */ }
    }
  }
  return null;
}

function parseJsonMaybe<T = any>(s: string): T | null {
  // eslint-disable-next-line
  try { return JSON.parse(s) as T; } catch { return null; }
}

interface CompanyCardProps {
  company: string;
  articles: NewsArticle[];
  summary?: SummarizeResponse;
  isLoadingSummary?: boolean;
  showSummary?: boolean;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, articles, summary, isLoadingSummary, showSummary }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const shouldShowSummary = showSummary !== false;
  const accent = ACCENTS[hashToIndex(company, ACCENTS.length)];


  const renderSummary = () => {
    if (!shouldShowSummary) return null;

    if (isLoadingSummary) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 160, py: 3 }}>
          <CircularProgress size={28} thickness={4} color="secondary" />
        </Box>
      );
    }

    if (summary?.summary) {
      let finalText = summary.summary;
      let finalSentiment = summary.sentiment || 'Neutral';

      const jsonBlock = extractJsonBlock(summary.summary);
      if (jsonBlock) {
        const parsed = parseJsonMaybe<{ summary?: string; sentiment?: string; keyPoints?: string[] }>(jsonBlock);
        if (parsed) {
          if (typeof parsed.summary === 'string' && parsed.summary.trim()) finalText = parsed.summary.trim();
          if (typeof parsed.sentiment === 'string' && parsed.sentiment.trim()) finalSentiment = parsed.sentiment.trim();
        }
      }

      return (
        <Box>
          <Chip
            icon={<InfoOutlined />}
            label={`Sentiment: ${finalSentiment}`}
            variant="outlined"
            sx={{
              mb: 2,
              fontWeight: 600,
              width: '100%',
              height: 'auto',
              alignItems: 'flex-start',
              color: 'text.primary',
              borderColor: accent.ring,
              backgroundColor: 'transparent',
              '& .MuiChip-label': {
                display: 'block',
                whiteSpace: 'normal',
                overflow: 'visible',
                textOverflow: 'unset',
                wordBreak: 'break-word',
                lineHeight: 1.4,
                py: 0.5,
              },
            }}
          />
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 2, fontSize: '1.14rem', lineHeight: 1.72, letterSpacing: 0.12 }} component="p">
            {finalText}
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
    <Card
      sx={{
        mb: 3,
        // Dark: bright glass with accent; Light: clean white surface
        borderColor: isDark ? accent.ring : 'rgba(17,24,39,0.06)',
        backgroundImage: isDark ? `linear-gradient(180deg, ${accent.start} 0%, ${accent.end} 100%)` : 'none',
        backgroundColor: isDark ? 'rgba(10,10,10,0.35)' : '#FFFFFF',
        backdropFilter: isDark ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: isDark ? 'blur(12px)' : 'none',
        boxShadow: isDark
          ? `0 18px 48px rgba(0,0,0,0.75), 0 0 0 1px ${accent.ring}`
          : '0 8px 24px rgba(17,24,39,0.06), 0 0 0 1px rgba(17,24,39,0.06)',
        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.1s',
        '&:hover': {
          borderColor: isDark ? accent.ring : 'rgba(17,24,39,0.08)',
          boxShadow: isDark
            ? `0 22px 56px rgba(0,0,0,0.80), 0 0 0 1px ${accent.ring}`
            : '0 10px 28px rgba(17,24,39,0.10), 0 0 0 1px rgba(17,24,39,0.08)',
          transform: 'translateY(-1px)'
        }
      }}
    >
      <CardContent>
        <Typography variant="h6" color="text.primary" gutterBottom sx={{ letterSpacing: 0.2 }}>
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
          <Box flex={shouldShowSummary ? 2 : 1} minWidth={0} sx={{
            backgroundColor: isDark ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.03)',
            borderRadius: 2,
            border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(17,24,39,0.06)',
            p: 2
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, whiteSpace: 'nowrap' }} gutterBottom>
              Latest News
            </Typography>
            <List>
              {articles.map((article) => (
                <ListItem
                  key={article.url || article.title}
                  component="a"
                  href={article.url}
                  target="_blank"
                  alignItems="flex-start"
                  sx={{ p: 0, mb: 2, '&:hover .news-headline': { color: 'text.primary', textDecoration: 'underline' } }}
                >
                  <ListItemText
                    primary={
                      <span className="news-headline" style={{ fontFamily: 'Roboto Flex, Inter, Roboto, Arial, sans-serif', fontWeight: 800, fontSize: '1.12rem', color: theme.palette.text.primary, letterSpacing: '0.01em', transition: 'color 0.2s' }}>
                        {article.title}
                      </span>
                    }
                    secondary={<span style={{ fontSize: '1rem', color: theme.palette.text.secondary }}>{new Date(article.publishedAt).toLocaleString()}</span>}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          {shouldShowSummary && (
            <>
              {/* Separator: static white (dark) or subtle gray (light) */}
              <Box sx={{ display: { xs: 'none', md: 'block' }, alignSelf: 'stretch', mx: 2, width: 2, borderRadius: 2, backgroundColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(17,24,39,0.10)' }} />
              {/* AI Summary */}
              <Box flex={1} minWidth={250}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, whiteSpace: 'nowrap' }} gutterBottom>
                  AI Summary
                </Typography>
                {renderSummary()}
              </Box>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
