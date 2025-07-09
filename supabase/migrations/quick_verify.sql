-- Quick Verification Queries
-- Run each section separately in Supabase SQL Editor

-- 1. Quick Table Check
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('organizations', 'profiles', 'permissions', 'teams', 'team_members', 'territories', 'user_territories', 'role_hierarchy', 'audit_logs')
ORDER BY table_name;

-- 2. Check Your Admin Status
SELECT id, email, role::text, is_active, organization_id 
FROM profiles 
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- 3. Check Team/Territory Tables Structure
SELECT 
    table_name,
    COUNT(*) as column_count
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('teams', 'team_members', 'territories', 'user_territories')
GROUP BY table_name
ORDER BY table_name;

-- 4. Check Sample Data
SELECT 'Teams:' as type, COUNT(*) as count FROM teams
UNION ALL
SELECT 'Territories:', COUNT(*) FROM territories
UNION ALL
SELECT 'Team Members:', COUNT(*) FROM team_members
UNION ALL
SELECT 'User Territories:', COUNT(*) FROM user_territories;

-- 5. Check Functions Exist
SELECT proname FROM pg_proc 
WHERE proname IN ('get_user_organization', 'check_permission', 'sync_profile_email')
ORDER BY proname;

-- 6. Check RLS is Enabled
SELECT tablename, 
       CASE WHEN rowsecurity THEN '✅ RLS Enabled' ELSE '❌ RLS Disabled' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'teams', 'team_members', 'territories', 'user_territories')
ORDER BY tablename;