# FASHUN.CO Deployment Guide

## 🚀 One-Click Deployment

### Vercel Deployment (Recommended for Frontend)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/fashun-store)

1. **Connect Repository**
   - Fork the repository to your GitHub account
   - Connect your GitHub account to Vercel
   - Import the `fashun-store` project

2. **Configure Environment Variables**
   ```bash
   NEXT_PUBLIC_SITE_URL=https://yoursite.vercel.app
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

3. **Deploy**
   - Click "Deploy" button
   - Automatic builds on every push to main branch
   - Custom domain setup in Vercel dashboard

### Railway Deployment (Backend & AI Service)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

1. **Backend Deployment**
   ```bash
   # Create new Railway project
   railway login
   railway init fashun-backend
   
   # Set environment variables
   railway variables set HOST=0.0.0.0
   railway variables set PORT=1337
   railway variables set DATABASE_CLIENT=postgresql
   railway variables set DATABASE_URL=${{Postgres.DATABASE_URL}}
   
   # Deploy
   railway up
   ```

2. **AI Service Deployment**
   ```bash
   # Create new service
   railway init fashun-ai-service
   
   # Set environment variables
   railway variables set PORT=3001
   railway variables set OPENAI_API_KEY=your_key
   
   # Deploy
   railway up
   ```

## 🐳 Docker Deployment

### Using Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./fashun-store
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:1337
    depends_on:
      - backend

  backend:
    build: ./fashun-backend
    ports:
      - "1337:1337"
    environment:
      - DATABASE_CLIENT=postgres
      - DATABASE_URL=postgres://user:pass@db:5432/fashun
    depends_on:
      - db

  ai-service:
    build: ./ai-mockup-service
    ports:
      - "3001:3001"
    environment:
      - PORT=3001

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=fashun
      - POSTGRES_USER=fashun_user
      - POSTGRES_PASSWORD=fashun_pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
# Deploy with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale frontend=2
```

### Individual Docker Builds

```dockerfile
# fashun-store/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t fashun-frontend ./fashun-store
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=your_api_url fashun-frontend
```

## 🖥️ VPS Deployment

### Ubuntu 20.04+ Setup

```bash
# 1. Initial server setup
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx nodejs npm postgresql redis-server

# 2. Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 for process management
sudo npm install -g pm2

# 4. Create application user
sudo adduser fashun
sudo usermod -aG sudo fashun

# 5. Setup PostgreSQL
sudo -u postgres createuser fashun
sudo -u postgres createdb fashun_db
sudo -u postgres psql -c "ALTER USER fashun PASSWORD 'secure_password';"

# 6. Configure Nginx
sudo nano /etc/nginx/sites-available/fashun
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/fashun
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # AI Service
    location /ai {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'fashun-frontend',
      cwd: '/home/fashun/fashun-store',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'https://yourdomain.com/api'
      }
    },
    {
      name: 'fashun-backend',
      cwd: '/home/fashun/fashun-backend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 1337,
        DATABASE_CLIENT: 'postgres',
        DATABASE_HOST: 'localhost',
        DATABASE_PORT: 5432,
        DATABASE_NAME: 'fashun_db',
        DATABASE_USERNAME: 'fashun',
        DATABASE_PASSWORD: 'secure_password'
      }
    },
    {
      name: 'fashun-ai',
      cwd: '/home/fashun/ai-mockup-service',
      script: 'src/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};
```

```bash
# Deploy with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

## 🔒 SSL Certificate Setup

### Using Certbot (Let's Encrypt)

```bash
# Install Certbot
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot

# Create symlink
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (crontab)
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Cloudflare SSL (Recommended)

1. **Add domain to Cloudflare**
   - Change nameservers to Cloudflare
   - Enable "Full (strict)" SSL mode
   - Enable "Always Use HTTPS"

2. **Origin Certificate**
   - Generate origin certificate in Cloudflare dashboard
   - Install on your server

## 📊 Monitoring & Analytics

### Server Monitoring

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Setup log rotation
sudo nano /etc/logrotate.d/fashun
```

```
# /etc/logrotate.d/fashun
/home/fashun/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 fashun fashun
}
```

### Application Monitoring

```javascript
// Add to package.json
"scripts": {
  "monitor": "pm2 monit",
  "logs": "pm2 logs",
  "status": "pm2 status"
}
```

### Uptime Monitoring

```bash
# Simple health check script
#!/bin/bash
# /home/fashun/scripts/health-check.sh

URL="https://yourdomain.com"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $RESPONSE -eq 200 ]; then
    echo "$(date): Site is up"
else
    echo "$(date): Site is down (HTTP $RESPONSE)"
    # Send alert email or Slack notification
fi
```

## 💾 Backup Strategy

### Database Backup

```bash
#!/bin/bash
# /home/fashun/scripts/backup-db.sh

BACKUP_DIR="/home/fashun/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="fashun_db"

# Create backup
pg_dump -U fashun -h localhost $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Remove backups older than 7 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "Database backup completed: $DATE"
```

### File Backup

```bash
#!/bin/bash
# /home/fashun/scripts/backup-files.sh

rsync -avz --delete /home/fashun/fashun-store/ /backup/fashun-store/
rsync -avz --delete /home/fashun/fashun-backend/ /backup/fashun-backend/
rsync -avz --delete /home/fashun/ai-mockup-service/ /backup/ai-mockup-service/

echo "File backup completed: $(date)"
```

### Automated Backups

```bash
# Add to crontab
crontab -e

# Database backup every 6 hours
0 */6 * * * /home/fashun/scripts/backup-db.sh

# File backup daily at 2 AM
0 2 * * * /home/fashun/scripts/backup-files.sh
```

## 🚀 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /home/fashun/fashun-store
          git pull origin main
          npm ci
          npm run build
          pm2 restart fashun-frontend
```

### Zero-Downtime Deployment

```bash
#!/bin/bash
# /home/fashun/scripts/deploy.sh

# Pull latest code
cd /home/fashun/fashun-store
git pull origin main

# Install dependencies
npm ci

# Build application
npm run build

# Graceful restart
pm2 reload fashun-frontend

echo "Deployment completed: $(date)"
```

## 🔧 Maintenance

### Health Checks

```bash
# System health check
#!/bin/bash
# /home/fashun/scripts/system-health.sh

echo "=== System Health Check ==="
echo "Date: $(date)"
echo

# Disk usage
echo "Disk Usage:"
df -h

# Memory usage
echo -e "\nMemory Usage:"
free -h

# CPU load
echo -e "\nCPU Load:"
uptime

# Service status
echo -e "\nPM2 Status:"
pm2 status

# Database status
echo -e "\nDatabase Status:"
pg_isready -h localhost -p 5432

echo "=== Health Check Complete ==="
```

### Log Management

```bash
# Log cleanup script
#!/bin/bash
# /home/fashun/scripts/cleanup-logs.sh

# Clear PM2 logs older than 7 days
pm2 flush

# Clear nginx logs older than 30 days
find /var/log/nginx/ -name "*.log" -mtime +30 -delete

# Clear application logs older than 14 days
find /home/fashun/logs/ -name "*.log" -mtime +14 -delete

echo "Log cleanup completed: $(date)"
```

## 📞 Support & Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port
   sudo lsof -i :3000
   
   # Kill process
   sudo kill -9 <PID>
   ```

2. **Permission Errors**
   ```bash
   # Fix ownership
   sudo chown -R fashun:fashun /home/fashun/
   
   # Fix permissions
   chmod +x /home/fashun/scripts/*.sh
   ```

3. **Database Connection Issues**
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql
   
   # Restart PostgreSQL
   sudo systemctl restart postgresql
   ```

### Support Contacts

- **Technical Issues**: Create GitHub issue
- **Emergency Support**: WhatsApp +91 98765 43210
- **Email Support**: support@fashun.co.in

---

## 🎉 Deployment Checklist

- [ ] Domain purchased and DNS configured
- [ ] SSL certificate installed
- [ ] Environment variables configured
- [ ] Database setup and migrated
- [ ] PM2 processes running
- [ ] Nginx configured and running
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Health checks configured
- [ ] Analytics tracking enabled

---

Built with ❤️ for seamless deployment experience.
