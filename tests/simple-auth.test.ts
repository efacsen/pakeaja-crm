import { test, expect } from '@playwright/test';

test.describe('Simple Authentication Test', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check if redirected to login
    await expect(page).toHaveURL(/.*login/);
    
    // Check if login form elements are present
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // Fill with invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should stay on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // Fill with valid credentials (dev auth accepts any)
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    
    // Should redirect to dashboard (might take a moment)
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    
    // Dashboard should be visible
    await expect(page.locator('h1')).toContainText('Dashboard');
  });
});