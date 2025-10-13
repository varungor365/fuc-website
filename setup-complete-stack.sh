#!/bin/bash

echo "🚀 FASHUN.CO - Complete Stack Setup"
echo "===================================="

# Update system
echo "📦 Updating system..."
sudo apt update && sudo apt upgrade -y

# Install PostgreSQL
echo "🐘 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create databases
echo "📊 Creating databases..."
sudo -u postgres psql -c "CREATE DATABASE fashun_medusa;"
sudo -u postgres psql -c "CREATE DATABASE umami;"
sudo -u postgres psql -c "CREATE DATABASE listmonk;"

# Install Redis
echo "🔴 Installing Redis..."
sudo apt install -y redis-server
sudo systemctl start redis
sudo systemctl enable redis

# Install Meilisearch
echo "🔍 Installing Meilisearch..."
curl -L https://install.meilisearch.com | sh
sudo mv ./meilisearch /usr/local/bin/
sudo chmod +x /usr/local/bin/meilisearch

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo "📦 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js
echo "📗 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
echo "⚙️ Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install Certbot
echo "🔒 Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Install Medusa CLI
echo "🛒 Installing Medusa CLI..."
sudo npm install -g @medusajs/medusa-cli

# Clone repository (if not already cloned)
if [ ! -d "fuc-website" ]; then
    echo "📥 Cloning repository..."
    git clone https://github.com/varungor365/fuc-website.git
    cd fuc-website
else
    cd fuc-website
fi

# Setup Medusa Backend
echo "🏗️ Setting up Medusa backend..."
cd fashun-medusa-backend
npm install
npm run build
medusa migrations run
npm run seed

# Setup Frontend
echo "🎨 Setting up frontend..."
cd ../fashun-store
npm install
npm run build

# Start Docker services
echo "🐳 Starting Docker services..."
cd ..
docker-compose up -d

# Configure PM2
echo "⚙️ Configuring PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Copy Nginx configuration
echo "🌐 Configuring Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/fashun.co
sudo ln -s /etc/nginx/sites-available/fashun.co /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL (interactive)
echo "🔒 Setting up SSL..."
echo "Run: sudo certbot --nginx -d fashun.co -d www.fashun.co"

# Create logs directory
mkdir -p logs

echo ""
echo "✅ Installation Complete!"
echo ""
echo "Services:"
echo "  Frontend:     http://localhost:3000"
echo "  Medusa API:   http://localhost:9000"
echo "  Meilisearch:  http://localhost:7700"
echo "  Umami:        http://localhost:3001"
echo "  n8n:          http://localhost:5678"
echo "  Listmonk:     http://localhost:9001"
echo "  Uptime Kuma:  http://localhost:3002"
echo ""
echo "Next steps:"
echo "  1. Configure environment variables"
echo "  2. Setup SSL with Certbot"
echo "  3. Configure domain DNS"
echo "  4. Test all services"
echo ""
