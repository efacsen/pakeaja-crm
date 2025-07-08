# RLS Infinite Recursion Fix Guide

## The Problem
You're getting "infinite recursion detected in policy for relation profiles" because one of the RLS policies references the profiles table within itself, creating a circular dependency.

## Quick Fix Steps

### Option 1: Run the Quick Fix (Recommended)
1. Go to Supabase Dashboard → SQL Editor
2. Copy ALL contents from: `RBAC Migration/FIX_RLS_RECURSION.sql`
3. Paste and run in SQL Editor
4. You should see your profile with role = 'admin' at the end

### Option 2: Manual Fix via Dashboard
1. Go to Supabase Dashboard → Authentication → Policies
2. Find the profiles table
3. Delete the policy named "Users can view profiles in same organization"
4. Create a new policy:
   - Name: "Users can view own profile"
   - Operation: SELECT
   - Expression: `auth.uid() = id`

### Option 3: Emergency Disable RLS
If you're completely locked out:
```sql
-- Disable RLS temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Fix your profile
UPDATE profiles 
SET role = 'admin'::user_role, is_active = true
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

## After Running the Fix

1. Visit https://css.pakeaja.com/api/profile-check
   - You should see `"profileFound": true` and `"role": "admin"`
   
2. Visit https://css.pakeaja.com
   - You should be redirected to the dashboard, not unauthorized

3. If still having issues:
   - Clear your browser cookies for the site
   - Log out and log back in

## What This Fix Does

1. **Removes the recursive policy** that was causing the infinite loop
2. **Creates simpler policies** that don't reference themselves
3. **Ensures your profile exists** with admin role
4. **Adds service role bypass** for system operations

## Prevention

The new policies follow these rules:
- Users can only see/edit their own profile
- No policy references the profiles table within itself
- Service role can bypass all restrictions

## Still Having Issues?

Check the debug info:
1. Browser DevTools → Network tab → Look for response headers starting with `X-Debug-`
2. Visit `/api/profile-check` for detailed profile status
3. Check Supabase logs for any SQL errors