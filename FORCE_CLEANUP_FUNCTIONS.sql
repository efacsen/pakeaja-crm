-- FORCE CLEANUP: Remove ALL versions of the functions
-- Run this BEFORE running the fix migration if you still see duplicates

-- Step 1: Drop all versions using CASCADE to handle dependencies
DROP FUNCTION IF EXISTS public.get_or_create_company CASCADE;
DROP FUNCTION IF EXISTS public.search_companies_with_contacts CASCADE;

-- Step 2: Double-check by dropping specific signatures we know might exist
DO $$ 
BEGIN
    -- Try to drop all possible signatures of get_or_create_company
    EXECUTE 'DROP FUNCTION IF EXISTS get_or_create_company(TEXT) CASCADE';
    EXECUTE 'DROP FUNCTION IF EXISTS get_or_create_company(TEXT, TEXT) CASCADE';
    EXECUTE 'DROP FUNCTION IF EXISTS get_or_create_company(TEXT, TEXT, TEXT) CASCADE';
    
    -- Try to drop all possible signatures of search_companies_with_contacts
    EXECUTE 'DROP FUNCTION IF EXISTS search_companies_with_contacts(TEXT) CASCADE';
    EXECUTE 'DROP FUNCTION IF EXISTS search_companies_with_contacts(TEXT, INTEGER) CASCADE';
    EXECUTE 'DROP FUNCTION IF EXISTS search_companies_with_contacts(TEXT, INT) CASCADE';
EXCEPTION
    WHEN OTHERS THEN
        -- Ignore errors if functions don't exist
        NULL;
END $$;

-- Step 3: Verify all functions are gone
SELECT 
    'Functions remaining: ' || COUNT(*)::text as status,
    string_agg(routine_name || '(' || pg_get_function_identity_arguments(p.oid) || ')', ', ') as remaining_functions
FROM information_schema.routines r
JOIN pg_proc p ON p.proname = r.routine_name
WHERE routine_schema = 'public'
AND routine_name IN ('get_or_create_company', 'search_companies_with_contacts');

-- If the count is 0, you're ready to run the fix migration!