-- Verification Queries for RBAC and Team/Territory Migrations
-- Run these queries in Supabase SQL Editor to verify everything is migrated

-- ============================================
-- 1. CHECK CORE TABLES EXIST
-- ============================================
SELECT '=== CHECKING CORE TABLES ===' as section;

SELECT table_name, 
       CASE WHEN table_name IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
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
-- 2. CHECK ENUM TYPES
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
-- 3. CHECK PROFILES TABLE STRUCTURE
-- ============================================
SELECT '=== CHECKING PROFILES TABLE COLUMNS ===' as section;

SELECT column_name, data_type, is_nullable,
       CASE 
           WHEN column_name IN ('id', 'role', 'organization_id', 'email', 'is_active', 'reports_to') 
           THEN '✅ Required' 
           ELSE '📋 Optional' 
       END as importance
FROM information_schema.columns
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY 
    CASE 
        WHEN column_name = 'id' THEN 1
        WHEN column_name = 'email' THEN 2
        WHEN column_name = 'role' THEN 3
        WHEN column_name = 'organization_id' THEN 4
        ELSE 5
    END,
    column_name;

-- ============================================
-- 4. CHECK FUNCTIONS
-- ============================================
SELECT '=== CHECKING FUNCTIONS ===' as section;

SELECT proname as function_name,
       CASE WHEN proname IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM (
    VALUES 
        ('get_user_organization'),
        ('check_permission'),
        ('sync_profile_email')
) AS required_functions(proname)
LEFT JOIN pg_proc p ON p.proname = required_functions.proname
ORDER BY required_functions.proname;

-- ============================================
-- 5. CHECK RLS POLICIES
-- ============================================
SELECT '=== CHECKING RLS POLICIES ===' as section;

SELECT 
    schemaname,
    tablename,
    COUNT(*) as policy_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ ' || COUNT(*) || ' policies'
        ELSE '❌ No policies'
    END as status
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'teams', 'team_members', 'territories', 'user_territories', 'organizations', 'permissions')
GROUP BY schemaname, tablename
ORDER BY tablename;

-- ============================================
-- 6. CHECK ADMIN USER
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
WHERE p.email = 'akevinzakaria@cepatservicestation.com'
    OR p.id IN (
        SELECT id FROM auth.users WHERE email = 'akevinzakaria@cepatservicestation.com'
    );

-- ============================================
-- 7. CHECK PERMISSIONS DATA
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
-- 8. CHECK TEAM AND TERRITORY DATA
-- ============================================
SELECT '=== CHECKING TEAM DATA ===' as section;

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
-- 9. CHECK VIEWS
-- ============================================
SELECT '=== CHECKING VIEWS ===' as section;

SELECT table_name as view_name,
       CASE WHEN table_name IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name IN ('team_hierarchy', 'user_team_memberships', 'user_territory_assignments', 'user_profiles')
ORDER BY table_name;

-- ============================================
-- 10. CHECK INDEXES
-- ============================================
SELECT '=== CHECKING INDEXES ===' as section;

SELECT 
    tablename,
    COUNT(*) as index_count,
    string_agg(indexname, ', ') as indexes
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'teams', 'team_members', 'territories', 'user_territories')
GROUP BY tablename
ORDER BY tablename;

-- ============================================
-- 11. SAMPLE DATA CHECK
-- ============================================
SELECT '=== CHECKING SAMPLE DATA ===' as section;

-- Check for sample team
SELECT 
    t.name as team_name,
    t.description,
    p.full_name as team_lead,
    COUNT(tm.user_id) as member_count
FROM teams t
LEFT JOIN profiles p ON t.team_lead_id = p.id
LEFT JOIN team_members tm ON t.id = tm.team_id
WHERE t.name LIKE '%Jakarta%'
GROUP BY t.name, t.description, p.full_name;

-- Check for sample territories
SELECT 
    t.name as territory_name,
    t.code,
    pt.name as parent_territory,
    COUNT(ut.user_id) as assigned_users
FROM territories t
LEFT JOIN territories pt ON t.parent_territory_id = pt.id
LEFT JOIN user_territories ut ON t.id = ut.territory_id
WHERE t.code IN ('JKT', 'BDG')
GROUP BY t.name, t.code, pt.name
ORDER BY t.code;

-- ============================================
-- 12. FINAL SUMMARY
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

-- ============================================
-- If everything is ✅, your migration is complete!
-- If any ❌ appear, run the corresponding migration
-- ============================================