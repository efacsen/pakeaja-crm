-- PRECISE CLEANUP: First identify all function signatures, then drop them specifically

-- Step 1: List all existing function signatures
SELECT 
    'DROP FUNCTION IF EXISTS ' || n.nspname || '.' || p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ') CASCADE;' as drop_command
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE p.proname IN ('get_or_create_company', 'search_companies_with_contacts')
AND n.nspname = 'public';

-- Copy the output from above and run each DROP command manually
-- For example, you might see:
-- DROP FUNCTION IF EXISTS public.get_or_create_company(text) CASCADE;
-- DROP FUNCTION IF EXISTS public.get_or_create_company(text, text, text) CASCADE;
-- etc.

-- Alternative: Use this dynamic SQL to drop all versions automatically
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

-- Step 2: Verify all functions are removed
SELECT 
    COUNT(*) as remaining_functions,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ All functions removed! Ready to create new ones.'
        ELSE '❌ Functions still exist. Check the list below.'
    END as status
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE p.proname IN ('get_or_create_company', 'search_companies_with_contacts')
AND n.nspname = 'public';

-- If any remain, list them:
SELECT 
    n.nspname || '.' || p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')' as remaining_function
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE p.proname IN ('get_or_create_company', 'search_companies_with_contacts')
AND n.nspname = 'public';