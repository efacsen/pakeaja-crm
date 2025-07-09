# 🔍 Vercel & OAuth Configuration Checklist

## Please gather the following information:

### 1️⃣ Vercel Environment Variables
Go to: https://vercel.com/efacsen/pakeaja-crm/settings/environment-variables

**Take a screenshot showing:**
- [ ] All environment variable NAMES (not values)
- [ ] Check if `SUPABASE_SERVICE_ROLE_KEY` exists
- [ ] Check if all variables are enabled for Production/Preview/Development

**Expected variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **CRITICAL - Often missing!**
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

### 2️⃣ Supabase Authentication Settings
Go to: https://supabase.com/dashboard/project/bemrgpgwaatizgxftzgg/auth/url-configuration

**Screenshot these sections:**
- [ ] **Site URL** - Should be `https://css.pakeaja.com` NOT localhost
- [ ] **Redirect URLs** - Should include:
  - `https://css.pakeaja.com/auth/callback`
  - `https://css.pakeaja.com/**`
  - `https://css.pakeaja.com`

### 3️⃣ Google OAuth Configuration
Go to: https://console.cloud.google.com/apis/credentials

**Check your OAuth 2.0 Client:**
- [ ] **Authorized JavaScript origins** includes:
  - `https://css.pakeaja.com`
  - `https://bemrgpgwaatizgxftzgg.supabase.co`
- [ ] **Authorized redirect URIs** includes:
  - `https://bemrgpgwaatizgxftzgg.supabase.co/auth/v1/callback`

### 4️⃣ Supabase API Keys
Go to: https://supabase.com/dashboard/project/bemrgpgwaatizgxftzgg/settings/api

**Identify these keys (don't share the actual values):**
- [ ] **anon key** - starts with `eyJ...` (public, used in frontend)
- [ ] **service_role key** - starts with `eyJ...` (secret, used in backend)

⚠️ **Common mistake**: Using anon key instead of service_role key in Vercel

### 5️⃣ Browser Information
**When you try to login:**
- [ ] Open DevTools (F12) → Network tab
- [ ] Try to login
- [ ] Look for any failed requests (red)
- [ ] Check Console for errors
- [ ] Note the exact redirect URL when you get the error

### 6️⃣ Vercel Function Logs
Go to: https://vercel.com/efacsen/pakeaja-crm/functions

**After a failed login attempt:**
- [ ] Click on recent function executions
- [ ] Look for errors mentioning:
  - "Profile not found"
  - "Service role key"
  - "RLS" or "Row Level Security"
  - Environment variable errors

## 🎯 Quick Diagnosis Questions:

1. **In Vercel env vars, do you see `SUPABASE_SERVICE_ROLE_KEY`?**
   - ✅ Yes → Check if it's the correct key (not anon key)
   - ❌ No → This is likely the main issue

2. **In Supabase Site URL, what's the value?**
   - ✅ `https://css.pakeaja.com` → Good
   - ❌ `http://localhost:3000` → Needs update

3. **When you login with Google, where does it redirect?**
   - To localhost → OAuth misconfiguration
   - To css.pakeaja.com/unauthorized → Profile/middleware issue

4. **In browser console, any errors about:**
   - Missing stylesheets → CSS loading issue
   - 404 errors → Routing issue
   - Unauthorized → Auth/profile issue

## 📋 Information to Share:

Please provide:
1. Screenshots of the above configurations
2. Results from running `COMPLETE_DIAGNOSTICS.sql`
3. Any error messages from browser console
4. Recent Vercel function logs

With this information, we can pinpoint the exact issue!