-- FIX FOR RLS INFINITE RECURSION ERROR
-- This script will completely rebuild the RLS policies for the profiles table
-- Run this entire script in Supabase SQL Editor

-- =========================================
-- STEP 1: DROP ALL EXISTING POLICIES
-- =========================================
DO $$
DECLARE
    pol RECORD;
BEGIN
    -- Drop all existing policies on profiles table
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

-- Verify all policies are dropped
SELECT 'After dropping policies:' as status, COUNT(*) as policy_count 
FROM pg_policies 
WHERE tablename = 'profiles';

-- =========================================
-- STEP 2: CREATE NEW SIMPLE POLICIES
-- =========================================

-- Enable RLS on profiles table (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile v2" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update own profile v2" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Policy 3: Service role bypass (for server-side operations)
CREATE POLICY "Service role bypass v2" 
ON public.profiles 
FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

-- Policy 4: Allow profile creation for new users
CREATE POLICY "Enable profile creation v2" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- =========================================
-- STEP 3: VERIFY YOUR PROFILE ACCESS
-- =========================================

-- Test 1: Check if we can query profiles without recursion error
SELECT 'Profile access test:' as test_name;
SELECT 
    id,
    email,
    full_name,
    role,
    is_active
FROM public.profiles
WHERE email = 'akevinzakaria@cepatservicestation.com'
LIMIT 1;

-- Test 2: Verify new policies are created
SELECT 'New policies created:' as status;
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- =========================================
-- STEP 4: FINAL VERIFICATION
-- =========================================

-- Count total profiles (should work now)
SELECT 'Total profiles in system:' as check_type, COUNT(*) as count
FROM public.profiles;

-- Check your specific profile
SELECT 'Your profile status:' as check_type;
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN 'Profile exists and is accessible ✓'
        ELSE 'Profile not found ✗'
    END as status,
    COUNT(*) as profile_count
FROM public.profiles
WHERE id = 'fc500bff-dc42-4595-a156-800d745129d2'::uuid;

-- =========================================
-- SUCCESS MESSAGE
-- =========================================
SELECT 
    'RLS FIX COMPLETE!' as status,
    'You should now be able to access the application without infinite recursion errors.' as message,
    'Next step: Go to https://css.pakeaja.com/debug-auth to verify the fix worked.' as action;