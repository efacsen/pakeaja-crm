-- Check all versions of the functions with their parameters
SELECT 
    routine_name,
    routine_type,
    data_type,
    pg_get_function_identity_arguments(p.oid) as parameters
FROM information_schema.routines r
JOIN pg_proc p ON p.proname = r.routine_name
WHERE routine_schema = 'public'
AND routine_name IN ('get_or_create_company', 'search_companies_with_contacts')
ORDER BY routine_name, parameters;

-- Alternative query if the above doesn't work
SELECT 
    proname as function_name,
    pg_get_function_identity_arguments(oid) as parameters,
    prosrc as source_preview
FROM pg_proc
WHERE proname IN ('get_or_create_company', 'search_companies_with_contacts')
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY proname, oid;