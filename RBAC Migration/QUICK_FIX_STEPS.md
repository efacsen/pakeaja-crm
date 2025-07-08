# Quick Fix Steps - RBAC Migration

## Your Current Situation
You got an error: `column "email" does not exist` because Supabase stores emails in `auth.users`, not `profiles`.

## Immediate Solution

### Step 1: Check if your user exists
Run this in Supabase SQL Editor:
```sql
SELECT 
    u.id,
    u.email,
    p.role,
    p.full_name
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'akevinzakaria@cepatservicestation.com';
```

### Step 2: Clean up failed migration (if needed)
```sql
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS permission_action CASCADE;
DROP TYPE IF EXISTS resource_type CASCADE;
```

### Step 3: Run the v2 migration
Copy ALL contents from: `supabase/migrations/20250108_master_rbac_migration_v2.sql`
Paste and run in SQL Editor.

### Step 4: Verify success
```sql
SELECT 
    u.email,
    p.role::text as role
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email = 'akevinzakaria@cepatservicestation.com';
```

Should show: `role: admin`

## Alternative: Quick Admin Update Only
If the full migration is too complex, just make yourself admin:

```sql
-- This single query will make you admin
UPDATE profiles 
SET role = 'admin'
WHERE id = (
    SELECT id FROM auth.users 
    WHERE email = 'akevinzakaria@cepatservicestation.com'
);
```

Note: This won't create the full RBAC structure, just updates your role.

## What the v2 Migration Fixes
1. ✅ Properly handles Supabase auth.users structure
2. ✅ Adds email column to profiles for convenience
3. ✅ Uses proper joins to find users
4. ✅ Creates sync trigger to keep emails updated
5. ✅ All other RBAC features from original migration

## After Success
1. Log out of your app
2. Log back in
3. You should see admin features

## Still Having Issues?
1. Check `CHECK_CURRENT_STATE.sql` to debug
2. Use `MANUAL_ADMIN_UPDATE.sql` for step-by-step manual update
3. The issue is likely that your user hasn't been created in profiles yet - make sure you've logged in at least once