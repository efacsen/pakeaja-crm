-- Run this directly in Supabase SQL Editor to fix profile creation
-- This is the same content as 20250109_fix_profile_creation_complete.sql

-- 1. Create handle_new_user function for automatic profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_org_id UUID;
BEGIN
    -- Get the default organization (PakeAja)
    SELECT id INTO default_org_id 
    FROM organizations 
    WHERE slug = 'pakeaja' 
    LIMIT 1;
    
    -- Create the organization if it doesn't exist
    IF default_org_id IS NULL THEN
        INSERT INTO organizations (name, slug, settings)
        VALUES ('PakeAja', 'pakeaja', '{}')
        RETURNING id INTO default_org_id;
    END IF;
    
    -- Insert new profile for the user
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
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        'sales'::user_role,  -- Default role for new users
        default_org_id,
        true,
        'Sales',
        'Sales Representative',
        CURRENT_DATE,
        NOW(),
        NOW()
    );
    
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Profile already exists, just update email if needed
        UPDATE profiles 
        SET 
            email = NEW.email,
            updated_at = NOW()
        WHERE id = NEW.id;
        RETURN NEW;
    WHEN OTHERS THEN
        -- Log the error but don't fail the auth process
        RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create trigger on auth.users for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- 3. Add enhanced RLS policies for server-side access

-- Allow service role to read all profiles (for middleware)
CREATE POLICY "Service role can read all profiles" ON profiles
FOR SELECT USING (
    auth.jwt() ->> 'role' = 'service_role'
);

-- Allow service role to create profiles (for new user flow)
CREATE POLICY "Service role can create profiles" ON profiles
FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role'
);

-- Allow service role to update profiles (for maintenance)
CREATE POLICY "Service role can update profiles" ON profiles
FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'service_role'
);

-- 4. Create function for manual profile creation (with better error handling)
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
        RETURN profile_id;
    END IF;
    
    -- Get default organization
    SELECT id INTO default_org_id 
    FROM organizations 
    WHERE slug = 'pakeaja' 
    LIMIT 1;
    
    -- Create organization if needed
    IF default_org_id IS NULL THEN
        INSERT INTO organizations (name, slug, settings)
        VALUES ('PakeAja', 'pakeaja', '{}')
        RETURNING id INTO default_org_id;
    END IF;
    
    -- Get email from auth.users if not provided
    IF user_email IS NULL THEN
        SELECT email INTO user_email 
        FROM auth.users 
        WHERE id = user_id;
    END IF;
    
    -- Create profile
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
        CASE user_role
            WHEN 'admin' THEN 'Management'
            WHEN 'manager' THEN 'Management'
            WHEN 'sales' THEN 'Sales'
            WHEN 'estimator' THEN 'Engineering'
            WHEN 'project_manager' THEN 'Projects'
            WHEN 'foreman' THEN 'Field Operations'
            WHEN 'inspector' THEN 'Quality Control'
            ELSE 'General'
        END,
        CASE user_role
            WHEN 'admin' THEN 'System Administrator'
            WHEN 'manager' THEN 'Manager'
            WHEN 'sales' THEN 'Sales Representative'
            WHEN 'estimator' THEN 'Estimator'
            WHEN 'project_manager' THEN 'Project Manager'
            WHEN 'foreman' THEN 'Foreman'
            WHEN 'inspector' THEN 'Inspector'
            ELSE 'User'
        END,
        CURRENT_DATE,
        NOW(),
        NOW()
    )
    RETURNING id INTO profile_id;
    
    RETURN profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_profile_if_missing(UUID, TEXT, TEXT, user_role) TO authenticated;
GRANT EXECUTE ON FUNCTION create_profile_if_missing(UUID, TEXT, TEXT, user_role) TO service_role;

-- 5. Create your admin profile (manual creation for existing user)
DO $$
DECLARE
    admin_user_id UUID := 'fc500bff-dc42-4595-a156-800d745129d2';
    admin_email TEXT := 'akevinzakaria@cepatservicestation.com';
    profile_result UUID;
BEGIN
    -- Create admin profile using the function
    SELECT create_profile_if_missing(
        admin_user_id,
        admin_email,
        'Kevin Zakaria',
        'admin'::user_role
    ) INTO profile_result;
    
    -- Update to ensure admin privileges
    UPDATE profiles 
    SET 
        role = 'admin'::user_role,
        is_active = true,
        department = 'Management',
        position = 'System Administrator',
        full_name = 'Kevin Zakaria',
        email = admin_email,
        updated_at = NOW()
    WHERE id = admin_user_id;
    
    RAISE NOTICE 'Admin profile created/updated for user: %', admin_email;
END $$;

-- 6. Create profiles for any existing auth.users that don't have profiles
DO $$
DECLARE
    user_record RECORD;
    profile_result UUID;
BEGIN
    FOR user_record IN 
        SELECT u.id, u.email, u.raw_user_meta_data
        FROM auth.users u
        LEFT JOIN profiles p ON u.id = p.id
        WHERE p.id IS NULL
    LOOP
        SELECT create_profile_if_missing(
            user_record.id,
            user_record.email,
            COALESCE(user_record.raw_user_meta_data->>'full_name', user_record.email),
            'sales'::user_role
        ) INTO profile_result;
        
        RAISE NOTICE 'Created profile for existing user: %', user_record.email;
    END LOOP;
END $$;

-- 7. Test the profile creation and access
DO $$
DECLARE
    profile_count INTEGER;
    admin_count INTEGER;
BEGIN
    -- Count total profiles
    SELECT COUNT(*) INTO profile_count FROM profiles;
    
    -- Count admin profiles
    SELECT COUNT(*) INTO admin_count 
    FROM profiles 
    WHERE role = 'admin' AND is_active = true;
    
    RAISE NOTICE 'Profile creation complete - Total profiles: %, Active admins: %', 
                 profile_count, admin_count;
    
    -- Test profile access
    IF EXISTS (
        SELECT 1 FROM profiles 
        WHERE email = 'akevinzakaria@cepatservicestation.com' 
        AND role = 'admin' 
        AND is_active = true
    ) THEN
        RAISE NOTICE '✅ Admin profile is accessible and properly configured';
    ELSE
        RAISE WARNING '❌ Admin profile access test failed';
    END IF;
END $$;

-- 8. Final verification query
SELECT 
    'Profile creation migration completed' as status,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_profiles,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_profiles
FROM profiles;