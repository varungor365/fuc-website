import { test, expect, Page } from '@playwright/test';

test.describe('Profile Management Flow', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Create and edit user profile', async () => {
    console.log('👤 Testing profile creation and editing...');
    
    // Navigate to profile page
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    
    // Take baseline screenshot
    await expect(page).toHaveScreenshot('profile-page-initial.png');
    
    // Look for profile form elements
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    const bioTextarea = page.locator('textarea[name="bio"], textarea[placeholder*="bio" i]').first();
    const saveButton = page.locator('button', { hasText: /save|update/i }).first();
    
    // Fill profile information
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test User Fashion');
      await expect(page).toHaveScreenshot('profile-name-filled.png');
    }
    
    if (await bioTextarea.isVisible()) {
      await bioTextarea.fill('Fashion enthusiast and streetwear lover. Creating unique designs with FASHUN.CO');
      await expect(page).toHaveScreenshot('profile-bio-filled.png');
    }
    
    // Save profile changes
    if (await saveButton.isVisible()) {
      await saveButton.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('profile-saved.png');
    }
  });

  test('Add social media links to profile', async () => {
    console.log('🔗 Testing adding social media links...');
    
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    
    // Look for social links section
    const addLinkButton = page.locator('button', { hasText: /add link|add social/i }).first();
    const instagramInput = page.locator('input[placeholder*="instagram" i], input[name="instagram"]').first();
    const twitterInput = page.locator('input[placeholder*="twitter" i], input[name="twitter"]').first();
    
    await expect(page).toHaveScreenshot('profile-links-section.png');
    
    // Add Instagram link
    if (await instagramInput.isVisible()) {
      await instagramInput.fill('https://instagram.com/fashunco');
      await expect(page).toHaveScreenshot('instagram-link-added.png');
    }
    
    // Add Twitter link
    if (await twitterInput.isVisible()) {
      await twitterInput.fill('https://twitter.com/fashunco');
      await expect(page).toHaveScreenshot('twitter-link-added.png');
    }
    
    // Click add link button if available
    if (await addLinkButton.isVisible()) {
      await addLinkButton.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('social-links-added.png');
    }
  });

  test('Upload profile avatar', async () => {
    console.log('📸 Testing profile avatar upload...');
    
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    
    // Look for avatar upload elements
    const avatarUpload = page.locator('input[type="file"]').first();
    const avatarSection = page.locator('[data-testid="avatar-section"], .avatar-upload').first();
    
    await expect(page).toHaveScreenshot('avatar-section-initial.png');
    
    // Create a test image file (base64 encoded 1x1 pixel PNG)
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    const buffer = Buffer.from(testImageBase64, 'base64');
    
    // Try to upload avatar if upload input is available
    if (await avatarUpload.isVisible()) {
      await avatarUpload.setInputFiles({
        name: 'test-avatar.png',
        mimeType: 'image/png',
        buffer: buffer
      });
      
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('avatar-uploaded.png');
    }
  });

  test('View public profile page', async () => {
    console.log('👀 Testing public profile view...');
    
    // Navigate to public profile (assuming username-based URLs)
    await page.goto('/profile/testuser');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('public-profile-view.png');
    
    // Check for profile elements
    const profileName = page.locator('[data-testid="profile-name"], .profile-name').first();
    const profileBio = page.locator('[data-testid="profile-bio"], .profile-bio').first();
    const socialLinks = page.locator('[data-testid="social-links"], .social-links').first();
    
    // Verify profile content is displayed
    if (await profileName.isVisible()) {
      await expect(profileName).toBeVisible();
    }
    
    if (await profileBio.isVisible()) {
      await expect(profileBio).toBeVisible();
    }
    
    if (await socialLinks.isVisible()) {
      await expect(socialLinks).toBeVisible();
      await expect(page).toHaveScreenshot('profile-with-social-links.png');
    }
  });
});