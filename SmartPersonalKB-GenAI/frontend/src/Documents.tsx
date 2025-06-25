import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, List, ListItem, ListItemText, Card, CardContent, CircularProgress, Alert,
  Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import ListItemIcon from '@mui/material/ListItemIcon';

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

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Documents</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SearchIcon sx={{ mr: 1 }} />
        <TextField
          label="Search documents"
          variant="outlined"
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ width: 300 }}
        />
      </Box>
      <List>
        {filteredDocuments.map(document => (
          <Card key={document.id} sx={{ mb: 2 }}>
            <CardContent>
              <ListItem
                secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(document)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(document)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemIcon><DescriptionIcon /></ListItemIcon>
                <ListItemText
                  primary={document.title}
                  secondary={document.filePath}
                />
              </ListItem>
            </CardContent>
          </Card>
        ))}
      </List>
      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 32, right: 32 }} onClick={() => { setOpen(true); setEditDocument(null); setNewTitle(''); setNewFilePath(''); }}>
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
  );
};

export default Documents; 