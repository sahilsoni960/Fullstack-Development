@echo off
echo 🚀 Testing Frontend with Nginx Proxy Locally...

REM Check if nginx is installed
where nginx >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Nginx not found. Please install nginx for Windows.
    echo Download from: http://nginx.org/en/download.html
    echo Or use WSL (Windows Subsystem for Linux)
    pause
    exit /b 1
)

REM Build the frontend
echo 📦 Building frontend...
call npm run build

REM Create local nginx config
echo ⚙️ Creating local nginx config...
(
echo events {
echo     worker_connections 1024;
echo }
echo.
echo http {
echo     include       /etc/nginx/mime.types;
echo     default_type  application/octet-stream;
echo.    
echo     server {
echo         listen 3001;
echo         server_name localhost;
echo         root dist;
echo         index index.html;
echo.        
echo         # Serve React app
echo         location / {
echo             try_files $uri $uri/ /index.html;
echo         }
echo.        
echo         # Proxy API calls to your deployed backend
echo         location /api/ {
echo             proxy_pass https://market-digest-backend.onrender.com;
echo             proxy_set_header Host $host;
echo             proxy_set_header X-Real-IP $remote_addr;
echo             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
echo             proxy_set_header X-Forwarded-Proto $scheme;
echo         }
echo.        
echo         # Cache static assets
echo         location ~* \.^(js^|css^|png^|jpg^|jpeg^|gif^|ico^|svg^)$ {
echo             expires 1y;
echo             add_header Cache-Control "public, immutable";
echo         }
echo     }
echo }
) > nginx-local.conf

echo 🌐 Starting nginx on port 3001...
echo 📱 Frontend will be available at: http://localhost:3001
echo 🔗 API calls will be proxied to: https://market-digest-backend.onrender.com
echo.
echo Press Ctrl+C to stop nginx

REM Start nginx with local config
nginx -c %cd%/nginx-local.conf -g "daemon off;"
