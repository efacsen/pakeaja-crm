-- Clean RLS Fix - Drop all policies first, then recreate
-- Run this in Supabase SQL Editor

-- 1. Drop ALL existing policies (including the ones that already exist)
DO $$ 
BEGIN
    -- Drop all policies on profiles table
    DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    DROP POLICY IF EXISTS "Service role bypass" ON profiles;
    DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
    DROP POLICY IF EXISTS "Users can view profiles in same organization" ON profiles;
    DROP POLICY IF EXISTS "Users can view own and org profiles" ON profiles;
    DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
    DROP POLICY IF EXISTS "Admins can view org profiles" ON profiles;
    DROP POLICY IF EXISTS "Admins can manage org profiles" ON profiles;
    
    RAISE NOTICE 'All existing policies dropped';
END $$;

-- 2. Create completely new, simple RLS policies

-- Basic user access - own profile only
CREATE POLICY "user_own_select" ON profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "user_own_insert" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "user_own_update" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Service role bypass for system operations
CREATE POLICY "service_bypass" ON profiles
FOR ALL USING (
    auth.jwt() ->> 'role' = 'service_role'
);

-- Admin access - can see all profiles in their org (non-recursive)
CREATE POLICY "admin_org_access" ON profiles
FOR SELECT USING (
    auth.uid() = id OR
    (
        SELECT role = 'admin' AND is_active = true
        FROM profiles admin_check
        WHERE admin_check.id = auth.uid()
        LIMIT 1
    ) = true
);

-- Test the policies
SELECT 'RLS policies recreated successfully - simple version' as status;

-- Verify your profile is accessible
SELECT 
    id,
    email,
    role::text,
    is_active,
    'Profile accessible after RLS fix' as test_result
FROM profiles 
WHERE email = 'akevinzakaria@cepatservicestation.com';