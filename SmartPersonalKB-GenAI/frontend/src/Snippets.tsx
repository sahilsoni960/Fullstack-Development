import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Card, CardContent, CircularProgress, Alert,
  Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, IconButton, Grid, Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CodeIcon from '@mui/icons-material/Code';
import SearchIcon from '@mui/icons-material/Search';

interface Snippet {
  id: number;
  title: string;
  content: string;
  language: string;
  createdAt: string;
  code?: string;
}

const Snippets: React.FC = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editSnippet, setEditSnippet] = useState<Snippet | null>(null);
  const [deleteSnippet, setDeleteSnippet] = useState<Snippet | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [search, setSearch] = useState('');

  const fetchSnippets = () => {
    setLoading(true);
    axios.get('/api/snippets')
      .then(res => {
        setSnippets(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch snippets');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  const handleAddSnippet = () => {
    setSubmitting(true);
    axios.post('/api/snippets', { title: newTitle, code: newContent, language: newLanguage })
      .then(() => {
        setOpen(false);
        setNewTitle('');
        setNewContent('');
        setNewLanguage('');
        fetchSnippets();
      })
      .catch(() => setError('Failed to add snippet'))
      .finally(() => setSubmitting(false));
  };

  const handleEditClick = (snippet: Snippet) => {
    setEditSnippet(snippet);
    setNewTitle(snippet.title || '');
    setNewContent(snippet.content || '');
    setNewLanguage(snippet.language || '');
    setOpen(true);
  };

  const handleEditSnippet = () => {
    if (!editSnippet) return;
    setSubmitting(true);
    axios.put(`/api/snippets/${editSnippet.id}`, { title: newTitle, code: newContent, language: newLanguage })
      .then(() => {
        setOpen(false);
        setEditSnippet(null);
        setNewTitle('');
        setNewContent('');
        setNewLanguage('');
        fetchSnippets();
      })
      .catch(() => setError('Failed to update snippet'))
      .finally(() => setSubmitting(false));
  };

  const handleDeleteClick = (snippet: Snippet) => {
    setDeleteSnippet(snippet);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSnippet = () => {
    if (!deleteSnippet) return;
    setSubmitting(true);
    axios.delete(`/api/snippets/${deleteSnippet.id}`)
      .then(() => {
        setDeleteDialogOpen(false);
        setDeleteSnippet(null);
        fetchSnippets();
      })
      .catch(() => setError('Failed to delete snippet'))
      .finally(() => setSubmitting(false));
  };

  const filteredSnippets = snippets.filter(snippet =>
    snippet.title.toLowerCase().includes(search.toLowerCase()) ||
    (snippet.code || '').toLowerCase().includes(search.toLowerCase()) ||
    snippet.language.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        p: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 700,
          minHeight: '80vh',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 4,
          boxShadow: 3,
          p: 4,
          position: 'relative',
          mt: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'primary.main' }}>
          Snippets
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SearchIcon sx={{ mr: 1 }} />
          <TextField
            label="Search snippets"
            variant="outlined"
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ width: 300 }}
          />
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredSnippets.map(snippet => (
              <Grid item xs={12} sm={6} md={4} key={snippet.id}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                        <CodeIcon />
                      </Avatar>
                      <Typography variant="h6">{snippet.title}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Language: {snippet.language}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, background: '#f5f5f5', p: 1, borderRadius: 1, fontFamily: 'monospace' }}>
                      {snippet.code}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton onClick={() => handleEditClick(snippet)}><EditIcon /></IconButton>
                      <IconButton onClick={() => handleDeleteClick(snippet)}><DeleteIcon /></IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {filteredSnippets.length === 0 && (
              <Grid item xs={12}>
                <Typography color="text.secondary">No snippets found.</Typography>
              </Grid>
            )}
          </Grid>
        )}
        <Fab
          color="secondary"
          aria-label="add"
          sx={{
            position: 'absolute',
            bottom: 32,
            right: 32,
            zIndex: 1,
          }}
          onClick={() => { setOpen(true); setEditSnippet(null); setNewTitle(''); setNewContent(''); setNewLanguage(''); }}
          title="Add Snippet"
        >
          <AddIcon />
        </Fab>
        <Dialog open={open} onClose={() => { setOpen(false); setEditSnippet(null); }}>
          <DialogTitle>{editSnippet ? 'Edit Snippet' : 'Add Snippet'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Language"
              fullWidth
              value={newLanguage}
              onChange={e => setNewLanguage(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Code"
              fullWidth
              multiline
              minRows={3}
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpen(false); setEditSnippet(null); }} disabled={submitting}>Cancel</Button>
            {editSnippet ? (
              <Button onClick={handleEditSnippet} disabled={submitting || !(newTitle || '').trim() || !(newContent || '').trim() || !(newLanguage || '').trim()} variant="contained">Update</Button>
            ) : (
              <Button onClick={handleAddSnippet} disabled={submitting || !(newTitle || '').trim() || !(newContent || '').trim() || !(newLanguage || '').trim()} variant="contained">Add</Button>
            )}
          </DialogActions>
        </Dialog>
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Snippet</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this snippet?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleDeleteSnippet} color="error" disabled={submitting} variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Snippets; 