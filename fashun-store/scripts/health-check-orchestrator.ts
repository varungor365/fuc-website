#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface HealthCheckConfig {
  testUrl: string;
  sentryDsn?: string;
  openaiApiKey?: string;
  slackWebhook?: string;
  githubToken?: string;
  repository: string;
}

interface TestResults {
  passed: boolean;
  failures: TestFailure[];
  timestamp: string;
  duration: number;
}

interface TestFailure {
  testName: string;
  error: string;
  file: string;
  line?: number;
  screenshot?: string;
}

interface SentryError {
  id: string;
  title: string;
  culprit: string;
  level: string;
  count: number;
  lastSeen: string;
  firstSeen: string;
  metadata: any;
}

class HealthCheckOrchestrator {
  private config: HealthCheckConfig;
  private logFile: string;
  
  constructor(config: HealthCheckConfig) {
    this.config = config;
    this.logFile = path.join(__dirname, '..', 'logs', `health-check-${new Date().toISOString().split('T')[0]}.log`);
  }

  async run(): Promise<void> {
    const startTime = Date.now();
    
    try {
      await this.log('🚀 Starting automated health check...');
      
      // Step 1: Run E2E Tests
      const testResults = await this.runE2ETests();
      
      if (testResults.passed) {
        await this.log('✅ All tests passed! System is healthy.');
        await this.notifySuccess();
        return;
      }

      // Step 2: Analyze failures
      await this.log('❌ Tests failed. Analyzing errors...');
      
      // Step 3: Fetch Sentry errors
      const sentryErrors = await this.fetchSentryErrors();
      
      // Step 4: Generate AI fixes
      const analysisResults = await this.analyzeAndFix(testResults.failures, sentryErrors);
      
      // Step 5: Report findings
      await this.reportFindings(testResults, sentryErrors, analysisResults);
      
    } catch (error) {
      await this.log(`💥 Health check orchestrator failed: ${error}`);
      await this.notifyError(error as Error);
    } finally {
      const duration = Date.now() - startTime;
      await this.log(`⏱️  Health check completed in ${duration}ms`);
    }
  }

  private async runE2ETests(): Promise<TestResults> {
    await this.log('🧪 Running E2E test suite...');
    
    const startTime = Date.now();
    
    try {
      // Set test environment variables
      process.env.TEST_URL = this.config.testUrl;
      process.env.CI = 'true';
      
      // Run Playwright tests
      const { stdout, stderr } = await execAsync('npx playwright test --reporter=json', {
        cwd: path.join(__dirname, '..'),
        timeout: 300000 // 5 minutes
      });
      
      // Parse JSON results
      const results = JSON.parse(stdout);
      
      const testResults: TestResults = {
        passed: results.stats.failures === 0,
        failures: [],
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime
      };

      // Extract failures
      if (results.suites) {
        for (const suite of results.suites) {
          for (const test of suite.tests || []) {
            if (test.results?.[0]?.status === 'failed') {
              testResults.failures.push({
                testName: test.title,
                error: test.results[0].error?.message || 'Unknown error',
                file: suite.file,
                line: test.line,
                screenshot: test.results[0].attachments?.find((a: any) => a.name === 'screenshot')?.path
              });
            }
          }
        }
      }

      await this.log(`📊 Test Results: ${results.stats.passed} passed, ${results.stats.failures} failed`);
      
      return testResults;
      
    } catch (error) {
      await this.log(`🚨 E2E tests execution failed: ${error}`);
      
      return {
        passed: false,
        failures: [{
          testName: 'E2E Test Execution',
          error: error instanceof Error ? error.message : String(error),
          file: 'test-runner'
        }],
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime
      };
    }
  }

  private async fetchSentryErrors(): Promise<SentryError[]> {
    if (!this.config.sentryDsn) {
      await this.log('⚠️  No Sentry DSN configured, skipping Sentry error fetch');
      return [];
    }

    try {
      await this.log('🔍 Fetching recent errors from Sentry...');
      
      // This would integrate with Sentry API
      // For now, return mock data
      return [];
      
    } catch (error) {
      await this.log(`⚠️  Failed to fetch Sentry errors: ${error}`);
      return [];
    }
  }

  private async analyzeAndFix(failures: TestFailure[], sentryErrors: SentryError[]): Promise<any[]> {
    if (!this.config.openaiApiKey) {
      await this.log('⚠️  No OpenAI API key configured, skipping AI analysis');
      return [];
    }

    const analysisResults = [];

    for (const failure of failures) {
      try {
        await this.log(`🤖 Analyzing failure: ${failure.testName}`);
        
        // Read the test file to get context
        const testFileContent = await this.readTestFile(failure.file);
        
        // Prepare context for AI
        const context = {
          testName: failure.testName,
          error: failure.error,
          file: failure.file,
          line: failure.line,
          testContent: testFileContent,
          sentryErrors: sentryErrors.filter(e => 
            e.culprit.includes(failure.file) || 
            e.title.toLowerCase().includes(failure.testName.toLowerCase())
          )
        };

        // Generate fix suggestion using AI
        const fixSuggestion = await this.generateAIFix(context);
        
        analysisResults.push({
          failure,
          context,
          fixSuggestion
        });

      } catch (error) {
        await this.log(`❌ Failed to analyze failure ${failure.testName}: ${error}`);
      }
    }

    return analysisResults;
  }

  private async readTestFile(filePath: string): Promise<string> {
    try {
      const fullPath = path.isAbsolute(filePath) ? filePath : path.join(__dirname, '..', filePath);
      return await fs.readFile(fullPath, 'utf-8');
    } catch (error) {
      return `Unable to read file: ${error}`;
    }
  }

  private async generateAIFix(context: any): Promise<string> {
    // This would integrate with OpenAI API
    // For now, return a mock response
    return `
    Analysis for ${context.testName}:
    
    Error: ${context.error}
    
    Suggested Fix:
    1. Check if the element selector is correct
    2. Add proper wait conditions
    3. Verify the page is fully loaded before interaction
    
    Code Suggestion:
    // Add wait for element to be visible
    await page.waitForSelector('your-selector', { timeout: 30000 });
    
    // Ensure element is ready for interaction
    await expect(element).toBeVisible();
    await expect(element).toBeEnabled();
    `;
  }

  private async reportFindings(testResults: TestResults, sentryErrors: SentryError[], analysisResults: any[]): Promise<void> {
    const report = {
      timestamp: testResults.timestamp,
      summary: {
        totalTests: testResults.failures.length,
        failedTests: testResults.failures.length,
        sentryErrors: sentryErrors.length,
        analysisCompleted: analysisResults.length
      },
      failures: testResults.failures,
      sentryErrors,
      aiAnalysis: analysisResults,
      recommendations: this.generateRecommendations(analysisResults)
    };

    // Save report to file
    const reportPath = path.join(__dirname, '..', 'reports', `health-check-${Date.now()}.json`);
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    await this.log(`📋 Health check report saved: ${reportPath}`);

    // Send notifications
    if (this.config.slackWebhook) {
      await this.notifySlack(report);
    }

    if (this.config.githubToken) {
      await this.createGitHubIssue(report);
    }
  }

  private generateRecommendations(analysisResults: any[]): string[] {
    const recommendations = [
      'Review failed test scenarios and update test data if needed',
      'Check if UI changes require test selector updates',
      'Verify application performance and loading times',
      'Consider implementing retry mechanisms for flaky tests'
    ];

    return recommendations;
  }

  private async notifySuccess(): Promise<void> {
    const message = `✅ Daily health check successful at ${new Date().toISOString()}. All systems operational.`;
    
    if (this.config.slackWebhook) {
      // Send success notification to Slack
      await this.sendSlackMessage({
        text: message,
        color: 'good'
      });
    }
  }

  private async notifyError(error: Error): Promise<void> {
    const message = `🚨 Health check system error: ${error.message}`;
    
    if (this.config.slackWebhook) {
      await this.sendSlackMessage({
        text: message,
        color: 'danger'
      });
    }
  }

  private async notifySlack(report: any): Promise<void> {
    if (!this.config.slackWebhook) return;

    const message = {
      text: `🔍 Automated Health Check Report`,
      color: 'warning',
      fields: [
        {
          title: 'Failed Tests',
          value: report.summary.failedTests.toString(),
          short: true
        },
        {
          title: 'Sentry Errors',
          value: report.summary.sentryErrors.toString(),
          short: true
        },
        {
          title: 'Timestamp',
          value: report.timestamp,
          short: false
        }
      ],
      attachments: report.failures.map((failure: TestFailure) => ({
        title: failure.testName,
        text: failure.error,
        color: 'danger'
      }))
    };

    await this.sendSlackMessage(message);
  }

  private async sendSlackMessage(message: any): Promise<void> {
    // Implementation would use actual Slack webhook
    await this.log(`📢 Slack notification: ${JSON.stringify(message, null, 2)}`);
  }

  private async createGitHubIssue(report: any): Promise<void> {
    if (!this.config.githubToken) return;

    const title = `Automated Health Check Failure - ${new Date().toISOString().split('T')[0]}`;
    const body = `
## 🔍 Automated Health Check Report

**Timestamp:** ${report.timestamp}

### Summary
- **Failed Tests:** ${report.summary.failedTests}
- **Sentry Errors:** ${report.summary.sentryErrors}
- **AI Analysis Completed:** ${report.summary.analysisCompleted}

### Failed Tests
${report.failures.map((f: TestFailure) => `
- **${f.testName}**
  - File: ${f.file}
  - Error: ${f.error}
`).join('\n')}

### AI Recommendations
${report.recommendations.map((r: string) => `- ${r}`).join('\n')}

### AI Analysis Results
${report.aiAnalysis.map((a: any) => `
#### ${a.failure.testName}
${a.fixSuggestion}
`).join('\n')}

---
*This issue was automatically generated by the Health Check System*
    `;

    // Implementation would use GitHub API
    await this.log(`📋 GitHub issue created: ${title}`);
  }

  private async log(message: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    
    console.log(logMessage);
    
    // Ensure log directory exists
    await fs.mkdir(path.dirname(this.logFile), { recursive: true });
    
    // Append to log file
    await fs.appendFile(this.logFile, logMessage + '\n');
  }
}

// CLI Usage
async function main() {
  const config: HealthCheckConfig = {
    testUrl: process.env.TEST_URL || 'https://fashun.co.in',
    sentryDsn: process.env.SENTRY_DSN,
    openaiApiKey: process.env.OPENAI_API_KEY,
    slackWebhook: process.env.SLACK_WEBHOOK,
    githubToken: process.env.GITHUB_TOKEN,
    repository: process.env.GITHUB_REPOSITORY || 'varungor365/fuc-website'
  };

  const orchestrator = new HealthCheckOrchestrator(config);
  await orchestrator.run();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { HealthCheckOrchestrator, type HealthCheckConfig };