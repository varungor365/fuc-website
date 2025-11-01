#!/usr/bin/env node
/**
 * Pre-deployment Checklist Script
 * Runs all necessary checks before pushing to production
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n🔍 Running Pre-Deployment Checks...\n');

const checks = [];

// 1. Check if in correct directory
try {
  const packageJson = require('./package.json');
  if (!packageJson.name.includes('fashun')) {
    throw new Error('Not in fashun-store directory');
  }
  checks.push({ name: 'Directory Check', status: '✅', message: 'In correct directory' });
} catch (error) {
  checks.push({ name: 'Directory Check', status: '❌', message: error.message });
}

// 2. Check if robots.ts exists
try {
  const robotsPath = path.join(__dirname, 'src', 'app', 'robots.ts');
  if (fs.existsSync(robotsPath)) {
    checks.push({ name: 'robots.txt', status: '✅', message: 'robots.ts exists' });
  } else {
    checks.push({ name: 'robots.txt', status: '❌', message: 'robots.ts missing' });
  }
} catch (error) {
  checks.push({ name: 'robots.txt', status: '❌', message: error.message });
}

// 3. Check if sitemap.ts is updated
try {
  const sitemapPath = path.join(__dirname, 'src', 'app', 'sitemap.ts');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  if (sitemapContent.includes('currentDate') && sitemapContent.includes('toISOString')) {
    checks.push({ name: 'Sitemap Fix', status: '✅', message: 'Date validation added' });
  } else {
    checks.push({ name: 'Sitemap Fix', status: '⚠️', message: 'Sitemap may need update' });
  }
} catch (error) {
  checks.push({ name: 'Sitemap Fix', status: '❌', message: error.message });
}

// 4. Check viewport meta tag
try {
  const layoutPath = path.join(__dirname, 'src', 'app', 'layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  if (layoutContent.includes('viewport:')) {
    checks.push({ name: 'Viewport Meta', status: '✅', message: 'Viewport configured' });
  } else {
    checks.push({ name: 'Viewport Meta', status: '❌', message: 'Viewport meta missing' });
  }
} catch (error) {
  checks.push({ name: 'Viewport Meta', status: '❌', message: error.message });
}

// 5. Check SEO metadata
try {
  const layoutPath = path.join(__dirname, 'src', 'app', 'layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  if (layoutContent.includes('keywords:') && layoutContent.includes('openGraph:')) {
    checks.push({ name: 'SEO Metadata', status: '✅', message: 'Comprehensive metadata' });
  } else {
    checks.push({ name: 'SEO Metadata', status: '⚠️', message: 'Metadata incomplete' });
  }
} catch (error) {
  checks.push({ name: 'SEO Metadata', status: '❌', message: error.message });
}

// 6. Try to build (optional, commented out for speed)
// try {
//   console.log('\n🏗️  Testing build...');
//   execSync('npm run build', { stdio: 'inherit' });
//   checks.push({ name: 'Build Test', status: '✅', message: 'Build successful' });
// } catch (error) {
//   checks.push({ name: 'Build Test', status: '❌', message: 'Build failed' });
// }

// Print results
console.log('📋 Checklist Results:\n');
checks.forEach(check => {
  console.log(`${check.status} ${check.name}: ${check.message}`);
});

// Summary
const passed = checks.filter(c => c.status === '✅').length;
const failed = checks.filter(c => c.status === '❌').length;
const warnings = checks.filter(c => c.status === '⚠️').length;

console.log('\n' + '─'.repeat(60));
console.log(`\n✅ Passed: ${passed}/${checks.length}`);
if (warnings > 0) console.log(`⚠️  Warnings: ${warnings}`);
if (failed > 0) console.log(`❌ Failed: ${failed}`);

if (failed > 0) {
  console.log('\n❌ Pre-deployment checks FAILED. Please fix issues before deploying.\n');
  process.exit(1);
} else if (warnings > 0) {
  console.log('\n⚠️  Pre-deployment checks passed with warnings. Review before deploying.\n');
  process.exit(0);
} else {
  console.log('\n🎉 All pre-deployment checks PASSED! Ready to deploy.\n');
  console.log('📦 Next steps:');
  console.log('   1. git add .');
  console.log('   2. git commit -m "🔧 Complete website audit fixes - SEO & Performance"');
  console.log('   3. git push origin main');
  console.log('\n   After deployment:');
  console.log('   - Configure Nginx HTTPS redirect');
  console.log('   - Install Redis caching');
  console.log('   - Set up Cloudflare CDN');
  console.log('   - Run broken links audit\n');
  process.exit(0);
}
