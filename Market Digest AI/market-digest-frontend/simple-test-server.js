import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3001;

// Simple MIME type mapping
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = createServer(async (req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  try {
    // Handle API proxy
    if (req.url.startsWith('/api/')) {
      console.log(`🔄 Proxying ${req.method} ${req.url} to backend`);
      
      // Simple proxy to your backend
      const backendUrl = `https://market-digest-backend.onrender.com${req.url}`;
      
      // For now, just redirect to show the proxy is working
      res.writeHead(302, { 'Location': backendUrl });
      res.end();
      return;
    }
    
    // Serve static files
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = join(__dirname, 'dist', filePath);
    
    const ext = extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    const content = await readFile(filePath);
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File not found, serve index.html for SPA routing
      try {
        const content = await readFile(join(__dirname, 'dist', 'index.html'));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      } catch (spaError) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    } else {
      console.error('Server error:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  }
});

server.listen(PORT, () => {
  console.log('🚀 Simple test server running at http://localhost:3001');
  console.log('🔗 API calls will be redirected to your backend');
  console.log('📱 Open http://localhost:3001 in your browser');
  console.log('⏹️  Press Ctrl+C to stop');
});
