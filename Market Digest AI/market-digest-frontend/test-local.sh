#!/bin/bash

echo "🚀 Testing Frontend with Nginx Proxy Locally..."

# Check if nginx is installed
if ! command -v nginx &> /dev/null; then
    echo "❌ Nginx not found. Installing..."
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        echo "Windows detected. Please install nginx manually or use WSL."
        exit 1
    else
        sudo apt-get update && sudo apt-get install -y nginx
    fi
fi

# Build the frontend
echo "📦 Building frontend..."
npm run build

# Create local nginx config
echo "⚙️ Creating local nginx config..."
cat > nginx-local.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    server {
        listen 3001;
        server_name localhost;
        root dist;
        index index.html;
        
        # Serve React app
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Proxy API calls to your deployed backend
        location /api/ {
            proxy_pass https://market-digest-backend.onrender.com;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
EOF

echo "🌐 Starting nginx on port 3001..."
echo "📱 Frontend will be available at: http://localhost:3001"
echo "🔗 API calls will be proxied to: https://market-digest-backend.onrender.com"
echo ""
echo "Press Ctrl+C to stop nginx"

# Start nginx with local config
nginx -c $(pwd)/nginx-local.conf -g "daemon off;"
