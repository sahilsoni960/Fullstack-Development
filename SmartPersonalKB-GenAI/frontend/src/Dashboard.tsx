import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CircularProgress, Alert, List, ListItem, ListItemText, Grid, Avatar, Paper, Divider } from '@mui/material';
import NoteIcon from '@mui/icons-material/Note';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';

interface Note { id: number; title: string; content: string; createdAt: string; }
interface Snippet { id: number; title: string; content: string; language: string; createdAt: string; }
interface Document { id: number; title: string; content: string; createdAt: string; }

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get('/api/notes'),
      axios.get('/api/snippets'),
      axios.get('/api/documents'),
    ])
      .then(([notesRes, snippetsRes, documentsRes]) => {
        setNotes(notesRes.data);
        setSnippets(snippetsRes.data);
        setDocuments(documentsRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch dashboard data');
        setLoading(false);
      });
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: { xs: 1, md: 4 }, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'primary.main' }}>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        SmartPersonalKB-GenAI is your personal knowledge base powered by generative AI. Organize your thoughts, code, and files, and ask questions or get summaries using Gemini AI.
      </Typography>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={4} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mb: 2, width: 56, height: 56 }}>
                <NoteIcon fontSize="large" />
              </Avatar>
              <Typography variant="h6">Notes</Typography>
              <Typography variant="h3" fontWeight="bold">{notes.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={4} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mb: 2, width: 56, height: 56 }}>
                <CodeIcon fontSize="large" />
              </Avatar>
              <Typography variant="h6">Snippets</Typography>
              <Typography variant="h3" fontWeight="bold">{snippets.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={4} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mb: 2, width: 56, height: 56 }}>
                <DescriptionIcon fontSize="large" />
              </Avatar>
              <Typography variant="h6">Documents</Typography>
              <Typography variant="h3" fontWeight="bold">{documents.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ borderRadius: 3, p: 2, minHeight: 220 }}>
            <Typography variant="h6" gutterBottom>Recent Notes</Typography>
            <Divider sx={{ mb: 1 }} />
            <List>
              {notes.slice(-3).reverse().map(note => (
                <ListItem key={note.id} alignItems="flex-start">
                  <ListItemText primary={note.title} secondary={note.content} />
                </ListItem>
              ))}
              {notes.length === 0 && <ListItem><ListItemText primary="No notes yet." /></ListItem>}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ borderRadius: 3, p: 2, minHeight: 220 }}>
            <Typography variant="h6" gutterBottom>Recent Snippets</Typography>
            <Divider sx={{ mb: 1 }} />
            <List>
              {snippets.slice(-3).reverse().map(snippet => (
                <ListItem key={snippet.id} alignItems="flex-start">
                  <ListItemText primary={snippet.title + (snippet.language ? ` [${snippet.language}]` : '')} secondary={snippet.content} />
                </ListItem>
              ))}
              {snippets.length === 0 && <ListItem><ListItemText primary="No snippets yet." /></ListItem>}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ borderRadius: 3, p: 2, minHeight: 220 }}>
            <Typography variant="h6" gutterBottom>Recent Documents</Typography>
            <Divider sx={{ mb: 1 }} />
            <List>
              {documents.slice(-3).reverse().map(document => (
                <ListItem key={document.id} alignItems="flex-start">
                  <ListItemText primary={document.title} secondary={document.content} />
                </ListItem>
              ))}
              {documents.length === 0 && <ListItem><ListItemText primary="No documents yet." /></ListItem>}
            </List>
          </Paper>
        </Grid>
      </Grid>
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Examples</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">Note Example</Typography>
              <Typography variant="body2">Title: <b>Grocery List</b></Typography>
              <Typography variant="body2">Content: Milk, Eggs, Bread, Coffee</Typography>
              <Typography variant="caption" color="text.secondary">Use notes for quick reminders or ideas.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">Snippet Example</Typography>
              <Typography variant="body2">Title: <b>Print to Console</b></Typography>
              <Typography variant="body2">Language: JavaScript</Typography>
              <Typography variant="body2" component="pre" sx={{ background: '#f5f5f5', p: 1, borderRadius: 1 }}>
                {`console.log("Hello, world!");`}
              </Typography>
              <Typography variant="caption" color="text.secondary">Use snippets to save reusable code or commands.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">Document Example</Typography>
              <Typography variant="body2">Title: <b>Project Proposal</b></Typography>
              <Typography variant="body2">File Path: /docs/proposal.pdf</Typography>
              <Typography variant="caption" color="text.secondary">Use documents to reference important files.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 