# 🔍 Manual Audit Checklist - Order System

## Prerequisites (PowerShell Commands)

```powershell
# Start the development server (proper PowerShell syntax)
cd frontend; npm run dev

# Check if server is running
netstat -an | findstr 3003

# Install testing dependencies if needed
npm install playwright
npx playwright install
```

## 📋 Manual Testing Checklist

### 1. ✅ Homepage Tests
- [ ] Open http://localhost:3003
- [ ] Page loads without errors
- [ ] Title shows "Order System - Place Your Order"
- [ ] Header displays "Order System" correctly
- [ ] "Admin" link visible in top-right corner

### 2. ✅ Order Form Tests

#### Form Elements Presence
- [ ] **Product Selection**: Dropdown/search field visible
- [ ] **Country Selection**: Dropdown/search field visible  
- [ ] **Quantity Input**: Number input field visible
- [ ] **Email Input**: Email input field visible
- [ ] **Submit Button**: "Submit Order" button visible

#### Form Validation
- [ ] Submit button is disabled when form is empty
- [ ] Enter invalid email → Submit button stays disabled
- [ ] Enter valid email → Submit button becomes enabled
- [ ] All required fields must be filled before submission

#### Form Interaction
- [ ] **Quantity**: Can enter numbers (try 1, 5, 10)
- [ ] **Email**: Accepts valid email format
- [ ] **Product**: Can select from dropdown
- [ ] **Country**: Can select from dropdown

### 3. ✅ Admin Access Tests

#### Admin Login
- [ ] Click "Admin" link in header
- [ ] Redirects to `/admin/login`
- [ ] Login form has email and password fields
- [ ] Development credentials shown: "Use any email with password 'admin123'"

#### Login Process
- [ ] Enter: `admin@test.com` and `admin123`
- [ ] Click "Sign in" button
- [ ] Redirects to `/admin/dashboard`
- [ ] Dashboard loads successfully

### 4. ✅ Admin Dashboard Tests

#### Stats Cards
- [ ] **Total Orders**: Shows number
- [ ] **Total Revenue**: Shows dollar amount
- [ ] **Active Products**: Shows count
- [ ] **Countries**: Shows count

#### Quick Actions
- [ ] "Add New Product" link works
- [ ] "Manage Products" link works
- [ ] "Manage Orders" link works
- [ ] "Update PPP Settings" link works
- [ ] "View Analytics" link works

### 5. ✅ Admin Navigation Tests

#### Page Navigation
- [ ] **Products** (`/admin/products`) - loads successfully
- [ ] **Orders** (`/admin/orders`) - loads successfully
- [ ] **Analytics** (`/admin/analytics`) - loads successfully
- [ ] **Countries** (`/admin/countries`) - loads successfully
- [ ] **Settings** (`/admin/settings`) - loads successfully

#### Navigation Elements
- [ ] Side navigation menu visible
- [ ] Current page highlighted in navigation
- [ ] Logo/home link works
- [ ] Logout functionality works

### 5a. ✅ Product Management Tests (IMPORTANT!)

⚠️ **CRITICAL**: You must be logged in as admin first before testing product edit!

#### Prerequisites for Product Edit Testing
1. [ ] Go to http://localhost:3003/admin/login
2. [ ] Login with email: `admin@test.com` and password: `admin123`
3. [ ] Verify you're redirected to admin dashboard
4. [ ] Navigate to Products page via dashboard or direct URL: `/admin/products`

#### Product Edit Functionality
- [ ] **Edit Button Visible**: Each product card shows "Edit" link
- [ ] **Edit Button Click**: Click "Edit" → navigates to `/admin/products/{id}/edit`
- [ ] **Edit Page Loads**: Shows "Edit Product" title and form
- [ ] **Form Pre-populated**: Product name and pricing data loaded correctly
- [ ] **Form Validation**: Can modify product name and pricing
- [ ] **Save Changes**: Submit form updates the product
- [ ] **Navigate Back**: "Back to Products" button works

#### Product Actions
- [ ] **Add Product**: "Add Product" button navigates to new product form
- [ ] **Delete Product**: Delete button shows confirmation dialog
- [ ] **Refresh**: Refresh button reloads product data

### 6. ✅ Responsive Design Tests

#### Mobile View (375px width)
- [ ] Open browser dev tools
- [ ] Set viewport to mobile (375px × 667px)
- [ ] Form remains usable
- [ ] All buttons clickable
- [ ] Text readable

#### Tablet View (768px width)
- [ ] Set viewport to tablet (768px × 1024px)
- [ ] Layout adapts properly
- [ ] Navigation still accessible
- [ ] Form elements properly sized

#### Desktop View (1280px width)
- [ ] Full desktop layout works
- [ ] All elements properly positioned
- [ ] Adequate spacing and margins

### 7. ✅ Error Handling Tests

#### Development Mode
- [ ] Yellow warning banner appears if database not connected
- [ ] Shows "Development Mode" message
- [ ] Falls back to mock data gracefully

#### Form Errors
- [ ] Invalid email shows appropriate feedback
- [ ] Empty required fields prevent submission
- [ ] Server errors handled gracefully

#### Network Issues
- [ ] Page works offline (cached assets)
- [ ] Graceful degradation when API unavailable

### 8. ✅ Data Flow Tests

#### Order Submission
- [ ] Fill complete form with valid data
- [ ] Submit order
- [ ] Success message appears
- [ ] Form resets after successful submission

#### Admin Data Views
- [ ] Orders appear in admin panel
- [ ] Product data displays correctly
- [ ] Country/PPP data loads
- [ ] Analytics show relevant data

### 9. ✅ UI/UX Tests

#### Visual Design
- [ ] Colors and styling consistent
- [ ] Icons display properly
- [ ] Loading states show appropriately
- [ ] Hover effects work on buttons/links

#### Accessibility
- [ ] Tab navigation works
- [ ] Form labels associated with inputs
- [ ] Error messages are descriptive
- [ ] Color contrast sufficient

#### Performance
- [ ] Page loads quickly (<3 seconds)
- [ ] Form interactions responsive
- [ ] Navigation smooth
- [ ] No console errors

### 10. ✅ Browser Compatibility

#### Chrome
- [ ] All functionality works
- [ ] No console errors
- [ ] Visual layout correct

#### Edge
- [ ] All functionality works
- [ ] No console errors
- [ ] Visual layout correct

#### Firefox
- [ ] All functionality works
- [ ] No console errors
- [ ] Visual layout correct

## 🚀 Automated Testing

### Run Full Audit Script
```powershell
# Make sure dev server is running first
cd frontend; npm run dev

# In another terminal, run audit
node frontend-audit.js
```

### Database Testing
```powershell
# Test database connection
node test-everything.js

# Setup database if needed
node setup-database.js
```

## 📊 Success Criteria

✅ **All tests pass**: Application is production-ready
⚠️ **Minor issues**: Address warnings but app is functional  
❌ **Critical failures**: Must fix before deployment

## 🔧 Common Issues & Fixes

### Server Not Starting
```powershell
cd frontend; npm install; npm run dev
```

### Port Already in Use
- Dev server will auto-select alternative port (3003, 3004, etc.)
- Update audit script if needed

### Playwright Issues
```powershell
npm install playwright
npx playwright install
```

### Database Connection Issues
```powershell
# Check configuration
node test-everything.js

# Setup if needed
node setup-database.js
```

### Edit Button "Not Working" Issue
🔧 **SOLUTION**: This is actually working correctly! The edit button requires admin authentication:

1. **Login First**: Go to `/admin/login` and login with `admin@test.com` / `admin123`
2. **Then Navigate**: Go to Products page and try the edit button
3. **Security Feature**: The middleware redirects to login if not authenticated

---

**Last Updated**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Test Environment**: Windows PowerShell
**Dev Server**: http://localhost:3003 