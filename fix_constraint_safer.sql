-- SAFER FIX FOR DATABASE CONSTRAINT ISSUE
-- This handles the constraint dependencies properly

-- 1. First, let's see what we're dealing with
SELECT 'CURRENT CONSTRAINT STATUS' as check_type;
SELECT 
    c.constraint_name,
    c.constraint_type,
    c.table_name
FROM information_schema.table_constraints c
WHERE c.table_name = 'profiles'
   OR c.constraint_name LIKE '%profiles%'
ORDER BY c.table_name, c.constraint_name;

-- 2. Check which constraint is actually the primary key
SELECT 'PRIMARY KEY CHECK' as check_type;
SELECT 
    constraint_name,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'profiles' 
  AND constraint_type = 'PRIMARY KEY';

-- 3. Rename the constraint if needed (safer than dropping)
DO $$
DECLARE
    current_pk_name TEXT;
BEGIN
    -- Get the current primary key constraint name
    SELECT constraint_name INTO current_pk_name
    FROM information_schema.table_constraints 
    WHERE table_name = 'profiles' 
      AND constraint_type = 'PRIMARY KEY'
    LIMIT 1;
    
    -- If it's profiles_new_pkey, rename it to profiles_pkey
    IF current_pk_name = 'profiles_new_pkey' THEN
        EXECUTE 'ALTER TABLE profiles RENAME CONSTRAINT profiles_new_pkey TO profiles_pkey';
        RAISE NOTICE 'Renamed profiles_new_pkey to profiles_pkey';
    ELSIF current_pk_name IS NULL THEN
        -- No primary key exists, create one
        EXECUTE 'ALTER TABLE profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id)';
        RAISE NOTICE 'Created profiles_pkey constraint';
    ELSE
        RAISE NOTICE 'Primary key constraint is already named: %', current_pk_name;
    END IF;
END $$;

-- 4. Create a safer profile creation function that handles duplicates
CREATE OR REPLACE FUNCTION safe_create_profile(
    p_id UUID,
    p_email TEXT,
    p_full_name TEXT,
    p_role user_role,
    p_organization_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    profile_exists BOOLEAN;
BEGIN
    -- Check if profile already exists
    SELECT EXISTS(SELECT 1 FROM profiles WHERE id = p_id) INTO profile_exists;
    
    IF profile_exists THEN
        -- Update existing profile
        UPDATE profiles 
        SET 
            email = COALESCE(p_email, email),
            full_name = COALESCE(p_full_name, full_name),
            role = COALESCE(p_role, role),
            organization_id = COALESCE(p_organization_id, organization_id),
            updated_at = NOW()
        WHERE id = p_id;
        
        RETURN FALSE; -- Profile existed, was updated
    ELSE
        -- Create new profile
        INSERT INTO profiles (
            id, email, full_name, role, organization_id, 
            is_active, created_at, updated_at
        ) VALUES (
            p_id, p_email, p_full_name, p_role, p_organization_id,
            true, NOW(), NOW()
        );
        
        RETURN TRUE; -- New profile created
    END IF;
EXCEPTION
    WHEN unique_violation THEN
        -- Handle any unique constraint violations gracefully
        UPDATE profiles 
        SET 
            email = COALESCE(p_email, email),
            updated_at = NOW()
        WHERE id = p_id;
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Test with your admin profile
DO $$
DECLARE
    was_created BOOLEAN;
    org_id UUID;
BEGIN
    -- Get organization ID
    SELECT id INTO org_id FROM organizations WHERE slug = 'pakeaja' LIMIT 1;
    
    -- Try to create/update admin profile
    SELECT safe_create_profile(
        'fc500bff-dc42-4595-a156-800d745129d2'::UUID,
        'akevinzakaria@cepatservicestation.com',
        'Kevin Zakaria',
        'admin'::user_role,
        org_id
    ) INTO was_created;
    
    IF was_created THEN
        RAISE NOTICE 'Admin profile created successfully';
    ELSE
        RAISE NOTICE 'Admin profile already existed, updated if needed';
    END IF;
END $$;

-- 6. Verify the fix
SELECT 'VERIFICATION' as check_type;
SELECT 
    'Primary key name' as item,
    constraint_name as value
FROM information_schema.table_constraints 
WHERE table_name = 'profiles' 
  AND constraint_type = 'PRIMARY KEY'

UNION ALL

SELECT 
    'Admin profile exists' as item,
    CASE WHEN COUNT(*) > 0 THEN 'Yes' ELSE 'No' END as value
FROM profiles 
WHERE email = 'akevinzakaria@cepatservicestation.com'

UNION ALL

SELECT 
    'Total profiles' as item,
    COUNT(*)::text as value
FROM profiles;

-- 7. Final message
SELECT 'CONSTRAINT FIX COMPLETE' as status, 
       'The constraint has been renamed/fixed and duplicate key errors should be resolved' as message;