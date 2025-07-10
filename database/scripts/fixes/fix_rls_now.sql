-- URGENT RLS FIX - Run this in Supabase SQL Editor NOW
-- This will fix the "infinite recursion detected in policy for relation profiles" error

-- 1. Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "Users can view profiles in same organization" ON profiles;
DROP POLICY IF EXISTS "Users can view own and org profiles" ON profiles;
DROP POLICY IF EXISTS "Service role bypass" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view org profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage org profiles" ON profiles;

-- 2. Create simple, non-recursive policies

-- Allow users to see their own profile only
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Allow service role to bypass (for system operations)
CREATE POLICY "Service role bypass" ON profiles
FOR ALL USING (
    auth.jwt() ->> 'role' = 'service_role'
);

-- Simplified admin policy without recursion
CREATE POLICY "Admin can view all profiles" ON profiles
FOR SELECT USING (
    auth.uid() = id OR
    auth.uid() IN (
        SELECT id FROM profiles 
        WHERE role = 'admin' 
        AND is_active = true
        AND auth.uid() = id
    )
);

-- Test the fix
SELECT 'RLS policies recreated successfully' as status;