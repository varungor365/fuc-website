const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs').promises;
const path = require('path');

/**
 * FASHUN Lighthouse Performance Auditor
 * Runs comprehensive performance audits on all key pages
 * Target: 95+ scores for Performance, Accessibility, SEO
 */

const config = {
  baseUrl: process.env.SITE_URL || 'http://localhost:3000',
  outputDir: './reports/lighthouse',
  targetScore: 95,
  
  // Key pages to audit
  pages: [
    { name: 'Homepage', path: '/' },
    { name: 'Collections', path: '/collections/all' },
    { name: 'Product Page', path: '/products/flame-tee' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Profile Landing', path: '/p' }
  ],

  lighthouseOptions: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    output: 'html',
    throttling: {
      rtt RTMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4
    }
  }
};

async function runLighthouseAudits() {
  console.log('🚀 Starting FASHUN Lighthouse Performance Audits...\n');
  console.log(`Base URL: ${config.baseUrl}`);
  console.log(`Target Score: ${config.targetScore}+\n`);

  const results = [];
  let chrome;

  try {
    // Launch Chrome
    chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const lighthouseOptions = {
      ...config.lighthouseOptions,
      port: chrome.port
    };

    // Create output directory
    await fs.mkdir(config.outputDir, { recursive: true });

    // Run audits for each page
    for (const page of config.pages) {
      const url = `${config.baseUrl}${page.path}`;
      console.log(`\n📊 Auditing: ${page.name} (${url})`);
      console.log('='.repeat(80));

      try {
        const runnerResult = await lighthouse(url, lighthouseOptions);
        const { lhr, report } = runnerResult;

        // Extract scores
        const scores = {
          performance: Math.round(lhr.categories.performance.score * 100),
          accessibility: Math.round(lhr.categories.accessibility.score * 100),
          bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
          seo: Math.round(lhr.categories.seo.score * 100)
        };

        // Calculate average
        const average = Math.round(
          Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
        );

        // Check if meets target
        const meetsTarget = Object.values(scores).every(score => score >= config.targetScore);

        console.log(`\n📈 Scores:`);
        console.log(`  Performance:     ${getScoreIndicator(scores.performance)} ${scores.performance}/100`);
        console.log(`  Accessibility:   ${getScoreIndicator(scores.accessibility)} ${scores.accessibility}/100`);
        console.log(`  Best Practices:  ${getScoreIndicator(scores.bestPractices)} ${scores.bestPractices}/100`);
        console.log(`  SEO:             ${getScoreIndicator(scores.seo)} ${scores.seo}/100`);
        console.log(`  Average:         ${getScoreIndicator(average)} ${average}/100`);
        console.log(`\n  Status: ${meetsTarget ? '✅ PASSED' : '❌ NEEDS IMPROVEMENT'}`);

        // Get key metrics
        const metrics = {
          firstContentfulPaint: lhr.audits['first-contentful-paint'].displayValue,
          largestContentfulPaint: lhr.audits['largest-contentful-paint'].displayValue,
          totalBlockingTime: lhr.audits['total-blocking-time'].displayValue,
          cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].displayValue,
          speedIndex: lhr.audits['speed-index'].displayValue
        };

        console.log(`\n⚡ Key Metrics:`);
        console.log(`  FCP:  ${metrics.firstContentfulPaint}`);
        console.log(`  LCP:  ${metrics.largestContentfulPaint}`);
        console.log(`  TBT:  ${metrics.totalBlockingTime}`);
        console.log(`  CLS:  ${metrics.cumulativeLayoutShift}`);
        console.log(`  SI:   ${metrics.speedIndex}`);

        // Get opportunities for improvement
        const opportunities = Object.values(lhr.audits)
          .filter(audit => audit.score !== null && audit.score < 0.9)
          .sort((a, b) => (b.score || 0) - (a.score || 0))
          .slice(0, 5)
          .map(audit => ({
            title: audit.title,
            description: audit.description,
            score: Math.round((audit.score || 0) * 100)
          }));

        if (opportunities.length > 0) {
          console.log(`\n💡 Top Improvement Opportunities:`);
          opportunities.forEach((opp, index) => {
            console.log(`  ${index + 1}. ${opp.title} (Score: ${opp.score}/100)`);
          });
        }

        // Save HTML report
        const reportPath = path.join(
          config.outputDir,
          `${page.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.html`
        );
        await fs.writeFile(reportPath, report);
        console.log(`\n💾 Report saved: ${reportPath}`);

        results.push({
          page: page.name,
          url,
          scores,
          average,
          meetsTarget,
          metrics,
          opportunities,
          reportPath
        });

      } catch (error) {
        console.error(`❌ Error auditing ${page.name}:`, error.message);
        results.push({
          page: page.name,
          url,
          error: error.message
        });
      }
    }

    // Generate summary report
    await generateSummaryReport(results);

    // Print final summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 FINAL AUDIT SUMMARY');
    console.log('='.repeat(80));

    const passedPages = results.filter(r => r.meetsTarget).length;
    const totalPages = results.filter(r => !r.error).length;

    console.log(`\n✅ Passed: ${passedPages}/${totalPages} pages`);
    console.log(`❌ Failed: ${totalPages - passedPages}/${totalPages} pages`);

    results.forEach(result => {
      if (!result.error) {
        console.log(`\n${result.page}: ${result.meetsTarget ? '✅' : '❌'} (Avg: ${result.average}/100)`);
      }
    });

    console.log('\n' + '='.repeat(80));

    if (passedPages === totalPages) {
      console.log('\n🎉 All pages meet the 95+ score target! Website is launch-ready! 🚀');
      process.exit(0);
    } else {
      console.log('\n⚠️  Some pages need optimization before launch.');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Fatal error during audits:', error);
    process.exit(1);
  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }
}

function getScoreIndicator(score) {
  if (score >= 90) return '🟢';
  if (score >= 50) return '🟡';
  return '🔴';
}

async function generateSummaryReport(results) {
  const timestamp = new Date().toISOString();
  
  const htmlReport = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FASHUN Lighthouse Audit Summary</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
      color: #fff;
      padding: 40px 20px;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    h1 {
      font-size: 48px;
      font-weight: 900;
      background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }
    .timestamp { color: #888; margin-bottom: 40px; }
    .page-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 30px;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .page-title { font-size: 24px; font-weight: bold; }
    .status-badge {
      padding: 8px 20px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 14px;
    }
    .status-passed { background: #4ade80; color: #000; }
    .status-failed { background: #f87171; color: #fff; }
    .scores-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    .score-item {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }
    .score-number {
      font-size: 36px;
      font-weight: 900;
      margin-bottom: 8px;
    }
    .score-label { color: #aaa; font-size: 12px; text-transform: uppercase; }
    .score-good { color: #4ade80; }
    .score-average { color: #fbbf24; }
    .score-poor { color: #f87171; }
    .metrics { margin-top: 20px; }
    .metric-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .footer {
      text-align: center;
      color: #666;
      margin-top: 60px;
      padding-top: 30px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚡ Lighthouse Audit Summary</h1>
    <p class="timestamp">Generated: ${timestamp}</p>
    <p class="timestamp">Target Score: ${config.targetScore}+</p>

    ${results.map(result => {
      if (result.error) {
        return `
          <div class="page-card">
            <div class="page-header">
              <h2 class="page-title">${result.page}</h2>
              <span class="status-badge status-failed">ERROR</span>
            </div>
            <p style="color: #f87171;">${result.error}</p>
          </div>
        `;
      }

      return `
        <div class="page-card">
          <div class="page-header">
            <div>
              <h2 class="page-title">${result.page}</h2>
              <p style="color: #888; font-size: 14px; margin-top: 5px;">${result.url}</p>
            </div>
            <span class="status-badge ${result.meetsTarget ? 'status-passed' : 'status-failed'}">
              ${result.meetsTarget ? '✅ PASSED' : '❌ NEEDS WORK'}
            </span>
          </div>

          <div class="scores-grid">
            <div class="score-item">
              <div class="score-number ${getScoreClass(result.scores.performance)}">
                ${result.scores.performance}
              </div>
              <div class="score-label">Performance</div>
            </div>
            <div class="score-item">
              <div class="score-number ${getScoreClass(result.scores.accessibility)}">
                ${result.scores.accessibility}
              </div>
              <div class="score-label">Accessibility</div>
            </div>
            <div class="score-item">
              <div class="score-number ${getScoreClass(result.scores.bestPractices)}">
                ${result.scores.bestPractices}
              </div>
              <div class="score-label">Best Practices</div>
            </div>
            <div class="score-item">
              <div class="score-number ${getScoreClass(result.scores.seo)}">
                ${result.scores.seo}
              </div>
              <div class="score-label">SEO</div>
            </div>
          </div>

          <div class="metrics">
            <h3 style="margin-bottom: 15px; color: #aaa;">Key Metrics</h3>
            <div class="metric-row">
              <span>First Contentful Paint</span>
              <span>${result.metrics.firstContentfulPaint}</span>
            </div>
            <div class="metric-row">
              <span>Largest Contentful Paint</span>
              <span>${result.metrics.largestContentfulPaint}</span>
            </div>
            <div class="metric-row">
              <span>Total Blocking Time</span>
              <span>${result.metrics.totalBlockingTime}</span>
            </div>
            <div class="metric-row">
              <span>Cumulative Layout Shift</span>
              <span>${result.metrics.cumulativeLayoutShift}</span>
            </div>
            <div class="metric-row">
              <span>Speed Index</span>
              <span>${result.metrics.speedIndex}</span>
            </div>
          </div>

          <p style="margin-top: 20px; color: #888;">
            <a href="${result.reportPath}" style="color: #60a5fa;">View Detailed Report →</a>
          </p>
        </div>
      `;
    }).join('')}

    <div class="footer">
      <p>FASHUN - Bold. Unapologetic. You.</p>
      <p>© ${new Date().getFullYear()} fashun.co.in</p>
    </div>
  </div>
</body>
</html>
  `;

  await fs.writeFile(
    path.join(config.outputDir, `summary-${Date.now()}.html`),
    htmlReport
  );
}

function getScoreClass(score) {
  if (score >= 90) return 'score-good';
  if (score >= 50) return 'score-average';
  return 'score-poor';
}

// Run if called directly
if (require.main === module) {
  runLighthouseAudits();
}

module.exports = { runLighthouseAudits };
