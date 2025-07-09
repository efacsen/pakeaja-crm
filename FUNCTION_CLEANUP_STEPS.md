# 🧹 Function Cleanup - Step by Step

## The Problem
PostgreSQL can't drop functions without knowing the exact signature when multiple versions exist.

## Solution Steps

### Step 1: Identify All Function Versions
Run this query first:
```sql
SELECT 
    'DROP FUNCTION IF EXISTS ' || n.nspname || '.' || p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ') CASCADE;' as drop_command
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE p.proname IN ('get_or_create_company', 'search_companies_with_contacts')
AND n.nspname = 'public';
```

### Step 2: Copy and Run Each DROP Command
The query above will output something like:
```sql
DROP FUNCTION IF EXISTS public.get_or_create_company(text) CASCADE;
DROP FUNCTION IF EXISTS public.get_or_create_company(text, text, text) CASCADE;
DROP FUNCTION IF EXISTS public.search_companies_with_contacts(text) CASCADE;
DROP FUNCTION IF EXISTS public.search_companies_with_contacts(text, integer) CASCADE;
```

Copy each line and run them one by one.

### Step 3: Or Use the Automatic Cleanup
If you prefer, run this single command that will drop all versions automatically:
```sql
DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT 
            n.nspname,
            p.proname,
            pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE p.proname IN ('get_or_create_company', 'search_companies_with_contacts')
        AND n.nspname = 'public'
    LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS %I.%I(%s) CASCADE', 
                      func_record.nspname, 
                      func_record.proname, 
                      func_record.args);
        RAISE NOTICE 'Dropped function: %.%(%)', func_record.nspname, func_record.proname, func_record.args;
    END LOOP;
END $$;
```

### Step 4: Verify Cleanup
Run this to confirm all functions are gone:
```sql
SELECT COUNT(*) as remaining_functions
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE p.proname IN ('get_or_create_company', 'search_companies_with_contacts')
AND n.nspname = 'public';
```

Should return: `0`

### Step 5: Create New Functions
Now run the migration from `/supabase/migrations/20250109_fix_company_functions.sql`

### Step 6: Final Verification
```sql
SELECT routine_name, COUNT(*) as versions
FROM information_schema.routines 
WHERE routine_type = 'FUNCTION' 
AND routine_name IN ('get_or_create_company', 'search_companies_with_contacts')
GROUP BY routine_name;
```

Should show 1 version of each function.

## Quick Option: Nuclear Reset
If all else fails, this will force-drop by OID:
```sql
SELECT 'DROP FUNCTION ' || oid || ' CASCADE;' 
FROM pg_proc 
WHERE proname IN ('get_or_create_company', 'search_companies_with_contacts');
```
Run each output line to drop by internal ID.