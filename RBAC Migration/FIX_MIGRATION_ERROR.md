# Fix for RBAC Migration Error

## Error Encountered
```
ERROR: 42601: syntax error at or near "NOT"
LINE 20: CREATE TYPE IF NOT EXISTS permission_action AS ENUM (
```

## Cause
PostgreSQL doesn't support `CREATE TYPE IF NOT EXISTS` syntax. This is a limitation of PostgreSQL's DDL commands.

## Solution
I've created a fixed version of the migration that properly checks for type existence using DO blocks.

## Fixed Migration File
`supabase/migrations/20250108_master_rbac_migration_fixed.sql`

## What Changed
Instead of:
```sql
CREATE TYPE IF NOT EXISTS permission_action AS ENUM (...);
```

Now using:
```sql
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'permission_action') THEN
        CREATE TYPE permission_action AS ENUM (...);
    END IF;
END $$;
```

## How to Apply the Fixed Migration

### Option 1: Supabase Dashboard
1. Go to SQL Editor
2. Copy ALL contents from: `supabase/migrations/20250108_master_rbac_migration_fixed.sql`
3. Paste and run

### Option 2: Direct SQL
If you already have some types created, first clean up:
```sql
-- Clean up any partial migration
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS permission_action CASCADE;
DROP TYPE IF EXISTS resource_type CASCADE;
```

Then run the fixed migration.

## Verification
After running, you should see:
- "SUCCESS: RBAC migration completed!"
- Your user info with role: admin

Check with:
```sql
SELECT email, role FROM profiles WHERE email = 'akevinzakaria@cepatservicestation.com';
```