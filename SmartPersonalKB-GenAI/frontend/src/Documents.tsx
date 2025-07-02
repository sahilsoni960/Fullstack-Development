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
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';

interface Document {
  id: number;
  title: string;
  filePath: string;
  createdAt: string;
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFilePath, setNewFilePath] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editDocument, setEditDocument] = useState<Document | null>(null);
  const [deleteDocument, setDeleteDocument] = useState<Document | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [search, setSearch] = useState('');

  const fetchDocuments = () => {
    setLoading(true);
    axios.get('/api/documents')
      .then(res => {
        setDocuments(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch documents');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleAddDocument = () => {
    setSubmitting(true);
    axios.post('/api/documents', { title: newTitle, filePath: newFilePath })
      .then(() => {
        setOpen(false);
        setNewTitle('');
        setNewFilePath('');
        fetchDocuments();
      })
      .catch(() => setError('Failed to add document'))
      .finally(() => setSubmitting(false));
  };

  const handleEditClick = (document: Document) => {
    setEditDocument(document);
    setNewTitle(document.title);
    setNewFilePath(document.filePath);
    setOpen(true);
  };

  const handleEditDocument = () => {
    if (!editDocument) return;
    setSubmitting(true);
    axios.put(`/api/documents/${editDocument.id}`, { title: newTitle, filePath: newFilePath })
      .then(() => {
        setOpen(false);
        setEditDocument(null);
        setNewTitle('');
        setNewFilePath('');
        fetchDocuments();
      })
      .catch(() => setError('Failed to update document'))
      .finally(() => setSubmitting(false));
  };

  const handleDeleteClick = (document: Document) => {
    setDeleteDocument(document);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDocument = () => {
    if (!deleteDocument) return;
    setSubmitting(true);
    axios.delete(`/api/documents/${deleteDocument.id}`)
      .then(() => {
        setDeleteDialogOpen(false);
        setDeleteDocument(null);
        fetchDocuments();
      })
      .catch(() => setError('Failed to delete document'))
      .finally(() => setSubmitting(false));
  };

  const filteredDocuments = documents.filter(document =>
    document.title.toLowerCase().includes(search.toLowerCase()) ||
    document.filePath.toLowerCase().includes(search.toLowerCase())
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
        <Typography variant="h3" fontWeight={900} gutterBottom sx={{ color: '#43e97b', fontFamily: 'Inter, Roboto, Open Sans, Arial, sans-serif', letterSpacing: 1.5 }}>
          Documents
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SearchIcon sx={{ mr: 1, color: '#43e97b' }} />
          <TextField
            label="Search documents"
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
            {filteredDocuments.map(document => (
              <Grid item xs={12} key={document.id}>
                <Card elevation={8} sx={{ borderRadius: 6, bgcolor: 'rgba(35,41,70,0.98)', color: '#fff', p: 3, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Avatar sx={{ bgcolor: '#43e97b', mr: 2, width: 44, height: 44 }}>
                      <DescriptionIcon sx={{ color: '#232946', fontSize: 22 }} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography fontWeight={800} sx={{ color: '#fff', fontSize: 18, lineHeight: 1.2 }}>{document.title}</Typography>
                      <Typography sx={{ color: '#e0e0e0', fontSize: 15, lineHeight: 1.4 }}>{document.filePath || document.content}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton onClick={() => handleEditClick(document)} sx={{ color: '#ff6f91' }}><EditIcon /></IconButton>
                      <IconButton onClick={() => handleDeleteClick(document)} sx={{ color: '#ff6f91' }}><DeleteIcon /></IconButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
            {filteredDocuments.length === 0 && (
              <Grid item xs={12}>
                <Typography color="#e0e0e0">No documents found.</Typography>
              </Grid>
            )}
          </Grid>
        )}
        <Fab
          color="success"
          aria-label="add"
          sx={{
            position: 'absolute',
            bottom: 32,
            right: 32,
            zIndex: 1,
            bgcolor: '#43e97b',
            color: '#232946',
            '&:hover': { bgcolor: '#22c55e' },
          }}
          onClick={() => { setOpen(true); setEditDocument(null); setNewTitle(''); setNewFilePath(''); }}
          title="Add Document"
        >
          <AddIcon />
        </Fab>
        <Dialog open={open} onClose={() => { setOpen(false); setEditDocument(null); }}>
          <DialogTitle>{editDocument ? 'Edit Document' : 'Add Document'}</DialogTitle>
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
              label="File Path"
              fullWidth
              value={newFilePath}
              onChange={e => setNewFilePath(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpen(false); setEditDocument(null); }} disabled={submitting}>Cancel</Button>
            {editDocument ? (
              <Button onClick={handleEditDocument} disabled={submitting || !newTitle.trim() || !newFilePath.trim()} variant="contained">Update</Button>
            ) : (
              <Button onClick={handleAddDocument} disabled={submitting || !newTitle.trim() || !newFilePath.trim()} variant="contained">Add</Button>
            )}
          </DialogActions>
        </Dialog>
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Document</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this document?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleDeleteDocument} color="error" disabled={submitting} variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Documents; 