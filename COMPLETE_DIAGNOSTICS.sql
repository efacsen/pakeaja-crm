-- COMPREHENSIVE SYSTEM DIAGNOSTICS FOR AUTH ISSUE
-- Run this entire script in Supabase SQL Editor
-- Copy ALL results and share them

-- =========================================
-- 1. DATABASE STRUCTURE CHECK
-- =========================================
SELECT '=== 1. DATABASE STRUCTURE ===' as section;

-- Check profiles table structure
SELECT 
    'Profiles Table Columns' as check_type,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Check constraints on profiles
SELECT 
    'Profiles Constraints' as check_type,
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'profiles';

-- Check if there are duplicate profile tables
SELECT 
    'Profile Tables Count' as check_type,
    schemaname,
    tablename
FROM pg_tables
WHERE tablename LIKE '%profile%';

-- =========================================
-- 2. YOUR SPECIFIC USER CHECK
-- =========================================
SELECT '=== 2. YOUR USER STATUS ===' as section;

-- Check auth.users entry
SELECT 
    'Auth User' as check_type,
    id,
    email,
    created_at,
    last_sign_in_at,
    raw_user_meta_data
FROM auth.users
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- Check profiles entry
SELECT 
    'Profile Record' as check_type,
    id,
    email,
    full_name,
    role,
    organization_id,
    is_active,
    created_at,
    updated_at
FROM profiles
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- Check if IDs match
SELECT 
    'ID Match Check' as check_type,
    CASE 
        WHEN a.id = p.id THEN 'IDs MATCH ✓'
        WHEN p.id IS NULL THEN 'NO PROFILE EXISTS ✗'
        ELSE 'ID MISMATCH ✗'
    END as status,
    a.id as auth_id,
    p.id as profile_id
FROM auth.users a
LEFT JOIN profiles p ON p.email = a.email
WHERE a.email = 'akevinzakaria@cepatservicestation.com';

-- =========================================
-- 3. RLS POLICIES CHECK
-- =========================================
SELECT '=== 3. RLS POLICIES ===' as section;

-- Check current RLS policies on profiles
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Check if RLS is enabled
SELECT 
    'RLS Status' as check_type,
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';

-- =========================================
-- 4. TRIGGER AND FUNCTION CHECK
-- =========================================
SELECT '=== 4. TRIGGERS & FUNCTIONS ===' as section;

-- Check triggers on auth.users
SELECT 
    'Auth Triggers' as check_type,
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
AND event_object_table = 'users';

-- Check if handle_new_user function exists
SELECT 
    'Functions' as check_type,
    routine_name
FROM information_schema.routines
WHERE routine_name IN ('handle_new_user', 'create_profile_if_missing', 'safe_create_profile')
AND routine_schema = 'public';

-- =========================================
-- 5. ORGANIZATION CHECK
-- =========================================
SELECT '=== 5. ORGANIZATION STATUS ===' as section;

-- Check organizations
SELECT 
    'Organizations' as check_type,
    id,
    name,
    slug
FROM organizations
WHERE slug = 'pakeaja';

-- =========================================
-- 6. OAUTH CONFIGURATION CHECK
-- =========================================
SELECT '=== 6. OAUTH CONFIG HINTS ===' as section;

-- This will help identify redirect issues
SELECT 
    'Current Site URL' as info_type,
    'Check Supabase Dashboard > Settings > Authentication > Site URL' as instruction,
    'Should be: https://css.pakeaja.com' as expected_value,
    'NOT: http://localhost:3000' as not_this;

-- =========================================
-- 7. DUPLICATE PROFILES CHECK
-- =========================================
SELECT '=== 7. DUPLICATE PROFILES ===' as section;

-- Check for duplicate profiles
SELECT 
    email,
    COUNT(*) as profile_count,
    array_agg(id) as profile_ids
FROM profiles
WHERE email = 'akevinzakaria@cepatservicestation.com'
GROUP BY email
HAVING COUNT(*) > 1;

-- =========================================
-- 8. PROFILE CREATION ATTEMPTS LOG
-- =========================================
SELECT '=== 8. RECENT PROFILE OPERATIONS ===' as section;

-- Check recent profile inserts/updates
SELECT 
    'Recent Profile Activity' as check_type,
    id,
    email,
    created_at,
    updated_at,
    CASE 
        WHEN created_at = updated_at THEN 'New Profile'
        ELSE 'Updated Profile'
    END as operation_type
FROM profiles
WHERE email LIKE '%cepatservicestation.com%'
ORDER BY updated_at DESC
LIMIT 5;

-- =========================================
-- 9. MANUAL PROFILE CREATION TEST
-- =========================================
SELECT '=== 9. MANUAL PROFILE TEST ===' as section;

-- Try to create profile manually (will show error if exists)
DO $$
DECLARE
    user_id UUID;
    org_id UUID;
    result TEXT;
BEGIN
    -- Get user ID
    SELECT id INTO user_id 
    FROM auth.users 
    WHERE email = 'akevinzakaria@cepatservicestation.com' 
    LIMIT 1;
    
    -- Get org ID
    SELECT id INTO org_id 
    FROM organizations 
    WHERE slug = 'pakeaja' 
    LIMIT 1;
    
    IF user_id IS NULL THEN
        RAISE NOTICE 'User not found in auth.users';
    ELSIF org_id IS NULL THEN
        RAISE NOTICE 'Organization pakeaja not found';
    ELSE
        -- Try to insert
        BEGIN
            INSERT INTO profiles (id, email, full_name, role, organization_id, is_active)
            VALUES (user_id, 'akevinzakaria@cepatservicestation.com', 'Kevin Zakaria', 'admin', org_id, true);
            RAISE NOTICE 'Profile created successfully!';
        EXCEPTION 
            WHEN unique_violation THEN
                RAISE NOTICE 'Profile already exists (unique violation)';
            WHEN foreign_key_violation THEN
                RAISE NOTICE 'Foreign key violation - check user_id and org_id';
            WHEN OTHERS THEN
                RAISE NOTICE 'Error: %', SQLERRM;
        END;
    END IF;
END $$;

-- =========================================
-- 10. FINAL SUMMARY
-- =========================================
SELECT '=== 10. DIAGNOSTIC SUMMARY ===' as section;

SELECT 
    'Summary' as check_type,
    COUNT(DISTINCT a.id) as auth_users_count,
    COUNT(DISTINCT p.id) as profile_count,
    COUNT(DISTINCT CASE WHEN a.id = p.id THEN a.id END) as matched_count
FROM auth.users a
FULL OUTER JOIN profiles p ON a.id = p.id
WHERE a.email = 'akevinzakaria@cepatservicestation.com'
   OR p.email = 'akevinzakaria@cepatservicestation.com';