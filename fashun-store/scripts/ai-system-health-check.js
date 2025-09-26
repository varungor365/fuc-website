#!/usr/bin/env node

/**
 * AI Image System Health Check
 * Verifies that all AI image generation systems are working properly
 */

const https = require('https');
const fs = require('fs').promises;
require('dotenv').config({ path: '.env.local' });

class AISystemHealthCheck {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      overall: 'UNKNOWN',
      checks: []
    };
  }

  log(message, level = 'info') {
    const prefix = { info: '✓', warn: '⚠️', error: '❌' }[level] || 'ℹ️';
    console.log(`${prefix} ${message}`);
  }

  async checkEnvironmentVariables() {
    this.log('Checking AI service environment variables...', 'info');
    
    const checks = {
      GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
      PERPLEXITY_API_KEY: !!process.env.PERPLEXITY_API_KEY
    };

    const allPresent = Object.values(checks).every(Boolean);
    
    this.results.checks.push({
      name: 'Environment Variables',
      status: allPresent ? 'PASS' : 'FAIL',
      details: checks,
      message: allPresent ? 'All AI API keys configured' : 'Missing required API keys'
    });

    return allPresent;
  }

  async checkImageGenerationAPI() {
    this.log('Testing image generation API endpoint...', 'info');
    
    try {
      const response = await fetch('http://localhost:3000/api/generate-image', {
        method: 'GET'
      });

      if (response.ok) {
        const data = await response.json();
        
        this.results.checks.push({
          name: 'Image Generation API - GET',
          status: 'PASS',
          details: data,
          message: `API responsive - ${data.service} v${data.version}`
        });

        // Test POST endpoint
        const postResponse = await fetch('http://localhost:3000/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: 'Test streetwear image',
            style: 'fashion',
            aspectRatio: '16:9'
          })
        });

        const postData = await postResponse.json();
        
        this.results.checks.push({
          name: 'Image Generation API - POST',
          status: postResponse.ok ? 'PASS' : 'FAIL',
          details: postData,
          message: postResponse.ok ? 'POST endpoint functional' : 'POST endpoint failed'
        });

        return response.ok && postResponse.ok;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      this.results.checks.push({
        name: 'Image Generation API',
        status: 'FAIL',
        details: { error: error.message },
        message: `API endpoint unreachable: ${error.message}`
      });
      return false;
    }
  }

  async checkAdminInterface() {
    this.log('Checking admin AI generator interface...', 'info');
    
    try {
      const response = await fetch('http://localhost:3000/ai-generator');
      
      this.results.checks.push({
        name: 'Admin AI Generator Page',
        status: response.ok ? 'PASS' : 'FAIL',
        details: { statusCode: response.status },
        message: response.ok ? 'Admin interface accessible' : `Interface returned ${response.status}`
      });

      return response.ok;
    } catch (error) {
      this.results.checks.push({
        name: 'Admin AI Generator Page',
        status: 'FAIL',
        details: { error: error.message },
        message: `Admin interface unreachable: ${error.message}`
      });
      return false;
    }
  }

  async checkStockImageDetection() {
    this.log('Verifying stock image detection...', 'info');
    
    try {
      // Check if our stock image directories exist
      const stockPaths = [
        'public/stock',
        'public/stock/models',
        'public/stock/lifestyle',
        'public/stock/icons'
      ];

      let foundPaths = 0;
      for (const stockPath of stockPaths) {
        try {
          await fs.access(stockPath);
          foundPaths++;
        } catch {
          // Path doesn't exist
        }
      }

      this.results.checks.push({
        name: 'Stock Image Detection',
        status: foundPaths > 0 ? 'PASS' : 'INFO',
        details: { 
          expectedPaths: stockPaths.length, 
          foundPaths,
          message: foundPaths > 0 ? 'Stock images detected' : 'No stock images found (already processed)'
        },
        message: foundPaths > 0 ? `Found ${foundPaths} stock directories` : 'Stock images already processed or not present'
      });

      return true;
    } catch (error) {
      this.results.checks.push({
        name: 'Stock Image Detection',
        status: 'FAIL',
        details: { error: error.message },
        message: `Error checking stock images: ${error.message}`
      });
      return false;
    }
  }

  async checkAutomationScripts() {
    this.log('Verifying automation scripts...', 'info');
    
    try {
      const scripts = [
        'scripts/ai-image-replacement.js',
        'scripts/replace-stock-images.js'
      ];

      let scriptsFound = 0;
      for (const script of scripts) {
        try {
          await fs.access(script);
          scriptsFound++;
        } catch {
          // Script doesn't exist
        }
      }

      this.results.checks.push({
        name: 'Automation Scripts',
        status: scriptsFound === scripts.length ? 'PASS' : 'FAIL',
        details: { expectedScripts: scripts.length, foundScripts: scriptsFound },
        message: scriptsFound === scripts.length ? 'All automation scripts present' : `Missing ${scripts.length - scriptsFound} scripts`
      });

      return scriptsFound === scripts.length;
    } catch (error) {
      this.results.checks.push({
        name: 'Automation Scripts',
        status: 'FAIL',
        details: { error: error.message },
        message: `Error checking scripts: ${error.message}`
      });
      return false;
    }
  }

  async checkPerplexityAPI() {
    this.log('Testing Perplexity API connection...', 'info');
    
    if (!process.env.PERPLEXITY_API_KEY) {
      this.results.checks.push({
        name: 'Perplexity API',
        status: 'FAIL',
        details: { error: 'API key not configured' },
        message: 'Perplexity API key missing'
      });
      return false;
    }

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            { role: 'user', content: 'Test connection - respond with "OK"' }
          ],
          max_tokens: 10
        })
      });

      this.results.checks.push({
        name: 'Perplexity API',
        status: response.ok ? 'PASS' : 'WARN',
        details: { statusCode: response.status },
        message: response.ok ? 'Perplexity API functional' : `API returned ${response.status} (fallback prompts will be used)`
      });

      return true; // We can function without Perplexity (fallback prompts)
    } catch (error) {
      this.results.checks.push({
        name: 'Perplexity API',
        status: 'WARN',
        details: { error: error.message },
        message: `Perplexity API error: ${error.message} (fallback prompts will be used)`
      });
      return true; // Non-critical failure
    }
  }

  generateOverallStatus() {
    const statuses = this.results.checks.map(check => check.status);
    const failCount = statuses.filter(s => s === 'FAIL').length;
    const warnCount = statuses.filter(s => s === 'WARN').length;
    
    if (failCount === 0 && warnCount === 0) {
      this.results.overall = 'HEALTHY';
    } else if (failCount === 0) {
      this.results.overall = 'HEALTHY_WITH_WARNINGS';
    } else if (failCount <= 2) {
      this.results.overall = 'DEGRADED';
    } else {
      this.results.overall = 'UNHEALTHY';
    }
  }

  async run() {
    console.log('🔍 AI IMAGE SYSTEM HEALTH CHECK');
    console.log('='.repeat(50));
    
    const checks = [
      this.checkEnvironmentVariables(),
      this.checkImageGenerationAPI(),
      this.checkAdminInterface(),
      this.checkStockImageDetection(),
      this.checkAutomationScripts(),
      this.checkPerplexityAPI()
    ];

    await Promise.all(checks);
    
    this.generateOverallStatus();
    
    // Results
    console.log('\n' + '='.repeat(50));
    console.log(`🎯 OVERALL STATUS: ${this.results.overall}`);
    console.log('='.repeat(50));
    
    this.results.checks.forEach(check => {
      const icon = { PASS: '✅', WARN: '⚠️', FAIL: '❌', INFO: 'ℹ️' }[check.status];
      console.log(`${icon} ${check.name}: ${check.message}`);
    });
    
    console.log('='.repeat(50));
    
    // Save detailed report
    const reportPath = `ai-system-health-report-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`📄 Detailed report saved: ${reportPath}`);
    
    // Summary
    if (this.results.overall === 'HEALTHY') {
      console.log('🎉 AI Image System is fully operational!');
    } else if (this.results.overall === 'HEALTHY_WITH_WARNINGS') {
      console.log('✅ AI Image System is operational with minor warnings');
    } else {
      console.log('⚠️ AI Image System has issues that need attention');
    }
    
    return this.results.overall;
  }
}

// Run if called directly
if (require.main === module) {
  const healthCheck = new AISystemHealthCheck();
  healthCheck.run().then(status => {
    process.exit(status === 'UNHEALTHY' ? 1 : 0);
  }).catch(console.error);
}

module.exports = AISystemHealthCheck;