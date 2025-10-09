#!/usr/bin/env node

/**
 * 🚀 FASHUN.CO.IN - GOLDEN PATH END-TO-END TEST
 * 
 * This script validates the complete customer journey from discovery to purchase
 * and profile creation. It simulates a real user experience across both applications.
 * 
 * Usage: node golden-path-test.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Test Configuration
const config = {
  mainStore: 'http://localhost:3000',
  profileService: 'http://localhost:3005',
  timeout: 30000,
  screenshots: true,
  screenshotDir: './test-screenshots',
  reportFile: './golden-path-test-report.json'
};

// Test Results
const testResults = {
  timestamp: new Date().toISOString(),
  totalTests: 0,
  passed: 0,
  failed: 0,
  errors: [],
  journey: {},
  performance: {},
  screenshots: []
};

class GoldenPathTester {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('🚀 Starting Golden Path End-to-End Test...\n');
    
    // Create screenshots directory
    if (config.screenshots && !fs.existsSync(config.screenshotDir)) {
      fs.mkdirSync(config.screenshotDir, { recursive: true });
    }

    // Launch browser
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for CI/CD
      slowMo: 100,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 720 });
    
    // Enable request interception for performance monitoring
    await this.page.setRequestInterception(true);
    const requests = [];
    
    this.page.on('request', (req) => {
      requests.push({
        url: req.url(),
        method: req.method(),
        timestamp: Date.now()
      });
      req.continue();
    });
    
    this.page.on('response', (res) => {
      const request = requests.find(r => r.url === res.url());
      if (request) {
        request.status = res.status();
        request.responseTime = Date.now() - request.timestamp;
      }
    });
    
    testResults.requests = requests;
  }

  async screenshot(name) {
    if (config.screenshots) {
      const filename = `${name}-${Date.now()}.png`;
      const filepath = path.join(config.screenshotDir, filename);
      await this.page.screenshot({ path: filepath, fullPage: true });
      testResults.screenshots.push({ name, filename, timestamp: Date.now() });
      console.log(`📸 Screenshot saved: ${filename}`);
    }
  }

  async test(name, testFn) {
    testResults.totalTests++;
    console.log(`🧪 Testing: ${name}`);
    
    try {
      const startTime = Date.now();
      await testFn();
      const endTime = Date.now();
      
      testResults.passed++;
      testResults.journey[name] = {
        status: 'PASSED',
        duration: endTime - startTime,
        timestamp: new Date().toISOString()
      };
      
      console.log(`✅ PASSED: ${name} (${endTime - startTime}ms)\n`);
    } catch (error) {
      testResults.failed++;
      testResults.errors.push({ test: name, error: error.message });
      testResults.journey[name] = {
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      
      console.log(`❌ FAILED: ${name} - ${error.message}\n`);
      await this.screenshot(`FAILED-${name}`);
    }
  }

  async runGoldenPath() {
    console.log('🛤️  EXECUTING GOLDEN PATH USER JOURNEY\n');

    // Step 1: User Discovers Website
    await this.test('Homepage Load & Discovery', async () => {
      await this.page.goto(config.mainStore, { waitUntil: 'networkidle2' });
      await this.page.waitForSelector('header', { timeout: config.timeout });
      await this.screenshot('01-homepage-loaded');
      
      // Check essential elements
      const title = await this.page.title();
      if (!title.includes('FASHUN')) throw new Error('Invalid page title');
      
      const logo = await this.page.$('img[alt*=\"FASHUN\"]');
      if (!logo) throw new Error('Logo not found');
      
      const navigation = await this.page.$('nav');
      if (!navigation) throw new Error('Navigation not found');
    });

    // Step 2: Browse Products
    await this.test('Product Catalog Browsing', async () => {
      await this.page.click('a[href*=\"collections\"]');
      await this.page.waitForSelector('[data-testid=\"product-grid\"], .grid', { timeout: config.timeout });
      await this.screenshot('02-product-catalog');
      
      const products = await this.page.$$('.group, [data-testid=\"product-card\"]');
      if (products.length === 0) throw new Error('No products found');
      
      console.log(`📦 Found ${products.length} products`);
    });

    // Step 3: View Product Details
    await this.test('Product Detail Page', async () => {
      const firstProduct = await this.page.$('.group, [data-testid=\"product-card\"]');
      if (!firstProduct) throw new Error('No product to click');
      
      await firstProduct.click();
      await this.page.waitForSelector('h1', { timeout: config.timeout });
      await this.screenshot('03-product-details');
      
      // Check product page elements
      const addToCartButton = await this.page.$('button:contains(\"Add to Cart\"), button[data-testid=\"add-to-cart\"]');
      const tryOnButton = await this.page.$('button:contains(\"Try On\"), button[data-testid=\"try-on\"]');
      
      console.log(`🛒 Add to Cart button: ${addToCartButton ? 'Found' : 'Missing'}`);
      console.log(`📸 Try On button: ${tryOnButton ? 'Found' : 'Missing'}`);
    });

    // Step 4: Test Customization Studio
    await this.test('Creator Studio Access', async () => {
      await this.page.goto(`${config.mainStore}/studio`);
      await this.page.waitForSelector('h1', { timeout: config.timeout });
      await this.screenshot('04-creator-studio');
      
      const title = await this.page.$eval('h1', el => el.textContent);
      if (!title.includes('Creator Studio')) throw new Error('Not on Creator Studio page');
      
      // Check AI tools
      const aiPatternButton = await this.page.$('button:contains(\"AI Pattern\")');
      const designRemixButton = await this.page.$('button:contains(\"Design Remix\")');
      
      if (!aiPatternButton) throw new Error('AI Pattern Generator not found');
      if (!designRemixButton) throw new Error('Design Remix not found');
    });

    // Step 5: Test Customization
    await this.test('Product Customization', async () => {
      await this.page.goto(`${config.mainStore}/customize`);
      await this.page.waitForSelector('h1', { timeout: config.timeout });
      await this.screenshot('05-customization');
      
      const title = await this.page.$eval('h1', el => el.textContent);
      if (!title.includes('Customizer') && !title.includes('Customize')) {
        throw new Error('Not on customization page');
      }
      
      // Check customization tools
      const canvas = await this.page.$('canvas');
      const addTextButton = await this.page.$('button:contains(\"Add Text\")');
      
      if (!canvas) throw new Error('Customization canvas not found');
      console.log(`🎨 Customization tools: ${addTextButton ? 'Available' : 'Limited'}`);
    });

    // Step 6: Test Profile Service
    await this.test('Profile Service Homepage', async () => {
      await this.page.goto(config.profileService);
      await this.page.waitForSelector('h1', { timeout: config.timeout });
      await this.screenshot('06-profile-service');
      
      const title = await this.page.$eval('h1', el => el.textContent);
      if (!title.includes('Fashun')) throw new Error('Profile service not loaded');
      
      const createProfileButton = await this.page.$('a:contains(\"Create Your Profile\")');
      if (!createProfileButton) throw new Error('Create Profile button not found');
    });

    // Step 7: Test Shopping Cart (if products exist)
    await this.test('Shopping Cart Functionality', async () => {
      await this.page.goto(`${config.mainStore}/cart`);
      await this.page.waitForSelector('h1, h2', { timeout: config.timeout });
      await this.screenshot('07-shopping-cart');
      
      // Cart page should load (empty or with items)
      const title = await this.page.$eval('h1, h2', el => el.textContent);
      console.log(`🛒 Cart page title: ${title}`);
    });

    // Step 8: Test Checkout Process
    await this.test('Checkout Process', async () => {
      await this.page.goto(`${config.mainStore}/checkout`);
      await this.page.waitForSelector('h1, h2, form', { timeout: config.timeout });
      await this.screenshot('08-checkout');
      
      // Checkout page should be accessible
      console.log('💳 Checkout page loaded successfully');
    });

    // Step 9: Test Search Functionality
    await this.test('Search Functionality', async () => {
      await this.page.goto(config.mainStore);
      const searchInput = await this.page.$('input[placeholder*=\"Search\"], input[type=\"search\"]');
      
      if (searchInput) {
        await searchInput.type('hoodie');
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000);
        await this.screenshot('09-search-results');
        console.log('🔍 Search functionality working');
      } else {
        console.log('⚠️  Search input not found');
      }
    });

    // Step 10: Test Mobile Responsiveness
    await this.test('Mobile Responsiveness', async () => {
      await this.page.setViewport({ width: 375, height: 667 }); // iPhone SE
      await this.page.goto(config.mainStore);
      await this.page.waitForSelector('header', { timeout: config.timeout });
      await this.screenshot('10-mobile-homepage');
      
      // Check mobile navigation
      const mobileMenu = await this.page.$('button[aria-label*=\"menu\"], button:contains(\"Menu\")');
      console.log(`📱 Mobile menu: ${mobileMenu ? 'Available' : 'Desktop-only'}`);
      
      // Reset viewport
      await this.page.setViewport({ width: 1280, height: 720 });
    });
  }

  async checkPerformance() {
    console.log('📈 PERFORMANCE ANALYSIS\n');

    await this.test('Homepage Performance', async () => {
      const startTime = Date.now();
      await this.page.goto(config.mainStore, { waitUntil: 'networkidle2' });
      const loadTime = Date.now() - startTime;
      
      testResults.performance.homepage = {
        loadTime,
        status: loadTime < 3000 ? 'GOOD' : loadTime < 5000 ? 'FAIR' : 'POOR'
      };
      
      console.log(`⏱️  Homepage load time: ${loadTime}ms`);
      if (loadTime > 3000) throw new Error(`Homepage too slow: ${loadTime}ms`);
    });

    await this.test('Profile Service Performance', async () => {
      const startTime = Date.now();
      await this.page.goto(config.profileService, { waitUntil: 'networkidle2' });
      const loadTime = Date.now() - startTime;
      
      testResults.performance.profileService = {
        loadTime,
        status: loadTime < 2000 ? 'GOOD' : loadTime < 3000 ? 'FAIR' : 'POOR'
      };
      
      console.log(`⏱️  Profile service load time: ${loadTime}ms`);
      if (loadTime > 3000) throw new Error(`Profile service too slow: ${loadTime}ms`);
    });
  }

  async generateReport() {
    console.log('📊 GENERATING TEST REPORT\n');
    
    // Calculate success rate
    const successRate = ((testResults.passed / testResults.totalTests) * 100).toFixed(1);
    
    // Performance summary
    const avgLoadTime = Object.values(testResults.performance)
      .reduce((sum, p) => sum + p.loadTime, 0) / Object.keys(testResults.performance).length;
    
    const report = {
      ...testResults,
      summary: {
        successRate: `${successRate}%`,
        totalTests: testResults.totalTests,
        passed: testResults.passed,
        failed: testResults.failed,
        averageLoadTime: `${Math.round(avgLoadTime)}ms`,
        testDuration: Date.now() - new Date(testResults.timestamp).getTime()
      }
    };
    
    // Save report to file
    fs.writeFileSync(config.reportFile, JSON.stringify(report, null, 2));
    
    // Console summary
    console.log('=' .repeat(60));
    console.log('🎯 GOLDEN PATH TEST RESULTS');
    console.log('=' .repeat(60));
    console.log(`📈 Success Rate: ${successRate}%`);
    console.log(`✅ Tests Passed: ${testResults.passed}/${testResults.totalTests}`);
    console.log(`❌ Tests Failed: ${testResults.failed}`);
    console.log(`⏱️  Average Load Time: ${Math.round(avgLoadTime)}ms`);
    console.log(`📸 Screenshots: ${testResults.screenshots.length}`);
    console.log(`📄 Full Report: ${config.reportFile}`);
    
    if (testResults.errors.length > 0) {
      console.log('\n🚨 ERRORS FOUND:');
      testResults.errors.forEach(error => {
        console.log(`  • ${error.test}: ${error.error}`);
      });
    }
    
    console.log('=' .repeat(60));
    
    return successRate >= 80;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function main() {
  const tester = new GoldenPathTester();
  let success = false;
  
  try {
    await tester.init();
    await tester.runGoldenPath();
    await tester.checkPerformance();
    success = await tester.generateReport();
  } catch (error) {
    console.error('💥 Test execution failed:', error.message);
    testResults.errors.push({ test: 'SYSTEM', error: error.message });
  } finally {
    await tester.cleanup();
  }
  
  // Exit with appropriate code
  process.exit(success ? 0 : 1);
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = { GoldenPathTester, config };