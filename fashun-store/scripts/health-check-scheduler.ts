#!/usr/bin/env node

import cron from 'node-cron';
import { HealthCheckOrchestrator, type HealthCheckConfig } from './health-check-orchestrator.js';

class HealthCheckScheduler {
  private config: HealthCheckConfig;
  private orchestrator: HealthCheckOrchestrator;

  constructor() {
    this.config = {
      testUrl: process.env.TEST_URL || 'https://fashun.co.in',
      sentryDsn: process.env.SENTRY_DSN,
      openaiApiKey: process.env.OPENAI_API_KEY,
      slackWebhook: process.env.SLACK_WEBHOOK,
      githubToken: process.env.GITHUB_TOKEN,
      repository: process.env.GITHUB_REPOSITORY || 'varungor365/fuc-website'
    };

    this.orchestrator = new HealthCheckOrchestrator(this.config);
  }

  start() {
    console.log('🕒 Starting Health Check Scheduler...');
    console.log(`📅 Scheduled to run daily at 9:00 AM (${process.env.TZ || 'system timezone'})`);

    // Schedule daily health check at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
      console.log('⏰ Daily health check triggered by cron job');
      await this.orchestrator.run();
    }, {
      timezone: process.env.TZ || 'UTC'
    });

    // Optional: Weekly comprehensive check on Sundays at 10:00 AM
    cron.schedule('0 10 * * 0', async () => {
      console.log('📅 Weekly comprehensive health check triggered');
      // Set more thorough testing flags
      process.env.COMPREHENSIVE_TEST = 'true';
      await this.orchestrator.run();
      delete process.env.COMPREHENSIVE_TEST;
    }, {
      timezone: process.env.TZ || 'UTC'
    });

    // Keep the process alive
    console.log('✅ Health Check Scheduler is running...');
    console.log('🔍 Next daily check: Tomorrow at 9:00 AM');
    console.log('📅 Next weekly check: Sunday at 10:00 AM');
    console.log('📊 Press Ctrl+C to stop the scheduler');

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('🛑 Health Check Scheduler stopping...');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('🛑 Health Check Scheduler terminated');
      process.exit(0);
    });
  }

  // Method to run health check immediately (for testing)
  async runNow() {
    console.log('🚀 Running health check immediately...');
    await this.orchestrator.run();
  }
}

// CLI Usage
async function main() {
  const command = process.argv[2];
  const scheduler = new HealthCheckScheduler();

  switch (command) {
    case 'start':
      scheduler.start();
      break;
    case 'run':
      await scheduler.runNow();
      break;
    default:
      console.log(`
🏥 FASHUN.CO Health Check Scheduler

Usage:
  npm run health-check:start     Start the daily scheduler
  npm run health-check:run       Run health check immediately
  npm run health-check:setup     Setup baseline screenshots

Environment Variables:
  TEST_URL              Target URL for testing (default: https://fashun.co.in)
  SENTRY_DSN           Sentry DSN for error monitoring
  OPENAI_API_KEY       OpenAI API key for AI analysis
  SLACK_WEBHOOK        Slack webhook for notifications
  GITHUB_TOKEN         GitHub token for issue creation
  GITHUB_REPOSITORY    GitHub repository (default: varungor365/fuc-website)
  TZ                   Timezone for scheduling (default: UTC)

Examples:
  npm run health-check:start
  npm run health-check:run
      `);
      break;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { HealthCheckScheduler };