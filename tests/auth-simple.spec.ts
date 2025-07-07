import { test, expect } from '@playwright/test';

test.describe('Authentication - Working Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/.*login/);
  });

  test('can access login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h2:has-text("Welcome back")')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign in")')).toBeVisible();
  });

  test('can access register page', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('h2:has-text("Create an account")')).toBeVisible();
    await expect(page.locator('input[name="fullName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Create account")')).toBeVisible();
  });

  test('protects dashboard routes', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*login/);
  });

  test('shows calculator page in dashboard navigation', async ({ page }) => {
    // First register a user
    await page.goto('/register');
    await page.fill('input[name="fullName"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    
    // Click the checkbox container (more reliable than clicking checkbox directly)
    await page.locator('div:has(> input#acceptTerms)').click();
    
    // Submit form
    await page.click('button:has-text("Create account")');
    
    // Wait for navigation
    await page.waitForURL(/.*dashboard/, { timeout: 10000 });
    
    // Check we're on dashboard
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    
    // Check calculator link exists
    await expect(page.locator('a:has-text("Coating Calculator")')).toBeVisible();
  });

  test('can navigate to calculator', async ({ page }) => {
    // Register and login
    await page.goto('/register');
    await page.fill('input[name="fullName"]', 'Test User');
    await page.fill('input[name="email"]', 'calc@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.locator('div:has(> input#acceptTerms)').click();
    await page.click('button:has-text("Create account")');
    await page.waitForURL(/.*dashboard/);
    
    // Navigate to calculator
    await page.click('a:has-text("Coating Calculator")');
    await expect(page).toHaveURL(/.*calculator/);
    await expect(page.locator('h1:has-text("Kalkulator Coating")')).toBeVisible();
  });

  test('calculator has all steps', async ({ page }) => {
    // Register and navigate to calculator
    await page.goto('/register');
    await page.fill('input[name="fullName"]', 'Test User');
    await page.fill('input[name="email"]', 'steps@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.locator('div:has(> input#acceptTerms)').click();
    await page.click('button:has-text("Create account")');
    await page.waitForURL(/.*dashboard/);
    await page.click('a:has-text("Coating Calculator")');
    
    // Check all steps are visible
    await expect(page.locator('text=Detail Proyek')).toBeVisible();
    await expect(page.locator('text=Pengukuran')).toBeVisible();
    await expect(page.locator('text=Pilih Coating')).toBeVisible();
    await expect(page.locator('text=Kalkulasi Biaya')).toBeVisible();
    await expect(page.locator('text=Tinjau & Buat')).toBeVisible();
  });

  test('can logout', async ({ page }) => {
    // Register and login
    await page.goto('/register');
    await page.fill('input[name="fullName"]', 'Test User');
    await page.fill('input[name="email"]', 'logout@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.locator('div:has(> input#acceptTerms)').click();
    await page.click('button:has-text("Create account")');
    await page.waitForURL(/.*dashboard/);
    
    // Click logout
    await page.click('button:has-text("Sign Out")');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
    
    // Should not be able to access dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*login/);
  });
});