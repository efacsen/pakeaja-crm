# RBAC Migration SQL Commands

If you prefer to run the migration manually via psql or Supabase Dashboard, here are the exact commands in order:

## 1. Connect to Your Database

### Via psql:
```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### Via Supabase Dashboard:
Go to SQL Editor in your Supabase Dashboard

## 2. Run Migration Commands

### Step 1: Check Current State (Optional)
```sql
-- Check if you already have a user
SELECT id, email, role FROM profiles WHERE email = 'akevinzakaria@cepatservicestation.com';

-- Check existing roles in system
SELECT DISTINCT role FROM profiles;
```

### Step 2: Run Master Migration
Copy and run the entire contents of:
`../supabase/migrations/20250108_master_rbac_migration.sql`

Or if you're in psql:
```sql
\i ../supabase/migrations/20250108_master_rbac_migration.sql
```

### Step 3: Verify Admin Role
```sql
-- Check your role
SELECT 
    email, 
    role::text as role, 
    department, 
    position,
    organization_id
FROM profiles 
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- Should show:
-- email: akevinzakaria@cepatservicestation.com
-- role: admin
-- department: Management
-- position: System Administrator
```

### Step 4: Verify Permissions
```sql
-- Count admin permissions
SELECT COUNT(*) as total_permissions 
FROM permissions 
WHERE role = 'admin';

-- Should show 66 permissions (11 resources × 6 actions)
```

## 3. If Migration Fails

### Common Fix: Drop Existing Types
```sql
-- Drop conflicting types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS permission_action CASCADE;
DROP TYPE IF EXISTS resource_type CASCADE;

-- Then re-run the migration
```

### Alternative: Manual Admin Update
If the migration runs but doesn't update your role:
```sql
-- Ensure organization exists
INSERT INTO organizations (name, slug) 
VALUES ('PakeAja', 'pakeaja')
ON CONFLICT (slug) DO NOTHING;

-- Update your role directly
UPDATE profiles 
SET 
    role = 'admin'::user_role,
    department = 'Management',
    position = 'System Administrator',
    organization_id = (SELECT id FROM organizations WHERE slug = 'pakeaja' LIMIT 1),
    updated_at = NOW()
WHERE email = 'akevinzakaria@cepatservicestation.com';
```

## 4. Quick Verification Tests

```sql
-- Test 1: Your role
SELECT role FROM profiles WHERE email = 'akevinzakaria@cepatservicestation.com';
-- Expected: admin

-- Test 2: Organization link
SELECT o.name as org_name, p.role 
FROM profiles p 
JOIN organizations o ON p.organization_id = o.id 
WHERE p.email = 'akevinzakaria@cepatservicestation.com';
-- Expected: org_name: PakeAja, role: admin

-- Test 3: Permission check function
SELECT check_permission(
    (SELECT id FROM profiles WHERE email = 'akevinzakaria@cepatservicestation.com'),
    'users'::resource_type,
    'update'::permission_action
);
-- Expected: true
```

## 5. Exit psql
```sql
\q
```

## Important Notes

1. The migration automatically updates your user to admin
2. All existing users' roles are converted to the new system
3. The migration is idempotent (safe to run multiple times)
4. Your email must exist in the profiles table first

## Success Indicators

✅ No errors during migration
✅ Your role shows as 'admin'
✅ You have an organization_id
✅ Permission count is correct
✅ Check_permission function returns true