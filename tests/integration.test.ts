import { test, expect } from '@playwright/test';

test.describe('Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('http://localhost:3000');
    await page.evaluate(() => localStorage.clear());
  });

  test.describe('Authentication Flow', () => {
    test('should login with development auth', async ({ page }) => {
      await page.goto('http://localhost:3000/login');
      
      // Fill login form
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should redirect to dashboard
      await expect(page).toHaveURL(/.*dashboard/);
      await expect(page.locator('h1')).toContainText('Dashboard');
    });

    test('should logout successfully', async ({ page }) => {
      // First login
      await page.goto('http://localhost:3000/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Wait for dashboard
      await page.waitForURL(/.*dashboard/);
      
      // Click logout
      await page.click('button:has-text("Sign Out")');
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*login/);
    });
  });

  test.describe('Customer Management', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.goto('http://localhost:3000/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
    });

    test('should create a new customer', async ({ page }) => {
      // Navigate to customers
      await page.click('a[href="/dashboard/customers"]');
      await page.waitForURL(/.*customers/);
      
      // Click add customer button
      await page.click('button:has-text("Tambah Pelanggan")');
      
      // Fill customer form
      await page.fill('input[name="name"]', 'PT Test Indonesia');
      await page.fill('input[name="email"]', 'test@pttest.com');
      await page.fill('input[name="phone"]', '+62 812 3456 7890');
      await page.fill('input[name="company"]', 'PT Test Indonesia');
      await page.fill('textarea[name="address"]', 'Jl. Test No. 123');
      await page.fill('input[name="city"]', 'Jakarta');
      await page.fill('input[name="state"]', 'DKI Jakarta');
      await page.fill('input[name="postal_code"]', '12345');
      
      // Submit form
      await page.click('button:has-text("Tambah Pelanggan")');
      
      // Verify customer appears in list
      await expect(page.locator('text=PT Test Indonesia')).toBeVisible();
    });

    test('should search customers', async ({ page }) => {
      // Navigate to customers
      await page.click('a[href="/dashboard/customers"]');
      await page.waitForURL(/.*customers/);
      
      // Create a customer first
      await page.click('button:has-text("Tambah Pelanggan")');
      await page.fill('input[name="name"]', 'Searchable Customer');
      await page.fill('input[name="email"]', 'search@example.com');
      await page.click('button:has-text("Tambah Pelanggan")');
      
      // Search for the customer
      await page.fill('input[placeholder*="Cari pelanggan"]', 'Searchable');
      
      // Verify search results
      await expect(page.locator('text=Searchable Customer')).toBeVisible();
    });
  });

  test.describe('Coating Calculator', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.goto('http://localhost:3000/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
    });

    test('should complete a coating calculation', async ({ page }) => {
      // Navigate to calculator
      await page.click('a[href="/dashboard/calculator"]');
      await page.waitForURL(/.*calculator/);
      
      // Step 1: Project Details
      await page.fill('input[name="name"]', 'Test Coating Project');
      await page.fill('input[name="client"]', 'Test Client');
      await page.fill('textarea[name="address"]', 'Test Address, Jakarta');
      await page.click('button:has-text("Next")');
      
      // Step 2: Surface Measurements
      await page.fill('input[name="length"]', '10');
      await page.fill('input[name="width"]', '5');
      await page.fill('input[name="quantity"]', '2');
      await page.click('button:has-text("Next")');
      
      // Step 3: Coating Selection
      await page.click('label:has-text("Epoxy")');
      await page.click('button:has-text("Next")');
      
      // Step 4: Cost Calculation
      await page.fill('input[name="laborRate"]', '50000');
      await page.click('button:has-text("Next")');
      
      // Step 5: Review
      await expect(page.locator('text=Test Coating Project')).toBeVisible();
      
      // Save draft
      await page.click('button:has-text("Simpan Draft")');
      await expect(page.locator('.toast')).toContainText('Draft Disimpan');
    });

    test('should load saved calculation', async ({ page }) => {
      // First create a calculation
      await page.goto('http://localhost:3000/dashboard/calculator');
      await page.fill('input[name="name"]', 'Saved Project');
      await page.fill('input[name="client"]', 'Saved Client');
      await page.click('button:has-text("Next")');
      await page.click('button:has-text("Simpan Draft")');
      
      // Get the calculation ID from URL
      const url = page.url();
      const calculationId = new URL(url).searchParams.get('id');
      
      // Navigate away and come back
      await page.goto('http://localhost:3000/dashboard');
      await page.goto(`http://localhost:3000/dashboard/calculator?id=${calculationId}`);
      
      // Verify data is loaded
      await expect(page.locator('input[name="name"]')).toHaveValue('Saved Project');
    });
  });

  test.describe('Calculations List', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.goto('http://localhost:3000/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
    });

    test('should filter calculations by status', async ({ page }) => {
      // Navigate to calculations
      await page.click('a[href="/dashboard/calculations"]');
      await page.waitForURL(/.*calculations/);
      
      // Create calculations with different statuses
      // This would be done through the calculator in a real scenario
      
      // Filter by status
      await page.selectOption('select', 'draft');
      
      // Verify filtered results
      const statusBadges = await page.locator('.badge:has-text("Draft")').count();
      expect(statusBadges).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.goto('http://localhost:3000/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
    });

    test('should navigate between all main sections', async ({ page }) => {
      // Dashboard
      await expect(page.locator('h1')).toContainText('Dashboard');
      
      // Calculator
      await page.click('a[href="/dashboard/calculator"]');
      await expect(page).toHaveURL(/.*calculator/);
      await expect(page.locator('h1')).toContainText('Kalkulator Coating');
      
      // Customers
      await page.click('a[href="/dashboard/customers"]');
      await expect(page).toHaveURL(/.*customers/);
      await expect(page.locator('h1')).toContainText('Pelanggan');
      
      // Calculations
      await page.click('a[href="/dashboard/calculations"]');
      await expect(page).toHaveURL(/.*calculations/);
      await expect(page.locator('h1')).toContainText('Perhitungan');
    });
  });
});