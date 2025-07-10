# Migration Verification Guide

Use these SQL queries to verify that all RBAC and team/territory migrations have been properly applied.

## Option 1: Complete Verification (Detailed)

Run this in Supabase SQL Editor:
```sql
-- File: supabase/migrations/verify_migrations.sql
```

This comprehensive script checks:
- ✅ All required tables exist
- ✅ Enum types are created
- ✅ Your admin user is properly configured
- ✅ Functions exist (get_user_organization, check_permission)
- ✅ RLS policies are in place
- ✅ Sample data was created
- ✅ Views are working

## Option 2: Quick Verification (Simple)

Run these queries one by one in Supabase SQL Editor:

### 1. Check Core Tables
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('organizations', 'profiles', 'permissions', 'teams', 'team_members', 'territories', 'user_territories', 'role_hierarchy', 'audit_logs')
ORDER BY table_name;
```
**Expected:** 9 rows (all table names)

### 2. Check Your Admin Status
```sql
SELECT id, email, role::text, is_active, organization_id 
FROM profiles 
WHERE email = 'akevinzakaria@cepatservicestation.com';
```
**Expected:** 1 row with `role = 'admin'` and `is_active = true`

### 3. Check Team/Territory Tables
```sql
SELECT 
    table_name,
    COUNT(*) as column_count
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('teams', 'team_members', 'territories', 'user_territories')
GROUP BY table_name
ORDER BY table_name;
```
**Expected:** 4 rows with reasonable column counts

### 4. Check Sample Data
```sql
SELECT 'Teams:' as type, COUNT(*) as count FROM teams
UNION ALL
SELECT 'Territories:', COUNT(*) FROM territories
UNION ALL
SELECT 'Team Members:', COUNT(*) FROM team_members
UNION ALL
SELECT 'User Territories:', COUNT(*) FROM user_territories;
```
**Expected:** At least 1 team, 2 territories, 1 team member, 1 user territory

### 5. Check Functions
```sql
SELECT proname FROM pg_proc 
WHERE proname IN ('get_user_organization', 'check_permission', 'sync_profile_email')
ORDER BY proname;
```
**Expected:** 3 function names

### 6. Check RLS (Security)
```sql
SELECT tablename, 
       CASE WHEN rowsecurity THEN '✅ RLS Enabled' ELSE '❌ RLS Disabled' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'teams', 'team_members', 'territories', 'user_territories')
ORDER BY tablename;
```
**Expected:** All tables show "✅ RLS Enabled"

## What Each Result Should Show

### ✅ Successful Migration:
- All 9 core tables exist
- Your user has `role = 'admin'` and `is_active = true`
- Sample data exists (1+ teams, 2+ territories)
- All functions are created
- RLS is enabled on all tables

### ❌ Missing Steps:
If any of these fail, you need to:
1. **Missing tables** → Run the team/territory migration
2. **Not admin** → Run the RBAC migration v2
3. **No sample data** → Run the team/territory migration again
4. **Missing functions** → Run the function fix script
5. **RLS disabled** → Run the RLS policies

## Test Your Access

After verification, test the system by:

1. **Visit the profile check endpoint:**
   ```
   https://css.pakeaja.com/api/profile-check
   ```
   Should show your admin role and organization

2. **Test admin pages:**
   - `/dashboard/users` (should work)
   - `/dashboard/profile` (should show admin role)

3. **Check navigation:**
   - All menu items should be visible
   - No "unauthorized" redirects

## If Something Is Missing

1. **Run the missing migration** from the RBAC Migration folder
2. **Check Supabase logs** for error messages
3. **Regenerate types** after fixing: 
   ```bash
   npx supabase gen types typescript --project-id bemrgpgwaatizgxftzgg > src/types/database.types.ts
   ```