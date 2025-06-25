import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, List, ListItem, ListItemText, Card, CardContent, CircularProgress, Alert,
  Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Notes</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SearchIcon sx={{ mr: 1 }} />
        <TextField
          label="Search notes"
          variant="outlined"
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ width: 300 }}
        />
      </Box>
      <List>
        {filteredNotes.map(note => (
          <Card key={note.id} sx={{ mb: 2 }}>
            <CardContent>
              <ListItem
                secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(note)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(note)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={note.title}
                  secondary={note.content}
                />
              </ListItem>
            </CardContent>
          </Card>
        ))}
      </List>
      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 32, right: 32 }} onClick={() => { setOpen(true); setEditNote(null); setNewTitle(''); setNewContent(''); }}>
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
  );
};

export default Notes; 