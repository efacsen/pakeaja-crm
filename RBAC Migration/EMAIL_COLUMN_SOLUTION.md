# Solution: Email Column Not Found Error

## The Problem
The error `column "email" does not exist` occurs because:
- In Supabase, emails are stored in `auth.users` table
- The `profiles` table only stores additional user data
- Our migration was trying to update users by email in profiles table

## Understanding Supabase Structure
```
auth.users (Supabase managed)
├── id (UUID) - Primary key
├── email
├── created_at
└── other auth fields

profiles (Your custom table)
├── id (UUID) - Foreign key to auth.users.id
├── full_name
├── role
└── other custom fields
```

## Solutions

### Solution 1: Use the Fixed Migration (v2)
I've created `20250108_master_rbac_migration_v2.sql` that:
1. Adds email column to profiles (optional but useful)
2. Syncs emails from auth.users
3. Updates your user properly using joins

Run in Supabase SQL Editor:
```sql
-- Copy and paste contents of:
-- supabase/migrations/20250108_master_rbac_migration_v2.sql
```

### Solution 2: Quick Manual Update
If you just need to become admin quickly:

1. First, check your user exists:
```sql
SELECT 
    u.id,
    u.email,
    p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'akevinzakaria@cepatservicestation.com';
```

2. Update to admin:
```sql
UPDATE profiles 
SET role = 'admin'::user_role
WHERE id = (
    SELECT id FROM auth.users 
    WHERE email = 'akevinzakaria@cepatservicestation.com'
);
```

### Solution 3: Check Current State First
Run the queries in `CHECK_CURRENT_STATE.sql` to understand:
- What columns exist in profiles
- Whether your user exists
- Current role value

## Why This Happened
1. The original migration assumed email exists in profiles
2. Standard Supabase setup doesn't duplicate email in profiles
3. Need to join tables or add email column

## Best Practice Going Forward
- Always join with auth.users when you need email
- Or add email to profiles and keep it synced (v2 migration does this)
- Use the `user_profiles` view created by v2 migration

## Verification
After any solution, verify with:
```sql
SELECT 
    u.email,
    p.role::text as role
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email = 'akevinzakaria@cepatservicestation.com';
```

Should show: `role: admin`