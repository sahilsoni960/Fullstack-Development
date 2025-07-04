import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, CircularProgress, Alert, Paper, Stack } from '@mui/material';
import ReactMarkdown from 'react-markdown';

// Add this helper component for formatting the LLM response using Markdown
const FormattedLLMResponse: React.FC<{ response: string }> = ({ response }) => (
  <ReactMarkdown
    components={{
      a: (props: any) => <a {...props} style={{ color: '#ffe066' }} target="_blank" rel="noopener noreferrer" />,
      p: (props: any) => <Typography component="div" sx={{ mb: 2 }}>{props.children}</Typography>,
      li: (props: any) => <li style={{ marginBottom: '0.5em' }}>{props.children}</li>
    }}
  >
    {response}
  </ReactMarkdown>
);

const LLM: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLLM = (type: 'ask' | 'summarize') => {
    setLoading(true);
    setError(null);
    setResponse('');
    const url = type === 'ask' ? '/api/ask' : '/api/summarize';
    axios.post(url, { prompt: input })
      .then(res => {
        setResponse(res.data.answer || res.data.summary || 'No response');
      })
      .catch(() => setError('Failed to get response from LLM'))
      .finally(() => setLoading(false));
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', p: 2 }}>
      <Paper elevation={8} sx={{
        width: '100%',
        maxWidth: 600,
        mt: 6,
        p: { xs: 2, md: 4 },
        borderRadius: 6,
        bgcolor: 'rgba(35,41,70,0.95)',
        color: '#fff',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }}>
        <Typography variant="h4" fontWeight={900} gutterBottom sx={{ color: '#ffe066', fontFamily: 'Inter, Roboto, Open Sans, Arial, sans-serif', letterSpacing: 1.5 }}>
          LLM Q&amp;A / Summarization
        </Typography>
        <Typography variant="subtitle2" sx={{ color: '#e0e0e0', mb: 2 }}>
          Ask a question or enter text to summarize
        </Typography>
        <TextField
          label="How can I help you?"
          multiline
          minRows={4}
          fullWidth
          value={input}
          onChange={e => setInput(e.target.value)}
          sx={{
            mb: 3,
            background: 'linear-gradient(135deg, #434c6d 0%, #232946 100%)',
            borderRadius: 2,
            input: { color: '#fff' },
            textarea: { color: '#fff' },
            label: { color: '#ffe066' },
          }}
          InputLabelProps={{ style: { color: '#ffe066' } }}
        />
        <Stack direction="row" spacing={2} justifyContent="center" mb={3}>
          <Button
            variant="contained"
            sx={{ bgcolor: '#ffe066', color: '#232946', fontWeight: 700, borderRadius: 3, '&:hover': { bgcolor: '#ffd700' } }}
            onClick={() => handleLLM('ask')}
            disabled={loading || !input.trim()}
          >
            Ask Your Knowledge Base
          </Button>
          <Button
            variant="outlined"
            sx={{ borderColor: '#ffe066', color: '#ffe066', fontWeight: 700, borderRadius: 3, '&:hover': { borderColor: '#ffd700', color: '#ffd700' } }}
            onClick={() => handleLLM('summarize')}
            disabled={loading || !input.trim()}
          >
            Ask LLM
          </Button>
        </Stack>
        {loading && <CircularProgress sx={{ color: '#ffe066', display: 'block', mx: 'auto', my: 2 }} />}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {response && (
          <Paper sx={{ p: 2, mt: 2, bgcolor: 'rgba(35,41,70,0.98)', color: '#fff', borderRadius: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ color: '#ffe066' }}>Response:</Typography>
            <FormattedLLMResponse response={response} />
          </Paper>
        )}
      </Paper>
    </Box>
  );
};

export default LLM; 