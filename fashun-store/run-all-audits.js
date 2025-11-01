#!/usr/bin/env node
/**
 * Complete Website Audit Runner
 * Runs all available audits and generates a comprehensive report
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n🎯 FASHUN.CO - Complete Website Audit\n');
console.log('═'.repeat(80));
console.log('\n');

// Create reports directory
const reportsDir = path.join(process.cwd(), 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
  console.log('✅ Created reports directory\n');
}

const results = {
  timestamp: new Date().toISOString(),
  audits: {}
};

// 1. Pre-deployment check
console.log('📋 Step 1: Pre-Deployment Verification\n');
try {
  execSync('node pre-deploy-check.js', { stdio: 'inherit' });
  results.audits.preDeployment = { status: 'PASSED', score: 100 };
  console.log('\n');
} catch (error) {
  results.audits.preDeployment = { status: 'FAILED', score: 0 };
  console.log('⚠️  Pre-deployment checks failed. Continuing with other audits...\n');
}

// 2. Image optimization audit
console.log('🖼️  Step 2: Image Optimization Analysis\n');
try {
  execSync('node scripts/analyze-images.js', { stdio: 'inherit' });
  results.audits.imageOptimization = { status: 'COMPLETED' };
  console.log('\n');
} catch (error) {
  results.audits.imageOptimization = { status: 'FAILED', error: error.message };
  console.log('⚠️  Image analysis failed. Continuing...\n');
}

// 3. Check if linkinator is installed
console.log('🔗 Step 3: Broken Links Check\n');
try {
  execSync('linkinator --version', { stdio: 'pipe' });
  console.log('✅ Linkinator is installed\n');
  
  console.log('⚠️  Note: Broken links audit requires the site to be deployed.');
  console.log('   To run manually after deployment:');
  console.log('   npm run audit:links\n');
  
  results.audits.brokenLinks = { status: 'SKIPPED', reason: 'Run manually after deployment' };
} catch (error) {
  console.log('❌ Linkinator is not installed globally\n');
  console.log('📦 To install and run broken links audit:');
  console.log('   npm install -g linkinator');
  console.log('   npm run audit:links\n');
  
  results.audits.brokenLinks = { status: 'NOT_INSTALLED' };
}

// 4. Check if lighthouse is installed
console.log('⚡ Step 4: Lighthouse Performance Check\n');
try {
  execSync('lighthouse --version', { stdio: 'pipe' });
  console.log('✅ Lighthouse is installed\n');
  
  console.log('⚠️  Note: Lighthouse audit requires the site to be deployed.');
  console.log('   To run manually after deployment:');
  console.log('   lighthouse https://fashun.co --view');
  console.log('   # or');
  console.log('   lighthouse https://fashun.co --output=json --output-path=reports/lighthouse.json\n');
  
  results.audits.lighthouse = { status: 'SKIPPED', reason: 'Run manually after deployment' };
} catch (error) {
  console.log('❌ Lighthouse is not installed globally\n');
  console.log('📦 To install and run lighthouse audit:');
  console.log('   npm install -g lighthouse');
  console.log('   lighthouse https://fashun.co --view\n');
  
  results.audits.lighthouse = { status: 'NOT_INSTALLED' };
}

// Summary
console.log('\n' + '═'.repeat(80));
console.log('\n📊 AUDIT SUMMARY\n');

const completed = Object.values(results.audits).filter(a => a.status === 'COMPLETED' || a.status === 'PASSED').length;
const failed = Object.values(results.audits).filter(a => a.status === 'FAILED').length;
const skipped = Object.values(results.audits).filter(a => a.status === 'SKIPPED' || a.status === 'NOT_INSTALLED').length;

console.log(`✅ Completed: ${completed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`⏭️  Skipped: ${skipped}`);
console.log(`📊 Total: ${Object.keys(results.audits).length}\n`);

// Save results
fs.writeFileSync(
  path.join(reportsDir, 'audit-summary.json'),
  JSON.stringify(results, null, 2)
);

console.log('✅ Audit summary saved: reports/audit-summary.json\n');

// Next steps
console.log('═'.repeat(80));
console.log('\n📋 NEXT STEPS\n');

console.log('1. ✅ Review image optimization report');
console.log('   File: reports/image-optimization-report.json\n');

console.log('2. 🚀 Deploy your changes');
console.log('   git add .');
console.log('   git commit -m "🔧 Complete website audit fixes"');
console.log('   git push origin main\n');

console.log('3. 🔗 After deployment, run broken links audit');
console.log('   npm install -g linkinator');
console.log('   npm run audit:links');
console.log('   npm run fix:links\n');

console.log('4. ⚡ After deployment, run lighthouse audit');
console.log('   npm install -g lighthouse');
console.log('   lighthouse https://fashun.co --view\n');

console.log('5. ⚙️  Configure server optimizations');
console.log('   See: SERVER_OPTIMIZATION_GUIDE.md');
console.log('   - HTTPS redirect (15 min)');
console.log('   - Redis caching (30 min)');
console.log('   - Cloudflare CDN (20 min)\n');

console.log('═'.repeat(80));
console.log('\n🎉 Local audits complete! Ready to deploy.\n');
