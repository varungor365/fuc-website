import { Page, expect } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';

export class VisualRegressionTester {
  private baselineDir: string;
  private currentDir: string;
  private diffDir: string;

  constructor(testName: string) {
    this.baselineDir = path.join('tests', 'visual-baselines', testName);
    this.currentDir = path.join('test-results', 'visual-current', testName);
    this.diffDir = path.join('test-results', 'visual-diffs', testName);
  }

  async initializeDirectories() {
    await Promise.all([
      fs.mkdir(this.baselineDir, { recursive: true }),
      fs.mkdir(this.currentDir, { recursive: true }),
      fs.mkdir(this.diffDir, { recursive: true })
    ]);
  }

  async captureAndCompare(page: Page, screenshotName: string, options?: {
    fullPage?: boolean;
    threshold?: number;
    mask?: Array<any>;
  }): Promise<boolean> {
    await this.initializeDirectories();

    const baselinePath = path.join(this.baselineDir, `${screenshotName}.png`);
    const currentPath = path.join(this.currentDir, `${screenshotName}.png`);
    
    // Take current screenshot
    await page.screenshot({
      path: currentPath,
      fullPage: options?.fullPage ?? true
    });

    // Check if baseline exists
    try {
      await fs.access(baselinePath);
      
      // Compare with baseline
      await expect(page).toHaveScreenshot(`${screenshotName}.png`, {
        threshold: options?.threshold ?? 0.2,
        mask: options?.mask
      });
      
      return true;
    } catch (error) {
      // No baseline exists, create it
      console.log(`📸 Creating baseline screenshot: ${screenshotName}`);
      await fs.copyFile(currentPath, baselinePath);
      return true;
    }
  }

  async generateReport(): Promise<VisualRegressionReport> {
    const report: VisualRegressionReport = {
      timestamp: new Date().toISOString(),
      totalScreenshots: 0,
      passed: 0,
      failed: 0,
      newBaselines: 0,
      differences: []
    };

    try {
      const files = await fs.readdir(this.currentDir);
      report.totalScreenshots = files.length;

      for (const file of files) {
        const baselinePath = path.join(this.baselineDir, file);
        const currentPath = path.join(this.currentDir, file);
        
        try {
          await fs.access(baselinePath);
          // Baseline exists, comparison was made
          report.passed++;
        } catch {
          // New baseline created
          report.newBaselines++;
        }
      }
    } catch (error) {
      console.error('Error generating visual regression report:', error);
    }

    return report;
  }
}

export interface VisualRegressionReport {
  timestamp: string;
  totalScreenshots: number;
  passed: number;
  failed: number;
  newBaselines: number;
  differences: Array<{
    screenshotName: string;
    diffPercentage: number;
    diffPath: string;
  }>;
}

export class ScreenshotHelper {
  static async captureElementScreenshot(
    page: Page, 
    selector: string, 
    name: string,
    options?: { threshold?: number }
  ) {
    const element = page.locator(selector);
    await expect(element).toBeVisible();
    await expect(element).toHaveScreenshot(`${name}.png`, {
      threshold: options?.threshold ?? 0.2
    });
  }

  static async captureFullPageScreenshot(
    page: Page, 
    name: string,
    options?: { 
      threshold?: number;
      mask?: Array<any>;
      animations?: 'disabled' | 'allow';
    }
  ) {
    // Disable animations for consistent screenshots
    if (options?.animations === 'disabled') {
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
          }
        `
      });
    }

    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      threshold: options?.threshold ?? 0.2,
      mask: options?.mask,
      animations: options?.animations ?? 'disabled'
    });
  }

  static async waitForStableLayout(page: Page, timeout: number = 5000) {
    // Wait for network idle
    await page.waitForLoadState('networkidle');
    
    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);
    
    // Wait for images to load
    await page.waitForFunction(() => {
      const images = Array.from(document.images);
      return images.every(img => img.complete);
    }, { timeout });

    // Additional wait for layout stability
    await page.waitForTimeout(1000);
  }
}