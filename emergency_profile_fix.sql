-- EMERGENCY PROFILE FIX - Simplified, Conflict-Free Migration
-- Run this AFTER the database check to fix profile creation

-- 1. Ensure organizations table and default org exist
DO $$
DECLARE
    default_org_id UUID;
BEGIN
    -- Check if default organization exists
    SELECT id INTO default_org_id FROM organizations WHERE slug = 'pakeaja' LIMIT 1;
    
    IF default_org_id IS NULL THEN
        INSERT INTO organizations (name, slug, settings)
        VALUES ('PakeAja', 'pakeaja', '{}')
        RETURNING id INTO default_org_id;
        RAISE NOTICE '✅ Created default organization: %', default_org_id;
    ELSE
        RAISE NOTICE '✅ Default organization exists: %', default_org_id;
    END IF;
END $$;

-- 2. Create SIMPLE profile creation function (no complex error handling)
CREATE OR REPLACE FUNCTION create_profile_if_missing(
    user_id UUID,
    user_email TEXT DEFAULT NULL,
    user_name TEXT DEFAULT NULL,
    user_role user_role DEFAULT 'sales'::user_role
)
RETURNS UUID AS $$
DECLARE
    profile_id UUID;
    default_org_id UUID;
BEGIN
    -- Check if profile already exists
    SELECT id INTO profile_id FROM profiles WHERE id = user_id;
    
    IF profile_id IS NOT NULL THEN
        RAISE NOTICE 'Profile already exists for user: %', user_email;
        RETURN profile_id;
    END IF;
    
    -- Get default organization
    SELECT id INTO default_org_id FROM organizations WHERE slug = 'pakeaja' LIMIT 1;
    
    -- Get email from auth.users if not provided
    IF user_email IS NULL THEN
        SELECT email INTO user_email FROM auth.users WHERE id = user_id;
    END IF;
    
    -- Simple profile creation (no complex CASE statements)
    INSERT INTO profiles (
        id,
        email,
        full_name,
        role,
        organization_id,
        is_active,
        department,
        position,
        joined_at,
        created_at,
        updated_at
    ) VALUES (
        user_id,
        user_email,
        COALESCE(user_name, user_email),
        user_role,
        default_org_id,
        true,
        'General',
        'User',
        CURRENT_DATE,
        NOW(),
        NOW()
    )
    RETURNING id INTO profile_id;
    
    RAISE NOTICE '✅ Created profile for user: %', user_email;
    RETURN profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION create_profile_if_missing(UUID, TEXT, TEXT, user_role) TO authenticated;
GRANT EXECUTE ON FUNCTION create_profile_if_missing(UUID, TEXT, TEXT, user_role) TO service_role;

-- 3. Add minimal service role policies (avoid policy conflicts)
DO $$
BEGIN
    -- Drop any conflicting policies first
    DROP POLICY IF EXISTS "Service role can read all profiles" ON profiles;
    DROP POLICY IF EXISTS "Service role can create profiles" ON profiles;
    DROP POLICY IF EXISTS "Service role can update profiles" ON profiles;
    
    -- Create new service role policies
    CREATE POLICY "service_read_profiles" ON profiles
    FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');
    
    CREATE POLICY "service_create_profiles" ON profiles  
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
    
    CREATE POLICY "service_update_profiles" ON profiles
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'service_role');
    
    RAISE NOTICE '✅ Service role policies created';
END $$;

-- 4. Test the function with a dummy call
DO $$
DECLARE
    test_result UUID;
BEGIN
    -- Test function exists and works
    SELECT create_profile_if_missing(
        '00000000-0000-0000-0000-000000000000'::UUID,
        'test@example.com',
        'Test User',
        'sales'::user_role
    ) INTO test_result;
    
    -- Clean up test
    DELETE FROM profiles WHERE id = '00000000-0000-0000-0000-000000000000'::UUID;
    
    RAISE NOTICE '✅ Profile creation function test passed';
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING '❌ Profile creation function test failed: %', SQLERRM;
END $$;

-- 5. Verification
SELECT 'EMERGENCY FIX APPLIED' as status;
SELECT 
    'create_profile_if_missing function ready' as function_status,
    'Service role policies active' as policy_status,
    'Ready for manual profile creation' as next_step;