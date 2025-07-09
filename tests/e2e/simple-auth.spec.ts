import { test, expect } from '@playwright/test';

test.describe('Simple Authentication Test', () => {
  test('Can login and access dashboard', async ({ page }) => {
    // Go to login page
    await page.goto('http://localhost:3001/login');
    
    // Fill login form
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'Test123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Verify we're on dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Take screenshot for verification
    await page.screenshot({ path: 'tests/screenshots/dashboard-after-login.png', fullPage: true });
  });
});