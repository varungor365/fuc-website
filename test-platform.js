// FASHUN Platform API Testing Script
const testEndpoints = async () => {
  const baseUrl = 'http://localhost:3000';
  const aiServiceUrl = 'http://localhost:3001';
  
  console.log('🧪 Starting FASHUN Platform Tests...\n');
  
  const results = {
    frontend: {},
    api: {},
    aiService: {}
  };

  // Test Frontend Pages
  const pages = [
    '/',
    '/studio',
    '/avatar', 
    '/customizer',
    '/profile/test-user-123',
    '/collections',
    '/dashboard'
  ];

  console.log('📱 Testing Frontend Pages:');
  for (const page of pages) {
    try {
      const response = await fetch(`${baseUrl}${page}`);
      const status = response.status;
      results.frontend[page] = { status, success: status < 400 };
      console.log(`  ${page}: ${status === 200 ? '✅' : '❌'} ${status}`);
    } catch (error) {
      results.frontend[page] = { status: 'ERROR', success: false, error: error.message };
      console.log(`  ${page}: ❌ ERROR - ${error.message}`);
    }
  }

  // Test API Endpoints
  const apiEndpoints = [
    '/api/profile/test-user-123',
    '/api/mockup',
    '/api/avatar/generate'
  ];

  console.log('\n🔌 Testing API Endpoints:');
  for (const endpoint of apiEndpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`);
      const status = response.status;
      results.api[endpoint] = { status, success: status < 500 };
      console.log(`  ${endpoint}: ${status < 500 ? '✅' : '❌'} ${status}`);
    } catch (error) {
      results.api[endpoint] = { status: 'ERROR', success: false, error: error.message };
      console.log(`  ${endpoint}: ❌ ERROR - ${error.message}`);
    }
  }

  // Test AI Service
  const aiEndpoints = [
    '/health',
    '/generate-qr'
  ];

  console.log('\n🤖 Testing AI Service:');
  for (const endpoint of aiEndpoints) {
    try {
      const response = await fetch(`${aiServiceUrl}${endpoint}`);
      const status = response.status;
      results.aiService[endpoint] = { status, success: status < 400 };
      console.log(`  ${endpoint}: ${status === 200 ? '✅' : '❌'} ${status}`);
    } catch (error) {
      results.aiService[endpoint] = { status: 'ERROR', success: false, error: error.message };
      console.log(`  ${endpoint}: ❌ ERROR - ${error.message}`);
    }
  }

  // Summary
  console.log('\n📊 Test Summary:');
  const frontendSuccess = Object.values(results.frontend).filter(r => r.success).length;
  const apiSuccess = Object.values(results.api).filter(r => r.success).length;
  const aiSuccess = Object.values(results.aiService).filter(r => r.success).length;
  
  console.log(`  Frontend Pages: ${frontendSuccess}/${pages.length} ✅`);
  console.log(`  API Endpoints: ${apiSuccess}/${apiEndpoints.length} ✅`);
  console.log(`  AI Service: ${aiSuccess}/${aiEndpoints.length} ✅`);
  
  return results;
};

// Run tests
testEndpoints().catch(console.error);