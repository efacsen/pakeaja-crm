-- Individual Check Queries
-- Run each one separately to see specific results

-- 1. Check all tables exist (should return 9 rows)
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('organizations', 'profiles', 'permissions', 'teams', 'team_members', 'territories', 'user_territories', 'role_hierarchy', 'audit_logs')
ORDER BY table_name;

-- 2. Check your admin status (should show role = admin, is_active = true)
SELECT id, email, role::text, is_active, organization_id 
FROM profiles 
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- 3. Check functions exist (should return 3 functions)
SELECT proname FROM pg_proc 
WHERE proname IN ('get_user_organization', 'check_permission', 'sync_profile_email')
ORDER BY proname;

-- 4. Check sample data counts
SELECT 'Teams' as type, COUNT(*) as count FROM teams
UNION ALL
SELECT 'Territories', COUNT(*) FROM territories
UNION ALL
SELECT 'Team Members', COUNT(*) FROM team_members
UNION ALL
SELECT 'User Territories', COUNT(*) FROM user_territories
UNION ALL
SELECT 'Permissions', COUNT(*) FROM permissions;

-- 5. Check enum types
SELECT typname, array_agg(enumlabel ORDER BY enumsortorder) as values
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typname IN ('user_role', 'permission_action', 'resource_type')
GROUP BY typname;

-- 6. Show actual team data
SELECT name, description, team_lead_id FROM teams;

-- 7. Show actual territory data  
SELECT name, code, parent_territory_id FROM territories ORDER BY code;

-- 8. Show your permissions count by role
SELECT role::text, COUNT(*) as permission_count
FROM permissions
GROUP BY role
ORDER BY role;