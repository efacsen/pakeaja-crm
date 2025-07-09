import { test, expect } from '@playwright/test';
import { login, waitForToast } from '../utils/test-helpers';

test.describe('Daily Reports Tests', () => {
  test.describe('Manager Daily Reports', () => {
    test.beforeEach(async ({ page }) => {
      // Login as manager
      await login(page, 'manager');
      
      // Navigate to daily reports
      await page.click('nav >> text=Daily Report');
      await page.waitForLoadState('networkidle');
    });

    test('User Journey: Manager submits daily report', async ({ page }) => {
      // Click create report button
      await page.click('button:has-text("Create Report")');
      
      // Wait for form to load
      await expect(page.locator('h2:has-text("Daily Report")')).toBeVisible();
      
      // Fill report date (default is today)
      const today = new Date().toISOString().split('T')[0];
      await page.fill('input[type="date"]', today);
      
      // Fill activities
      await page.fill('textarea[placeholder*="activities"]', 'Conducted team meeting\nReviewed sales pipeline\nApproved 3 quotations');
      
      // Fill achievements
      await page.fill('textarea[placeholder*="achievements"]', 'Closed 2 deals worth 50M IDR\nTeam exceeded daily target by 20%');
      
      // Fill challenges
      await page.fill('textarea[placeholder*="challenges"]', 'Customer delayed payment\nNeed more technical support staff');
      
      // Fill tomorrow's plan
      await page.fill('textarea[placeholder*="tomorrow"]', 'Follow up on pending quotations\nTeam training on new products');
      
      // Add metrics
      await page.fill('input[placeholder*="calls"]', '25');
      await page.fill('input[placeholder*="meetings"]', '5');
      await page.fill('input[placeholder*="quotations"]', '8');
      await page.fill('input[placeholder*="deals closed"]', '2');
      
      // Submit report
      await page.click('button:has-text("Submit Report")');
      
      // Verify success
      await waitForToast(page, 'Report submitted successfully');
      
      // Verify report appears in list
      await expect(page.locator(`text=Report for ${today}`)).toBeVisible();
    });

    test('User Journey: Manager views team reports', async ({ page }) => {
      // Switch to team view
      await page.click('button:has-text("Team Reports")');
      await page.waitForLoadState('networkidle');
      
      // Verify can see team members' reports
      await expect(page.locator('text=Team Daily Reports')).toBeVisible();
      
      // Check if any team reports exist
      const teamReports = page.locator('[data-testid="team-report-card"]');
      const count = await teamReports.count();
      
      if (count > 0) {
        // Click on first team report
        await teamReports.first().click();
        
        // Verify report details modal opens
        await expect(page.locator('h3:has-text("Daily Report Details")')).toBeVisible();
        
        // Verify can see report content
        await expect(page.locator('text=Activities')).toBeVisible();
        await expect(page.locator('text=Achievements')).toBeVisible();
        await expect(page.locator('text=Challenges')).toBeVisible();
        
        // Close modal
        await page.keyboard.press('Escape');
      }
    });

    test('User Journey: Manager filters reports by date', async ({ page }) => {
      // Click date filter
      await page.click('button:has-text("Filter by Date")');
      
      // Select date range (last 7 days)
      await page.click('button:has-text("Last 7 days")');
      
      // Apply filter
      await page.click('button:has-text("Apply")');
      await page.waitForLoadState('networkidle');
      
      // Verify filtered results
      const reports = page.locator('[data-testid="report-card"]');
      const reportCount = await reports.count();
      
      // All reports should be within last 7 days
      for (let i = 0; i < reportCount; i++) {
        const reportDate = await reports.nth(i).locator('[data-testid="report-date"]').textContent();
        const date = new Date(reportDate!);
        const daysDiff = (new Date().getTime() - date.getTime()) / (1000 * 3600 * 24);
        expect(daysDiff).toBeLessThanOrEqual(7);
      }
    });
  });

  test.describe('Admin Daily Reports', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await login(page, 'admin');
      
      // Navigate to daily reports
      await page.click('nav >> text=Daily Report');
      await page.waitForLoadState('networkidle');
    });

    test('User Journey: Admin views all team reports', async ({ page }) => {
      // Admin should see overview dashboard
      await expect(page.locator('text=Daily Reports Overview')).toBeVisible();
      
      // Check for summary statistics
      await expect(page.locator('text=Total Reports Today')).toBeVisible();
      await expect(page.locator('text=Teams Reported')).toBeVisible();
      await expect(page.locator('text=Pending Reports')).toBeVisible();
      
      // Switch to all reports view
      await page.click('button:has-text("All Reports")');
      await page.waitForLoadState('networkidle');
      
      // Verify can see reports from all teams
      const teamFilter = page.locator('select[name="team"]');
      if (await teamFilter.isVisible()) {
        // Select a specific team
        await teamFilter.selectOption({ index: 1 });
        await page.waitForLoadState('networkidle');
        
        // Verify filtered by team
        const reports = page.locator('[data-testid="report-card"]');
        expect(await reports.count()).toBeGreaterThan(0);
      }
    });

    test('User Journey: Admin exports reports', async ({ page }) => {
      // Click export button
      await page.click('button:has-text("Export Reports")');
      
      // Select export format
      await page.click('button:has-text("Export as Excel")');
      
      // Handle download
      const downloadPromise = page.waitForEvent('download');
      await page.click('button:has-text("Download")');
      const download = await downloadPromise;
      
      // Verify download
      expect(download.suggestedFilename()).toContain('daily-reports');
      expect(download.suggestedFilename()).toMatch(/\.(xlsx|xls)$/);
    });

    test('User Journey: Admin sends report reminders', async ({ page }) => {
      // Check for pending reports section
      const pendingSection = page.locator('text=Pending Reports');
      
      if (await pendingSection.isVisible()) {
        // Find send reminder button
        const reminderButton = page.locator('button:has-text("Send Reminder")').first();
        
        if (await reminderButton.isVisible()) {
          // Click send reminder
          await reminderButton.click();
          
          // Confirm action
          await page.click('button:has-text("Confirm")');
          
          // Verify success
          await waitForToast(page, 'Reminder sent successfully');
        }
      }
    });
  });
});