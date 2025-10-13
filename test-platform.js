const axios = require('axios');
const fs = require('fs');

const FRONTEND_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:9000';

const results = {
  passed: [],
  failed: [],
  warnings: []
};

async function testEndpoint(name, url, expectedStatus = 200) {
  try {
    const response = await axios.get(url, { timeout: 5000 });
    if (response.status === expectedStatus) {
      results.passed.push(`✅ ${name}: ${url}`);
      return true;
    } else {
      results.failed.push(`❌ ${name}: Expected ${expectedStatus}, got ${response.status}`);
      return false;
    }
  } catch (error) {
    results.failed.push(`❌ ${name}: ${error.message}`);
    return false;
  }
}

async function testFileExists(name, path) {
  if (fs.existsSync(path)) {
    results.passed.push(`✅ ${name}: ${path}`);
    return true;
  } else {
    results.failed.push(`❌ ${name}: File not found - ${path}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 FASHUN.CO Platform Test Suite\n');
  console.log('='.repeat(50));

  // Frontend Tests
  console.log('\n📱 Frontend Tests:');
  await testEndpoint('Homepage', FRONTEND_URL);
  await testEndpoint('Products Page', `${FRONTEND_URL}/collections/all`);
  await testEndpoint('Login Page', `${FRONTEND_URL}/login`);
  await testEndpoint('Register Page', `${FRONTEND_URL}/register`);
  await testEndpoint('Cart Page', `${FRONTEND_URL}/cart`);
  await testEndpoint('Account Page', `${FRONTEND_URL}/account`);

  // Backend Tests
  console.log('\n🔧 Backend Tests:');
  await testEndpoint('Medusa Health', `${BACKEND_URL}/health`);
  await testEndpoint('Products API', `${BACKEND_URL}/store/products`);
  await testEndpoint('Collections API', `${BACKEND_URL}/store/collections`);
  await testEndpoint('Regions API', `${BACKEND_URL}/store/regions`);

  // File Structure Tests
  console.log('\n📁 File Structure Tests:');
  await testFileExists('Medusa Client', 'fashun-store/src/lib/medusa-client.ts');
  await testFileExists('Product Service', 'fashun-store/src/services/medusa/product.service.ts');
  await testFileExists('Cart Service', 'fashun-store/src/services/medusa/cart.service.ts');
  await testFileExists('Checkout Service', 'fashun-store/src/services/medusa/checkout.service.ts');
  await testFileExists('Customer Service', 'fashun-store/src/services/medusa/customer.service.ts');
  await testFileExists('Wishlist Service', 'fashun-store/src/services/wishlist.service.ts');
  await testFileExists('Loyalty Service', 'fashun-store/src/services/loyalty.service.ts');
  await testFileExists('Bundle Service', 'fashun-store/src/services/medusa/bundle.service.ts');

  // Configuration Tests
  console.log('\n⚙️  Configuration Tests:');
  await testFileExists('Next Config', 'fashun-store/next.config.js');
  await testFileExists('Docker Compose', 'docker-compose.yml');
  await testFileExists('PM2 Config', 'ecosystem.config.js');
  await testFileExists('Nginx Config', 'nginx.conf');
  await testFileExists('PWA Manifest', 'fashun-store/public/manifest.json');
  await testFileExists('Robots.txt', 'fashun-store/public/robots.txt');

  // Component Tests
  console.log('\n🎨 Component Tests:');
  await testFileExists('Login Page', 'fashun-store/src/app/login/page.tsx');
  await testFileExists('Register Page', 'fashun-store/src/app/register/page.tsx');
  await testFileExists('Checkout Page', 'fashun-store/src/app/checkout/page.tsx');
  await testFileExists('Account Page', 'fashun-store/src/app/account/page.tsx');
  await testFileExists('Admin Settings', 'fashun-store/src/app/admin/settings/page.tsx');
  await testFileExists('Bundle Component', 'fashun-store/src/components/product/BundleRecommendation.tsx');
  await testFileExists('Stock Notification', 'fashun-store/src/components/product/StockNotification.tsx');
  await testFileExists('Loyalty Badge', 'fashun-store/src/components/loyalty/LoyaltyBadge.tsx');
  await testFileExists('UGC Gallery', 'fashun-store/src/components/community/UGCGallery.tsx');
  await testFileExists('Referral Program', 'fashun-store/src/components/community/ReferralProgram.tsx');
  await testFileExists('Game Drop', 'fashun-store/src/components/drops/GameDrop.tsx');

  // Script Tests
  console.log('\n📜 Script Tests:');
  await testFileExists('Trend Detector', 'scripts/ai-trend-detector.js');
  await testFileExists('Social Content', 'scripts/auto-social-content.js');
  await testFileExists('Link Checker', 'scripts/link-checker.js');
  await testFileExists('Image Optimizer', 'scripts/image-optimizer.js');
  await testFileExists('Medusa Migration', 'scripts/migrate-to-medusa.js');

  // Documentation Tests
  console.log('\n📚 Documentation Tests:');
  await testFileExists('README', 'README.md');
  await testFileExists('Medusa Migration Guide', 'MEDUSA_MIGRATION_GUIDE.md');
  await testFileExists('Auth System Guide', 'AUTH_SYSTEM_GUIDE.md');
  await testFileExists('Complete Setup Guide', 'COMPLETE_SETUP_GUIDE.md');
  await testFileExists('Tech Stack Guide', 'COMPLETE_TECH_STACK.md');
  await testFileExists('Advanced Features', 'ADVANCED_FEATURES_GUIDE.md');
  await testFileExists('Production Checklist', 'PRODUCTION_LAUNCH_CHECKLIST.md');

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⚠️  Warnings: ${results.warnings.length}`);

  if (results.failed.length > 0) {
    console.log('\n❌ Failed Tests:');
    results.failed.forEach(test => console.log(test));
  }

  if (results.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    results.warnings.forEach(warning => console.log(warning));
  }

  // Save results
  fs.writeFileSync('test-results.json', JSON.stringify(results, null, 2));
  console.log('\n📄 Results saved to test-results.json');

  // Exit code
  process.exit(results.failed.length > 0 ? 1 : 0);
}

runTests();
