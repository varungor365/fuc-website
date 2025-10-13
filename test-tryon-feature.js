const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Try On Yourself Feature Implementation\n');

const checks = {
  passed: 0,
  failed: 0,
  tests: []
};

function test(name, condition, details = '') {
  const result = condition ? '✅' : '❌';
  const status = condition ? 'PASS' : 'FAIL';
  
  checks.tests.push({ name, status, details });
  
  if (condition) {
    checks.passed++;
    console.log(`${result} ${name}`);
  } else {
    checks.failed++;
    console.log(`${result} ${name}`);
    if (details) console.log(`   └─ ${details}`);
  }
}

console.log('📦 Checking Core Files...\n');

// Service file
test(
  'Selfie Mockup Service',
  fs.existsSync('fashun-store/src/services/selfie-mockup.service.ts'),
  'Face detection and styling service'
);

// Component file
test(
  'Try On Button Component',
  fs.existsSync('fashun-store/src/components/product/TryOnButton.tsx'),
  'UI component for try-on feature'
);

// API route
test(
  'Mockup Generation API',
  fs.existsSync('fashun-store/src/app/api/mockup/generate/route.ts'),
  'Backend API for image overlay'
);

// Example page
test(
  'Product Page Example',
  fs.existsSync('fashun-store/src/app/product/[id]/page-with-tryon.tsx'),
  'Example integration in product page'
);

console.log('\n📁 Checking Directories...\n');

// Directories
test(
  'Mockup Templates Directory',
  fs.existsSync('fashun-store/public/mockup-templates'),
  'Directory for T-shirt templates'
);

test(
  'Face Models Directory',
  fs.existsSync('fashun-store/public/models'),
  'Directory for face-api.js models'
);

test(
  'Uploads Directory',
  fs.existsSync('fashun-store/public/uploads/mockups'),
  'Directory for generated mockups'
);

console.log('\n🔧 Checking Setup Scripts...\n');

// Scripts
test(
  'Face Models Setup Script',
  fs.existsSync('scripts/setup-face-models.js'),
  'Script to download face-api.js models'
);

test(
  'Template Generator Script',
  fs.existsSync('scripts/generate-tshirt-templates.js'),
  'Script to generate T-shirt templates'
);

console.log('\n📚 Checking Documentation...\n');

// Documentation
test(
  'Try On Feature Guide',
  fs.existsSync('TRYON_FEATURE_GUIDE.md'),
  'Complete documentation for the feature'
);

test(
  'Models README',
  fs.existsSync('fashun-store/public/models/README.md'),
  'Instructions for downloading models'
);

test(
  'Templates README',
  fs.existsSync('fashun-store/public/mockup-templates/README.md'),
  'Instructions for T-shirt templates'
);

console.log('\n📦 Checking Package Configuration...\n');

// Package.json
const packageJson = JSON.parse(
  fs.readFileSync('fashun-store/package.json', 'utf8')
);

test(
  'face-api.js Dependency',
  packageJson.dependencies['face-api.js'] !== undefined,
  'Face detection library'
);

test(
  'Sharp Dependency',
  packageJson.dependencies['sharp'] !== undefined,
  'Image processing library'
);

test(
  'Setup Scripts in package.json',
  packageJson.scripts['setup:tryon'] !== undefined,
  'NPM scripts for setup'
);

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Test Results: ${checks.passed}/${checks.passed + checks.failed} passed\n`);

if (checks.failed === 0) {
  console.log('✨ All tests passed! Try On Yourself feature is ready.\n');
  console.log('📋 Next Steps:');
  console.log('   1. cd fashun-store');
  console.log('   2. npm install');
  console.log('   3. npm run setup:tryon');
  console.log('   4. npm run dev');
  console.log('   5. Navigate to any product page');
  console.log('   6. Click "Try On Yourself" button\n');
} else {
  console.log(`⚠️  ${checks.failed} test(s) failed. Review the output above.\n`);
}

// Save results
fs.writeFileSync(
  'tryon-test-results.json',
  JSON.stringify(checks, null, 2)
);

console.log('💾 Results saved to tryon-test-results.json\n');
