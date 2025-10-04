#!/usr/bin/env node

/**
 * Build script for deployment independence
 * Creates a fully standalone version of FUC Portfolio Pro
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 FUC Portfolio Pro - Building Standalone Version...\n');

// Step 1: Clean previous builds
console.log('🧹 Cleaning previous builds...');
try {
  execSync('rm -rf .next out dist', { stdio: 'inherit' });
} catch (error) {
  // Directory might not exist, continue
}

// Step 2: Install dependencies
console.log('📦 Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

// Step 3: Build the application
console.log('🔨 Building application...');
execSync('npm run build', { stdio: 'inherit' });

// Step 4: Create deployment package
console.log('📁 Creating deployment package...');

const deploymentDir = 'deployment-package';
if (fs.existsSync(deploymentDir)) {
  execSync(`rm -rf ${deploymentDir}`, { stdio: 'inherit' });
}
fs.mkdirSync(deploymentDir);

// Copy essential files
const filesToCopy = [
  '.next',
  'public',
  'data',
  'package.json',
  'package-lock.json',
  'next.config.ts',
  'README.md',
  'DEPLOYMENT.md'
];

filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`📋 Copying ${file}...`);
    execSync(`cp -r ${file} ${deploymentDir}/`, { stdio: 'inherit' });
  }
});

// Create production environment file
console.log('⚙️ Creating production environment...');
const prodEnv = `NODE_ENV=production
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
`;

fs.writeFileSync(path.join(deploymentDir, '.env.production'), prodEnv);

// Create startup script
console.log('🔧 Creating startup script...');
const startupScript = `#!/bin/bash

# FUC Portfolio Pro - Startup Script
echo "🚀 Starting FUC Portfolio Pro..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --production
fi

# Start the application
echo "🌟 Starting server..."
npm start
`;

fs.writeFileSync(path.join(deploymentDir, 'start.sh'), startupScript);
execSync(`chmod +x ${deploymentDir}/start.sh`);

// Create Docker setup
console.log('🐳 Creating Docker configuration...');
const dockerfile = `FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/ || exit 1

# Start application
CMD ["npm", "start"]
`;

fs.writeFileSync(path.join(deploymentDir, 'Dockerfile'), dockerfile);

const dockerCompose = `version: '3.8'

services:
  fuc-portfolio:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
      - ./public/uploads:/app/public/uploads
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_BASE_URL=http://localhost:3000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
`;

fs.writeFileSync(path.join(deploymentDir, 'docker-compose.yml'), dockerCompose);

// Create README for deployment
console.log('📄 Creating deployment README...');
const deploymentReadme = `# FUC Portfolio Pro - Deployment Package

## 🚀 Quick Start

### Option 1: Direct Node.js
\`\`\`bash
# Make startup script executable
chmod +x start.sh

# Start the application
./start.sh
\`\`\`

### Option 2: Docker
\`\`\`bash
# Build and start with Docker Compose
docker-compose up -d
\`\`\`

### Option 3: Manual
\`\`\`bash
# Install dependencies
npm install --production

# Start the server
npm start
\`\`\`

## 🌐 Access Your Portfolio

- Open http://localhost:3000 in your browser
- Your portfolio will be available at http://localhost:3000/profile/[username]

## 🔧 Configuration

1. Update \`.env.production\` with your domain
2. Customize \`NEXT_PUBLIC_BASE_URL\` for your deployment
3. Change \`JWT_SECRET\` for security

## 📊 Features Included

✅ Stunning AI-generated portfolio pages
✅ 25+ social media platform support  
✅ QR code generation
✅ SQLite database (no external dependencies)
✅ Lifetime free access
✅ Deployment independent
✅ Self-contained assets

## 🆘 Support

For support and documentation, visit: https://github.com/your-repo
`;

fs.writeFileSync(path.join(deploymentDir, 'README-DEPLOYMENT.md'), deploymentReadme);

// Create archive
console.log('📦 Creating deployment archive...');
execSync(`tar -czf fuc-portfolio-pro-standalone.tar.gz ${deploymentDir}/`, { stdio: 'inherit' });

// Success message
console.log('\n🎉 Standalone build complete!');
console.log('📁 Deployment package created in:', deploymentDir);
console.log('📦 Archive created:', 'fuc-portfolio-pro-standalone.tar.gz');
console.log('\n🚀 Ready for deployment anywhere!');
console.log('\nDeployment options:');
console.log('  • Upload to any VPS/server');
console.log('  • Deploy to cloud platforms');
console.log('  • Run on Raspberry Pi');
console.log('  • Use with Docker');
console.log('\n✨ Your portfolio will be permanent and independent!');