-- Create RBAC Schema for PakeAja CRM
-- This migration sets up comprehensive role-based access control

-- Create organizations table (for future multi-tenant support)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create enum for roles
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'sales', 'estimator', 'project_manager', 'foreman', 'inspector', 'client');

-- Create enum for permission actions
CREATE TYPE permission_action AS ENUM ('create', 'read', 'update', 'delete', 'approve', 'export');

-- Create enum for resources
CREATE TYPE resource_type AS ENUM (
    'users', 'contacts', 'leads', 'opportunities', 'quotes', 'projects', 
    'materials', 'calculations', 'reports', 'documents', 'settings'
);

-- Update profiles table with RBAC fields
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id),
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'sales',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS department VARCHAR(100),
ADD COLUMN IF NOT EXISTS position VARCHAR(100),
ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS joined_at DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS reports_to UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}';

-- Create territories table
CREATE TABLE IF NOT EXISTS territories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    boundaries JSONB, -- GeoJSON or structured location data
    parent_territory_id UUID REFERENCES territories(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_territories junction table
CREATE TABLE IF NOT EXISTS user_territories (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    territory_id UUID REFERENCES territories(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID REFERENCES profiles(id),
    is_primary BOOLEAN DEFAULT false,
    PRIMARY KEY (user_id, territory_id)
);

-- Create teams table
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

-- Create team_members junction table
CREATE TABLE IF NOT EXISTS team_members (
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    role VARCHAR(100),
    PRIMARY KEY (team_id, user_id)
);

-- Create permissions table for granular control
CREATE TABLE IF NOT EXISTS permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    resource resource_type NOT NULL,
    action permission_action NOT NULL,
    conditions JSONB DEFAULT '{}', -- Additional conditions like "own_only", "team_only", etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, role, resource, action)
);

-- Create role_hierarchy table
CREATE TABLE IF NOT EXISTS role_hierarchy (
    parent_role user_role NOT NULL,
    child_role user_role NOT NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    PRIMARY KEY (parent_role, child_role, organization_id)
);

-- Create audit_logs table for tracking permission usage
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

-- Insert default organization (can be updated later)
INSERT INTO organizations (name, slug) 
VALUES ('PakeAja', 'pakeaja')
ON CONFLICT (slug) DO NOTHING;

-- Insert default role hierarchy
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

-- Insert default permissions for each role
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
INSERT INTO permissions (organization_id, role, resource, action, conditions)
SELECT 
    organizations.id,
    'manager',
    resource,
    action,
    CASE 
        WHEN resource = 'settings' AND action IN ('create', 'delete') THEN '{"restricted": true}'::jsonb
        WHEN resource = 'users' AND action = 'delete' THEN '{"restricted": true}'::jsonb
        ELSE '{}'::jsonb
    END
FROM organizations
CROSS JOIN unnest(ARRAY['users', 'contacts', 'leads', 'opportunities', 'quotes', 'projects', 'materials', 'calculations', 'reports', 'documents']::resource_type[]) AS resource
CROSS JOIN unnest(ARRAY['create', 'read', 'update', 'delete', 'approve', 'export']::permission_action[]) AS action
WHERE organizations.slug = 'pakeaja'
ON CONFLICT DO NOTHING;

-- Sales permissions
INSERT INTO permissions (organization_id, role, resource, action, conditions)
SELECT 
    organizations.id,
    'sales',
    resource,
    action,
    CASE 
        WHEN action IN ('delete', 'approve') THEN '{"own_only": true}'::jsonb
        WHEN resource IN ('users', 'settings') AND action != 'read' THEN '{"restricted": true}'::jsonb
        ELSE '{}'::jsonb
    END
FROM organizations
CROSS JOIN unnest(ARRAY['contacts', 'leads', 'opportunities', 'quotes', 'documents']::resource_type[]) AS resource
CROSS JOIN unnest(ARRAY['create', 'read', 'update', 'export']::permission_action[]) AS action
WHERE organizations.slug = 'pakeaja'
AND NOT (resource IN ('users', 'settings') AND action != 'read')
ON CONFLICT DO NOTHING;

-- Estimator permissions
INSERT INTO permissions (organization_id, role, resource, action, conditions)
SELECT 
    organizations.id,
    'estimator',
    resource,
    action,
    CASE 
        WHEN resource = 'quotes' AND action = 'approve' THEN '{"max_value": 1000000}'::jsonb
        ELSE '{}'::jsonb
    END
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
INSERT INTO permissions (organization_id, role, resource, action, conditions)
SELECT 
    organizations.id,
    'foreman',
    resource,
    action,
    '{"project_assigned": true}'::jsonb
FROM organizations
CROSS JOIN unnest(ARRAY['projects', 'materials', 'reports', 'documents']::resource_type[]) AS resource
CROSS JOIN unnest(ARRAY['read', 'update', 'create']::permission_action[]) AS action
WHERE organizations.slug = 'pakeaja'
AND NOT (resource = 'projects' AND action = 'create')
ON CONFLICT DO NOTHING;

-- Inspector permissions
INSERT INTO permissions (organization_id, role, resource, action, conditions)
SELECT 
    organizations.id,
    'inspector',
    resource,
    action,
    '{"quality_control": true}'::jsonb
FROM organizations
CROSS JOIN unnest(ARRAY['projects', 'reports', 'documents']::resource_type[]) AS resource
CROSS JOIN unnest(ARRAY['read', 'create', 'update', 'approve']::permission_action[]) AS action
WHERE organizations.slug = 'pakeaja'
AND (resource = 'reports' OR (resource IN ('projects', 'documents') AND action = 'read'))
ON CONFLICT DO NOTHING;

-- Client permissions (very limited)
INSERT INTO permissions (organization_id, role, resource, action, conditions)
SELECT 
    organizations.id,
    'client',
    resource,
    'read',
    '{"own_only": true}'::jsonb
FROM organizations
CROSS JOIN unnest(ARRAY['projects', 'documents']::resource_type[]) AS resource
WHERE organizations.slug = 'pakeaja'
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_organization ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_reports_to ON profiles(reports_to);
CREATE INDEX IF NOT EXISTS idx_user_territories_user ON user_territories(user_id);
CREATE INDEX IF NOT EXISTS idx_user_territories_territory ON user_territories(territory_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_permissions_role_resource ON permissions(role, resource);

-- Create function to check permissions
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
    v_conditions JSONB;
BEGIN
    -- Get user role and organization
    SELECT role, organization_id INTO v_user_role, v_organization_id
    FROM profiles
    WHERE id = p_user_id AND is_active = true;
    
    IF v_user_role IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check direct permission
    SELECT 
        COUNT(*) > 0,
        conditions INTO v_has_permission, v_conditions
    FROM permissions
    WHERE organization_id = v_organization_id
        AND role = v_user_role
        AND resource = p_resource
        AND action = p_action
    GROUP BY conditions
    LIMIT 1;
    
    -- If no direct permission, check hierarchy
    IF NOT v_has_permission THEN
        SELECT COUNT(*) > 0 INTO v_has_permission
        FROM permissions p
        JOIN role_hierarchy rh ON rh.child_role = v_user_role
        WHERE p.organization_id = v_organization_id
            AND p.role = rh.parent_role
            AND p.resource = p_resource
            AND p.action = p_action
            AND rh.organization_id = v_organization_id;
    END IF;
    
    -- Apply conditions if resource_id is provided
    IF v_has_permission AND p_resource_id IS NOT NULL AND v_conditions IS NOT NULL THEN
        -- Check own_only condition
        IF v_conditions->>'own_only' = 'true' THEN
            -- This would need to be customized based on resource type
            -- For now, return true (implement resource-specific checks later)
            RETURN TRUE;
        END IF;
    END IF;
    
    RETURN v_has_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_territories_updated_at BEFORE UPDATE ON territories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view profiles in same organization" ON profiles
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Add more RLS policies as needed...

-- Create view for user permissions
CREATE OR REPLACE VIEW user_permissions AS
SELECT 
    p.id as user_id,
    p.email,
    p.full_name,
    p.role,
    p.organization_id,
    o.name as organization_name,
    perm.resource,
    perm.action,
    perm.conditions
FROM profiles p
JOIN organizations o ON o.id = p.organization_id
LEFT JOIN permissions perm ON perm.role = p.role AND perm.organization_id = p.organization_id
WHERE p.is_active = true;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;