import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for E2E tests...');
  
  // Create a browser instance for setup tasks
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Wait for the application to be ready
    console.log('⏳ Waiting for application to be ready...');
    await page.goto(config.projects[0].use?.baseURL || 'http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    // Perform any setup tasks (e.g., database seeding, auth setup)
    console.log('🔧 Performing setup tasks...');
    
    // Store authentication state if needed
    await context.storageState({ path: 'tests/auth/admin.json' });
    
    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;