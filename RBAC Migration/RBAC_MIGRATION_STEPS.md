# RBAC Migration Steps - Quick Reference

## Prerequisites
- Access to Supabase Dashboard
- Database connection string (from Supabase Settings > Database)

## Option 1: Via Supabase Dashboard (Recommended)

### Step 1: Run Master Migration
1. Go to Supabase Dashboard > SQL Editor
2. Copy contents of `supabase/migrations/20250108_master_rbac_migration.sql`
3. Paste and run the query
4. Check for success message

### Step 2: Verify Your Admin Access
1. Still in SQL Editor, run:
```sql
SELECT id, email, full_name, role, department, position 
FROM profiles 
WHERE email = 'akevinzakaria@cepatservicestation.com';
```
2. Should show role as 'admin'

## Option 2: Via psql Command Line

### Step 1: Get Connection String
1. Go to Supabase Dashboard > Settings > Database
2. Copy the connection string (starts with `postgresql://`)

### Step 2: Connect and Run Migration
```bash
# Connect to database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run master migration
\i supabase/migrations/20250108_master_rbac_migration.sql

# Verify your admin role
\i UPDATE_USER_TO_ADMIN.sql

# Exit
\q
```

## Option 3: Via Supabase CLI (If Available)

```bash
# Push all migrations
npx supabase db push

# Then update your user via dashboard or psql
```

## Post-Migration Checklist

### 1. Test Login
- [ ] Log out and log back in
- [ ] Check if you see "Administrator" role on profile
- [ ] Verify access to User Management page

### 2. Verify Navigation
- [ ] All menu items should be visible for admin
- [ ] User Management should appear under Administration

### 3. Test Permissions
- [ ] Can access /dashboard/users
- [ ] Can change other users' roles
- [ ] Profile page shows admin role

## Troubleshooting

### If Migration Fails
1. Check for error messages in SQL output
2. Most common issue: type conflicts
3. Solution: Run this first:
```sql
DROP TYPE IF EXISTS user_role CASCADE;
```

### If Still Shows Old Role
1. Clear browser cache and cookies
2. Sign out and sign in again
3. Check if migration completed successfully

### If Navigation Not Updated
1. Hard refresh page (Ctrl+Shift+R or Cmd+Shift+R)
2. Check browser console for errors
3. Verify auth context is loading new role

## Emergency Rollback
If something goes wrong:
```sql
-- Set your role directly
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    raw_user_meta_data, 
    '{role}', 
    '"admin"'
)
WHERE email = 'akevinzakaria@cepatservicestation.com';
```

## Success Indicators
- ✅ SQL shows: "RBAC migration completed successfully!"
- ✅ Your profile shows role: 'admin'
- ✅ Navigation shows Administration section
- ✅ Can access User Management page
- ✅ Can edit other users' roles

## Next Steps After Migration
1. Test all role-based features
2. Create test users with different roles
3. Verify permission boundaries work
4. Update any remaining components with old role references

## Quick SQL Commands

### Check Your Current Role
```sql
SELECT email, role FROM profiles WHERE email = 'akevinzakaria@cepatservicestation.com';
```

### List All Roles in System
```sql
SELECT DISTINCT role FROM profiles ORDER BY role;
```

### Count Permissions by Role
```sql
SELECT role, COUNT(*) as permissions 
FROM permissions 
GROUP BY role 
ORDER BY permissions DESC;
```

### View Your Organization
```sql
SELECT o.name, o.slug, p.role 
FROM profiles p 
JOIN organizations o ON p.organization_id = o.id 
WHERE p.email = 'akevinzakaria@cepatservicestation.com';
```