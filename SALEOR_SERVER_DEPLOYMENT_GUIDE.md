# FASHUN.CO Saleor Server Deployment Guide
# Deploy Saleor Platform on DigitalOcean Droplet (167.71.236.151)

## Prerequisites Checklist
- ✅ DigitalOcean Droplet running Ubuntu 20.04/22.04
- ✅ Root access to server (167.71.236.151)
- ✅ SSH access configured
- ✅ Domain pointed to server IP (optional but recommended)

## Step 1: SSH Connection
```bash
# Connect to your server
ssh root@167.71.236.151

# Once connected, update the system
apt update && apt upgrade -y
```

## Step 2: Install Required Dependencies
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Verify installations
docker --version
docker-compose --version
node --version
npm --version
```

## Step 3: Install Saleor CLI
```bash
# Install Saleor CLI globally
npm install -g @saleor/cli

# Verify installation
saleor --version
```

## Step 4: Deploy Saleor Platform
```bash
# Create directory for Saleor
mkdir -p /opt/saleor
cd /opt/saleor

# Deploy Saleor platform with demo data
saleor-cli platform demo --name=fashun-saleor-store

# Alternative command if the above doesn't work:
# saleor platform demo --name=fashun-saleor-store

# Wait for deployment (5-10 minutes)
# The command will download and setup:
# - Saleor Core API
# - PostgreSQL database
# - Saleor Dashboard
# - Redis cache
# - All necessary containers
```

## Step 5: Configure Firewall (Important!)
```bash
# Allow necessary ports through firewall
ufw allow 22      # SSH
ufw allow 80      # HTTP
ufw allow 443     # HTTPS
ufw allow 8000    # Saleor API
ufw allow 9000    # Saleor Dashboard
ufw enable

# Check firewall status
ufw status
```

## Step 6: Verify Deployment
```bash
# Check running containers
docker ps

# You should see containers for:
# - saleor-api
# - saleor-dashboard
# - postgres
# - redis
# - worker

# Check logs if needed
docker-compose logs -f saleor-api
```

## Step 7: Access Your Saleor Installation

### API Access
- **URL**: `http://167.71.236.151:8000/graphql/`
- **Test**: Should show GraphQL playground interface

### Dashboard Access  
- **URL**: `http://167.71.236.151:9000`
- **Default Login**: 
  - Email: `admin@example.com`
  - Password: `admin`

### Test API Connection
```bash
# Test API endpoint
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ shop { name } }"}' \
  http://167.71.236.151:8000/graphql/
```

## Step 8: Configure for Production

### Update Environment Variables
```bash
# Edit the environment file
cd /opt/saleor/saleor-platform
nano .env

# Key settings to update:
# ALLOWED_HOSTS=167.71.236.151,your-domain.com
# DEBUG=False
# SECRET_KEY=your-secret-key
# DATABASE_URL=postgres://...
```

### Setup SSL Certificate (Optional but Recommended)
```bash
# Install Certbot for Let's Encrypt
apt install certbot python3-certbot-nginx

# If you have a domain pointed to your server:
certbot --nginx -d your-domain.com
```

## Step 9: Update FASHUN.CO Frontend Configuration

Once your server Saleor is running, update your local `.env.local`:

```bash
# Replace the cloud URL with your server URL
NEXT_PUBLIC_SALEOR_API_URL=http://167.71.236.151:8000/graphql/
NEXT_PUBLIC_SALEOR_DASHBOARD_URL=http://167.71.236.151:9000/

# You'll need to create a new API token from your dashboard
SALEOR_AUTH_TOKEN=your-new-server-token
```

## Troubleshooting Commands

### If deployment fails:
```bash
# Check Docker status
systemctl status docker

# Restart Docker
systemctl restart docker

# Check available disk space
df -h

# Check memory usage
free -h

# View deployment logs
cd /opt/saleor && docker-compose logs
```

### If ports are not accessible:
```bash
# Check if services are running
netstat -tlnp | grep -E ':(8000|9000)'

# Check iptables rules
iptables -L

# Restart UFW
ufw --force reset
ufw enable
```

## Next Steps After Successful Deployment

1. **Login to Dashboard**: `http://167.71.236.151:9000`
2. **Create Admin User**: Replace default admin credentials
3. **Configure Store Settings**: Add your store details
4. **Add Products**: Import your FASHUN.CO products
5. **Generate API Token**: For frontend integration
6. **Update Frontend**: Point your website to the new server

## Expected Timeline
- Server preparation: 5-10 minutes
- Saleor deployment: 5-10 minutes  
- Configuration: 5-10 minutes
- **Total**: ~20-30 minutes

---

## Quick Command Summary
```bash
# Connect
ssh root@167.71.236.151

# Install dependencies
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && apt-get install -y nodejs
npm install -g @saleor/cli

# Deploy
mkdir -p /opt/saleor && cd /opt/saleor
saleor-cli platform demo --name=fashun-saleor-store

# Configure firewall
ufw allow 22 && ufw allow 80 && ufw allow 443 && ufw allow 8000 && ufw allow 9000 && ufw enable

# Test
curl http://167.71.236.151:8000/graphql/
```

🚀 **Your self-hosted Saleor platform will be ready at:**
- **API**: `http://167.71.236.151:8000/graphql/`
- **Dashboard**: `http://167.71.236.151:9000`