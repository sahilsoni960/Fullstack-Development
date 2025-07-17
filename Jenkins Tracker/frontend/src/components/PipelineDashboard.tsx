import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  CircularProgress,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Collapse,
  Drawer,
  Divider,
  Switch
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface Stage {
  name: string;
  status: string;
  id?: string;
  error?: { message: string; type: string };
  // Remove children and is_leaf
}

interface PipelineData {
  pipeline_name: string;
  build_number: string;
  stages: Stage[];
  status: string;
  startTimeMillis?: number;
  endTimeMillis?: number;
}

const STATUS_MAP: Record<string, { color: 'success' | 'error' | 'warning' | 'default'; icon?: React.ReactElement }> = {
  SUCCESS: { color: 'success', icon: <CheckCircleIcon color="success" /> },
  FAILED: { color: 'error', icon: <ErrorIcon color="error" /> },
  FAILURE: { color: 'error', icon: <ErrorIcon color="error" /> },
  IN_PROGRESS: { color: 'warning', icon: <HourglassEmptyIcon color="warning" /> },
  PAUSED: { color: 'warning', icon: <HourglassEmptyIcon color="warning" /> },
  ABORTED: { color: 'error', icon: <ErrorIcon color="error" /> },
  null: { color: 'default', icon: <ErrorIcon color="disabled" /> },
};

function getStatusProps(status: string) {
  return STATUS_MAP[status] || { color: 'default', icon: undefined };
}

const PipelineDashboard: React.FC = () => {
  const [data, setData] = useState<PipelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Log modal state
  const [logDrawerOpen, setLogDrawerOpen] = useState(false);
  const [logLoading, setLogLoading] = useState(false);
  const [logError, setLogError] = useState<string | null>(null);
  const [logContent, setLogContent] = useState('');
  const [logStage, setLogStage] = useState<Stage | null>(null);
  const [downstreamConsoleUrl, setDownstreamConsoleUrl] = useState<string | null>(null);
  const [runSearchMode, setRunSearchMode] = useState<'auto' | 'always'>('auto');
  const [jiraLinks, setJiraLinks] = useState<string[]>([]);

  // Remove expanded state and recursive rendering

  useEffect(() => {
    fetch('http://localhost:8000/pipeline/status')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleViewLog = (stage: Stage) => {
    setLogDrawerOpen(true);
    setLogLoading(true);
    setLogError(null);
    setLogContent('');
    setDownstreamConsoleUrl(null);
    setLogStage(stage);
    setJiraLinks([]);
    fetch(`http://localhost:8000/pipeline/log/${data?.build_number}/${stage.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ run_search: runSearchMode })
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          setLogError(json.error);
        } else if (json.downstream_console_url) {
          setDownstreamConsoleUrl(json.downstream_console_url);
        } else if (json.log) {
          setLogContent(json.log);
          let summaryText = null;
          if (json.summary) {
            if (typeof json.summary === 'string') {
              summaryText = json.summary;
            } else if (typeof json.summary === 'object' && json.summary !== null && typeof json.summary.summary === 'string') {
              summaryText = json.summary.summary;
            }
          }
          (window as any).lastLogSummary = summaryText;
          if (json.document_ids && Array.isArray(json.document_ids)) {
            setJiraLinks(json.document_ids);
          }
        } else if (json.summary) {
          // If summary is present at top level (new backend behavior)
          let summaryText = null;
          if (typeof json.summary === 'string') {
            summaryText = json.summary;
          } else if (typeof json.summary === 'object' && json.summary !== null && typeof json.summary.summary === 'string') {
            summaryText = json.summary.summary;
          }
          (window as any).lastLogSummary = summaryText;
          if (json.document_ids && Array.isArray(json.document_ids)) {
            setJiraLinks(json.document_ids);
          }
        }
        setLogLoading(false);
      })
      .catch((err) => {
        setLogError(err.message);
        setLogLoading(false);
      });
  };

  const handleCloseLog = () => {
    setLogDrawerOpen(false);
    setLogContent('');
    setLogError(null);
    setLogStage(null);
  };

  // Remove handleExpand

  // Recursive row renderer
  // Remove renderStageRow

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress />
    </Box>
  );
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!data) return <Typography>No data available.</Typography>;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6, p: 2 }}>
      <Card elevation={4} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" fontWeight={700} gutterBottom align="center">
            Jenkins Pipeline Dashboard
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" alignItems="center" mb={3}>
            <Typography variant="subtitle1"><b>Pipeline:</b> #{data.pipeline_name}</Typography>
            <Typography variant="subtitle1"><b>Build #:</b> {data.build_number}</Typography>
            <Chip
              label={data.status}
              color={getStatusProps(data.status).color}
              icon={getStatusProps(data.status).icon}
              sx={{ fontWeight: 600, fontSize: 16 }}
            />
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Run Search: Auto</Typography>
              <Switch
                checked={runSearchMode === 'always'}
                onChange={e => setRunSearchMode(e.target.checked ? 'always' : 'auto')}
                color="primary"
              />
              <Typography>Always</Typography>
            </Stack>
          </Stack>
          <TableContainer component={Card} sx={{ mt: 2, boxShadow: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: 18 }}>Stage</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 18 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 18 }}>Error</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 18 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.stages.map((stage, idx) => (
                  <TableRow hover key={stage.id || idx}>
                    <TableCell sx={{ fontSize: 16 }}>{stage.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={stage.status}
                        color={getStatusProps(stage.status).color}
                        icon={getStatusProps(stage.status).icon}
                        sx={{ fontWeight: 500, fontSize: 15 }}
                      />
                    </TableCell>
                    <TableCell>
                      {stage.status === 'FAILED' && stage.error && (
                        <Typography color="error" sx={{ fontSize: 13 }}>{stage.error.message}</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {stage.status === 'FAILED' && stage.id && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewLog(stage)}
                        >
                          View Log
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <Drawer
        anchor="right"
        open={logDrawerOpen}
        onClose={handleCloseLog}
        PaperProps={{ sx: { width: { xs: '100%', sm: '60%', md: '50%' }, maxWidth: 900, background: '#181818', color: '#fff' } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #333' }}>
          <Typography variant="h6" fontWeight={700}>Stage Log: {logStage?.name}</Typography>
          <IconButton aria-label="close" onClick={handleCloseLog}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ height: 'calc(100% - 64px)', display: 'flex', flexDirection: 'column' }}>
          {/* Top half: Console Log */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2, fontFamily: 'monospace', background: '#111', borderBottom: '1px solid #333' }}>
            {logLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
                <CircularProgress color="inherit" />
              </Box>
            ) : logError ? (
              <Typography color="error">Error: {logError}</Typography>
            ) : downstreamConsoleUrl ? (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={100}>
                <Typography sx={{ mb: 2 }}>
                  This stage triggered a downstream Jenkins job. Click below to view the full log in Jenkins:
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  href={downstreamConsoleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Full Log in Jenkins
                </Button>
              </Box>
            ) : (
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>{logContent}</pre>
            )}
          </Box>
          {/* Bottom half: AI Summary */}
          {logStage && (logStage.status === 'FAILED' || logStage.status === 'FAILURE' || logStage.status === 'ERROR') && !logLoading && !logError && !downstreamConsoleUrl && (
            <>
              <Divider sx={{ bgcolor: '#333' }} />
              <Box sx={{ flex: 1, overflowY: 'auto', p: 2, background: '#181818' }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>AI Summary</Typography>
                {logContent && typeof (window as any).lastLogSummary === 'string' && (window as any).lastLogSummary ? (
                  <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{(window as any).lastLogSummary}</Typography>
                ) : (
                  <Typography color="text.secondary">No summary available.</Typography>
                )}
                {jiraLinks.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>Jira Link Ids:</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {jiraLinks.map((link, idx) => (
                        <Button
                          key={link + idx}
                          variant="outlined"
                          color="info"
                          size="small"
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ mb: 1 }}
                        >
                          {link.replace('https://infajira.informatica.com/browse/', '')}
                        </Button>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default PipelineDashboard; 