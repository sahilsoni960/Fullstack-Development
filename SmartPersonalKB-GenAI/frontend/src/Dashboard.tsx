import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Card, CardContent, CircularProgress, Alert, List, ListItem, ListItemText, Grid, Avatar, Paper, Divider, Button, Collapse, IconButton, Tooltip
} from '@mui/material';
import NoteIcon from '@mui/icons-material/Note';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface Note { id: number; title: string; content: string; createdAt: string; }
interface Snippet { id: number; title: string; code?: string; content?: string; language: string; createdAt: string; }
interface Document { id: number; title: string; content?: string; filePath?: string; createdAt: string; }

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotes, setShowNotes] = useState(true);
  const [showSnippets, setShowSnippets] = useState(true);
  const [showDocuments, setShowDocuments] = useState(true);

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
    <Box sx={{
      p: { xs: 1, md: 5 },
      background: 'none',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Box sx={{ width: '100%', maxWidth: 1200 }}>
        <Typography
          variant="h3"
          fontWeight={900}
          gutterBottom
          sx={{
            color: '#fff',
            fontFamily: 'Inter, Roboto, Open Sans, Arial, sans-serif',
            letterSpacing: 1.5,
            mb: 1.5,
          }}
        >
          Dashboard
        </Typography>
        <Typography
          variant="subtitle1"
          color="#e0e0e0"
          mb={5}
          sx={{ fontSize: 18, maxWidth: 700 }}
        >
          Your personal knowledge base powered by generative AI. Organize your thoughts, code, and files, and ask questions or get summaries using Gemini AI.
        </Typography>
        <Grid container spacing={4} mb={6} justifyContent="center">
          <Grid item>
            <Card elevation={8} sx={{ borderRadius: 6, p: 3, minWidth: 220, minHeight: 260, bgcolor: 'rgba(35,41,70,0.98)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
              <Avatar sx={{ bgcolor: '#ffe066', mb: 2, width: 56, height: 56 }}>
                <NoteIcon sx={{ color: '#232946' }} fontSize="large" />
              </Avatar>
              <Typography variant="h6" fontWeight={700} sx={{ color: '#fff' }}>Notes</Typography>
              <Typography variant="h2" fontWeight={900} sx={{ color: '#ffe066' }}>{notes.length}</Typography>
              <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 2, bgcolor: '#ffe066', color: '#232946', fontWeight: 700, borderRadius: 3, '&:hover': { bgcolor: '#ffd700' } }} href="/notes">Add Note</Button>
            </Card>
          </Grid>
          <Grid item>
            <Card elevation={8} sx={{ borderRadius: 6, p: 3, minWidth: 220, minHeight: 260, bgcolor: 'rgba(35,41,70,0.98)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
              <Avatar sx={{ bgcolor: '#845ec2', mb: 2, width: 56, height: 56 }}>
                <CodeIcon sx={{ color: '#fff' }} fontSize="large" />
              </Avatar>
              <Typography variant="h6" fontWeight={700} sx={{ color: '#fff' }}>Snippets</Typography>
              <Typography variant="h2" fontWeight={900} sx={{ color: '#845ec2' }}>{snippets.length}</Typography>
              <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 2, bgcolor: '#845ec2', color: '#fff', fontWeight: 700, borderRadius: 3, '&:hover': { bgcolor: '#6d3bbd' } }} href="/snippets">Add Snippet</Button>
            </Card>
          </Grid>
          <Grid item>
            <Card elevation={8} sx={{ borderRadius: 6, p: 3, minWidth: 220, minHeight: 260, bgcolor: 'rgba(35,41,70,0.98)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
              <Avatar sx={{ bgcolor: '#43e97b', mb: 2, width: 56, height: 56 }}>
                <DescriptionIcon sx={{ color: '#232946' }} fontSize="large" />
              </Avatar>
              <Typography variant="h6" fontWeight={700} sx={{ color: '#fff' }}>Documents</Typography>
              <Typography variant="h2" fontWeight={900} sx={{ color: '#43e97b' }}>{documents.length}</Typography>
              <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 2, bgcolor: '#43e97b', color: '#232946', fontWeight: 700, borderRadius: 3, '&:hover': { bgcolor: '#22c55e' } }} href="/documents">Add Document</Button>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ borderRadius: 6, p: 3, minHeight: 220, bgcolor: 'rgba(35,41,70,0.98)', color: '#fff', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.20)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" fontWeight={800} sx={{ color: '#fff' }}>Recent Notes</Typography>
                <Tooltip title={showNotes ? 'Hide' : 'Show'}>
                  <IconButton onClick={() => setShowNotes(v => !v)} sx={{ color: '#ffe066' }}>
                    {showNotes ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 2, bgcolor: '#fff', opacity: 0.12 }} />
              <Collapse in={showNotes}>
                <List>
                  {notes.slice(-3).reverse().map(note => (
                    <ListItem key={note.id} alignItems="flex-start" sx={{ mb: 1, p: 0 }} disableGutters>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Avatar sx={{ bgcolor: '#ffe066', mr: 2, width: 44, height: 44 }}>
                          <NoteIcon sx={{ color: '#232946', fontSize: 22 }} />
                        </Avatar>
                        <Box>
                          <Typography fontWeight={800} sx={{ color: '#fff', fontSize: 18, lineHeight: 1.2 }}>{note.title}</Typography>
                          <Typography sx={{ color: '#e0e0e0', fontSize: 15, lineHeight: 1.4 }}>{note.content}</Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                  {notes.length === 0 && <ListItem><ListItemText primary={<span style={{ color: '#e0e0e0' }}>No notes yet.</span>} /></ListItem>}
                </List>
              </Collapse>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ borderRadius: 6, p: 3, minHeight: 220, bgcolor: 'rgba(35,41,70,0.98)', color: '#fff', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.20)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" fontWeight={800} sx={{ color: '#fff' }}>Recent Snippets</Typography>
                <Tooltip title={showSnippets ? 'Hide' : 'Show'}>
                  <IconButton onClick={() => setShowSnippets(v => !v)} sx={{ color: '#845ec2' }}>
                    {showSnippets ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 2, bgcolor: '#fff', opacity: 0.12 }} />
              <Collapse in={showSnippets}>
                <List>
                  {snippets.slice(-3).reverse().map(snippet => (
                    <ListItem key={snippet.id} alignItems="flex-start" sx={{ mb: 1, p: 0 }} disableGutters>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Avatar sx={{ bgcolor: '#845ec2', mr: 2, width: 44, height: 44 }}>
                          <CodeIcon sx={{ color: '#fff', fontSize: 22 }} />
                        </Avatar>
                        <Box>
                          <Typography fontWeight={800} sx={{ color: '#fff', fontSize: 18, lineHeight: 1.2 }}>{snippet.title + (snippet.language ? ` [${snippet.language}]` : '')}</Typography>
                          <Typography sx={{ color: '#e0e0e0', fontSize: 15, lineHeight: 1.4 }}>{snippet.code || snippet.content}</Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                  {snippets.length === 0 && <ListItem><ListItemText primary={<span style={{ color: '#e0e0e0' }}>No snippets yet.</span>} /></ListItem>}
                </List>
              </Collapse>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ borderRadius: 6, p: 3, minHeight: 220, bgcolor: 'rgba(35,41,70,0.98)', color: '#fff', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.20)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" fontWeight={800} sx={{ color: '#fff' }}>Recent Documents</Typography>
                <Tooltip title={showDocuments ? 'Hide' : 'Show'}>
                  <IconButton onClick={() => setShowDocuments(v => !v)} sx={{ color: '#43e97b' }}>
                    {showDocuments ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 2, bgcolor: '#fff', opacity: 0.12 }} />
              <Collapse in={showDocuments}>
                <List>
                  {documents.slice(-3).reverse().map(document => (
                    <ListItem key={document.id} alignItems="flex-start" sx={{ mb: 1, p: 0 }} disableGutters>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Avatar sx={{ bgcolor: '#43e97b', mr: 2, width: 44, height: 44 }}>
                          <DescriptionIcon sx={{ color: '#232946', fontSize: 22 }} />
                        </Avatar>
                        <Box>
                          <Typography fontWeight={800} sx={{ color: '#fff', fontSize: 18, lineHeight: 1.2 }}>{document.title}</Typography>
                          <Typography sx={{ color: '#e0e0e0', fontSize: 15, lineHeight: 1.4 }}>{document.filePath || document.content}</Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                  {documents.length === 0 && <ListItem><ListItemText primary={<span style={{ color: '#e0e0e0' }}>No documents yet.</span>} /></ListItem>}
                </List>
              </Collapse>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard; 