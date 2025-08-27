import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy API calls to your backend
app.use('/api', createProxyMiddleware({
  target: 'https://market-digest-backend.onrender.com',
  changeOrigin: true,
  secure: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`🔄 Proxying ${req.method} ${req.path} to backend`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`✅ Backend responded with status ${proxyRes.statusCode}`);
  }
}));

// Handle React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log('🚀 Test server running at http://localhost:3001');
  console.log('🔗 API calls will be proxied to your backend');
  console.log('📱 Open http://localhost:3001 in your browser');
  console.log('⏹️  Press Ctrl+C to stop');
});
