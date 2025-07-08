-- QUICK FIX FOR RLS INFINITE RECURSION
-- Run this in Supabase SQL Editor to fix the "infinite recursion" error

-- Step 1: Temporarily disable RLS to fix the issue
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Ensure your profile exists
INSERT INTO profiles (
  id, 
  email, 
  full_name, 
  role, 
  organization_id, 
  is_active,
  joined_at
)
SELECT 
  'fc500bff-dc42-4595-a156-800d745129d2',
  'akevinzakaria@cepatservicestation.com',
  'Kevin Zakaria',
  'admin'::user_role,
  (SELECT id FROM organizations WHERE slug = 'pakeaja' LIMIT 1),
  true,
  CURRENT_DATE
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE id = 'fc500bff-dc42-4595-a156-800d745129d2'
);

-- Update if exists
UPDATE profiles 
SET 
  role = 'admin'::user_role,
  is_active = true,
  email = 'akevinzakaria@cepatservicestation.com'
WHERE id = 'fc500bff-dc42-4595-a156-800d745129d2';

-- Step 3: Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles in same organization" ON profiles;
DROP POLICY IF EXISTS "Service role bypass" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Step 4: Create new, non-recursive policies
-- Allow users to see their own profile
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile (during signup)
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow service role full access
CREATE POLICY "Service role full access" ON profiles
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Step 5: Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 6: Verify
SELECT 
  id,
  email,
  full_name,
  role::text as role,
  is_active,
  organization_id
FROM profiles
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- You should see your profile with role = 'admin' and is_active = true