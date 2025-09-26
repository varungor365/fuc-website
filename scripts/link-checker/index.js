#!/usr/bin/env node

import { LinkChecker } from './src/link-checker.js';
import { ReportGenerator } from './src/report-generator.js';
import { GitHubIntegration } from './src/github-integration.js';
import { WaybackMachine } from './src/wayback-machine.js';
import { program } from 'commander';
import chalk from 'chalk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../../.env.local' });

program
  .name('fashun-link-checker')
  .description('Autonomous broken link checker for FASHUN.CO')
  .version('1.0.0');

program
  .command('check')
  .description('Run comprehensive link check')
  .option('-u, --url <url>', 'Base URL to check', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
  .option('-f, --full', 'Check all pages (not just critical paths)')
  .option('-e, --external-only', 'Check only external links')
  .option('-r, --report', 'Generate detailed report')
  .option('-g, --github', 'Create GitHub issues for broken links')
  .action(async (options) => {
    console.log(chalk.blue('🔍 Starting FASHUN.CO Link Check...'));
    
    try {
      const checker = new LinkChecker({
        baseUrl: options.url,
        fullScan: options.full,
        externalOnly: options.externalOnly
      });

      const results = await checker.scan();
      
      if (options.report) {
        const reportGenerator = new ReportGenerator();
        await reportGenerator.generate(results);
      }

      if (options.github && results.brokenLinks.length > 0) {
        const github = new GitHubIntegration();
        await github.createIssuesForBrokenLinks(results.brokenLinks);
      }

      console.log(chalk.green('✅ Link check completed!'));
      console.log(chalk.cyan(`📊 Total links checked: ${results.totalLinks}`));
      console.log(chalk.red(`❌ Broken links found: ${results.brokenLinks.length}`));
      
      if (results.brokenLinks.length > 0) {
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red('❌ Link check failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('setup')
  .description('Setup link checker with GitHub integration')
  .action(async () => {
    console.log(chalk.blue('🔧 Setting up FASHUN.CO Link Checker...'));
    
    // Setup instructions
    console.log(chalk.yellow('Please ensure the following environment variables are set:'));
    console.log('- GITHUB_TOKEN: Personal access token for GitHub API');
    console.log('- GITHUB_OWNER: Repository owner (varungor365)');
    console.log('- GITHUB_REPO: Repository name (fuc-website)');
    console.log('- NEXT_PUBLIC_SITE_URL: Base URL for link checking');
    
    console.log(chalk.green('✅ Setup complete!'));
  });

program
  .command('schedule')
  .description('Start scheduled link checking (runs nightly)')
  .action(async () => {
    console.log(chalk.blue('⏰ Starting scheduled link checker...'));
    
    const cron = (await import('node-cron')).default;
    
    // Run every night at 2 AM
    cron.schedule('0 2 * * *', async () => {
      console.log(chalk.blue('🌙 Running nightly link check...'));
      
      try {
        const checker = new LinkChecker({
          baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://fashun.co',
          fullScan: true
        });

        const results = await checker.scan();
        
        const reportGenerator = new ReportGenerator();
        await reportGenerator.generate(results);

        if (results.brokenLinks.length > 0) {
          const github = new GitHubIntegration();
          await github.createIssuesForBrokenLinks(results.brokenLinks);
        }

        console.log(chalk.green('✅ Nightly check completed'));
      } catch (error) {
        console.error(chalk.red('❌ Nightly check failed:'), error.message);
      }
    });

    console.log(chalk.green('✅ Scheduled checker is running...'));
    console.log(chalk.cyan('Press Ctrl+C to stop'));
  });

if (process.argv.length === 2) {
  program.help();
} else {
  program.parse();
}