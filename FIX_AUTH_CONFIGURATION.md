# 🔥 URGENT: Fix Authentication Configuration

## Current Status
✅ Database is properly configured (profile exists, functions work)  
❌ Middleware can't read profiles (using wrong Supabase key)  
❌ Google OAuth redirects to localhost (misconfigured)

## ⚡ Quick Fix Steps

### 1️⃣ Get Your Service Role Key (2 mins)
1. Go to **Supabase Dashboard**: https://supabase.com/dashboard/project/bemrgpgwaatizgxftzgg/settings/api
2. Find **"service_role"** key (NOT the anon key)
3. Copy it (keep it secret!)

### 2️⃣ Add to Vercel Environment Variables (3 mins)
1. Go to **Vercel Dashboard**: https://vercel.com/efacsen/pakeaja-crm/settings/environment-variables
2. Add new variable:
   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: [paste the service_role key from step 1]
   - **Environment**: Production, Preview, Development
3. Click **Save**

### 3️⃣ Fix Google OAuth Redirect (2 mins)
1. Go to **Supabase Dashboard**: https://supabase.com/dashboard/project/bemrgpgwaatizgxftzgg/auth/url-configuration
2. Update these settings:
   - **Site URL**: `https://css.pakeaja.com`
   - **Redirect URLs**: Add these (remove localhost entries):
     ```
     https://css.pakeaja.com/auth/callback
     https://css.pakeaja.com/**
     ```
3. Click **Save**

### 4️⃣ Deploy the Code Changes (2 mins)
The code changes are ready to deploy. They include:
- Service role client for middleware
- Updated RBAC middleware to use service role
- Proper RLS bypass for profile reading

Run:
```bash
git add -A
git commit -m "fix: add service role client for middleware RLS bypass"
git push origin main
```

### 5️⃣ Test the Fix (2 mins)
1. Wait for Vercel deployment (2-3 mins)
2. Clear browser cache completely
3. Go to https://css.pakeaja.com
4. Login with your credentials
5. **You should now access the dashboard!**

## 🔍 What This Fixes

### Service Role Key
- **Before**: Middleware used `ANON_KEY` → subject to RLS → couldn't read profiles
- **After**: Middleware uses `SERVICE_ROLE_KEY` → bypasses RLS → can read all profiles

### Google OAuth
- **Before**: Redirects to `localhost` → breaks production login
- **After**: Redirects to `css.pakeaja.com` → works in production

## ⚠️ Important Security Notes

1. **NEVER expose the service role key** in client-side code
2. **Only use it in server-side middleware** where it's needed
3. **Keep it secret** - it bypasses all RLS policies

## 🚨 If It Still Doesn't Work

Check:
1. **Vercel logs** - Did the env var get picked up?
2. **Browser console** - Any new errors?
3. **Network tab** - Check the response headers for debug info

## 📞 Next Steps

Once this is working, we can:
1. Fix the login page styling
2. Build team hierarchy features
3. Complete the CRM functionality

**Start with Step 1 - Get your service role key from Supabase!**