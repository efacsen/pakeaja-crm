# RBAC Migration Guide

This folder contains all files related to the RBAC (Role-Based Access Control) implementation for PakeAja CRM.

## ⚠️ Important Update
The original migration had an issue with email columns. Use the **v2 migration** instead.

## Quick Start

### Option 1: Supabase Dashboard (Recommended)
1. Open Supabase Dashboard > SQL Editor
2. Copy contents from `supabase/migrations/20250108_master_rbac_migration_v2.sql` (use v2!)
3. Run the query
4. Verify your admin role

### If You Get Errors
See `EMAIL_COLUMN_SOLUTION.md` for detailed fixes.

### Option 2: Run Migration Script
```bash
cd "RBAC Migration"
./run-migration-complete.sh
```

## Files in This Folder

### Documentation
- `RBAC_IMPLEMENTATION_COMPLETE.md` - Final status report
- `RBAC_MIGRATION_PLAN.md` - Detailed migration strategy
- `RBAC_MIGRATION_STEPS.md` - Quick reference guide
- `RBAC_IMPLEMENTATION_PLAN.md` - Technical details
- `RBAC_TODO_FIXES.md` - Remaining TypeScript fixes

### Scripts
- `run-migration-complete.sh` - Complete migration script
- `run-rbac-migration.sh` - Original migration script
- `UPDATE_USER_TO_ADMIN.sql` - Admin user update query

## Your Supabase Connection

To run migrations via psql, you need your connection string from:
Supabase Dashboard > Settings > Database > Connection String

Format:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

## Migration Order

1. Master RBAC Migration (includes everything)
2. Verify admin role was applied
3. Test login and permissions

## Verification

After migration, verify success:
```sql
SELECT email, role FROM profiles WHERE email = 'akevinzakaria@cepatservicestation.com';
```

Should show: `role: admin`