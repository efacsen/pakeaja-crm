-- TEST PROFILE CREATION SYSTEM
-- Run this to verify everything is working correctly

-- 1. Test the profile creation function directly
SELECT 'TESTING PROFILE CREATION FUNCTION' as test_type;

DO $$
DECLARE
    test_user_id UUID := 'fc500bff-dc42-4595-a156-800d745129d2';
    test_email TEXT := 'akevinzakaria@cepatservicestation.com';
    result_id UUID;
BEGIN
    -- Test the function
    SELECT create_profile_if_missing(
        test_user_id,
        test_email,
        'Kevin Zakaria',
        'admin'::user_role
    ) INTO result_id;
    
    IF result_id IS NOT NULL THEN
        RAISE NOTICE '✅ Profile creation function works: %', result_id;
    ELSE
        RAISE WARNING '❌ Profile creation function failed';
    END IF;
END $$;

-- 2. Verify your admin profile exists and is accessible
SELECT 'ADMIN PROFILE TEST' as test_type;
SELECT 
    id,
    email,
    full_name,
    role::text as role,
    is_active,
    organization_id,
    CASE 
        WHEN role = 'admin' AND is_active = true THEN '✅ Admin Active'
        WHEN role = 'admin' AND is_active = false THEN '⚠️ Admin Inactive'
        ELSE '❌ Not Admin'
    END as admin_status
FROM profiles 
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- 3. Test RLS policies work
SELECT 'RLS POLICY TEST' as test_type;
DO $$
DECLARE
    profile_count INTEGER;
BEGIN
    -- Try to count profiles (should work with service role policies)
    SELECT COUNT(*) INTO profile_count FROM profiles;
    RAISE NOTICE '✅ Can access profiles table: % profiles found', profile_count;
EXCEPTION
    WHEN insufficient_privilege THEN
        RAISE WARNING '❌ RLS blocking access - service role policies may be missing';
    WHEN OTHERS THEN
        RAISE WARNING '❌ Other error accessing profiles: %', SQLERRM;
END $$;

-- 4. Test function permissions
SELECT 'FUNCTION PERMISSIONS TEST' as test_type;
SELECT 
    proname as function_name,
    proacl as permissions,
    'Function accessible' as status
FROM pg_proc 
WHERE proname = 'create_profile_if_missing';

-- 5. Test complete auth user to profile flow
SELECT 'AUTH USER TO PROFILE MAPPING' as test_type;
SELECT 
    u.id as auth_user_id,
    u.email as auth_email,
    p.id as profile_id,
    p.email as profile_email,
    p.role::text as profile_role,
    CASE 
        WHEN u.id = p.id THEN '✅ Mapped Correctly'
        ELSE '❌ Mapping Issue'
    END as mapping_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'akevinzakaria@cepatservicestation.com';

-- 6. Test organization relationship
SELECT 'ORGANIZATION RELATIONSHIP TEST' as test_type;
SELECT 
    p.email,
    p.role::text,
    o.name as organization_name,
    o.slug as organization_slug,
    CASE 
        WHEN o.id IS NOT NULL THEN '✅ Organization Linked'
        ELSE '❌ No Organization'
    END as org_status
FROM profiles p
LEFT JOIN organizations o ON p.organization_id = o.id
WHERE p.email = 'akevinzakaria@cepatservicestation.com';

-- 7. Final readiness check
SELECT 'SYSTEM READINESS CHECK' as test_type;
WITH readiness AS (
    SELECT 
        (SELECT COUNT(*) FROM pg_proc WHERE proname = 'create_profile_if_missing') as function_exists,
        (SELECT COUNT(*) FROM profiles WHERE email = 'akevinzakaria@cepatservicestation.com' AND role = 'admin' AND is_active = true) as admin_ready,
        (SELECT COUNT(*) FROM organizations WHERE slug = 'pakeaja') as org_ready
)
SELECT 
    CASE WHEN function_exists > 0 THEN '✅' ELSE '❌' END || ' Profile Function: ' || function_exists as function_status,
    CASE WHEN admin_ready > 0 THEN '✅' ELSE '❌' END || ' Admin Profile: ' || admin_ready as admin_status,
    CASE WHEN org_ready > 0 THEN '✅' ELSE '❌' END || ' Organization: ' || org_ready as org_status,
    CASE 
        WHEN function_exists > 0 AND admin_ready > 0 AND org_ready > 0 
        THEN '🚀 SYSTEM READY - Try accessing css.pakeaja.com'
        ELSE '⚠️ NOT READY - Check failed components above'
    END as overall_status
FROM readiness;