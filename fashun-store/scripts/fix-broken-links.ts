#!/usr/bin/env tsx
/**
 * Broken Links Analyzer and Fixer
 * Analyzes linkinator output and provides fix suggestions
 */

import * as fs from 'fs';
import * as path from 'path';

interface LinkResult {
  url: string;
  status: number;
  state: 'OK' | 'BROKEN' | 'SKIPPED';
  parent?: string;
  failureDetails?: string;
}

interface LinkReport {
  links: LinkResult[];
  passed: boolean;
}

const COMMON_FIXES: Record<string, string> = {
  '/products': '/collections/all',
  '/shop': '/collections/all',
  '/store': '/collections/all',
  '/cart': '/checkout',
  '/account': '/login',
};

async function analyzeBrokenLinks() {
  console.log('🔍 Analyzing Broken Links Report...\n');

  const reportPath = path.join(process.cwd(), 'reports', 'broken-links-report.json');
  
  if (!fs.existsSync(reportPath)) {
    console.error('❌ Report file not found!');
    console.log('💡 Run: npm run audit:links first\n');
    return;
  }

  const report: LinkReport = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
  
  const brokenLinks = report.links.filter(link => link.state === 'BROKEN');
  const totalLinks = report.links.length;
  const okLinks = report.links.filter(link => link.state === 'OK').length;
  
  console.log('📊 Summary:');
  console.log(`   Total Links Checked: ${totalLinks}`);
  console.log(`   ✅ Working Links: ${okLinks}`);
  console.log(`   ❌ Broken Links: ${brokenLinks.length}`);
  console.log(`   📈 Success Rate: ${((okLinks / totalLinks) * 100).toFixed(2)}%\n`);

  if (brokenLinks.length === 0) {
    console.log('🎉 No broken links found! Your site is healthy.\n');
    return;
  }

  // Group by status code
  const byStatus: Record<number, LinkResult[]> = {};
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
    
    links.forEach((link, index) => {
      console.log(`\n${index + 1}. URL: ${link.url}`);
      if (link.parent) {
        console.log(`   Found on: ${link.parent}`);
      }
      if (link.failureDetails) {
        console.log(`   Error: ${link.failureDetails}`);
      }
      
      // Suggest fixes
      const suggestion = suggestFix(link.url, statusCode);
      if (suggestion) {
        console.log(`   💡 Suggestion: ${suggestion}`);
      }
    });
  });

  // Generate fix script
  console.log('\n\n📝 Generating Fix Script...\n');
  generateFixScript(brokenLinks);
  
  console.log('\n✅ Fix script generated: scripts/apply-link-fixes.ts');
  console.log('💡 Review the suggestions and run: npm run fix:links\n');
}

function getStatusName(status: number): string {
  const statusNames: Record<number, string> = {
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

function suggestFix(url: string, status: number): string | null {
  // Check common redirects
  for (const [old, newUrl] of Object.entries(COMMON_FIXES)) {
    if (url.includes(old)) {
      return `Redirect ${old} → ${newUrl}`;
    }
  }

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

function generateFixScript(brokenLinks: LinkResult[]) {
  const fixes: Record<string, { from: string; to: string; reason: string }[]> = {};
  
  brokenLinks.forEach(link => {
    if (!link.parent) return;
    
    const parent = link.parent;
    if (!fixes[parent]) {
      fixes[parent] = [];
    }
    
    const suggestion = COMMON_FIXES[new URL(link.url).pathname] || 'MANUAL_FIX_REQUIRED';
    
    fixes[parent].push({
      from: link.url,
      to: suggestion,
      reason: `Status: ${link.status}`,
    });
  });

  const scriptContent = `#!/usr/bin/env tsx
/**
 * GENERATED FILE - DO NOT EDIT MANUALLY
 * Auto-generated link fixes based on broken links audit
 */

import * as fs from 'fs';
import * as path from 'path';

const fixes = ${JSON.stringify(fixes, null, 2)};

async function applyFixes() {
  console.log('🔧 Applying link fixes...\\n');
  
  let filesFixed = 0;
  let linksFixed = 0;
  
  for (const [filePath, fileFixes] of Object.entries(fixes)) {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(\`⚠️  File not found: \${filePath}\`);
      continue;
    }
    
    let content = fs.readFileSync(fullPath, 'utf-8');
    let fileChanged = false;
    
    for (const fix of fileFixes) {
      if (fix.to === 'MANUAL_FIX_REQUIRED') {
        console.log(\`⚠️  Manual fix required in \${filePath}:\`);
        console.log(\`   \${fix.from} - \${fix.reason}\`);
        continue;
      }
      
      if (content.includes(fix.from)) {
        content = content.replace(new RegExp(fix.from, 'g'), fix.to);
        console.log(\`✅ Fixed: \${fix.from} → \${fix.to}\`);
        linksFixed++;
        fileChanged = true;
      }
    }
    
    if (fileChanged) {
      fs.writeFileSync(fullPath, content, 'utf-8');
      filesFixed++;
    }
  }
  
  console.log(\`\\n🎉 Complete! Fixed \${linksFixed} links in \${filesFixed} files.\\n\`);
}

applyFixes().catch(console.error);
`;

  fs.mkdirSync(path.join(process.cwd(), 'scripts'), { recursive: true });
  fs.writeFileSync(
    path.join(process.cwd(), 'scripts', 'apply-link-fixes.ts'),
    scriptContent
  );
}

// Run the analysis
analyzeBrokenLinks().catch(console.error);
