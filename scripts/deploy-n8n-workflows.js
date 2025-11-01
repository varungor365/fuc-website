/**
 * n8n Workflow Deployment Script
 * Uploads all workflows to n8n Cloud instance
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzYjhmYjhkMC0zYjkzLTQyNGYtODE5Ny1iNGU5ZTRhOGY0ZWQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYxOTM4MTU4fQ.muGUhlCS_tS5HPMT6ETtIsgGJxP5Ty9R2YzkKQMaGG4';
const N8N_BASE_URL = 'https://automations.fashun.co.in/api/v1';

console.log('🔧 API Configuration:');
console.log(`   Base URL: ${N8N_BASE_URL}`);
console.log(`   API Key: ${N8N_API_KEY.substring(0, 20)}...`);
console.log('');

// Workflow files to deploy
const workflowFiles = [
  '01-order-confirmation-automation.json',
  '02-abandoned-cart-recovery.json',
  '03-shopify-order-processing.json',
];

/**
 * Make API request to n8n
 */
function makeRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, N8N_BASE_URL);
    const options = {
      method: method,
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = https.request(url, options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          // Log response for debugging
          console.log(`   Response status: ${res.statusCode}`);
          if (responseData.length < 200) {
            console.log(`   Response preview: ${responseData.substring(0, 100)}`);
          }
          
          const parsed = responseData ? JSON.parse(responseData) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${responseData.substring(0, 500)}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response (${res.statusCode}): ${e.message}. Response: ${responseData.substring(0, 200)}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Get existing workflows
 */
async function getExistingWorkflows() {
  try {
    console.log('📋 Fetching existing workflows...');
    const response = await makeRequest('GET', '/workflows');
    return response.data || [];
  } catch (error) {
    console.error('❌ Failed to fetch workflows:', error.message);
    return [];
  }
}

/**
 * Create or update workflow
 */
async function deployWorkflow(workflowData, existingWorkflows) {
  const workflowName = workflowData.name;
  const existing = existingWorkflows.find(w => w.name === workflowName);

  try {
    if (existing) {
      console.log(`🔄 Updating workflow: ${workflowName}...`);
      
      // Prepare update data
      const updateData = {
        name: workflowData.name,
        nodes: workflowData.nodes,
        connections: workflowData.connections,
        active: workflowData.active || false,
        settings: workflowData.settings || {}
      };

      const response = await makeRequest('PATCH', `/workflows/${existing.id}`, updateData);
      console.log(`✅ Updated: ${workflowName} (ID: ${existing.id})`);
      return response;
    } else {
      console.log(`➕ Creating workflow: ${workflowName}...`);
      
      // Prepare create data
      const createData = {
        name: workflowData.name,
        nodes: workflowData.nodes,
        connections: workflowData.connections,
        active: false, // Don't activate automatically
        settings: workflowData.settings || {}
      };

      const response = await makeRequest('POST', '/workflows', createData);
      console.log(`✅ Created: ${workflowName} (ID: ${response.id})`);
      return response;
    }
  } catch (error) {
    console.error(`❌ Failed to deploy ${workflowName}:`, error.message);
    throw error;
  }
}

/**
 * Activate workflow
 */
async function activateWorkflow(workflowId, workflowName) {
  try {
    console.log(`🚀 Activating workflow: ${workflowName}...`);
    await makeRequest('PATCH', `/workflows/${workflowId}`, { active: true });
    console.log(`✅ Activated: ${workflowName}`);
  } catch (error) {
    console.error(`⚠️  Failed to activate ${workflowName}:`, error.message);
  }
}

/**
 * Main deployment function
 */
async function deployAllWorkflows() {
  console.log('🚀 Starting n8n Workflow Deployment\n');
  console.log('=' .repeat(60));
  
  try {
    // Get existing workflows
    const existingWorkflows = await getExistingWorkflows();
    console.log(`📊 Found ${existingWorkflows.length} existing workflows\n`);

    const deployedWorkflows = [];
    const workflowsDir = path.join(__dirname, '../n8n-workflows');

    // Deploy each workflow
    for (const filename of workflowFiles) {
      const filePath = path.join(workflowsDir, filename);
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Skipping ${filename} - file not found`);
        continue;
      }

      try {
        const workflowData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const deployed = await deployWorkflow(workflowData, existingWorkflows);
        deployedWorkflows.push({ ...deployed, originalName: filename });
        
        // Small delay between deployments
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Error deploying ${filename}:`, error.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Deployment Summary\n');
    console.log(`✅ Successfully deployed: ${deployedWorkflows.length}/${workflowFiles.length} workflows`);
    
    if (deployedWorkflows.length > 0) {
      console.log('\n📋 Deployed Workflows:');
      deployedWorkflows.forEach((w, i) => {
        console.log(`   ${i + 1}. ${w.name} (ID: ${w.id})`);
      });

      // Ask about activation
      console.log('\n⚠️  IMPORTANT: Workflows are deployed but NOT activated yet.');
      console.log('   Configure credentials first, then activate manually in n8n UI.');
      console.log('\n📝 Next Steps:');
      console.log('   1. Go to https://automations.fashun.co.in');
      console.log('   2. Configure credentials for:');
      console.log('      - Shopify API');
      console.log('      - Supabase (HTTP Request with API key)');
      console.log('      - Twilio (WhatsApp)');
      console.log('      - SendGrid/Gmail (Email)');
      console.log('      - Telegram Bot');
      console.log('   3. Test each workflow with sample data');
      console.log('   4. Activate workflows one by one');
    }

    console.log('\n🎉 Deployment complete!\n');
    return deployedWorkflows;

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run deployment
if (require.main === module) {
  deployAllWorkflows()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { deployAllWorkflows, makeRequest };
