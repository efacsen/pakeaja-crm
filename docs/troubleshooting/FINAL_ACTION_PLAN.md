# 🚨 FINAL ACTION PLAN: Fix Authentication Issue

## Current Situation
You're getting redirected to `/unauthorized?reason=no-profile` because the middleware cannot read your profile due to missing service role key in Vercel.

## 🎯 Quick Fix Steps (10 minutes total)

### Step 1: Run Database Diagnostics (2 mins)
1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/bemrgpgwaatizgxftzgg/sql/new)
2. Copy and run the entire `COMPLETE_DIAGNOSTICS.sql` file
3. Copy ALL results (we need to see your profile status)

### Step 2: Add Service Role Key to Vercel (3 mins)
This is the **MOST CRITICAL** step!

1. **Get the Service Role Key:**
   - Go to [Supabase API Settings](https://supabase.com/dashboard/project/bemrgpgwaatizgxftzgg/settings/api)
   - Find the `service_role` key (NOT the `anon` key!)
   - It's the second key, labeled "service_role (secret)"
   - Copy it

2. **Add to Vercel:**
   - Go to [Vercel Environment Variables](https://vercel.com/efacsen/pakeaja-crm/settings/environment-variables)
   - Click "Add Variable"
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: [paste the service_role key]
   - Select all environments: ✅ Production ✅ Preview ✅ Development
   - Click "Save"

3. **Redeploy:**
   - Stay on Vercel dashboard
   - Click the "..." menu → "Redeploy"
   - Choose "Use existing Build Cache"
   - Wait for deployment to complete

### Step 3: Test Debug Page (2 mins)
1. Go to: https://css.pakeaja.com/debug-auth
2. This will show you:
   - ✅/❌ Environment variables status
   - ✅/❌ Your authentication status
   - ✅/❌ Profile access status
   - Clear diagnosis of issues

3. Take a screenshot of this page

### Step 4: Fix Any Remaining Issues (3 mins)

Based on the debug page results:

**If "SUPABASE_SERVICE_ROLE_KEY is missing":**
- You didn't add it correctly in Step 2
- Double-check you copied the SERVICE_ROLE key, not ANON key

**If "Profile not found":**
- Run this in Supabase SQL Editor:
```sql
-- Get your user ID first
SELECT id FROM auth.users WHERE email = 'akevinzakaria@cepatservicestation.com';

-- Use that ID here (replace YOUR_USER_ID)
INSERT INTO profiles (id, email, full_name, role, organization_id, is_active)
SELECT 
    'YOUR_USER_ID'::uuid,
    'akevinzakaria@cepatservicestation.com',
    'Kevin Zakaria',
    'admin'::user_role,
    (SELECT id FROM organizations WHERE slug = 'pakeaja'),
    true
ON CONFLICT (id) DO UPDATE
SET role = 'admin', is_active = true;
```

**If Google redirects to localhost:**
1. Go to [Supabase URL Configuration](https://supabase.com/dashboard/project/bemrgpgwaatizgxftzgg/auth/url-configuration)
2. Change Site URL from `http://localhost:3000` to `https://css.pakeaja.com`
3. Save changes

### Step 5: Final Test
1. Clear browser cache (Ctrl+Shift+Delete) or use Incognito
2. Go to https://css.pakeaja.com
3. Login with your credentials
4. You should reach the dashboard!

## 📊 What the Debug Page Will Tell You

The debug page (https://css.pakeaja.com/debug-auth) shows:

```
🔧 Environment Variables
- hasServiceRoleKey: ✅/❌  <- Must be ✅
- hasAnonKey: ✅/❌         <- Should be ✅
- hasSupabaseUrl: ✅/❌      <- Should be ✅

🔐 Authentication Status
- Shows if you're logged in
- Shows your user ID and email

👤 Profile Access
- Via Anon Key: Shows if RLS blocks access
- Via Service Role: Shows if profile exists

🗄️ Database Connection
- Tests both connection types
- Shows total profile count
```

## 🆘 If Still Not Working

Share with me:
1. Screenshot of debug page (https://css.pakeaja.com/debug-auth)
2. Results from COMPLETE_DIAGNOSTICS.sql
3. Screenshot of Vercel env variables (just the names)
4. Any error messages

## 🎉 Success Indicators
- Debug page shows all green checkmarks
- Can access https://css.pakeaja.com/dashboard
- No redirect to /unauthorized
- Login page is properly styled

---

**Start with Step 1 - Run the diagnostics!** This will tell us exactly what's wrong.