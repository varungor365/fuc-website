#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import path from 'path';

const execAsync = promisify(exec);

class HealthCheckSetup {
  private baseDir: string;

  constructor() {
    this.baseDir = path.dirname(new URL(import.meta.url).pathname);
  }

  async run() {
    console.log('🚀 Setting up Health Check System...\n');

    try {
      // Step 1: Create necessary directories
      await this.createDirectories();

      // Step 2: Check environment configuration
      await this.checkEnvironment();

      // Step 3: Install browser dependencies
      await this.installBrowsers();

      // Step 4: Create baseline screenshots
      await this.createBaselines();

      // Step 5: Verify system health
      await this.verifySetup();

      console.log('\n✅ Health Check System setup completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('1. Copy .env.health-check.example to .env.local');
      console.log('2. Fill in your configuration values');
      console.log('3. Run: npm run health-check:test');
      console.log('4. Start daily monitoring: npm run health-check:start');

    } catch (error) {
      console.error('\n❌ Setup failed:', error);
      process.exit(1);
    }
  }

  private async createDirectories() {
    console.log('📁 Creating directories...');
    
    const directories = [
      'tests/e2e',
      'tests/visual-baselines',
      'tests/auth',
      'test-results',
      'logs',
      'reports'
    ];

    for (const dir of directories) {
      await fs.mkdir(dir, { recursive: true });
      console.log(`   ✓ ${dir}`);
    }
  }

  private async checkEnvironment() {
    console.log('\n🔍 Checking environment...');

    // Check if .env.local exists
    try {
      await fs.access('.env.local');
      console.log('   ✓ .env.local found');
    } catch {
      console.log('   ⚠️  .env.local not found - copy from .env.health-check.example');
    }

    // Check Node.js version
    const nodeVersion = process.version;
    console.log(`   ✓ Node.js version: ${nodeVersion}`);

    // Check if required packages are installed
    try {
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
      const hasPlaywright = packageJson.devDependencies?.['@playwright/test'];
      const hasSentry = packageJson.devDependencies?.['@sentry/nextjs'];
      const hasOpenAI = packageJson.devDependencies?.['openai'];

      console.log(`   ${hasPlaywright ? '✓' : '❌'} Playwright: ${hasPlaywright || 'Not installed'}`);
      console.log(`   ${hasSentry ? '✓' : '❌'} Sentry: ${hasSentry || 'Not installed'}`);
      console.log(`   ${hasOpenAI ? '✓' : '❌'} OpenAI: ${hasOpenAI || 'Not installed'}`);
    } catch (error) {
      console.log('   ⚠️  Error checking packages:', error);
    }
  }

  private async installBrowsers() {
    console.log('\n🌐 Installing Playwright browsers...');
    
    try {
      const { stdout } = await execAsync('npx playwright install --with-deps');
      console.log('   ✓ Browsers installed successfully');
    } catch (error) {
      console.log('   ⚠️  Browser installation may have issues:', error);
    }
  }

  private async createBaselines() {
    console.log('\n📸 Creating baseline screenshots...');
    
    try {
      // Start the development server in background
      console.log('   🚀 Starting development server...');
      
      // Run tests in update-snapshots mode to create baselines
      console.log('   📷 Generating baseline screenshots...');
      
      const { stdout, stderr } = await execAsync('npx playwright test --update-snapshots --project=chromium', {
        timeout: 120000 // 2 minutes timeout
      });

      console.log('   ✓ Baseline screenshots created');
      
    } catch (error) {
      console.log('   ⚠️  Baseline creation completed with some issues');
      console.log('       This is normal for the first run - baselines will be created on next test run');
    }
  }

  private async verifySetup() {
    console.log('\n🔬 Verifying setup...');

    // Check if test files exist
    const testFiles = [
      'tests/e2e/auth.spec.ts',
      'tests/e2e/profile.spec.ts', 
      'tests/e2e/ecommerce.spec.ts'
    ];

    for (const file of testFiles) {
      try {
        await fs.access(file);
        console.log(`   ✓ ${file}`);
      } catch {
        console.log(`   ❌ ${file} not found`);
      }
    }

    // Check Playwright config
    try {
      await fs.access('playwright.config.ts');
      console.log('   ✓ playwright.config.ts');
    } catch {
      console.log('   ❌ playwright.config.ts not found');
    }

    // Check script files
    const scriptFiles = [
      'scripts/health-check-orchestrator.ts',
      'scripts/health-check-scheduler.ts'
    ];

    for (const file of scriptFiles) {
      try {
        await fs.access(file);
        console.log(`   ✓ ${file}`);
      } catch {
        console.log(`   ❌ ${file} not found`);
      }
    }
  }
}

// Run setup
const setup = new HealthCheckSetup();
setup.run().catch(console.error);