const https = require('https');
const http = require('http');

const tests = [
  { name: 'Frontend Dev', url: 'http://localhost:3000' },
  { name: 'Profile Service', url: 'http://localhost:3001' },
  { name: 'Medusa Backend', url: 'http://localhost:9000/health' }
];

async function checkEndpoint(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: 5000 }, (res) => {
      resolve({ success: true, status: res.statusCode });
    });
    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

async function runTests() {
  console.log('🧪 Running Health Checks...\n');
  
  for (const test of tests) {
    const result = await checkEndpoint(test.url);
    if (result.success) {
      console.log(`✅ ${test.name}: OK (${result.status})`);
    } else {
      console.log(`❌ ${test.name}: FAILED (${result.error})`);
    }
  }
  
  console.log('\n✅ Health check complete!');
}

runTests();
