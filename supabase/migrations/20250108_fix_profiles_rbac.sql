-- Fix existing profiles table for RBAC
-- This is a patch to update the existing profiles table without recreating it

-- First, create the enums if they don't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'manager', 'sales', 'estimator', 'project_manager', 'foreman', 'inspector', 'client');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update profiles table - add missing columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS department VARCHAR(100),
ADD COLUMN IF NOT EXISTS position VARCHAR(100),
ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS joined_at DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS reports_to UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update the role column to use the new enum (if it's currently text)
DO $$ 
BEGIN
    -- Check if role column exists and is not already user_role type
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'role' 
        AND data_type != 'USER-DEFINED'
    ) THEN
        -- Create a temporary column
        ALTER TABLE profiles ADD COLUMN role_new user_role;
        
        -- Map old roles to new roles
        UPDATE profiles SET role_new = 
            CASE 
                WHEN role = 'superadmin' THEN 'admin'::user_role
                WHEN role = 'admin' THEN 'admin'::user_role
                WHEN role = 'sales_rep' THEN 'sales'::user_role
                WHEN role = 'sales_manager' THEN 'manager'::user_role
                WHEN role = 'estimator' THEN 'estimator'::user_role
                WHEN role = 'project_manager' THEN 'project_manager'::user_role
                WHEN role = 'foreman' THEN 'foreman'::user_role
                WHEN role = 'customer' THEN 'client'::user_role
                WHEN role = 'client' THEN 'client'::user_role
                ELSE 'sales'::user_role
            END;
        
        -- Drop old column and rename new one
        ALTER TABLE profiles DROP COLUMN role;
        ALTER TABLE profiles RENAME COLUMN role_new TO role;
        
        -- Set NOT NULL constraint
        ALTER TABLE profiles ALTER COLUMN role SET NOT NULL;
        ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'sales'::user_role;
    END IF;
END $$;

-- Create default organization if it doesn't exist
INSERT INTO organizations (id, name, slug) 
VALUES (gen_random_uuid(), 'PakeAja', 'pakeaja')
ON CONFLICT (slug) DO NOTHING;

-- Update existing profiles to have organization_id
UPDATE profiles 
SET organization_id = (SELECT id FROM organizations WHERE slug = 'pakeaja' LIMIT 1)
WHERE organization_id IS NULL;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_organization ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_reports_to ON profiles(reports_to);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

-- Enable RLS if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Update RLS policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles in same organization" ON profiles;

CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view profiles in same organization" ON profiles
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Grant permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON organizations TO authenticated;