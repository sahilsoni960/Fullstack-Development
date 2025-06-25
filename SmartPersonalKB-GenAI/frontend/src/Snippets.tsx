import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, List, ListItem, ListItemText, Card, CardContent, CircularProgress, Alert,
  Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CodeIcon from '@mui/icons-material/Code';
import SearchIcon from '@mui/icons-material/Search';
import ListItemIcon from '@mui/material/ListItemIcon';

interface Snippet {
  id: number;
  title: string;
  code: string;
  language: string;
  createdAt: string;
}

const Snippets: React.FC = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
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
    axios.post('/api/snippets', { title: newTitle, code: newCode, language: newLanguage })
      .then(() => {
        setOpen(false);
        setNewTitle('');
        setNewCode('');
        setNewLanguage('');
        fetchSnippets();
      })
      .catch(() => setError('Failed to add snippet'))
      .finally(() => setSubmitting(false));
  };

  const handleEditClick = (snippet: Snippet) => {
    setEditSnippet(snippet);
    setNewTitle(snippet.title);
    setNewCode(snippet.code);
    setNewLanguage(snippet.language);
    setOpen(true);
  };

  const handleEditSnippet = () => {
    if (!editSnippet) return;
    setSubmitting(true);
    axios.put(`/api/snippets/${editSnippet.id}`, { title: newTitle, code: newCode, language: newLanguage })
      .then(() => {
        setOpen(false);
        setEditSnippet(null);
        setNewTitle('');
        setNewCode('');
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
    snippet.code.toLowerCase().includes(search.toLowerCase()) ||
    snippet.language.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Snippets</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
      <List>
        {filteredSnippets.map(snippet => (
          <Card key={snippet.id} sx={{ mb: 2 }}>
            <CardContent>
              <ListItem
                secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(snippet)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(snippet)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemIcon><CodeIcon /></ListItemIcon>
                <ListItemText
                  primary={snippet.title + (snippet.language ? ` [${snippet.language}]` : '')}
                  secondary={snippet.code}
                />
              </ListItem>
            </CardContent>
          </Card>
        ))}
      </List>
      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 32, right: 32 }} onClick={() => { setOpen(true); setEditSnippet(null); setNewTitle(''); setNewCode(''); setNewLanguage(''); }}>
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
            value={newCode}
            onChange={e => setNewCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); setEditSnippet(null); }} disabled={submitting}>Cancel</Button>
          {editSnippet ? (
            <Button onClick={handleEditSnippet} disabled={submitting || !newTitle.trim() || !newCode.trim() || !newLanguage.trim()} variant="contained">Update</Button>
          ) : (
            <Button onClick={handleAddSnippet} disabled={submitting || !newTitle.trim() || !newCode.trim() || !newLanguage.trim()} variant="contained">Add</Button>
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
  );
};

export default Snippets; 