import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class ReportGenerator {
  constructor() {
    this.reportsDir = path.join(__dirname, '../../reports');
  }

  async generate(scanResults) {
    console.log(chalk.blue('📊 Generating comprehensive link check report...'));

    // Ensure reports directory exists
    await fs.ensureDir(this.reportsDir);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFileName = `link-check-report-${timestamp}.html`;
    const reportPath = path.join(this.reportsDir, reportFileName);

    // Generate HTML report
    const htmlReport = this.generateHtmlReport(scanResults);
    await fs.writeFile(reportPath, htmlReport, 'utf8');

    // Generate JSON report for programmatic access
    const jsonReportPath = path.join(this.reportsDir, `link-check-report-${timestamp}.json`);
    await fs.writeFile(jsonReportPath, JSON.stringify(scanResults, null, 2), 'utf8');

    // Generate CSV report for analysis
    const csvReportPath = path.join(this.reportsDir, `link-check-report-${timestamp}.csv`);
    const csvReport = this.generateCsvReport(scanResults);
    await fs.writeFile(csvReportPath, csvReport, 'utf8');

    // Update latest symlinks
    const latestHtmlPath = path.join(this.reportsDir, 'latest-report.html');
    const latestJsonPath = path.join(this.reportsDir, 'latest-report.json');
    const latestCsvPath = path.join(this.reportsDir, 'latest-report.csv');

    try {
      await fs.remove(latestHtmlPath);
      await fs.remove(latestJsonPath);
      await fs.remove(latestCsvPath);
    } catch (error) {
      // Files might not exist, which is fine
    }

    await fs.copy(reportPath, latestHtmlPath);
    await fs.copy(jsonReportPath, latestJsonPath);
    await fs.copy(csvReportPath, latestCsvPath);

    console.log(chalk.green(`✅ Reports generated:`));
    console.log(chalk.cyan(`   HTML: ${reportPath}`));
    console.log(chalk.cyan(`   JSON: ${jsonReportPath}`));
    console.log(chalk.cyan(`   CSV:  ${csvReportPath}`));

    return {
      html: reportPath,
      json: jsonReportPath,
      csv: csvReportPath
    };
  }

  generateHtmlReport(results) {
    const { totalLinks, workingLinks, brokenLinks, redirects, warnings, scanDuration, timestamp } = results;
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FASHUN.CO Link Check Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .header h1 {
            color: white;
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-align: center;
        }
        
        .header .subtitle {
            color: rgba(255, 255, 255, 0.8);
            text-align: center;
            font-size: 1.1rem;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 25px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            text-align: center;
        }
        
        .stat-card h3 {
            color: white;
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .stat-card p {
            color: rgba(255, 255, 255, 0.8);
            font-size: 1.1rem;
        }
        
        .stat-card.working h3 { color: #4ade80; }
        .stat-card.broken h3 { color: #f87171; }
        .stat-card.redirects h3 { color: #fbbf24; }
        .stat-card.warnings h3 { color: #fb923c; }
        
        .section {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .section h2 {
            color: white;
            font-size: 1.8rem;
            margin-bottom: 20px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.2);
            padding-bottom: 10px;
        }
        
        .link-item {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 15px;
            border-left: 4px solid #f87171;
        }
        
        .link-item.working { border-left-color: #4ade80; }
        .link-item.redirect { border-left-color: #fbbf24; }
        .link-item.warning { border-left-color: #fb923c; }
        
        .link-url {
            color: white;
            font-weight: 600;
            font-size: 1.1rem;
            margin-bottom: 8px;
            word-break: break-all;
        }
        
        .link-details {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            margin-bottom: 10px;
        }
        
        .link-parent {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.85rem;
            font-style: italic;
        }
        
        .suggestions {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .suggestions h4 {
            color: #4ade80;
            margin-bottom: 10px;
        }
        
        .suggestion-item {
            background: rgba(74, 222, 128, 0.1);
            border-radius: 5px;
            padding: 10px;
            margin-bottom: 8px;
        }
        
        .suggestion-link {
            color: #4ade80;
            text-decoration: none;
        }
        
        .suggestion-link:hover {
            text-decoration: underline;
        }
        
        .no-items {
            text-align: center;
            color: rgba(255, 255, 255, 0.6);
            font-style: italic;
            padding: 40px;
        }
        
        .summary {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 25px;
            margin-top: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .summary h3 {
            color: white;
            margin-bottom: 15px;
        }
        
        .summary-item {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 8px;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 15px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 FASHUN.CO Link Check Report</h1>
            <p class="subtitle">Generated on ${new Date(timestamp).toLocaleString()}</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>${totalLinks}</h3>
                <p>Total Links Checked</p>
            </div>
            <div class="stat-card working">
                <h3>${workingLinks.length}</h3>
                <p>Working Links</p>
            </div>
            <div class="stat-card broken">
                <h3>${brokenLinks.length}</h3>
                <p>Broken Links</p>
            </div>
            <div class="stat-card redirects">
                <h3>${redirects.length}</h3>
                <p>Redirects</p>
            </div>
        </div>
        
        ${brokenLinks.length > 0 ? `
        <div class="section">
            <h2>❌ Broken Links</h2>
            ${brokenLinks.map(link => `
                <div class="link-item">
                    <div class="link-url">${link.url}</div>
                    <div class="link-details">
                        Status: ${link.status} | 
                        Type: ${link.isExternal ? 'External' : 'Internal'} |
                        ${link.isPriority ? 'Priority' : 'Normal'}
                    </div>
                    <div class="link-parent">Found on: ${link.parent}</div>
                    ${link.suggestions && link.suggestions.length > 0 ? `
                        <div class="suggestions">
                            <h4>💡 Suggestions:</h4>
                            ${link.suggestions.map(suggestion => `
                                <div class="suggestion-item">
                                    <a href="${suggestion.url}" class="suggestion-link" target="_blank">
                                        ${suggestion.description}
                                    </a>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
        ` : `
        <div class="section">
            <h2>✅ Broken Links</h2>
            <div class="no-items">No broken links found! Your website is healthy.</div>
        </div>
        `}
        
        ${redirects.length > 0 ? `
        <div class="section">
            <h2>🔄 Redirects</h2>
            ${redirects.map(link => `
                <div class="link-item redirect">
                    <div class="link-url">${link.url}</div>
                    <div class="link-details">Status: ${link.status} → ${link.target}</div>
                    <div class="link-parent">Found on: ${link.parent}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${warnings.length > 0 ? `
        <div class="section">
            <h2>⚠️ Warnings</h2>
            ${warnings.map(link => `
                <div class="link-item warning">
                    <div class="link-url">${link.url}</div>
                    <div class="link-details">Status: ${link.status} | State: ${link.state}</div>
                    <div class="link-parent">Found on: ${link.parent}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        <div class="summary">
            <h3>📊 Scan Summary</h3>
            <div class="summary-item">Scan Duration: ${(scanDuration / 1000).toFixed(2)} seconds</div>
            <div class="summary-item">Success Rate: ${((workingLinks.length / totalLinks) * 100).toFixed(1)}%</div>
            <div class="summary-item">External Links: ${brokenLinks.filter(l => l.isExternal).length + workingLinks.filter(l => this.isExternal(l.url)).length}</div>
            <div class="summary-item">Internal Links: ${brokenLinks.filter(l => !l.isExternal).length + workingLinks.filter(l => !this.isExternal(l.url)).length}</div>
        </div>
    </div>
</body>
</html>`;

    return html;
  }

  generateCsvReport(results) {
    const { workingLinks, brokenLinks, redirects, warnings } = results;
    
    let csv = 'Status,URL,HTTP Status,Parent Page,Type,Priority,Suggestions,Timestamp\n';
    
    // Add working links
    workingLinks.forEach(link => {
      csv += `"Working","${link.url}","${link.status}","${link.parent}","${this.isExternal(link.url) ? 'External' : 'Internal'}","Normal","",""\n`;
    });
    
    // Add broken links
    brokenLinks.forEach(link => {
      const suggestions = link.suggestions ? link.suggestions.map(s => s.url).join('; ') : '';
      csv += `"Broken","${link.url}","${link.status}","${link.parent}","${link.isExternal ? 'External' : 'Internal'}","${link.isPriority ? 'Priority' : 'Normal'}","${suggestions}","${link.timestamp}"\n`;
    });
    
    // Add redirects
    redirects.forEach(link => {
      csv += `"Redirect","${link.url}","${link.status}","${link.parent}","${this.isExternal(link.url) ? 'External' : 'Internal'}","Normal","${link.target}",""\n`;
    });
    
    // Add warnings
    warnings.forEach(link => {
      csv += `"Warning","${link.url}","${link.status}","${link.parent}","${this.isExternal(link.url) ? 'External' : 'Internal'}","Normal","",""\n`;
    });
    
    return csv;
  }

  isExternal(url) {
    try {
      const linkDomain = new URL(url).hostname;
      const baseDomains = ['localhost', 'fashun.co', 'www.fashun.co'];
      return !baseDomains.some(domain => linkDomain.includes(domain));
    } catch (error) {
      return false;
    }
  }
}