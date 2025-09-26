#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setup() {
  console.log(chalk.blue('🚀 Setting up FASHUN.CO Autonomous Link Checker...\n'));

  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 16) {
    console.error(chalk.red('❌ Node.js 16 or higher is required'));
    console.error(chalk.yellow(`   Current version: ${nodeVersion}`));
    process.exit(1);
  }
  
  console.log(chalk.green(`✅ Node.js version: ${nodeVersion}`));

  // Create necessary directories
  const directories = [
    path.join(__dirname, '../reports'),
    path.join(__dirname, '../logs'),
    path.join(__dirname, '../cache')
  ];

  for (const dir of directories) {
    await fs.ensureDir(dir);
    console.log(chalk.green(`✅ Created directory: ${path.relative(process.cwd(), dir)}`));
  }

  // Copy environment file if it doesn't exist
  const envExample = path.join(__dirname, '../.env.example');
  const envLocal = path.join(__dirname, '../../.env.local');
  
  if (!await fs.pathExists(envLocal)) {
    console.log(chalk.yellow('⚠️  .env.local not found, creating from template...'));
    await fs.copy(envExample, envLocal);
    console.log(chalk.green('✅ Created .env.local from template'));
  } else {
    console.log(chalk.green('✅ .env.local already exists'));
  }

  // Check environment variables
  console.log(chalk.blue('\n🔧 Checking environment configuration...'));
  
  const requiredEnvVars = [
    'GITHUB_TOKEN',
    'GITHUB_OWNER',
    'GITHUB_REPO',
    'NEXT_PUBLIC_SITE_URL'
  ];

  const missingEnvVars = [];
  
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(chalk.green(`✅ ${envVar} is configured`));
    } else {
      console.log(chalk.red(`❌ ${envVar} is missing`));
      missingEnvVars.push(envVar);
    }
  }

  if (missingEnvVars.length > 0) {
    console.log(chalk.yellow('\n⚠️  Please configure the following environment variables in .env.local:'));
    console.log(chalk.yellow(`   ${missingEnvVars.join(', ')}\n`));
    
    console.log(chalk.cyan('📝 Configuration Guide:'));
    console.log(chalk.white('   GITHUB_TOKEN: Personal access token with repo permissions'));
    console.log(chalk.white('     → https://github.com/settings/personal-access-tokens'));
    console.log(chalk.white('   GITHUB_OWNER: Repository owner (varungor365)'));
    console.log(chalk.white('   GITHUB_REPO: Repository name (fuc-website)'));
    console.log(chalk.white('   NEXT_PUBLIC_SITE_URL: Base URL for scanning (https://fashun.co)'));
  }

  // Test GitHub API access
  if (process.env.GITHUB_TOKEN) {
    console.log(chalk.blue('\n🔍 Testing GitHub API access...'));
    
    try {
      const { Octokit } = await import('@octokit/rest');
      const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
      
      const { data: user } = await octokit.rest.users.getAuthenticated();
      console.log(chalk.green(`✅ GitHub API access confirmed (${user.login})`));
      
      // Test repository access
      try {
        const { data: repo } = await octokit.rest.repos.get({
          owner: process.env.GITHUB_OWNER || 'varungor365',
          repo: process.env.GITHUB_REPO || 'fuc-website'
        });
        console.log(chalk.green(`✅ Repository access confirmed (${repo.full_name})`));
      } catch (error) {
        console.log(chalk.red(`❌ Repository access failed: ${error.message}`));
      }
      
    } catch (error) {
      console.log(chalk.red(`❌ GitHub API test failed: ${error.message}`));
    }
  }

  // Create PM2 ecosystem file for production
  const pm2Config = {
    apps: [{
      name: 'fashun-link-checker',
      script: 'index.js',
      args: 'schedule',
      cwd: __dirname + '/..',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }]
  };

  const pm2ConfigPath = path.join(__dirname, '../ecosystem.config.js');
  await fs.writeFile(
    pm2ConfigPath,
    `module.exports = ${JSON.stringify(pm2Config, null, 2)};`,
    'utf8'
  );
  console.log(chalk.green('✅ Created PM2 ecosystem configuration'));

  // Create systemd service file for Linux
  const systemdService = `[Unit]
Description=FASHUN.CO Link Checker
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=${path.join(__dirname, '..')}
ExecStart=${process.execPath} index.js schedule
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target`;

  const systemdPath = path.join(__dirname, '../fashun-link-checker.service');
  await fs.writeFile(systemdPath, systemdService, 'utf8');
  console.log(chalk.green('✅ Created systemd service file'));

  // Create Docker configuration
  const dockerfile = `FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p reports logs cache

# Run as non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S linkchecker -u 1001
RUN chown -R linkchecker:nodejs /app
USER linkchecker

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
  CMD node -e "console.log('healthy')" || exit 1

# Start scheduler
CMD ["node", "index.js", "schedule"]`;

  const dockerfilePath = path.join(__dirname, '../Dockerfile');
  await fs.writeFile(dockerfilePath, dockerfile, 'utf8');
  console.log(chalk.green('✅ Created Dockerfile'));

  const dockerCompose = `version: '3.8'

services:
  link-checker:
    build: .
    container_name: fashun-link-checker
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    env_file:
      - ../../.env.local
    volumes:
      - ./reports:/app/reports
      - ./logs:/app/logs
      - ./cache:/app/cache
    networks:
      - fashun-network

networks:
  fashun-network:
    external: true`;

  const dockerComposePath = path.join(__dirname, '../docker-compose.yml');
  await fs.writeFile(dockerComposePath, dockerCompose, 'utf8');
  console.log(chalk.green('✅ Created Docker Compose configuration'));

  // Installation summary
  console.log(chalk.blue('\n📋 Setup Summary:'));
  console.log(chalk.green('✅ Directories created'));
  console.log(chalk.green('✅ Configuration files prepared'));
  console.log(chalk.green('✅ Deployment configurations created'));

  console.log(chalk.blue('\n🚀 Next Steps:'));
  console.log(chalk.white('1. Configure environment variables in .env.local'));
  console.log(chalk.white('2. Test the link checker: npm run check'));
  console.log(chalk.white('3. Run manual scan: npm run check -- --full --report'));
  console.log(chalk.white('4. Deploy to production using one of:'));
  console.log(chalk.white('   • PM2: pm2 start ecosystem.config.js'));
  console.log(chalk.white('   • Docker: docker-compose up -d'));
  console.log(chalk.white('   • Systemd: sudo systemctl enable fashun-link-checker.service'));

  console.log(chalk.blue('\n📚 Documentation:'));
  console.log(chalk.white('• README.md - Complete usage guide'));
  console.log(chalk.white('• GitHub Actions will run nightly scans automatically'));
  console.log(chalk.white('• Reports are saved in the reports/ directory'));

  if (missingEnvVars.length === 0) {
    console.log(chalk.green('\n🎉 Setup completed successfully!'));
    console.log(chalk.cyan('Run: npm run check -- --help for usage information'));
  } else {
    console.log(chalk.yellow('\n⚠️  Setup completed with warnings'));
    console.log(chalk.yellow('Please configure missing environment variables before running'));
  }
}

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setup().catch(error => {
    console.error(chalk.red('❌ Setup failed:'), error.message);
    process.exit(1);
  });
}

export { setup };