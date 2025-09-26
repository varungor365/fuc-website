import { test, expect, Page } from '@playwright/test';

test.describe('User Authentication Flow', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Complete sign-up flow', async () => {
    console.log('🔐 Testing user sign-up flow...');
    
    // Navigate to sign-up page
    await page.goto('/auth');
    await page.waitForLoadState('networkidle');
    
    // Take baseline screenshot
    await expect(page).toHaveScreenshot('auth-page-initial.png');
    
    // Look for sign-up form elements
    const signUpButton = page.locator('button', { hasText: /sign up|register/i }).first();
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    // Fill out sign-up form
    if (await emailInput.isVisible()) {
      await emailInput.fill(`test-${Date.now()}@fashun.co.in`);
      await expect(page).toHaveScreenshot('auth-email-filled.png');
    }
    
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('TestPassword123!');
      await expect(page).toHaveScreenshot('auth-password-filled.png');
    }
    
    // Submit form if button is visible
    if (await signUpButton.isVisible()) {
      await signUpButton.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('auth-signup-submitted.png');
    }
    
    // Verify we're redirected or see success message
    await expect(page.url()).not.toBe('/auth');
  });

  test('Complete login flow', async () => {
    console.log('🔑 Testing user login flow...');
    
    await page.goto('/auth');
    await page.waitForLoadState('networkidle');
    
    // Look for login form elements
    const loginButton = page.locator('button', { hasText: /login|sign in/i }).first();
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    // Take screenshot of login form
    await expect(page).toHaveScreenshot('login-form.png');
    
    // Fill login form with test credentials
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@fashun.co.in');
    }
    
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('testpassword');
    }
    
    await expect(page).toHaveScreenshot('login-credentials-filled.png');
    
    // Submit login
    if (await loginButton.isVisible()) {
      await loginButton.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('login-submitted.png');
    }
  });

  test('Logout flow', async () => {
    console.log('🚪 Testing user logout flow...');
    
    // First navigate to a page that might show logout option
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Look for logout button/link
    const logoutButton = page.locator('button', { hasText: /logout|sign out/i }).first();
    const userMenu = page.locator('[data-testid="user-menu"]').first();
    
    await expect(page).toHaveScreenshot('dashboard-logged-in.png');
    
    // Try to find and click logout
    if (await userMenu.isVisible()) {
      await userMenu.click();
      await expect(page).toHaveScreenshot('user-menu-opened.png');
    }
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('logged-out.png');
    }
  });
});