# 🚨 QUICK FIX: RLS Infinite Recursion Error

## The Problem
Your profiles table has RLS policies that reference themselves, creating an infinite loop. This prevents ANYONE (including service role) from accessing profiles.

## The Solution (2 minutes)

### Step 1: Run the Fix Script
1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/bemrgpgwaatizgxftzgg/sql/new)
2. Copy and paste the entire contents of `FIX_RLS_INFINITE_RECURSION.sql`
3. Click "Run" 
4. You should see:
   - "Dropped policy: [name]" messages
   - "Profile exists and is accessible ✓"
   - "RLS FIX COMPLETE!" at the end

### Step 2: Verify the Fix
1. Go to https://css.pakeaja.com/debug-auth
2. You should now see:
   - ✅ Profile access via Anon Key (your profile data)
   - ✅ Profile access via Service Role (your profile data)
   - No more "infinite recursion" errors!

### Step 3: Test Login
1. Clear your browser cache or use incognito mode
2. Go to https://css.pakeaja.com
3. Login with your credentials
4. You should reach the dashboard without any redirects!

## What This Fix Does
- Drops ALL existing policies on the profiles table (removes the recursion)
- Creates 4 simple, non-recursive policies:
  1. Users can view their own profile
  2. Users can update their own profile
  3. Service role can do anything (for middleware)
  4. Users can create their profile on signup

## If It Still Doesn't Work
Run this query to double-check:
```sql
-- Check if policies were created correctly
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'profiles';

-- Should show 4 policies with "v2" suffix
```

## Success! 🎉
Once this is done, you'll be able to:
- Access the CRM without authentication errors
- Start building the team hierarchy features
- Continue with the RBAC implementation

The entire fix takes less than 2 minutes!