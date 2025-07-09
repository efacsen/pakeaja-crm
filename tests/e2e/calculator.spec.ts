import { test, expect } from '@playwright/test';
import { login, generateTestData, waitForToast } from '../utils/test-helpers';

test.describe('Calculator Tests', () => {
  test.describe('Sales User Calculator Journey', () => {
    test.beforeEach(async ({ page }) => {
      // Login as sales user
      await login(page, 'sales');
      
      // Navigate to calculator
      await page.click('nav >> text=Calculator');
      await page.waitForLoadState('networkidle');
    });

    test('User Journey: Sales calculates coating for new project', async ({ page }) => {
      const testData = generateTestData();
      
      // Step 1: Customer Information
      await expect(page.locator('text=Customer Information')).toBeVisible();
      
      // Select existing company
      await page.click('button:has-text("Type or select company")');
      await page.fill('input[placeholder="Cari perusahaan..."]', 'PT Sinar');
      await page.waitForTimeout(1000);
      await page.click('[role="option"]:has-text("PT Sinar Jaya")');
      
      // Select contact
      await page.click('button:has-text("Select or add contact")');
      await page.waitForTimeout(500);
      await page.click('[role="option"]:has-text("Budi Santoso")');
      
      // Click next
      await page.click('button:has-text("Next")');
      
      // Step 2: Project Information
      await expect(page.locator('text=Project Information')).toBeVisible();
      
      // Fill project details
      await page.fill('input[placeholder="Project name"]', `Test Project ${Date.now()}`);
      await page.fill('textarea[placeholder="Project location"]', 'Jakarta Industrial Area');
      
      // Select project type
      await page.click('button:has-text("Select project type")');
      await page.click('[role="option"]:has-text("Tank")');
      
      // Click next
      await page.click('button:has-text("Next")');
      
      // Step 3: Surface Preparation
      await expect(page.locator('text=Surface Preparation')).toBeVisible();
      
      // Select surface type
      await page.click('button:has-text("Select surface type")');
      await page.click('[role="option"]:has-text("Steel")');
      
      // Select blast cleaning
      await page.click('button:has-text("Select blast cleaning")');
      await page.click('[role="option"]:has-text("Sa 2.5")');
      
      // Fill surface area
      await page.fill('input[placeholder="Surface area"]', '1000');
      
      // Click next
      await page.click('button:has-text("Next")');
      
      // Step 4: Coating System
      await expect(page.locator('text=Coating System')).toBeVisible();
      
      // Add primer layer
      await page.click('button:has-text("Add Primer")');
      await page.click('button:has-text("Select primer")');
      await page.click('[role="option"]:has-text("Epoxy Primer")');
      await page.fill('input[placeholder="DFT"]', '75');
      
      // Add intermediate layer
      await page.click('button:has-text("Add Intermediate")');
      await page.click('button:has-text("Select intermediate")');
      await page.click('[role="option"]:has-text("Epoxy MIO")');
      await page.fill('input[placeholder="DFT"]:last-of-type', '100');
      
      // Add topcoat
      await page.click('button:has-text("Add Topcoat")');
      await page.click('button:has-text("Select topcoat")');
      await page.click('[role="option"]:has-text("Polyurethane")');
      await page.fill('input[placeholder="DFT"]:last-of-type', '50');
      
      // Click calculate
      await page.click('button:has-text("Calculate")');
      
      // Step 5: Results
      await expect(page.locator('text=Calculation Results')).toBeVisible();
      
      // Verify results are displayed
      await expect(page.locator('text=Total DFT')).toBeVisible();
      await expect(page.locator('text=225 μm')).toBeVisible(); // 75 + 100 + 50
      
      // Verify material quantities
      await expect(page.locator('text=Material Requirements')).toBeVisible();
      await expect(page.locator('text=Epoxy Primer')).toBeVisible();
      await expect(page.locator('text=liters')).toBeVisible();
      
      // Save calculation
      await page.click('button:has-text("Save Calculation")');
      await waitForToast(page, 'Calculation saved successfully');
      
      // Download PDF
      const downloadPromise = page.waitForEvent('download');
      await page.click('button:has-text("Download PDF")');
      const download = await downloadPromise;
      
      // Verify PDF download
      expect(download.suggestedFilename()).toContain('coating-calculation');
      expect(download.suggestedFilename()).toEndWith('.pdf');
    });

    test('User Journey: Sales creates quick estimate', async ({ page }) => {
      // Use quick estimate mode
      await page.click('button:has-text("Quick Estimate")');
      
      // Fill basic information
      await page.fill('input[placeholder="Company name"]', 'Quick Test Company');
      await page.fill('input[placeholder="Contact name"]', 'Quick Test Contact');
      await page.fill('input[placeholder="Surface area"]', '500');
      
      // Select coating system template
      await page.click('button:has-text("Select template")');
      await page.click('[role="option"]:has-text("C3 Medium")');
      
      // Calculate
      await page.click('button:has-text("Calculate")');
      
      // Verify quick results
      await expect(page.locator('text=Quick Estimate Results')).toBeVisible();
      await expect(page.locator('text=Total Materials')).toBeVisible();
      await expect(page.locator('text=Estimated Cost')).toBeVisible();
    });
  });

  test.describe('Manager Calculator Review', () => {
    test.beforeEach(async ({ page }) => {
      // Login as manager
      await login(page, 'manager');
      
      // Navigate to calculator
      await page.click('nav >> text=Calculator');
      await page.waitForLoadState('networkidle');
    });

    test('User Journey: Manager reviews saved calculations', async ({ page }) => {
      // Switch to saved calculations tab
      await page.click('button:has-text("Saved Calculations")');
      await page.waitForLoadState('networkidle');
      
      // Check if any calculations exist
      const calculations = page.locator('[data-testid="calculation-card"]');
      const count = await calculations.count();
      
      if (count > 0) {
        // Click on first calculation
        await calculations.first().click();
        
        // Verify calculation details
        await expect(page.locator('h2:has-text("Calculation Details")')).toBeVisible();
        await expect(page.locator('text=Customer Information')).toBeVisible();
        await expect(page.locator('text=Project Details')).toBeVisible();
        await expect(page.locator('text=Coating System')).toBeVisible();
        await expect(page.locator('text=Material Summary')).toBeVisible();
        
        // Manager can approve calculation
        if (await page.locator('button:has-text("Approve")').isVisible()) {
          await page.click('button:has-text("Approve")');
          await waitForToast(page, 'Calculation approved');
        }
        
        // Manager can add notes
        await page.fill('textarea[placeholder="Add review notes"]', 'Reviewed and approved by manager');
        await page.click('button:has-text("Save Notes")');
        await waitForToast(page, 'Notes saved');
      }
    });

    test('User Journey: Manager exports calculation report', async ({ page }) => {
      // Go to reports section
      await page.click('button:has-text("Calculation Reports")');
      
      // Select date range
      await page.click('button:has-text("This Month")');
      
      // Export report
      const downloadPromise = page.waitForEvent('download');
      await page.click('button:has-text("Export Report")');
      const download = await downloadPromise;
      
      // Verify export
      expect(download.suggestedFilename()).toContain('calculation-report');
    });
  });
});