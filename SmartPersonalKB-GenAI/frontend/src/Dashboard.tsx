import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CircularProgress, Alert, List, ListItem, ListItemText } from '@mui/material';
import Grid from '@mui/material/Grid';

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

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        <b>SmartPersonalKB-GenAI</b> is your personal knowledge base powered by generative AI. Organize your thoughts, code, and files, and ask questions or get summaries using Gemini AI.<br/>
        <b>Notes:</b> Quick thoughts, reminders, or ideas.<br/>
        <b>Snippets:</b> Useful code or text blocks you want to reuse.<br/>
        <b>Documents:</b> References to important files or resources.
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Notes</Typography>
              <Typography variant="h3">{notes.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Snippets</Typography>
              <Typography variant="h3">{snippets.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Documents</Typography>
              <Typography variant="h3">{documents.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Notes</Typography>
              <List>
                {notes.slice(-3).reverse().map(note => (
                  <ListItem key={note.id}>
                    <ListItemText primary={note.title} secondary={note.content} />
                  </ListItem>
                ))}
                {notes.length === 0 && <ListItem><ListItemText primary="No notes yet." /></ListItem>}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Snippets</Typography>
              <List>
                {snippets.slice(-3).reverse().map(snippet => (
                  <ListItem key={snippet.id}>
                    <ListItemText primary={snippet.title + (snippet.language ? ` [${snippet.language}]` : '')} secondary={snippet.content} />
                  </ListItem>
                ))}
                {snippets.length === 0 && <ListItem><ListItemText primary="No snippets yet." /></ListItem>}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Documents</Typography>
              <List>
                {documents.slice(-3).reverse().map(document => (
                  <ListItem key={document.id}>
                    <ListItemText primary={document.title} secondary={document.content} />
                  </ListItem>
                ))}
                {documents.length === 0 && <ListItem><ListItemText primary="No documents yet." /></ListItem>}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Examples</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1"><b>Note Example</b></Typography>
                <Typography variant="body2">Title: <b>Grocery List</b></Typography>
                <Typography variant="body2">Content: Milk, Eggs, Bread, Coffee</Typography>
                <Typography variant="caption" color="text.secondary">Use notes for quick reminders or ideas.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1"><b>Snippet Example</b></Typography>
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
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1"><b>Document Example</b></Typography>
                <Typography variant="body2">Title: <b>Project Proposal</b></Typography>
                <Typography variant="body2">File Path: /docs/proposal.pdf</Typography>
                <Typography variant="caption" color="text.secondary">Use documents to reference important files.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard; 