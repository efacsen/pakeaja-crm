-- Comprehensive RLS Fix Verification
-- Run this in Supabase SQL Editor after applying the RLS fix

-- 1. Check current policies (should show 5 new policies)
SELECT '=== CURRENT RLS POLICIES ===' as section;
SELECT 
    policyname,
    cmd,
    CASE 
        WHEN policyname LIKE '%own%' THEN '✅ User Own Access'
        WHEN policyname LIKE '%service%' THEN '✅ Service Bypass'
        WHEN policyname LIKE '%admin%' THEN '✅ Admin Access'
        ELSE '⚠️ Unknown Policy'
    END as policy_type
FROM pg_policies 
WHERE tablename = 'profiles' 
ORDER BY policyname;

-- 2. Test profile access (should return your admin profile)
SELECT '=== PROFILE ACCESS TEST ===' as section;
SELECT 
    id,
    email,
    full_name,
    role::text,
    is_active,
    organization_id,
    CASE 
        WHEN role = 'admin' AND is_active = true THEN '✅ Admin Active'
        WHEN role = 'admin' AND is_active = false THEN '⚠️ Admin Inactive'
        ELSE '❌ Not Admin'
    END as admin_status
FROM profiles 
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- 3. Test RLS is working (count profiles - should work without recursion)
SELECT '=== RLS FUNCTIONALITY TEST ===' as section;
SELECT 
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_count,
    'RLS working without recursion' as status
FROM profiles;

-- 4. Check if you can see other profiles (admin should see all)
SELECT '=== ADMIN ACCESS TEST ===' as section;
SELECT 
    email,
    role::text,
    is_active,
    'Visible to admin' as access_test
FROM profiles 
WHERE organization_id = (
    SELECT organization_id 
    FROM profiles 
    WHERE email = 'akevinzakaria@cepatservicestation.com'
)
ORDER BY email
LIMIT 5;

-- 5. Final status check
SELECT '=== FINAL STATUS ===' as section;
WITH checks AS (
    SELECT 
        (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'profiles') as policy_count,
        (SELECT COUNT(*) FROM profiles WHERE email = 'akevinzakaria@cepatservicestation.com' AND role = 'admin' AND is_active = true) as admin_ready,
        (SELECT COUNT(*) FROM profiles) as can_access_profiles
)
SELECT 
    CASE 
        WHEN policy_count = 5 THEN '✅ RLS Policies: ' || policy_count || '/5'
        ELSE '❌ RLS Policies: ' || policy_count || '/5 (Expected 5)'
    END as policies_status,
    
    CASE 
        WHEN admin_ready = 1 THEN '✅ Admin User: Ready'
        ELSE '❌ Admin User: Not Found/Inactive'
    END as admin_status,
    
    CASE 
        WHEN can_access_profiles > 0 THEN '✅ Profile Access: Working'
        ELSE '❌ Profile Access: Blocked'
    END as access_status,
    
    'Ready to test css.pakeaja.com' as next_step
FROM checks;