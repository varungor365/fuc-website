// Simple AI Service Test
const http = require('http');

const testAIService = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3001/health', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('✅ AI Service Response:', data);
        resolve(data);
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ AI Service Error:', error.message);
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      console.log('⏰ Request timeout');
      reject(new Error('Timeout'));
    });
  });
};

console.log('🧪 Testing AI Service...');
testAIService().catch(console.error);