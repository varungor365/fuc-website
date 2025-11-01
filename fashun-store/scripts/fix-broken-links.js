#!/usr/bin/env node
/**
 * Broken Links Analyzer
 * Note: This requires linkinator to be installed globally
 * Run: npm install -g linkinator
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Broken Links Analysis Tool\n');

const reportPath = path.join(process.cwd(), 'reports', 'broken-links-report.json');

if (!fs.existsSync(reportPath)) {
  console.log('❌ No broken links report found!\n');
  console.log('📋 To generate a report, run:');
  console.log('   npm install -g linkinator');
  console.log('   npm run audit:links\n');
  console.log('💡 This will crawl https://fashun.co and find all broken links.\n');
  process.exit(1);
}

try {
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
  
  const brokenLinks = report.links ? report.links.filter(link => link.state === 'BROKEN') : [];
  const totalLinks = report.links ? report.links.length : 0;
  const okLinks = report.links ? report.links.filter(link => link.state === 'OK').length : 0;
  
  console.log('📊 Summary:');
  console.log(`   Total Links Checked: ${totalLinks}`);
  console.log(`   ✅ Working Links: ${okLinks}`);
  console.log(`   ❌ Broken Links: ${brokenLinks.length}`);
  
  if (totalLinks > 0) {
    console.log(`   📈 Success Rate: ${((okLinks / totalLinks) * 100).toFixed(2)}%\n`);
  }

  if (brokenLinks.length === 0) {
    console.log('🎉 No broken links found! Your site is healthy.\n');
    process.exit(0);
  }

  // Group by status code
  const byStatus = {};
  brokenLinks.forEach(link => {
    if (!byStatus[link.status]) {
      byStatus[link.status] = [];
    }
    byStatus[link.status].push(link);
  });

  console.log('🔴 Broken Links by Status:\n');
  
  Object.entries(byStatus).forEach(([status, links]) => {
    const statusCode = parseInt(status);
    const statusName = getStatusName(statusCode);
    
    console.log(`\n${statusName} (${statusCode}) - ${links.length} links:`);
    console.log('─'.repeat(80));
    
    links.slice(0, 5).forEach((link, index) => {
      console.log(`\n${index + 1}. URL: ${link.url}`);
      if (link.parent) {
        console.log(`   Found on: ${link.parent}`);
      }
      
      // Suggest fixes
      const suggestion = suggestFix(link.url, statusCode);
      if (suggestion) {
        console.log(`   💡 Suggestion: ${suggestion}`);
      }
    });

    if (links.length > 5) {
      console.log(`\n... and ${links.length - 5} more ${statusName} links`);
    }
  });

  console.log('\n\n📝 Next Steps:\n');
  console.log('1. Review the broken links above');
  console.log('2. Fix or remove broken links in your code');
  console.log('3. Re-run the audit after fixes: npm run audit:links');
  console.log('4. Check the detailed report: reports/broken-links-report.json\n');

} catch (error) {
  console.error('❌ Error reading report:', error.message);
  console.log('\n💡 Try running the audit again: npm run audit:links\n');
  process.exit(1);
}

function getStatusName(status) {
  const statusNames = {
    0: '❌ CONNECTION FAILED',
    400: '🚫 BAD REQUEST',
    401: '🔒 UNAUTHORIZED',
    403: '🚫 FORBIDDEN',
    404: '❌ NOT FOUND',
    500: '💥 SERVER ERROR',
    502: '💥 BAD GATEWAY',
    503: '💥 SERVICE UNAVAILABLE',
  };
  
  return statusNames[status] || `❌ ERROR ${status}`;
}

function suggestFix(url, status) {
  if (status === 404) {
    return 'Remove link or create missing page';
  } else if (status === 0) {
    return 'Check external URL or add to allowed domains';
  } else if (status === 403 || status === 401) {
    return 'Check authentication or make resource public';
  } else if (status >= 500) {
    return 'Server issue - check backend logs';
  }
  
  return null;
}
