-- Fixed Verification Queries for RBAC and Team/Territory Migrations
-- Run these queries in Supabase SQL Editor to verify everything is migrated

-- ============================================
-- 1. CHECK CORE TABLES EXIST
-- ============================================
SELECT '=== CHECKING CORE TABLES ===' as section;

SELECT required_tables.table_name, 
       CASE WHEN ist.table_name IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM (
    VALUES 
        ('organizations'),
        ('profiles'),
        ('permissions'),
        ('teams'),
        ('team_members'),
        ('territories'),
        ('user_territories'),
        ('role_hierarchy'),
        ('audit_logs')
) AS required_tables(table_name)
LEFT JOIN information_schema.tables ist 
    ON ist.table_name = required_tables.table_name 
    AND ist.table_schema = 'public'
ORDER BY required_tables.table_name;

-- ============================================
-- 2. CHECK YOUR ADMIN STATUS
-- ============================================
SELECT '=== CHECKING ADMIN USER ===' as section;

SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role::text as role,
    p.is_active,
    o.name as organization,
    CASE 
        WHEN p.role = 'admin' AND p.is_active = true THEN '✅ Admin Active'
        WHEN p.role = 'admin' AND p.is_active = false THEN '⚠️ Admin Inactive'
        WHEN p.role != 'admin' THEN '❌ Not Admin (role: ' || p.role::text || ')'
        ELSE '❌ Unknown Status'
    END as status
FROM profiles p
LEFT JOIN organizations o ON p.organization_id = o.id
WHERE p.email = 'akevinzakaria@cepatservicestation.com';

-- ============================================
-- 3. CHECK FUNCTIONS EXIST
-- ============================================
SELECT '=== CHECKING FUNCTIONS ===' as section;

SELECT required_functions.proname as function_name,
       CASE WHEN p.proname IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM (
    VALUES 
        ('get_user_organization'),
        ('check_permission'),
        ('sync_profile_email')
) AS required_functions(proname)
LEFT JOIN pg_proc p ON p.proname = required_functions.proname
ORDER BY required_functions.proname;

-- ============================================
-- 4. CHECK ENUM TYPES
-- ============================================
SELECT '=== CHECKING ENUM TYPES ===' as section;

SELECT typname as enum_name,
       array_agg(enumlabel ORDER BY enumsortorder) as values
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typname IN ('user_role', 'permission_action', 'resource_type')
GROUP BY typname
ORDER BY typname;

-- ============================================
-- 5. CHECK SAMPLE DATA
-- ============================================
SELECT '=== CHECKING SAMPLE DATA ===' as section;

SELECT 
    'teams' as table_name,
    COUNT(*) as record_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ ' || COUNT(*) || ' teams'
        ELSE '⚠️ No teams yet'
    END as status
FROM teams
UNION ALL
SELECT 
    'team_members' as table_name,
    COUNT(*) as record_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ ' || COUNT(*) || ' memberships'
        ELSE '⚠️ No memberships yet'
    END as status
FROM team_members
UNION ALL
SELECT 
    'territories' as table_name,
    COUNT(*) as record_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ ' || COUNT(*) || ' territories'
        ELSE '⚠️ No territories yet'
    END as status
FROM territories
UNION ALL
SELECT 
    'user_territories' as table_name,
    COUNT(*) as record_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ ' || COUNT(*) || ' assignments'
        ELSE '⚠️ No assignments yet'
    END as status
FROM user_territories;

-- ============================================
-- 6. CHECK PERMISSIONS DATA
-- ============================================
SELECT '=== CHECKING PERMISSIONS DATA ===' as section;

SELECT 
    role::text,
    COUNT(*) as permission_count,
    array_agg(DISTINCT resource::text ORDER BY resource::text) as resources
FROM permissions
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'pakeaja')
GROUP BY role
ORDER BY 
    CASE role::text
        WHEN 'admin' THEN 1
        WHEN 'manager' THEN 2
        WHEN 'sales' THEN 3
        WHEN 'estimator' THEN 4
        WHEN 'project_manager' THEN 5
        WHEN 'foreman' THEN 6
        WHEN 'inspector' THEN 7
        WHEN 'client' THEN 8
    END;

-- ============================================
-- 7. CHECK RLS STATUS
-- ============================================
SELECT '=== CHECKING RLS STATUS ===' as section;

SELECT pt.tablename,
       CASE WHEN pt.rowsecurity THEN '✅ RLS Enabled' ELSE '❌ RLS Disabled' END as rls_status,
       COUNT(pp.policyname) as policy_count
FROM pg_tables pt
LEFT JOIN pg_policies pp ON pt.tablename = pp.tablename AND pt.schemaname = pp.schemaname
WHERE pt.schemaname = 'public'
AND pt.tablename IN ('profiles', 'teams', 'team_members', 'territories', 'user_territories', 'organizations', 'permissions')
GROUP BY pt.tablename, pt.rowsecurity
ORDER BY pt.tablename;

-- ============================================
-- 8. SHOW SAMPLE TEAM AND TERRITORY DATA
-- ============================================
SELECT '=== SAMPLE TEAM DATA ===' as section;

SELECT 
    t.name as team_name,
    t.description,
    p.full_name as team_lead,
    COUNT(tm.user_id) as member_count
FROM teams t
LEFT JOIN profiles p ON t.team_lead_id = p.id
LEFT JOIN team_members tm ON t.id = tm.team_id
GROUP BY t.name, t.description, p.full_name
ORDER BY t.name;

SELECT '=== SAMPLE TERRITORY DATA ===' as section;

SELECT 
    t.name as territory_name,
    t.code,
    pt.name as parent_territory,
    COUNT(ut.user_id) as assigned_users
FROM territories t
LEFT JOIN territories pt ON t.parent_territory_id = pt.id
LEFT JOIN user_territories ut ON t.id = ut.territory_id
GROUP BY t.name, t.code, pt.name
ORDER BY t.code;

-- ============================================
-- 9. FINAL SUMMARY
-- ============================================
SELECT '=== MIGRATION SUMMARY ===' as section;

WITH checks AS (
    SELECT 
        -- Core tables
        (SELECT COUNT(*) FROM information_schema.tables 
         WHERE table_schema = 'public' 
         AND table_name IN ('organizations', 'profiles', 'permissions', 'teams', 'team_members', 'territories', 'user_territories')) as tables_count,
        
        -- Enum types
        (SELECT COUNT(*) FROM pg_type 
         WHERE typname IN ('user_role', 'permission_action', 'resource_type')) as enum_count,
        
        -- Functions
        (SELECT COUNT(*) FROM pg_proc 
         WHERE proname IN ('get_user_organization', 'check_permission')) as function_count,
        
        -- Admin user
        (SELECT COUNT(*) FROM profiles 
         WHERE email = 'akevinzakaria@cepatservicestation.com' 
         AND role = 'admin' AND is_active = true) as admin_count,
        
        -- Permissions
        (SELECT COUNT(*) FROM permissions) as permission_count,
        
        -- Teams and territories
        (SELECT COUNT(*) FROM teams) as team_count,
        (SELECT COUNT(*) FROM territories) as territory_count
)
SELECT 
    CASE 
        WHEN tables_count >= 7 THEN '✅' ELSE '❌' 
    END || ' Tables: ' || tables_count || '/7' as tables_status,
    
    CASE 
        WHEN enum_count >= 3 THEN '✅' ELSE '❌' 
    END || ' Enums: ' || enum_count || '/3' as enum_status,
    
    CASE 
        WHEN function_count >= 2 THEN '✅' ELSE '❌' 
    END || ' Functions: ' || function_count || '/2' as function_status,
    
    CASE 
        WHEN admin_count >= 1 THEN '✅' ELSE '❌' 
    END || ' Admin User: ' || 
    CASE WHEN admin_count >= 1 THEN 'Active' ELSE 'Not Found/Inactive' END as admin_status,
    
    CASE 
        WHEN permission_count > 0 THEN '✅' ELSE '❌' 
    END || ' Permissions: ' || permission_count || ' records' as permission_status,
    
    CASE 
        WHEN team_count > 0 AND territory_count > 0 THEN '✅' 
        WHEN team_count > 0 OR territory_count > 0 THEN '⚠️'
        ELSE '❌' 
    END || ' Teams: ' || team_count || ', Territories: ' || territory_count as team_territory_status
FROM checks;