import { test, expect } from '@playwright/test';
import { login, generateTestData, waitForToast } from '../utils/test-helpers';

test.describe('Sales Pipeline Tests', () => {
  test.describe('Sales User Pipeline Management', () => {
    test.beforeEach(async ({ page }) => {
      // Login as sales user
      await login(page, 'sales');
      
      // Navigate to leads/pipeline
      await page.click('nav >> text=Leads');
      await page.waitForLoadState('networkidle');
    });

    test('User Journey: Sales creates new lead', async ({ page }) => {
      const testData = generateTestData();
      
      // Click add lead button
      await page.click('button:has-text("New Lead")');
      
      // Wait for modal
      await expect(page.locator('h2:has-text("Create New Lead")')).toBeVisible();
      
      // Fill lead information
      await page.fill('input[placeholder="Lead title"]', testData.lead.title);
      
      // Select or create company
      await page.click('button:has-text("Select company")');
      await page.fill('input[placeholder="Search company"]', testData.lead.company);
      await page.waitForTimeout(1000);
      await page.click(`text=Add "${testData.lead.company}"`);
      
      // Fill contact information
      await page.fill('input[placeholder="Contact name"]', testData.contact.name);
      await page.fill('input[placeholder="Contact email"]', testData.contact.email);
      await page.fill('input[placeholder="Contact phone"]', testData.contact.phone);
      
      // Select lead source
      await page.click('button:has-text("Select source")');
      await page.click('[role="option"]:has-text("Website")');
      
      // Fill opportunity details
      await page.fill('input[placeholder="Estimated value"]', testData.lead.value.toString());
      await page.fill('textarea[placeholder="Lead notes"]', testData.lead.notes);
      
      // Set probability
      await page.fill('input[type="range"]', '30');
      
      // Save lead
      await page.click('button:has-text("Create Lead")');
      
      // Verify success
      await waitForToast(page, 'Lead created successfully');
      
      // Verify lead appears in pipeline
      await expect(page.locator(`text=${testData.lead.title}`)).toBeVisible();
    });

    test('User Journey: Sales moves lead through pipeline stages', async ({ page }) => {
      // Find a lead in "Lead" stage
      const leadCard = page.locator('[data-stage="lead"] >> [data-testid="lead-card"]').first();
      
      if (await leadCard.isVisible()) {
        // Get lead title for tracking
        const leadTitle = await leadCard.locator('[data-testid="lead-title"]').textContent();
        
        // Drag to Qualified stage
        await leadCard.dragTo(page.locator('[data-stage="qualified"]'));
        await waitForToast(page, 'Lead status updated');
        
        // Verify lead moved
        await expect(page.locator(`[data-stage="qualified"] >> text=${leadTitle}`)).toBeVisible();
        
        // Click on lead to open details
        await page.click(`[data-stage="qualified"] >> text=${leadTitle}`);
        
        // Update lead details
        await expect(page.locator('h3:has-text("Lead Details")')).toBeVisible();
        
        // Add activity
        await page.click('button:has-text("Add Activity")');
        await page.fill('textarea[placeholder="Activity notes"]', 'Qualified lead after initial call');
        await page.click('button:has-text("Save Activity")');
        
        // Update probability
        await page.fill('input[name="probability"]', '50');
        
        // Save changes
        await page.click('button:has-text("Update Lead")');
        await waitForToast(page, 'Lead updated successfully');
        
        // Close modal
        await page.keyboard.press('Escape');
        
        // Move to Negotiation
        const qualifiedCard = page.locator(`[data-stage="qualified"] >> text=${leadTitle}`);
        await qualifiedCard.dragTo(page.locator('[data-stage="negotiation"]'));
        await waitForToast(page, 'Lead status updated');
        
        // Verify in negotiation stage
        await expect(page.locator(`[data-stage="negotiation"] >> text=${leadTitle}`)).toBeVisible();
      }
    });

    test('User Journey: Sales converts lead to won deal', async ({ page }) => {
      // Find a lead in negotiation or closing stage
      const negotiationLead = page.locator('[data-stage="negotiation"] >> [data-testid="lead-card"]').first();
      const closingLead = page.locator('[data-stage="closing"] >> [data-testid="lead-card"]').first();
      
      let leadToConvert = null;
      if (await negotiationLead.isVisible()) {
        leadToConvert = negotiationLead;
      } else if (await closingLead.isVisible()) {
        leadToConvert = closingLead;
      }
      
      if (leadToConvert) {
        // Click on lead
        await leadToConvert.click();
        
        // Mark as won
        await page.click('button:has-text("Mark as Won")');
        
        // Fill won details
        await page.fill('input[placeholder="Final amount"]', '5000000');
        await page.fill('textarea[placeholder="Win notes"]', 'Customer signed contract');
        
        // Confirm
        await page.click('button:has-text("Confirm Win")');
        
        // Verify success
        await waitForToast(page, 'Deal marked as won');
        
        // Verify moved to won column
        const leadTitle = await leadToConvert.locator('[data-testid="lead-title"]').textContent();
        await expect(page.locator(`[data-stage="won"] >> text=${leadTitle}`)).toBeVisible();
      }
    });

    test('User Journey: Sales filters pipeline view', async ({ page }) => {
      // Filter by date range
      await page.click('button:has-text("Filter")');
      await page.click('button:has-text("This Month")');
      await page.click('button:has-text("Apply Filters")');
      await page.waitForLoadState('networkidle');
      
      // Filter by value
      await page.click('button:has-text("Filter")');
      await page.fill('input[placeholder="Min value"]', '1000000');
      await page.click('button:has-text("Apply Filters")');
      await page.waitForLoadState('networkidle');
      
      // Search for specific lead
      await page.fill('input[placeholder="Search leads..."]', 'Test');
      await page.waitForTimeout(500); // Debounce
      
      // Clear filters
      await page.click('button:has-text("Clear Filters")');
      await page.waitForLoadState('networkidle');
    });
  });

  test.describe('Manager Pipeline Overview', () => {
    test.beforeEach(async ({ page }) => {
      // Login as manager
      await login(page, 'manager');
      
      // Navigate to pipeline
      await page.click('nav >> text=Leads');
      await page.waitForLoadState('networkidle');
    });

    test('User Journey: Manager views team pipeline', async ({ page }) => {
      // Switch to team view
      await page.click('button:has-text("Team View")');
      await page.waitForLoadState('networkidle');
      
      // Verify pipeline metrics
      await expect(page.locator('text=Pipeline Value')).toBeVisible();
      await expect(page.locator('text=Conversion Rate')).toBeVisible();
      await expect(page.locator('text=Average Deal Size')).toBeVisible();
      
      // Check team member filter
      if (await page.locator('select[name="team-member"]').isVisible()) {
        // Select a team member
        await page.selectOption('select[name="team-member"]', { index: 1 });
        await page.waitForLoadState('networkidle');
      }
      
      // View pipeline analytics
      await page.click('button:has-text("Analytics")');
      
      // Verify charts
      await expect(page.locator('text=Pipeline Progression')).toBeVisible();
      await expect(page.locator('text=Win Rate by Stage')).toBeVisible();
      await expect(page.locator('text=Lead Sources')).toBeVisible();
    });

    test('User Journey: Manager reviews stalled deals', async ({ page }) => {
      // Click on stalled deals filter
      await page.click('button:has-text("Stalled Deals")');
      await page.waitForLoadState('networkidle');
      
      // Check if any stalled deals exist
      const stalledDeals = page.locator('[data-testid="stalled-deal"]');
      const count = await stalledDeals.count();
      
      if (count > 0) {
        // Click on first stalled deal
        await stalledDeals.first().click();
        
        // Add manager note
        await page.fill('textarea[placeholder="Manager notes"]', 'Following up with sales rep on this deal');
        await page.click('button:has-text("Save Note")');
        
        // Assign action
        await page.click('button:has-text("Assign Action")');
        await page.selectOption('select[name="action-type"]', 'follow-up');
        await page.selectOption('select[name="assignee"]', { index: 1 });
        await page.click('button:has-text("Assign")');
        
        await waitForToast(page, 'Action assigned successfully');
      }
    });
  });
});