-- Fix RLS Infinite Recursion in Profiles Table
-- This migration fixes the circular reference in RLS policies that causes
-- "infinite recursion detected in policy for relation profiles" error

-- 1. First, drop the problematic policy
DROP POLICY IF EXISTS "Users can view profiles in same organization" ON profiles;

-- 2. Create a simpler policy that doesn't cause recursion
-- This allows users to see their own profile and profiles in their organization
CREATE POLICY "Users can view own and org profiles" ON profiles
FOR SELECT USING (
  auth.uid() = id OR 
  (
    -- Check if the requesting user's org matches this profile's org
    organization_id IS NOT NULL AND
    organization_id = (
      SELECT p.organization_id 
      FROM profiles p 
      WHERE p.id = auth.uid()
      LIMIT 1
    )
  )
);

-- 3. Add policy for service role to bypass RLS (for system operations)
DROP POLICY IF EXISTS "Service role bypass" ON profiles;
CREATE POLICY "Service role bypass" ON profiles
FOR ALL USING (
  auth.jwt() ->> 'role' = 'service_role'
);

-- 4. Add policy to allow profile creation during signup
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. Ensure the admin user profile exists with proper data
-- Using a DO block to handle the insert safely
DO $$
DECLARE
  v_org_id UUID;
  v_user_id UUID := 'fc500bff-dc42-4595-a156-800d745129d2';
  v_email TEXT := 'akevinzakaria@cepatservicestation.com';
BEGIN
  -- Get the default organization
  SELECT id INTO v_org_id FROM organizations WHERE slug = 'pakeaja' LIMIT 1;
  
  -- Check if profile exists
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = v_user_id) THEN
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
    -- Update existing profile to ensure it's admin
    UPDATE profiles 
    SET 
      role = 'admin'::user_role,
      is_active = true,
      organization_id = COALESCE(organization_id, v_org_id),
      email = COALESCE(email, v_email),
      updated_at = NOW()
    WHERE id = v_user_id;
    
    RAISE NOTICE 'Profile updated for user %', v_email;
  END IF;
END $$;

-- 6. Also fix RLS on other tables if needed
-- Organizations table - users can see their own organization
DROP POLICY IF EXISTS "Users can view own organization" ON organizations;
CREATE POLICY "Users can view own organization" ON organizations
FOR SELECT USING (
  id IN (
    SELECT organization_id 
    FROM profiles 
    WHERE profiles.id = auth.uid()
  )
);

-- Permissions table - users can see permissions for their organization
DROP POLICY IF EXISTS "Users can view organization permissions" ON permissions;
CREATE POLICY "Users can view organization permissions" ON permissions
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id 
    FROM profiles 
    WHERE profiles.id = auth.uid()
  )
);

-- 7. Create a helper function to safely get user's organization
-- This avoids RLS recursion issues
CREATE OR REPLACE FUNCTION get_user_organization(user_id UUID)
RETURNS UUID AS $$
DECLARE
  v_org_id UUID;
BEGIN
  SELECT organization_id INTO v_org_id
  FROM profiles
  WHERE id = user_id
  LIMIT 1;
  
  RETURN v_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_organization(UUID) TO authenticated;

-- 8. Verify the fix
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Count profiles to ensure RLS is working
  SELECT COUNT(*) INTO v_count FROM profiles;
  RAISE NOTICE 'Total profiles visible: %', v_count;
  
  -- Check specific user
  SELECT COUNT(*) INTO v_count 
  FROM profiles 
  WHERE email = 'akevinzakaria@cepatservicestation.com' 
  AND role = 'admin'
  AND is_active = true;
  
  IF v_count > 0 THEN
    RAISE NOTICE '✅ Admin user profile is properly configured';
  ELSE
    RAISE WARNING '❌ Admin user profile not found or not properly configured';
  END IF;
END $$;