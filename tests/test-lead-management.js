const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🎯 Testing Lead Management Workflows\n');
    
    // Login as sales user
    console.log('🔐 Logging in as sales user...');
    await page.goto('http://localhost:3001/login');
    await page.fill('input[type="email"]', 'sales@test.com');
    await page.fill('input[type="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    console.log('✅ Logged in successfully');
    
    // Navigate to leads
    console.log('\n📋 Navigating to Leads...');
    await page.click('nav >> text=Leads');
    await page.waitForURL('**/leads');
    await page.waitForTimeout(2000);
    
    // Take screenshot of leads page
    await page.screenshot({ 
      path: 'tests/screenshots/leads-page.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot: leads-page.png');
    
    // Try to create a new lead
    console.log('\n➕ Testing lead creation...');
    const createButton = page.locator('button:has-text("Create Lead"), button:has-text("Add Lead"), button:has-text("New Lead")');
    
    if (await createButton.isVisible()) {
      await createButton.click();
      console.log('✅ Found create lead button');
      
      // Wait for form/modal
      await page.waitForTimeout(1000);
      
      // Take screenshot of create form
      await page.screenshot({ 
        path: 'tests/screenshots/create-lead-form.png', 
        fullPage: true 
      });
      console.log('📸 Screenshot: create-lead-form.png');
      
      // Try to fill the form
      console.log('📝 Filling lead form...');
      
      // Look for common lead form fields
      const titleField = page.locator('input[placeholder*="title"], input[placeholder*="Title"], input[name="title"]').first();
      const companyField = page.locator('input[placeholder*="company"], input[placeholder*="Company"], input[name="company"]').first();
      const valueField = page.locator('input[placeholder*="value"], input[placeholder*="Value"], input[name="value"]').first();
      const notesField = page.locator('textarea').first();
      
      if (await titleField.isVisible()) {
        await titleField.fill('Test Lead - Automated Test');
        console.log('  ✓ Filled title');
      }
      
      if (await companyField.isVisible()) {
        await companyField.fill('Test Company XYZ');
        console.log('  ✓ Filled company');
      }
      
      if (await valueField.isVisible()) {
        await valueField.fill('1000000');
        console.log('  ✓ Filled value');
      }
      
      if (await notesField.isVisible()) {
        await notesField.fill('This is a test lead created by automated testing');
        console.log('  ✓ Filled notes');
      }
      
      // Look for submit button
      const submitButton = page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Create")').last();
      if (await submitButton.isVisible()) {
        await submitButton.click();
        console.log('✅ Submitted lead form');
        await page.waitForTimeout(2000);
      }
    } else {
      console.log('⚠️  No create lead button found');
    }
    
    // Check pipeline view
    console.log('\n🔄 Checking pipeline view...');
    const pipelineButton = page.locator('button:has-text("Pipeline"), button:has-text("Kanban")');
    
    if (await pipelineButton.isVisible()) {
      await pipelineButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ Switched to pipeline view');
      
      await page.screenshot({ 
        path: 'tests/screenshots/leads-pipeline.png', 
        fullPage: true 
      });
      console.log('📸 Screenshot: leads-pipeline.png');
    }
    
    // Test lead stages
    console.log('\n📊 Checking lead stages...');
    const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];
    for (const stage of stages) {
      const stageColumn = page.locator(`text=${stage}`).first();
      if (await stageColumn.isVisible()) {
        console.log(`  ✓ ${stage} stage found`);
      }
    }
    
    console.log('\n✅ Lead management workflow test completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ 
      path: 'tests/screenshots/lead-test-error.png', 
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
})();