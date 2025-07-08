-- Master RBAC Migration for PakeAja CRM (Fixed Version)
-- This migration consolidates all RBAC changes and handles conflicts

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

-- 6. Ensure profiles table has all required columns
-- First, check if we need to convert role column
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

-- 7. Set organization_id for all existing profiles
UPDATE profiles 
SET organization_id = (SELECT id FROM organizations WHERE slug = 'pakeaja' LIMIT 1)
WHERE organization_id IS NULL;

-- 8. Create territories table
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

-- 9. Create user_territories junction table
CREATE TABLE IF NOT EXISTS user_territories (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    territory_id UUID REFERENCES territories(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID REFERENCES profiles(id),
    is_primary BOOLEAN DEFAULT false,
    PRIMARY KEY (user_id, territory_id)
);

-- 10. Create teams table
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

-- 11. Create team_members junction table
CREATE TABLE IF NOT EXISTS team_members (
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    role VARCHAR(100),
    PRIMARY KEY (team_id, user_id)
);

-- 12. Create permissions table
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

-- 13. Create role_hierarchy table
CREATE TABLE IF NOT EXISTS role_hierarchy (
    parent_role user_role NOT NULL,
    child_role user_role NOT NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    PRIMARY KEY (parent_role, child_role, organization_id)
);

-- 14. Create audit_logs table
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

-- 15. Insert default permissions for each role
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

-- Manager permissions (all except some settings)
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
AND NOT (resource = 'settings' AND action IN ('delete'))
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

-- Add read permissions for sales
INSERT INTO permissions (organization_id, role, resource, action)
SELECT 
    organizations.id,
    'sales',
    resource,
    'read'
FROM organizations
CROSS JOIN unnest(ARRAY['materials', 'calculations', 'documents']::resource_type[]) AS resource
WHERE organizations.slug = 'pakeaja'
ON CONFLICT DO NOTHING;

-- Estimator permissions
INSERT INTO permissions (organization_id, role, resource, action)
SELECT 
    organizations.id,
    'estimator',
    resource,
    action
FROM organizations
CROSS JOIN unnest(ARRAY['contacts', 'leads', 'opportunities', 'quotes', 'materials', 'calculations', 'documents']::resource_type[]) AS resource
CROSS JOIN unnest(ARRAY['create', 'read', 'update', 'export']::permission_action[]) AS action
WHERE organizations.slug = 'pakeaja'
ON CONFLICT DO NOTHING;

-- Project Manager permissions
INSERT INTO permissions (organization_id, role, resource, action)
SELECT 
    organizations.id,
    'project_manager',
    resource,
    action
FROM organizations
CROSS JOIN unnest(ARRAY['contacts', 'projects', 'materials', 'reports', 'documents']::resource_type[]) AS resource
CROSS JOIN unnest(ARRAY['create', 'read', 'update', 'approve', 'export']::permission_action[]) AS action
WHERE organizations.slug = 'pakeaja'
ON CONFLICT DO NOTHING;

-- Foreman permissions
INSERT INTO permissions (organization_id, role, resource, action)
SELECT 
    organizations.id,
    'foreman',
    resource,
    action
FROM organizations
CROSS JOIN unnest(ARRAY['projects', 'materials', 'reports', 'documents']::resource_type[]) AS resource
CROSS JOIN unnest(ARRAY['read', 'update', 'create']::permission_action[]) AS action
WHERE organizations.slug = 'pakeaja'
AND NOT (resource = 'projects' AND action = 'create')
ON CONFLICT DO NOTHING;

-- Inspector permissions
INSERT INTO permissions (organization_id, role, resource, action)
SELECT 
    organizations.id,
    'inspector',
    resource,
    action
FROM organizations
CROSS JOIN unnest(ARRAY['projects', 'reports', 'documents']::resource_type[]) AS resource
CROSS JOIN unnest(ARRAY['read', 'create', 'update', 'approve']::permission_action[]) AS action
WHERE organizations.slug = 'pakeaja'
AND (resource = 'reports' OR (resource IN ('projects', 'documents') AND action = 'read'))
ON CONFLICT DO NOTHING;

-- Client permissions
INSERT INTO permissions (organization_id, role, resource, action)
SELECT 
    organizations.id,
    'client',
    resource,
    'read'
FROM organizations
CROSS JOIN unnest(ARRAY['projects', 'documents']::resource_type[]) AS resource
WHERE organizations.slug = 'pakeaja'
ON CONFLICT DO NOTHING;

-- 16. Insert role hierarchy
INSERT INTO role_hierarchy (parent_role, child_role, organization_id)
SELECT 'admin', role, organizations.id
FROM unnest(ARRAY['manager', 'sales', 'estimator', 'project_manager', 'foreman', 'inspector']::user_role[]) AS role
CROSS JOIN organizations
WHERE organizations.slug = 'pakeaja'
ON CONFLICT DO NOTHING;

INSERT INTO role_hierarchy (parent_role, child_role, organization_id)
SELECT 'manager', role, organizations.id
FROM unnest(ARRAY['sales', 'estimator', 'project_manager']::user_role[]) AS role
CROSS JOIN organizations
WHERE organizations.slug = 'pakeaja'
ON CONFLICT DO NOTHING;

INSERT INTO role_hierarchy (parent_role, child_role, organization_id)
SELECT 'project_manager', role, organizations.id
FROM unnest(ARRAY['foreman', 'inspector']::user_role[]) AS role
CROSS JOIN organizations
WHERE organizations.slug = 'pakeaja'
ON CONFLICT DO NOTHING;

-- 17. Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_organization ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_reports_to ON profiles(reports_to);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_user_territories_user ON user_territories(user_id);
CREATE INDEX IF NOT EXISTS idx_user_territories_territory ON user_territories(territory_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_permissions_role_resource ON permissions(role, resource);

-- 18. Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles in same organization" ON profiles;

-- Create new policies
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

-- 19. Create permission check function
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

-- 20. Update your user to admin (replace with your email)
UPDATE profiles 
SET 
    role = 'admin'::user_role,
    department = 'Management',
    position = 'System Administrator',
    is_active = true,
    updated_at = NOW()
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- 21. Verify the update
SELECT 
    id, 
    email, 
    full_name, 
    role::text as role, 
    department, 
    position,
    is_active,
    organization_id
FROM profiles 
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- Success message
DO $$
DECLARE
    v_user_count INTEGER;
    v_admin_role TEXT;
BEGIN
    SELECT COUNT(*) INTO v_user_count FROM profiles WHERE email = 'akevinzakaria@cepatservicestation.com' AND role = 'admin';
    
    IF v_user_count > 0 THEN
        RAISE NOTICE 'SUCCESS: RBAC migration completed!';
        RAISE NOTICE 'User akevinzakaria@cepatservicestation.com has been granted admin role.';
        RAISE NOTICE 'Total permissions created: %', (SELECT COUNT(*) FROM permissions);
    ELSE
        RAISE WARNING 'Migration completed but user role update may have failed. Please check manually.';
    END IF;
END $$;