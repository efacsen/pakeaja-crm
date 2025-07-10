-- Emergency Database State Check
-- Run this FIRST to understand current state

-- 1. Check if organizations table and data exist
SELECT 'ORGANIZATIONS CHECK' as check_type;
SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'organizations') 
    THEN '✅ organizations table exists' 
    ELSE '❌ organizations table missing' 
    END as table_status;

SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM organizations WHERE slug = 'pakeaja') 
    THEN '✅ PakeAja organization exists' 
    ELSE '❌ PakeAja organization missing' 
    END as org_status;

-- 2. Check profiles table structure and constraints
SELECT 'PROFILES TABLE CHECK' as check_type;
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. Check for problematic constraints
SELECT 'CONSTRAINT CHECK' as check_type;
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'profiles';

-- 4. Check if user_role enum exists
SELECT 'ENUM CHECK' as check_type;
SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') 
    THEN '✅ user_role enum exists' 
    ELSE '❌ user_role enum missing' 
    END as enum_status;

-- 5. Check existing functions
SELECT 'FUNCTION CHECK' as check_type;
SELECT 
    proname as function_name,
    CASE WHEN proname = 'handle_new_user' THEN '✅ Auto-creation function exists'
         WHEN proname = 'create_profile_if_missing' THEN '✅ Manual creation function exists'
         ELSE '📝 Other function'
    END as status
FROM pg_proc 
WHERE proname IN ('handle_new_user', 'create_profile_if_missing', 'get_user_organization', 'check_permission');

-- 6. Check existing triggers
SELECT 'TRIGGER CHECK' as check_type;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name LIKE '%user%' OR trigger_name LIKE '%profile%';

-- 7. Check your specific user in auth.users
SELECT 'USER CHECK' as check_type;
SELECT 
    id,
    email,
    created_at,
    'Found in auth.users' as status
FROM auth.users 
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- 8. Check your profile in profiles table
SELECT 'PROFILE CHECK' as check_type;
SELECT 
    id,
    email,
    full_name,
    role::text,
    is_active,
    organization_id,
    'Found in profiles' as status
FROM profiles 
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- 9. Check total profiles count
SELECT 'PROFILE COUNT' as check_type;
SELECT 
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_profiles,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_profiles
FROM profiles;

-- 10. Final summary
SELECT 'SUMMARY' as check_type;
SELECT 
    'Database diagnosis complete' as message,
    'Check results above for missing components' as next_step;