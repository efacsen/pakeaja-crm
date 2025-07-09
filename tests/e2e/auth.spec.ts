import { test, expect } from '@playwright/test';
import { TEST_USERS, login, logout } from '../utils/test-helpers';

test.describe('Authentication Tests', () => {
  test.describe('User Journey: Login with Valid Credentials', () => {
    test('Admin can login successfully', async ({ page }) => {
      const user = TEST_USERS.admin;
      
      // Go to login page
      await page.goto('/login');
      
      // Verify login page is loaded
      await expect(page.locator('h2:has-text("Welcome back")')).toBeVisible();
      
      // Fill login form
      await page.fill('input[type="email"]', user.email);
      await page.fill('input[type="password"]', user.password);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Verify redirect to dashboard
      await page.waitForURL('**/dashboard');
      
      // Verify user info is displayed
      await expect(page.locator('text=' + user.fullName)).toBeVisible();
      
      // Verify admin menu items are visible
      await expect(page.locator('nav >> text=User Management')).toBeVisible();
      await expect(page.locator('nav >> text=Daily Report')).toBeVisible();
    });

    test('Manager can login successfully', async ({ page }) => {
      const user = TEST_USERS.manager;
      
      await page.goto('/login');
      await page.fill('input[type="email"]', user.email);
      await page.fill('input[type="password"]', user.password);
      await page.click('button[type="submit"]');
      
      await page.waitForURL('**/dashboard');
      await expect(page.locator('text=' + user.fullName)).toBeVisible();
      
      // Verify manager menu items
      await expect(page.locator('nav >> text=Daily Report')).toBeVisible();
      await expect(page.locator('nav >> text=Calculator')).toBeVisible();
      
      // Verify admin-only items are NOT visible
      await expect(page.locator('nav >> text=User Management')).not.toBeVisible();
    });

    test('Sales can login successfully', async ({ page }) => {
      const user = TEST_USERS.sales;
      
      await page.goto('/login');
      await page.fill('input[type="email"]', user.email);
      await page.fill('input[type="password"]', user.password);
      await page.click('button[type="submit"]');
      
      await page.waitForURL('**/dashboard');
      await expect(page.locator('text=' + user.fullName)).toBeVisible();
      
      // Verify sales menu items
      await expect(page.locator('nav >> text=Leads')).toBeVisible();
      await expect(page.locator('nav >> text=Calculator')).toBeVisible();
      
      // Verify restricted items are NOT visible
      await expect(page.locator('nav >> text=User Management')).not.toBeVisible();
      await expect(page.locator('nav >> text=Daily Report')).not.toBeVisible();
    });
  });

  test.describe('User Journey: Invalid Login Attempts', () => {
    test('Shows error with invalid credentials', async ({ page }) => {
      await page.goto('/login');
      
      // Try invalid credentials
      await page.fill('input[type="email"]', 'invalid@test.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      
      // Verify error message
      await expect(page.locator('text=Login failed')).toBeVisible();
      
      // Verify still on login page
      await expect(page).toHaveURL(/.*login/);
    });

    test('Shows validation errors for empty fields', async ({ page }) => {
      await page.goto('/login');
      
      // Try to submit with empty email
      await page.fill('input[type="password"]', 'test');
      await page.click('button[type="submit"]');
      
      // Check HTML5 validation (browser will prevent submission)
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toHaveAttribute('required', '');
      
      // Clear and try with empty password
      await page.fill('input[type="email"]', 'test@test.com');
      await page.fill('input[type="password"]', '');
      
      const passwordInput = page.locator('input[type="password"]');
      await expect(passwordInput).toHaveAttribute('required', '');
    });
  });

  test.describe('User Journey: Logout Functionality', () => {
    test('User can logout successfully', async ({ page }) => {
      // First login
      await login(page, 'sales');
      
      // Click user menu
      await page.click('[data-testid="user-menu-trigger"]');
      
      // Click logout
      await page.click('text=Logout');
      
      // Verify redirect to login
      await page.waitForURL('**/login');
      
      // Try to access dashboard directly
      await page.goto('/dashboard');
      
      // Should redirect back to login
      await expect(page).toHaveURL(/.*login/);
    });
  });

  test.describe('User Journey: Session Persistence', () => {
    test('User session persists across page reloads', async ({ page }) => {
      // Login
      await login(page, 'manager');
      
      // Reload page
      await page.reload();
      
      // Verify still logged in
      await expect(page.locator('text=' + TEST_USERS.manager.fullName)).toBeVisible();
      
      // Navigate to another page
      await page.click('nav >> text=Customers');
      await page.waitForLoadState('networkidle');
      
      // Verify still logged in
      await expect(page.locator('text=' + TEST_USERS.manager.fullName)).toBeVisible();
    });
  });
});