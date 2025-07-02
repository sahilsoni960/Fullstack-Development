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
        background: 'none',
        p: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 700,
          minHeight: '80vh',
          background: 'rgba(35,41,70,0.85)',
          borderRadius: 6,
          boxShadow: 4,
          p: 4,
          position: 'relative',
          mt: 4,
        }}
      >
        <Typography variant="h3" fontWeight={900} gutterBottom sx={{ color: '#845ec2', fontFamily: 'Inter, Roboto, Open Sans, Arial, sans-serif', letterSpacing: 1.5 }}>
          Snippets
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SearchIcon sx={{ mr: 1, color: '#845ec2' }} />
          <TextField
            label="Search snippets"
            variant="outlined"
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ width: 300, background: '#fff', borderRadius: 2 }}
            InputProps={{ style: { color: '#232946' } }}
            InputLabelProps={{ style: { color: '#232946' } }}
          />
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredSnippets.map(snippet => (
              <Grid item xs={12} key={snippet.id}>
                <Card elevation={8} sx={{ borderRadius: 6, bgcolor: 'rgba(35,41,70,0.98)', color: '#fff', p: 3, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Avatar sx={{ bgcolor: '#845ec2', mr: 2, width: 44, height: 44 }}>
                      <CodeIcon sx={{ color: '#fff', fontSize: 22 }} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography fontWeight={800} sx={{ color: '#fff', fontSize: 18, lineHeight: 1.2 }}>{snippet.title}</Typography>
                      <Typography sx={{ color: '#e0e0e0', fontSize: 15, lineHeight: 1.4 }}>{snippet.code || snippet.content}</Typography>
                      <Typography sx={{ color: '#e0e0e0', fontSize: 13, fontStyle: 'italic' }}>{snippet.language}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton onClick={() => handleEditClick(snippet)} sx={{ color: '#ff6f91' }}><EditIcon /></IconButton>
                      <IconButton onClick={() => handleDeleteClick(snippet)} sx={{ color: '#ff6f91' }}><DeleteIcon /></IconButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
            {filteredSnippets.length === 0 && (
              <Grid item xs={12}>
                <Typography color="#e0e0e0">No snippets found.</Typography>
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
            bgcolor: '#845ec2',
            color: '#fff',
            '&:hover': { bgcolor: '#6d3bbd' },
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