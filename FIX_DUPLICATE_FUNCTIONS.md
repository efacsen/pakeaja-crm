# 🔧 Fix Duplicate Functions Issue

You're seeing duplicate functions because there are multiple versions with different parameter signatures. Here's how to fix it:

## Option 1: Force Cleanup (Recommended)

### Step 1: Check Current Functions
Run this query first to see all versions:
```sql
SELECT 
    proname as function_name,
    pg_get_function_identity_arguments(oid) as parameters
FROM pg_proc
WHERE proname IN ('get_or_create_company', 'search_companies_with_contacts')
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY proname;
```

### Step 2: Force Remove All Versions
1. Copy ALL content from: `/FORCE_CLEANUP_FUNCTIONS.sql`
2. Run it in Supabase SQL Editor
3. You should see: `Functions remaining: 0`

### Step 3: Recreate Functions
After cleanup is confirmed:
1. Copy content from: `/supabase/migrations/20250109_fix_company_functions.sql`
2. Run it in SQL Editor
3. Functions will be created fresh

## Option 2: Manual Cleanup

If Option 1 doesn't work, manually drop each version:

```sql
-- First, identify exact signatures
\df get_or_create_company
\df search_companies_with_contacts

-- Then drop each one specifically
DROP FUNCTION get_or_create_company(text);
DROP FUNCTION get_or_create_company(text, text);
DROP FUNCTION get_or_create_company(text, text, text);
-- etc for each signature shown
```

## Why This Happens
- Functions can have multiple signatures (overloading)
- Previous migrations might have created different versions
- PostgreSQL keeps all versions unless explicitly dropped

## Verification After Fix
Run this to confirm only ONE version of each function exists:
```sql
SELECT 
    routine_name,
    COUNT(*) as versions
FROM information_schema.routines 
WHERE routine_type = 'FUNCTION' 
AND routine_name IN ('get_or_create_company', 'search_companies_with_contacts')
GROUP BY routine_name;
```

Expected result:
```
routine_name              | versions
-------------------------|----------
get_or_create_company    | 1
search_companies_with_contacts | 1
```

## Test the Fix
1. Go to http://localhost:3002/dashboard/calculator
2. Try creating a new company
3. Should work without errors!

⚠️ **Important**: Always use the FORCE_CLEANUP script before running migrations to avoid conflicts.