import { test, expect } from '@playwright/test';
import { login, generateTestData, waitForToast } from '../utils/test-helpers';

test.describe('Customer Management Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as sales user
    await login(page, 'sales');
    
    // Navigate to customers page
    await page.click('nav >> text=Customers');
    await page.waitForLoadState('networkidle');
  });

  test.describe('User Journey: Create New Customer', () => {
    test('Sales user can create customer with new company', async ({ page }) => {
      const testData = generateTestData();
      
      // Click add customer button
      await page.click('button:has-text("Add Customer")');
      
      // Wait for modal to open
      await expect(page.locator('h2:has-text("Add Customer")')).toBeVisible();
      
      // Fill company information
      await page.click('button:has-text("Select or add company")');
      await page.fill('input[placeholder="Cari perusahaan..."]', testData.company.name);
      await page.waitForTimeout(1000); // Wait for search
      
      // Click create new company option
      await page.click(`text=Tambah "${testData.company.name}"`);
      await waitForToast(page, 'Company created');
      
      // Select company type
      await page.click('button:has-text("Select type")');
      await page.click('[role="option"]:has-text("Commercial")');
      
      // Fill company address
      await page.fill('textarea[placeholder*="Jl. Industri"]', testData.company.address);
      await page.fill('input[placeholder="Jakarta"]', testData.company.city);
      
      // Fill contact information
      await page.click('button:has-text("Select or add contact")');
      await page.fill('input[placeholder="Cari contact person..."]', testData.contact.name);
      await page.waitForTimeout(500);
      
      // Create new contact
      await page.click(`text=Tambah kontak baru "${testData.contact.name}"`);
      await waitForToast(page, 'Contact created');
      
      // Fill contact details
      await page.fill('input[placeholder="Purchasing Manager"]', testData.contact.position);
      await page.fill('input[placeholder="0812-3456-7890"]', testData.contact.phone);
      await page.fill('input[placeholder="contact@company.com"]', testData.contact.email);
      
      // Select lead source
      await page.click('button:has-text("Select source")');
      await page.click('[role="option"]:has-text("Website")');
      
      // Select status
      await page.click('button:has-text("Select status")');
      await page.click('[role="option"]:has-text("Prospect")');
      
      // Fill business information
      await page.fill('input[placeholder="0"]', '1000000');
      await page.fill('input[placeholder="30"]', '30');
      await page.fill('input[placeholder="0"]:last-of-type', '10');
      
      // Add notes
      await page.fill('textarea[placeholder="Additional information"]', 'Test customer created via automated test');
      
      // Submit form
      await page.click('button:has-text("Save")');
      
      // Verify success
      await waitForToast(page, 'Customer created successfully');
      
      // Verify customer appears in list
      await expect(page.locator(`text=${testData.company.name}`)).toBeVisible();
    });

    test('Sales user can create customer with existing company', async ({ page }) => {
      // Click add customer button
      await page.click('button:has-text("Add Customer")');
      
      // Select existing company
      await page.click('button:has-text("Select or add company")');
      await page.fill('input[placeholder="Cari perusahaan..."]', 'PT Sinar');
      await page.waitForTimeout(1000);
      
      // Click on existing company
      await page.click('[role="option"]:has-text("PT Sinar Jaya")');
      
      // Verify company details are populated
      await expect(page.locator('input[value="Jakarta"]')).toBeVisible();
      
      // Select existing contact
      await page.click('button:has-text("Select or add contact")');
      await page.waitForTimeout(500);
      await page.click('[role="option"]:has-text("Budi Santoso")');
      
      // Verify contact details are populated
      await expect(page.locator('input[value="081234567890"]')).toBeVisible();
      
      // Submit form
      await page.click('button:has-text("Save")');
      
      // Verify success
      await waitForToast(page, 'Customer created successfully');
    });
  });

  test.describe('User Journey: Edit Existing Customer', () => {
    test('Sales user can edit customer information', async ({ page }) => {
      // Find and click edit button on first customer
      await page.click('button[aria-label="Edit customer"]:first-of-type');
      
      // Wait for edit modal
      await expect(page.locator('h2:has-text("Edit Customer")')).toBeVisible();
      
      // Update credit limit
      const creditLimitInput = page.locator('input[name="credit_limit"]');
      await creditLimitInput.clear();
      await creditLimitInput.fill('2000000');
      
      // Update notes
      const notesTextarea = page.locator('textarea[name="notes"]');
      await notesTextarea.clear();
      await notesTextarea.fill('Updated via automated test');
      
      // Save changes
      await page.click('button:has-text("Save")');
      
      // Verify success
      await waitForToast(page, 'Customer updated successfully');
    });
  });

  test.describe('User Journey: Search and Filter Customers', () => {
    test('Sales user can search customers by name', async ({ page }) => {
      // Use search input
      await page.fill('input[placeholder="Search customers..."]', 'Sinar');
      await page.waitForTimeout(500); // Debounce
      
      // Verify filtered results
      await expect(page.locator('text=PT Sinar Jaya')).toBeVisible();
      
      // Clear search
      await page.fill('input[placeholder="Search customers..."]', '');
      await page.waitForTimeout(500);
    });

    test('Sales user can filter customers by status', async ({ page }) => {
      // Click filter button
      await page.click('button:has-text("Filter")');
      
      // Select status filter
      await page.click('button:has-text("All Status")');
      await page.click('[role="option"]:has-text("Active")');
      
      // Apply filter
      await page.click('button:has-text("Apply")');
      
      // Verify filtered results show only active customers
      const customerCards = page.locator('[data-testid="customer-card"]');
      const count = await customerCards.count();
      
      for (let i = 0; i < count; i++) {
        const card = customerCards.nth(i);
        await expect(card.locator('text=Active')).toBeVisible();
      }
    });

    test('Sales user can paginate through customers', async ({ page }) => {
      // Check if pagination exists
      const paginationExists = await page.locator('button:has-text("Next")').isVisible();
      
      if (paginationExists) {
        // Click next page
        await page.click('button:has-text("Next")');
        await page.waitForLoadState('networkidle');
        
        // Verify page changed
        await expect(page.locator('text=Page 2')).toBeVisible();
        
        // Go back to first page
        await page.click('button:has-text("Previous")');
        await page.waitForLoadState('networkidle');
        
        // Verify back on page 1
        await expect(page.locator('text=Page 1')).toBeVisible();
      }
    });
  });

  test.describe('User Journey: View Customer Details', () => {
    test('Sales user can view full customer details', async ({ page }) => {
      // Click on first customer card
      await page.click('[data-testid="customer-card"]:first-of-type');
      
      // Wait for details modal/page
      await page.waitForLoadState('networkidle');
      
      // Verify customer details are visible
      await expect(page.locator('text=Company Information')).toBeVisible();
      await expect(page.locator('text=Contact Information')).toBeVisible();
      await expect(page.locator('text=Business Information')).toBeVisible();
      
      // Verify can see transaction history if available
      const hasTransactions = await page.locator('text=Transaction History').isVisible();
      if (hasTransactions) {
        await expect(page.locator('text=Transaction History')).toBeVisible();
      }
    });
  });
});