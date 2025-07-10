const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('📊 Testing Daily Reports Submission\n');
    
    // Test 1: Sales user submitting report
    console.log('=== Test 1: Sales User Report ===');
    console.log('🔐 Logging in as sales user...');
    await page.goto('http://localhost:3001/login');
    await page.fill('input[type="email"]', 'sales@test.com');
    await page.fill('input[type="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    console.log('✅ Logged in as sales');
    
    // Navigate to daily report
    console.log('\n📝 Navigating to Daily Report...');
    await page.click('nav >> text=Daily Report');
    await page.waitForURL('**/daily-report');
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/daily-report-sales.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot: daily-report-sales.png');
    
    // Check if sales can see the report form
    const reportForm = page.locator('form, [role="form"]').first();
    if (await reportForm.isVisible()) {
      console.log('✅ Report form is visible for sales user');
      
      // Try to fill report
      console.log('📝 Filling daily report...');
      
      // Look for activity fields
      const visitField = page.locator('input[placeholder*="visit"], input[placeholder*="kunjungan"], input[name*="visit"]').first();
      const callField = page.locator('input[placeholder*="call"], input[placeholder*="telepon"], input[name*="call"]').first();
      const notesField = page.locator('textarea').first();
      
      if (await visitField.isVisible()) {
        await visitField.fill('5');
        console.log('  ✓ Filled visits');
      }
      
      if (await callField.isVisible()) {
        await callField.fill('10');
        console.log('  ✓ Filled calls');
      }
      
      if (await notesField.isVisible()) {
        await notesField.fill('Daily activities: Visited 5 clients, made 10 calls. Good progress on leads.');
        console.log('  ✓ Filled notes');
      }
    } else {
      console.log('⚠️  No report form found for sales user');
    }
    
    // Logout
    await page.click('button:has(svg.lucide-user), [data-testid="user-menu-trigger"]');
    await page.click('text=Logout');
    await page.waitForURL('**/login');
    
    // Test 2: Manager viewing reports
    console.log('\n=== Test 2: Manager Viewing Reports ===');
    console.log('🔐 Logging in as manager...');
    await page.fill('input[type="email"]', 'manager@test.com');
    await page.fill('input[type="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    console.log('✅ Logged in as manager');
    
    // Navigate to daily report
    console.log('\n📊 Checking manager report view...');
    await page.click('nav >> text=Daily Report');
    await page.waitForURL('**/daily-report');
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/daily-report-manager.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot: daily-report-manager.png');
    
    // Check for team view
    const teamView = page.locator('text=Team Reports, text=Team Performance, text=Team Overview').first();
    if (await teamView.isVisible()) {
      console.log('✅ Manager can see team reports');
    } else {
      console.log('⚠️  Team view not visible for manager');
    }
    
    // Logout
    await page.click('button:has(svg.lucide-user), [data-testid="user-menu-trigger"]');
    await page.click('text=Logout');
    await page.waitForURL('**/login');
    
    // Test 3: Admin viewing all reports
    console.log('\n=== Test 3: Admin Viewing All Reports ===');
    console.log('🔐 Logging in as admin...');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    console.log('✅ Logged in as admin');
    
    // Navigate to daily report
    console.log('\n👁️  Checking admin report view...');
    await page.click('nav >> text=Daily Report');
    await page.waitForURL('**/daily-report');
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/daily-report-admin.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot: daily-report-admin.png');
    
    // Check for admin features
    const allReports = page.locator('text=All Reports, text=All Teams, text=Organization Reports').first();
    if (await allReports.isVisible()) {
      console.log('✅ Admin can see all reports');
    } else {
      console.log('⚠️  Admin view features not visible');
    }
    
    console.log('\n✅ Daily reports test completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ 
      path: 'tests/screenshots/daily-report-error.png', 
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
})();