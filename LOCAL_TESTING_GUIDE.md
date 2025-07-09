# 🧪 PakeAja CRM - Local Testing Guide

## 🚀 Quick Start

Your application is running at: **http://localhost:3002**

## 📋 Testing Checklist

### 1. System Health Check ✅
- [ ] Visit http://localhost:3002/test-supabase
- [ ] Click "Run Tests" button
- [ ] Verify all 4 tests pass:
  - Database Connection
  - Authentication
  - RLS Policies  
  - Storage Access

### 2. Create Test Users in Supabase
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Authentication > Users**
3. Create test users by clicking "Invite User":

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| admin@test.com | Test123! | admin | Full system access |
| manager@test.com | Test123! | manager | Team management |
| sales@test.com | Test123! | sales | Sales operations |
| estimator@test.com | Test123! | estimator | Quote generation |

**Note**: After creating users, you need to update their roles in the profiles table:
1. Go to **Table Editor > profiles**
2. Find each user by email
3. Update their `role` field to match the table above

### 3. Authentication Testing 🔐

#### Login Flow:
1. Visit http://localhost:3002/login
2. Test with each user account
3. Verify successful redirect to dashboard
4. Check that the correct menu items appear for each role

#### Test Cases:
- [ ] Invalid credentials show error
- [ ] Valid login redirects to dashboard
- [ ] Logout works correctly
- [ ] Session persists on page refresh

### 4. Feature Testing by Role

#### A. Admin User Testing (admin@test.com)
- [ ] **Dashboard**: All KPI cards visible
- [ ] **User Management**: Can view/edit all users
- [ ] **Role Switcher**: Can switch between roles
- [ ] **Settings**: Full access to system settings
- [ ] **All Features**: Access to every module

#### B. Manager Testing (manager@test.com)
- [ ] **Dashboard**: Team performance visible
- [ ] **Daily Reports**: Can approve team reports
- [ ] **Sales Pipeline**: Can view all deals
- [ ] **User Management**: Can view team members
- [ ] **Reports**: Access to team analytics

#### C. Sales Testing (sales@test.com)
- [ ] **Dashboard**: Personal KPIs only
- [ ] **Daily Reports**: Can create/submit reports
- [ ] **Sales Pipeline**: Can manage own leads
- [ ] **Canvassing**: Can log field visits
- [ ] **Limited Access**: No admin features

### 5. Core Feature Testing 📊

#### Daily Reports Workflow:
1. Login as **sales@test.com**
2. Go to http://localhost:3002/dashboard/daily-report
3. Fill in activity numbers
4. Save as draft
5. Submit report
6. Login as **manager@test.com**
7. Go to Team Reports
8. Approve the submitted report

#### Sales Pipeline:
1. Visit http://localhost:3002/dashboard/leads
2. Click "New Lead" button
3. Fill in lead details
4. Test drag-and-drop between stages
5. Apply filters (stage, type, temperature)
6. Test search functionality

#### Materials Catalog:
1. Visit http://localhost:3002/dashboard/materials
2. Browse coating systems
3. Click on products for details
4. Test responsive grid layout

#### Calculator (if enabled):
1. Visit http://localhost:3002/dashboard/calculator
2. Input project details
3. Select coating systems
4. Generate quotation
5. Test print functionality

### 6. Mobile Responsiveness 📱
Test on different viewport sizes:
- [ ] iPhone SE (375px)
- [ ] iPad (768px)
- [ ] Desktop (1280px+)

Key areas to check:
- [ ] Sidebar collapses properly
- [ ] Tables are scrollable
- [ ] Forms are usable
- [ ] Touch interactions work

### 7. Performance Testing ⚡
- [ ] Dashboard loads < 2 seconds
- [ ] Page transitions are smooth
- [ ] Data tables paginate properly
- [ ] Images lazy load correctly

### 8. Error Handling 🛡️
- [ ] Submit empty forms - should show validation
- [ ] Try accessing unauthorized pages
- [ ] Test with slow network (Chrome DevTools)
- [ ] Check offline behavior

## 🔍 Common Issues & Solutions

### Issue: Can't login
**Solution**: 
1. Check user exists in Supabase Auth
2. Verify profile was created in profiles table
3. Ensure role is set correctly

### Issue: Features missing
**Solution**: Check feature flags in `.env.local`:
```env
NEXT_PUBLIC_ENABLE_CALCULATOR=true
NEXT_PUBLIC_ENABLE_PROJECTS=true
NEXT_PUBLIC_ENABLE_SALES=true
```

### Issue: Data not saving
**Solution**: 
1. Check browser console for errors
2. Verify RLS policies in Supabase
3. Ensure user has correct permissions

### Issue: Slow performance
**Solution**:
1. Check if running production build: `npm run build && npm start`
2. Clear browser cache
3. Check network tab for slow requests

## 📊 Test Results Template

Copy this template for documenting your test results:

```markdown
## Test Session: [Date]

### Environment
- Browser: [Chrome/Firefox/Safari]
- Device: [Desktop/Mobile]
- User Role: [admin/manager/sales]

### Test Results
- [ ] System Health: PASS/FAIL
- [ ] Authentication: PASS/FAIL  
- [ ] Dashboard: PASS/FAIL
- [ ] Daily Reports: PASS/FAIL
- [ ] Sales Pipeline: PASS/FAIL
- [ ] User Management: PASS/FAIL
- [ ] Mobile Responsive: PASS/FAIL

### Issues Found
1. [Description]
2. [Description]

### Notes
[Any additional observations]
```

## 🎯 Ready for Production?

Once all tests pass:
1. Run production build: `npm run build`
2. Test production locally: `npm start`
3. Deploy to Vercel
4. Run tests on staging URL
5. Go live! 🚀

---

**Need Help?** Check the browser console for errors or review the [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) guide.