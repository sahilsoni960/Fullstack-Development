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
import NoteIcon from '@mui/icons-material/Note';
import SearchIcon from '@mui/icons-material/Search';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [deleteNote, setDeleteNote] = useState<Note | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [search, setSearch] = useState('');

  const fetchNotes = () => {
    setLoading(true);
    axios.get('/api/notes')
      .then(res => {
        setNotes(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch notes');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = () => {
    setSubmitting(true);
    axios.post('/api/notes', { title: newTitle, content: newContent })
      .then(() => {
        setOpen(false);
        setNewTitle('');
        setNewContent('');
        fetchNotes();
      })
      .catch(() => setError('Failed to add note'))
      .finally(() => setSubmitting(false));
  };

  const handleEditClick = (note: Note) => {
    setEditNote(note);
    setNewTitle(note.title);
    setNewContent(note.content);
    setOpen(true);
  };

  const handleEditNote = () => {
    if (!editNote) return;
    setSubmitting(true);
    axios.put(`/api/notes/${editNote.id}`, { title: newTitle, content: newContent })
      .then(() => {
        setOpen(false);
        setEditNote(null);
        setNewTitle('');
        setNewContent('');
        fetchNotes();
      })
      .catch(() => setError('Failed to update note'))
      .finally(() => setSubmitting(false));
  };

  const handleDeleteClick = (note: Note) => {
    setDeleteNote(note);
    setDeleteDialogOpen(true);
  };

  const handleDeleteNote = () => {
    if (!deleteNote) return;
    setSubmitting(true);
    axios.delete(`/api/notes/${deleteNote.id}`)
      .then(() => {
        setDeleteDialogOpen(false);
        setDeleteNote(null);
        fetchNotes();
      })
      .catch(() => setError('Failed to delete note'))
      .finally(() => setSubmitting(false));
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase())
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
        <Typography variant="h3" fontWeight={900} gutterBottom sx={{ color: '#ffe066', fontFamily: 'Inter, Roboto, Open Sans, Arial, sans-serif', letterSpacing: 1.5 }}>
          Notes
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SearchIcon sx={{ mr: 1, color: '#ffe066' }} />
          <TextField
            label="Search notes"
            variant="outlined"
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{
              width: 300,
              background: '#fff',
              borderRadius: 2,
            }}
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
            {filteredNotes.map(note => (
              <Grid item xs={12} key={note.id}>
                <Card elevation={8} sx={{ borderRadius: 6, bgcolor: 'rgba(35,41,70,0.98)', color: '#fff', p: 3, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Avatar sx={{ bgcolor: '#ffe066', mr: 2, width: 44, height: 44 }}>
                      <NoteIcon sx={{ color: '#232946', fontSize: 22 }} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography fontWeight={800} sx={{ color: '#fff', fontSize: 18, lineHeight: 1.2 }}>{note.title}</Typography>
                      <Typography sx={{ color: '#e0e0e0', fontSize: 15, lineHeight: 1.4 }}>{note.content}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton onClick={() => handleEditClick(note)} sx={{ color: '#ff6f91' }}><EditIcon /></IconButton>
                      <IconButton onClick={() => handleDeleteClick(note)} sx={{ color: '#ff6f91' }}><DeleteIcon /></IconButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
            {filteredNotes.length === 0 && (
              <Grid item xs={12}>
                <Typography color="#e0e0e0">No notes found.</Typography>
              </Grid>
            )}
          </Grid>
        )}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'absolute',
            bottom: 32,
            right: 32,
            zIndex: 1,
            bgcolor: '#ffe066',
            color: '#232946',
            '&:hover': { bgcolor: '#ffd700' },
          }}
          onClick={() => { setOpen(true); setEditNote(null); setNewTitle(''); setNewContent(''); }}
          title="Add Note"
        >
          <AddIcon />
        </Fab>
        <Dialog open={open} onClose={() => { setOpen(false); setEditNote(null); }}>
          <DialogTitle>{editNote ? 'Edit Note' : 'Add Note'}</DialogTitle>
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
              label="Content"
              fullWidth
              multiline
              minRows={3}
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpen(false); setEditNote(null); }} disabled={submitting}>Cancel</Button>
            {editNote ? (
              <Button onClick={handleEditNote} disabled={submitting || !newTitle.trim() || !newContent.trim()} variant="contained">Update</Button>
            ) : (
              <Button onClick={handleAddNote} disabled={submitting || !newTitle.trim() || !newContent.trim()} variant="contained">Add</Button>
            )}
          </DialogActions>
        </Dialog>
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Note</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this note?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleDeleteNote} color="error" disabled={submitting} variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Notes; 