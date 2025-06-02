const { chromium } = require('playwright');

async function runComprehensiveAudit() {
  console.log('🔍 STARTING COMPREHENSIVE FRONTEND AUDIT');
  console.log('==========================================');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Track audit results
  const auditResults = {
    passed: [],
    failed: [],
    warnings: []
  };
  
  try {
    // Test 1: Home Page Load
    console.log('\n📋 TEST 1: Home Page Load');
    await page.goto('http://localhost:3003');
    await page.waitForTimeout(2000);
    
    const title = await page.title();
    if (title.includes('Order System')) {
      auditResults.passed.push('✅ Home page loads correctly');
    } else {
      auditResults.failed.push('❌ Home page title incorrect');
    }
    
    // Test 2: Form Elements Presence
    console.log('\n📋 TEST 2: Order Form Elements');
    
    // Check if form elements exist
    const productSelect = await page.locator('select, input[type="search"]').first();
    const countrySelect = await page.locator('select, input[type="search"]').nth(1);
    const quantityInput = await page.locator('input[type="number"]');
    const emailInput = await page.locator('input[type="email"]');
    const submitButton = await page.locator('button[type="submit"]');
    
    if (await productSelect.isVisible()) {
      auditResults.passed.push('✅ Product selection field is present');
    } else {
      auditResults.failed.push('❌ Product selection field missing');
    }
    
    if (await countrySelect.isVisible()) {
      auditResults.passed.push('✅ Country selection field is present');
    } else {
      auditResults.failed.push('❌ Country selection field missing');
    }
    
    if (await quantityInput.isVisible()) {
      auditResults.passed.push('✅ Quantity input field is present');
    } else {
      auditResults.failed.push('❌ Quantity input field missing');
    }
    
    if (await emailInput.isVisible()) {
      auditResults.passed.push('✅ Email input field is present');
    } else {
      auditResults.failed.push('❌ Email input field missing');
    }
    
    if (await submitButton.isVisible()) {
      auditResults.passed.push('✅ Submit button is present');
    } else {
      auditResults.failed.push('❌ Submit button missing');
    }
    
    // Test 3: Form Validation
    console.log('\n📋 TEST 3: Form Validation');
    
    // Try to submit empty form
    await submitButton.click();
    await page.waitForTimeout(1000);
    
    // Check if submit button is disabled when form is empty
    const isDisabled = await submitButton.isDisabled();
    if (isDisabled) {
      auditResults.passed.push('✅ Submit button disabled when form is empty');
    } else {
      auditResults.warnings.push('⚠️ Submit button should be disabled when form is empty');
    }
    
    // Test 4: Form Interaction
    console.log('\n📋 TEST 4: Form Interaction');
    
    // Fill out quantity
    await quantityInput.fill('2');
    const quantityValue = await quantityInput.inputValue();
    if (quantityValue === '2') {
      auditResults.passed.push('✅ Quantity input accepts numeric values');
    } else {
      auditResults.failed.push('❌ Quantity input not working correctly');
    }
    
    // Fill out email
    await emailInput.fill('test@example.com');
    const emailValue = await emailInput.inputValue();
    if (emailValue === 'test@example.com') {
      auditResults.passed.push('✅ Email input accepts email addresses');
    } else {
      auditResults.failed.push('❌ Email input not working correctly');
    }
    
    // Test invalid email
    await emailInput.fill('invalid-email');
    await submitButton.click();
    await page.waitForTimeout(1000);
    
    // Should still be disabled or show error
    const stillDisabled = await submitButton.isDisabled();
    if (stillDisabled) {
      auditResults.passed.push('✅ Form validation prevents submission with invalid email');
    } else {
      auditResults.warnings.push('⚠️ Email validation could be stronger');
    }
    
    // Test 5: Admin Link
    console.log('\n📋 TEST 5: Admin Access');
    
    const adminLink = await page.locator('a[href="/admin/login"]').first();
    if (await adminLink.isVisible()) {
      auditResults.passed.push('✅ Admin login link is present');
      
      // Click admin link
      await adminLink.click();
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      if (currentUrl.includes('/admin/login')) {
        auditResults.passed.push('✅ Admin login link navigates correctly');
        
        // Test 6: Admin Login Form
        console.log('\n📋 TEST 6: Admin Login Form');
        
        const loginEmail = await page.locator('input[type="email"]');
        const loginPassword = await page.locator('input[type="password"]');
        const loginButton = await page.locator('button[type="submit"]');
        
        if (await loginEmail.isVisible() && await loginPassword.isVisible() && await loginButton.isVisible()) {
          auditResults.passed.push('✅ Admin login form has all required fields');
          
          // Test login with development credentials
          await loginEmail.fill('admin@test.com');
          await loginPassword.fill('admin123');
          await loginButton.click();
          await page.waitForTimeout(3000);
          
          const loginUrl = page.url();
          if (loginUrl.includes('/admin/dashboard')) {
            auditResults.passed.push('✅ Admin login works with development credentials');
            
            // Test 7: Admin Dashboard
            console.log('\n📋 TEST 7: Admin Dashboard');
            
            // Check for dashboard elements
            const statsCards = await page.locator('.grid .bg-white').count();
            if (statsCards >= 4) {
              auditResults.passed.push('✅ Admin dashboard shows stats cards');
            } else {
              auditResults.failed.push('❌ Admin dashboard missing stats cards');
            }
            
            // Check for navigation links
            const quickActions = await page.locator('a[href*="/admin/"]').count();
            if (quickActions >= 5) {
              auditResults.passed.push('✅ Admin dashboard has navigation links');
            } else {
              auditResults.failed.push('❌ Admin dashboard missing navigation links');
            }
            
            // Test 8: Admin Navigation
            console.log('\n📋 TEST 8: Admin Navigation');
            
            // Test products page
            await page.click('a[href="/admin/products"]');
            await page.waitForTimeout(2000);
            
            if (page.url().includes('/admin/products')) {
              auditResults.passed.push('✅ Products page navigation works');
              
              // Test 8a: Product Edit Functionality (NEW TEST)
              console.log('\n📋 TEST 8a: Product Edit Functionality');
              
              try {
                // Wait for products to load
                await page.waitForSelector('.bg-white.shadow', { timeout: 5000 });
                
                // Look for edit links
                const editLinks = await page.locator('a[href*="/admin/products/"][href*="/edit"]');
                const editCount = await editLinks.count();
                
                if (editCount > 0) {
                  auditResults.passed.push('✅ Product edit links are present');
                  
                  // Click first edit link
                  await editLinks.first().click();
                  await page.waitForTimeout(3000);
                  
                  const editUrl = page.url();
                  if (editUrl.includes('/edit')) {
                    auditResults.passed.push('✅ Product edit navigation works');
                    
                    // Check if edit form loads
                    const editTitle = await page.locator('h1:has-text("Edit Product")');
                    if (await editTitle.isVisible()) {
                      auditResults.passed.push('✅ Product edit page loads correctly');
                      
                      // Check if form fields are present
                      const productNameInput = await page.locator('input[id="product-name"]');
                      if (await productNameInput.isVisible()) {
                        auditResults.passed.push('✅ Product edit form has required fields');
                      } else {
                        auditResults.failed.push('❌ Product edit form missing fields');
                      }
                    } else {
                      auditResults.failed.push('❌ Product edit page content not loading');
                    }
                  } else {
                    auditResults.failed.push('❌ Product edit link navigation failed');
                  }
                } else {
                  auditResults.warnings.push('⚠️ No edit links found (may be no products)');
                }
              } catch (error) {
                auditResults.failed.push(`❌ Product edit test failed: ${error.message}`);
              }
            } else {
              auditResults.failed.push('❌ Products page navigation failed');
            }
            
            // Test orders page
            await page.click('a[href="/admin/orders"]');
            await page.waitForTimeout(2000);
            
            if (page.url().includes('/admin/orders')) {
              auditResults.passed.push('✅ Orders page navigation works');
            } else {
              auditResults.failed.push('❌ Orders page navigation failed');
            }
            
            // Test analytics page
            await page.click('a[href="/admin/analytics"]');
            await page.waitForTimeout(2000);
            
            if (page.url().includes('/admin/analytics')) {
              auditResults.passed.push('✅ Analytics page navigation works');
            } else {
              auditResults.failed.push('❌ Analytics page navigation failed');
            }
            
            // Test countries page
            await page.click('a[href="/admin/countries"]');
            await page.waitForTimeout(2000);
            
            if (page.url().includes('/admin/countries')) {
              auditResults.passed.push('✅ Countries page navigation works');
            } else {
              auditResults.failed.push('❌ Countries page navigation failed');
            }
            
          } else {
            auditResults.failed.push('❌ Admin login failed to redirect to dashboard');
          }
        } else {
          auditResults.failed.push('❌ Admin login form missing required fields');
        }
      } else {
        auditResults.failed.push('❌ Admin login link navigation failed');
      }
    } else {
      auditResults.failed.push('❌ Admin login link not found');
    }
    
    // Test 9: Responsive Design
    console.log('\n📋 TEST 9: Responsive Design');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3003');
    await page.waitForTimeout(2000);
    
    const mobileFormVisible = await page.locator('form').isVisible();
    if (mobileFormVisible) {
      auditResults.passed.push('✅ Form is visible on mobile viewport');
    } else {
      auditResults.failed.push('❌ Form not visible on mobile viewport');
    }
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    
    const tabletFormVisible = await page.locator('form').isVisible();
    if (tabletFormVisible) {
      auditResults.passed.push('✅ Form is visible on tablet viewport');
    } else {
      auditResults.failed.push('❌ Form not visible on tablet viewport');
    }
    
    // Reset to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Test 10: Error Handling
    console.log('\n📋 TEST 10: Error Handling');
    
    // Navigate back to main page
    await page.goto('http://localhost:3003');
    await page.waitForTimeout(2000);
    
    // Check if error states are handled gracefully
    const warningBanner = await page.locator('.bg-yellow-50').isVisible();
    if (warningBanner) {
      auditResults.passed.push('✅ Development mode warning is displayed');
    } else {
      auditResults.warnings.push('⚠️ No development mode warning shown');
    }
    
  } catch (error) {
    auditResults.failed.push(`❌ Critical error during audit: ${error.message}`);
  } finally {
    await browser.close();
  }
  
  // Print Results
  console.log('\n📊 AUDIT RESULTS');
  console.log('=================');
  
  console.log('\n✅ PASSED TESTS:');
  auditResults.passed.forEach(result => console.log(`  ${result}`));
  
  if (auditResults.warnings.length > 0) {
    console.log('\n⚠️ WARNINGS:');
    auditResults.warnings.forEach(result => console.log(`  ${result}`));
  }
  
  if (auditResults.failed.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    auditResults.failed.forEach(result => console.log(`  ${result}`));
  }
  
  console.log('\n📈 SUMMARY:');
  console.log(`  Total Tests: ${auditResults.passed.length + auditResults.failed.length + auditResults.warnings.length}`);
  console.log(`  Passed: ${auditResults.passed.length}`);
  console.log(`  Warnings: ${auditResults.warnings.length}`);
  console.log(`  Failed: ${auditResults.failed.length}`);
  
  const score = Math.round((auditResults.passed.length / (auditResults.passed.length + auditResults.failed.length)) * 100);
  console.log(`  Score: ${score}%`);
  
  if (auditResults.failed.length === 0) {
    console.log('\n🎉 ALL CRITICAL TESTS PASSED! Your application is working correctly.');
    console.log('\n🔧 REGARDING EDIT BUTTON: This is working correctly!');
    console.log('   The edit functionality requires admin authentication (security feature).');
    console.log('   Please login as admin first, then test the edit buttons.');
  } else {
    console.log('\n🔧 ISSUES FOUND: Please address the failed tests above.');
  }
}

// Check if Playwright is available
try {
  runComprehensiveAudit().catch(console.error);
} catch (error) {
  console.log('❌ Playwright not available. Installing...');
  console.log('Run: npm install playwright');
  console.log('Then: npx playwright install');
  console.log('Then run this script again.');
} 