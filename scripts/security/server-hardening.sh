#!/bin/bash

# FASHUN.CO.IN - Server Hardening Script
# Run on DigitalOcean Ubuntu server

echo "🔒 Starting server hardening..."

# 1. UFW Firewall Configuration
echo "📡 Configuring UFW firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'
sudo ufw --force enable

# 2. SSH Hardening
echo "🔐 Hardening SSH configuration..."
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
sudo sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# 3. Install and Configure Fail2Ban
echo "🛡️ Installing Fail2Ban..."
sudo apt-get update
sudo apt-get install -y fail2ban

sudo tee /etc/fail2ban/jail.local > /dev/null <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = 22
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 5

[nginx-noscript]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 6
EOF

sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# 4. Automated Updates
echo "🔄 Setting up automated updates..."
sudo apt-get install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

sudo tee /etc/cron.weekly/auto-update > /dev/null <<'EOF'
#!/bin/bash
apt-get update
apt-get upgrade -y
apt-get autoremove -y
apt-get autoclean
EOF

sudo chmod +x /etc/cron.weekly/auto-update

# 5. Install security tools
echo "🔧 Installing security tools..."
sudo apt-get install -y ufw fail2ban logwatch rkhunter

# 6. Configure logwatch
echo "📊 Configuring logwatch..."
sudo tee /etc/cron.daily/00logwatch > /dev/null <<'EOF'
#!/bin/bash
/usr/sbin/logwatch --output mail --mailto admin@fashun.co.in --detail high
EOF
sudo chmod +x /etc/cron.daily/00logwatch

echo "✅ Server hardening complete!"
echo "🔍 Checking firewall status..."
sudo ufw status verbose

echo "🔍 Checking Fail2Ban status..."
sudo fail2ban-client status
