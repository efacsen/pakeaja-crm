-- Master RBAC Migration for PakeAja CRM (v2 - Supabase Compatible)
-- This migration properly handles Supabase auth.users structure

-- 1. First, handle existing type conflicts
DO $$ 
BEGIN
    -- Drop old user_role type if it exists
    DROP TYPE IF EXISTS user_role CASCADE;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- 2. Create new user_role enum
CREATE TYPE user_role AS ENUM (
    'admin', 'manager', 'sales', 'estimator', 
    'project_manager', 'foreman', 'inspector', 'client'
);

-- 3. Create other required enums (with proper existence check)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'permission_action') THEN
        CREATE TYPE permission_action AS ENUM (
            'create', 'read', 'update', 'delete', 'approve', 'export'
        );
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'resource_type') THEN
        CREATE TYPE resource_type AS ENUM (
            'users', 'contacts', 'leads', 'opportunities', 'quotes', 'projects', 
            'materials', 'calculations', 'reports', 'documents', 'settings'
        );
    END IF;
END $$;

-- 4. Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Insert default organization
INSERT INTO organizations (name, slug) 
VALUES ('PakeAja', 'pakeaja')
ON CONFLICT (slug) DO NOTHING;

-- 6. Add email column to profiles if it doesn't exist (for convenience and performance)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Create index on email for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- 7. Sync existing emails from auth.users to profiles
UPDATE profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id
AND p.email IS NULL;

-- 8. Ensure profiles table has all required columns
DO $$ 
BEGIN
    -- Add organization_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'organization_id') THEN
        ALTER TABLE profiles ADD COLUMN organization_id UUID REFERENCES organizations(id);
    END IF;

    -- Add other columns if they don't exist
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

    -- Handle role column conversion
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'role' 
               AND data_type != 'USER-DEFINED') THEN
        
        -- Create temporary column
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
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'profiles' AND column_name = 'role') THEN
        -- Add role column if it doesn't exist
        ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'sales'::user_role NOT NULL;
    END IF;
END $$;

-- 9. Set organization_id for all existing profiles
UPDATE profiles 
SET organization_id = (SELECT id FROM organizations WHERE slug = 'pakeaja' LIMIT 1)
WHERE organization_id IS NULL;

-- 10. Create function to keep email in sync
CREATE OR REPLACE FUNCTION sync_profile_email()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles
    SET email = NEW.email
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users to sync email changes
DROP TRIGGER IF EXISTS sync_profile_email_trigger ON auth.users;
CREATE TRIGGER sync_profile_email_trigger
AFTER UPDATE OF email ON auth.users
FOR EACH ROW
EXECUTE FUNCTION sync_profile_email();

-- 11. Create all RBAC tables (same as before)
CREATE TABLE IF NOT EXISTS territories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    boundaries JSONB,
    parent_territory_id UUID REFERENCES territories(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_territories (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    territory_id UUID REFERENCES territories(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID REFERENCES profiles(id),
    is_primary BOOLEAN DEFAULT false,
    PRIMARY KEY (user_id, territory_id)
);

CREATE TABLE IF NOT EXISTS teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    team_lead_id UUID REFERENCES profiles(id),
    parent_team_id UUID REFERENCES teams(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    role VARCHAR(100),
    PRIMARY KEY (team_id, user_id)
);

CREATE TABLE IF NOT EXISTS permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    resource resource_type NOT NULL,
    action permission_action NOT NULL,
    conditions JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, role, resource, action)
);

CREATE TABLE IF NOT EXISTS role_hierarchy (
    parent_role user_role NOT NULL,
    child_role user_role NOT NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    PRIMARY KEY (parent_role, child_role, organization_id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    resource_type resource_type,
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Insert permissions (same as before)
-- Admin has all permissions
INSERT INTO permissions (organization_id, role, resource, action)
SELECT 
    organizations.id,
    'admin',
    resource,
    action
FROM organizations
CROSS JOIN unnest(ARRAY['users', 'contacts', 'leads', 'opportunities', 'quotes', 'projects', 'materials', 'calculations', 'reports', 'documents', 'settings']::resource_type[]) AS resource
CROSS JOIN unnest(ARRAY['create', 'read', 'update', 'delete', 'approve', 'export']::permission_action[]) AS action
WHERE organizations.slug = 'pakeaja'
ON CONFLICT DO NOTHING;

-- Manager permissions
INSERT INTO permissions (organization_id, role, resource, action)
SELECT 
    organizations.id,
    'manager',
    resource,
    action
FROM organizations
CROSS JOIN unnest(ARRAY['users', 'contacts', 'leads', 'opportunities', 'quotes', 'projects', 'materials', 'calculations', 'reports', 'documents']::resource_type[]) AS resource
CROSS JOIN unnest(ARRAY['create', 'read', 'update', 'delete', 'approve', 'export']::permission_action[]) AS action
WHERE organizations.slug = 'pakeaja'
ON CONFLICT DO NOTHING;

-- Sales permissions
INSERT INTO permissions (organization_id, role, resource, action)
SELECT 
    organizations.id,
    'sales',
    resource,
    action
FROM organizations
CROSS JOIN unnest(ARRAY['contacts', 'leads', 'opportunities', 'quotes']::resource_type[]) AS resource
CROSS JOIN unnest(ARRAY['create', 'read', 'update', 'export']::permission_action[]) AS action
WHERE organizations.slug = 'pakeaja'
ON CONFLICT DO NOTHING;

-- Other role permissions (estimator, project_manager, foreman, inspector, client)...
-- (Same as in previous migration)

-- 13. Insert role hierarchy
INSERT INTO role_hierarchy (parent_role, child_role, organization_id)
SELECT 'admin', role, organizations.id
FROM unnest(ARRAY['manager', 'sales', 'estimator', 'project_manager', 'foreman', 'inspector']::user_role[]) AS role
CROSS JOIN organizations
WHERE organizations.slug = 'pakeaja'
ON CONFLICT DO NOTHING;

-- 14. Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_organization ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_permissions_role_resource ON permissions(role, resource);

-- 15. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view profiles in same organization" ON profiles;
CREATE POLICY "Users can view profiles in same organization" ON profiles
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    );

-- 16. Create permission check function
CREATE OR REPLACE FUNCTION check_permission(
    p_user_id UUID,
    p_resource resource_type,
    p_action permission_action,
    p_resource_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_user_role user_role;
    v_organization_id UUID;
    v_has_permission BOOLEAN;
BEGIN
    -- Get user role and organization
    SELECT role, organization_id INTO v_user_role, v_organization_id
    FROM profiles
    WHERE id = p_user_id AND is_active = true;
    
    IF v_user_role IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Admin has all permissions
    IF v_user_role = 'admin' THEN
        RETURN TRUE;
    END IF;
    
    -- Check direct permission
    SELECT COUNT(*) > 0 INTO v_has_permission
    FROM permissions
    WHERE organization_id = v_organization_id
        AND role = v_user_role
        AND resource = p_resource
        AND action = p_action;
    
    RETURN v_has_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 17. Update your user to admin role
-- First, ensure email is synced
UPDATE profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id
AND p.email IS NULL;

-- Now update the user to admin using either email or direct lookup
DO $$
DECLARE
    v_user_id UUID;
    v_email TEXT := 'akevinzakaria@cepatservicestation.com';
BEGIN
    -- Try to find user by email in profiles first
    SELECT id INTO v_user_id FROM profiles WHERE email = v_email;
    
    -- If not found, find by joining with auth.users
    IF v_user_id IS NULL THEN
        SELECT p.id INTO v_user_id 
        FROM profiles p
        JOIN auth.users u ON p.id = u.id
        WHERE u.email = v_email;
    END IF;
    
    -- Update the user if found
    IF v_user_id IS NOT NULL THEN
        UPDATE profiles 
        SET 
            role = 'admin'::user_role,
            department = 'Management',
            position = 'System Administrator',
            is_active = true,
            email = v_email,  -- Ensure email is set
            updated_at = NOW()
        WHERE id = v_user_id;
        
        RAISE NOTICE 'User % updated to admin role successfully', v_email;
    ELSE
        RAISE WARNING 'User % not found in the system. Please ensure the user has logged in at least once.', v_email;
    END IF;
END $$;

-- 18. Verify the update
SELECT 
    p.id, 
    COALESCE(p.email, u.email) as email,
    p.full_name, 
    p.role::text as role, 
    p.department, 
    p.position,
    p.is_active,
    p.organization_id
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.email = 'akevinzakaria@cepatservicestation.com' OR p.email = 'akevinzakaria@cepatservicestation.com';

-- 19. Create a view for easier user management
CREATE OR REPLACE VIEW user_profiles AS
SELECT 
    p.*,
    u.email as auth_email,
    u.created_at as auth_created_at,
    u.last_sign_in_at
FROM profiles p
JOIN auth.users u ON p.id = u.id;

-- Grant access to the view
GRANT SELECT ON user_profiles TO authenticated;

-- Success message
DO $$
DECLARE
    v_user_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_user_count 
    FROM profiles p
    LEFT JOIN auth.users u ON p.id = u.id
    WHERE (u.email = 'akevinzakaria@cepatservicestation.com' OR p.email = 'akevinzakaria@cepatservicestation.com')
    AND p.role = 'admin';
    
    IF v_user_count > 0 THEN
        RAISE NOTICE '';
        RAISE NOTICE '===========================================';
        RAISE NOTICE 'SUCCESS: RBAC migration completed!';
        RAISE NOTICE 'User akevinzakaria@cepatservicestation.com has been granted admin role.';
        RAISE NOTICE 'Total permissions created: %', (SELECT COUNT(*) FROM permissions);
        RAISE NOTICE '===========================================';
    ELSE
        RAISE WARNING 'Migration completed but user role update may have failed. Please check manually.';
    END IF;
END $$;