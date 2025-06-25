import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, CircularProgress, Alert, Paper } from '@mui/material';

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
        setResponse(res.data.response || res.data.summary || JSON.stringify(res.data));
      })
      .catch(() => setError('Failed to get response from LLM'))
      .finally(() => setLoading(false));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>LLM Q&amp;A / Summarization</Typography>
      <TextField
        label="Ask a question or enter text to summarize"
        multiline
        minRows={4}
        fullWidth
        value={input}
        onChange={e => setInput(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" onClick={() => handleLLM('ask')} disabled={loading || !input.trim()}>
          Ask
        </Button>
        <Button variant="outlined" onClick={() => handleLLM('summarize')} disabled={loading || !input.trim()}>
          Summarize
        </Button>
      </Box>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {response && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Response:</Typography>
          <Typography>{response}</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default LLM; 