import { test, expect } from '@playwright/test';

test.describe('Dashboard Features (Authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/login');
    
    // Fill login form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForURL('http://localhost:3000/dashboard', { timeout: 10000 });
  });

  test('dashboard page should load with all widgets', async ({ page }) => {
    // Check if main dashboard elements are present
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Check stats cards
    await expect(page.locator('text=Total Pelanggan')).toBeVisible();
    await expect(page.locator('text=Total Perhitungan')).toBeVisible();
    await expect(page.locator('text=Proyek Aktif')).toBeVisible();
    await expect(page.locator('text=Pendapatan Bulanan')).toBeVisible();
    
    // Check charts are rendered
    await expect(page.locator('text=Pendapatan Bulanan / Monthly Revenue')).toBeVisible();
    await expect(page.locator('text=Status Proyek / Project Status')).toBeVisible();
    
    // Check recent activities
    await expect(page.locator('text=Aktivitas Terbaru / Recent Activities')).toBeVisible();
    
    // Check top customers
    await expect(page.locator('text=Pelanggan Terbaik / Top Customers')).toBeVisible();
    
    // Check quick actions
    await expect(page.locator('text=Buat Perhitungan')).toBeVisible();
    await expect(page.locator('text=Tambah Pelanggan')).toBeVisible();
    await expect(page.locator('text=Lihat Penawaran')).toBeVisible();
    await expect(page.locator('text=Lihat Laporan')).toBeVisible();
  });

  test('reports page should load with analytics', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/reports');
    
    // Check if reports page loads
    await expect(page.locator('h1')).toContainText('Laporan & Analisis / Reports & Analytics');
    
    // Check summary cards
    await expect(page.locator('text=Total Pendapatan')).toBeVisible();
    await expect(page.locator('text=Total Proyek')).toBeVisible();
    await expect(page.locator('text=Nilai Rata-rata')).toBeVisible();
    await expect(page.locator('text=Pertumbuhan')).toBeVisible();
    
    // Check charts
    await expect(page.locator('text=Pendapatan & Proyek Bulanan')).toBeVisible();
    await expect(page.locator('text=Distribusi Tipe Proyek')).toBeVisible();
    await expect(page.locator('text=Produk Terlaris')).toBeVisible();
    await expect(page.locator('text=Pertumbuhan Pelanggan')).toBeVisible();
    
    // Check time range selector
    await expect(page.locator('text=6 Bulan Terakhir')).toBeVisible();
    
    // Check export button
    await expect(page.locator('text=Export PDF')).toBeVisible();
  });

  test('navigation should work between dashboard sections', async ({ page }) => {
    // Navigate to Reports
    await page.click('a[href="/dashboard/reports"]');
    await expect(page).toHaveURL(/.*reports/);
    await expect(page.locator('h1')).toContainText('Laporan & Analisis');
    
    // Navigate back to Dashboard
    await page.click('a[href="/dashboard"]');
    await expect(page).toHaveURL(/.*dashboard$/);
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('quick actions should navigate correctly', async ({ page }) => {
    // Test calculator quick action
    await page.click('a[href="/dashboard/calculator"]');
    await expect(page).toHaveURL(/.*calculator/);
    
    // Go back and test customers quick action
    await page.goto('http://localhost:3000/dashboard');
    await page.click('a[href="/dashboard/customers"]');
    await expect(page).toHaveURL(/.*customers/);
    
    // Go back and test calculations quick action
    await page.goto('http://localhost:3000/dashboard');
    await page.click('a[href="/dashboard/calculations"]');
    await expect(page).toHaveURL(/.*calculations/);
  });

  test('should be able to logout', async ({ page }) => {
    // Click logout button
    await page.click('button:has-text("Sign Out")');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h2')).toContainText('Welcome back');
  });
});