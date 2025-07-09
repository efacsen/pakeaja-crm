-- FIX DATABASE CONSTRAINT ISSUE
-- This fixes the "duplicate key value violates unique constraint profiles_new_pkey" error

-- 1. Check for any tables with "profiles" in the name
SELECT 'CHECKING FOR PROFILE TABLES' as check_type;
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%profile%'
ORDER BY table_name;

-- 2. Check for constraints with "profiles_new" in the name
SELECT 'CHECKING FOR PROBLEMATIC CONSTRAINTS' as check_type;
SELECT 
    constraint_name,
    table_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE constraint_name LIKE '%profiles_new%'
   OR table_name LIKE '%profiles_new%';

-- 3. Check all constraints on the profiles table
SELECT 'CHECKING PROFILES TABLE CONSTRAINTS' as check_type;
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'profiles'
ORDER BY constraint_name;

-- 4. Drop any conflicting constraints or tables
DO $$
BEGIN
    -- Drop profiles_new table if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles_new') THEN
        DROP TABLE IF EXISTS profiles_new CASCADE;
        RAISE NOTICE 'Dropped profiles_new table';
    END IF;
    
    -- Drop any constraints with profiles_new in the name
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'profiles_new_pkey') THEN
        -- Find which table has this constraint
        DECLARE
            v_table_name TEXT;
        BEGIN
            SELECT table_name INTO v_table_name
            FROM information_schema.table_constraints 
            WHERE constraint_name = 'profiles_new_pkey'
            LIMIT 1;
            
            IF v_table_name IS NOT NULL THEN
                EXECUTE format('ALTER TABLE %I DROP CONSTRAINT IF EXISTS profiles_new_pkey', v_table_name);
                RAISE NOTICE 'Dropped profiles_new_pkey constraint from table %', v_table_name;
            END IF;
        END;
    END IF;
END $$;

-- 5. Ensure profiles table has correct primary key
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_new_pkey CASCADE;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_pkey CASCADE;
ALTER TABLE profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

-- 6. Verify fix
SELECT 'VERIFICATION' as check_type;
SELECT 
    'Profiles table constraints after fix:' as status,
    string_agg(constraint_name || ' (' || constraint_type || ')', ', ') as constraints
FROM information_schema.table_constraints 
WHERE table_name = 'profiles'
GROUP BY table_name;

-- 7. Test profile access
SELECT 'PROFILE ACCESS TEST' as check_type;
SELECT 
    COUNT(*) as profile_count,
    COUNT(CASE WHEN email = 'akevinzakaria@cepatservicestation.com' THEN 1 END) as admin_profile_exists
FROM profiles;

-- 8. Final status
SELECT 'FIX COMPLETE' as status, 'Constraint issue should be resolved' as message;