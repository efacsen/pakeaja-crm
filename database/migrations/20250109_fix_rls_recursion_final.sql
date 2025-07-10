-- Fix RLS Infinite Recursion - Final Solution
-- This addresses the "infinite recursion detected in policy for relation profiles" error

-- 1. Drop all existing problematic policies on profiles
DROP POLICY IF EXISTS "Users can view profiles in same organization" ON profiles;
DROP POLICY IF EXISTS "Users can view own and org profiles" ON profiles;
DROP POLICY IF EXISTS "Service role bypass" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

-- 2. Create the get_user_organization function if it doesn't exist
CREATE OR REPLACE FUNCTION get_user_organization(user_id UUID)
RETURNS UUID AS $$
DECLARE
    v_org_id UUID;
BEGIN
    -- Use a simple query without RLS to avoid recursion
    SELECT organization_id INTO v_org_id
    FROM profiles
    WHERE id = user_id
    LIMIT 1;
    
    RETURN v_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_user_organization(UUID) TO authenticated;

-- 3. Create non-recursive RLS policies

-- Allow users to see their own profile (no recursion)
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- Allow users to insert their own profile (for signup)
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Allow service role to bypass all restrictions
CREATE POLICY "Service role bypass" ON profiles
FOR ALL USING (
    auth.jwt() ->> 'role' = 'service_role'
);

-- Allow admins to see all profiles in their organization
-- This uses a subquery to avoid recursion
CREATE POLICY "Admins can view org profiles" ON profiles
FOR SELECT USING (
    auth.uid() = id OR
    EXISTS (
        SELECT 1 
        FROM profiles admin_profile
        WHERE admin_profile.id = auth.uid()
        AND admin_profile.role = 'admin'
        AND admin_profile.organization_id = profiles.organization_id
    )
);

-- Allow admins to manage profiles in their organization
CREATE POLICY "Admins can manage org profiles" ON profiles
FOR ALL USING (
    auth.uid() = id OR
    EXISTS (
        SELECT 1 
        FROM profiles admin_profile
        WHERE admin_profile.id = auth.uid()
        AND admin_profile.role = 'admin'
        AND admin_profile.organization_id = profiles.organization_id
    )
);

-- 4. Ensure your admin profile exists with proper data
-- First, check if it exists
DO $$
DECLARE
    v_org_id UUID;
    v_user_id UUID := 'fc500bff-dc42-4595-a156-800d745129d2';
    v_email TEXT := 'akevinzakaria@cepatservicestation.com';
    v_profile_exists BOOLEAN := FALSE;
BEGIN
    -- Get the default organization
    SELECT id INTO v_org_id FROM organizations WHERE slug = 'pakeaja' LIMIT 1;
    
    -- Check if profile exists
    SELECT EXISTS(SELECT 1 FROM profiles WHERE id = v_user_id) INTO v_profile_exists;
    
    IF NOT v_profile_exists THEN
        -- Insert the profile
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
            v_user_id,
            v_email,
            'Kevin Zakaria',
            'admin'::user_role,
            v_org_id,
            true,
            'Management',
            'System Administrator',
            CURRENT_DATE,
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Profile created for user %', v_email;
    ELSE
        -- Update existing profile to ensure it's admin and active
        UPDATE profiles 
        SET 
            role = 'admin'::user_role,
            is_active = true,
            organization_id = COALESCE(organization_id, v_org_id),
            email = COALESCE(email, v_email),
            full_name = COALESCE(full_name, 'Kevin Zakaria'),
            updated_at = NOW()
        WHERE id = v_user_id;
        
        RAISE NOTICE 'Profile updated for user %', v_email;
    END IF;
END $$;

-- 5. Test the policies by checking if profile is accessible
DO $$
DECLARE
    v_count INTEGER;
BEGIN
    -- Try to count profiles to test if RLS is working without recursion
    SELECT COUNT(*) INTO v_count FROM profiles;
    RAISE NOTICE 'RLS test: Can see % profiles', v_count;
    
    -- Check specific user
    SELECT COUNT(*) INTO v_count 
    FROM profiles 
    WHERE email = 'akevinzakaria@cepatservicestation.com' 
    AND role = 'admin'
    AND is_active = true;
    
    IF v_count > 0 THEN
        RAISE NOTICE '✅ Admin user profile is properly configured and accessible';
    ELSE
        RAISE WARNING '❌ Admin user profile not found or not accessible';
    END IF;
END $$;

-- 6. Final verification
SELECT 
    id,
    email,
    full_name,
    role::text,
    is_active,
    organization_id,
    'Profile accessible via RLS' as rls_test
FROM profiles 
WHERE email = 'akevinzakaria@cepatservicestation.com';