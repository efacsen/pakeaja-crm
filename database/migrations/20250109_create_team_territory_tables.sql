-- Migration: Create Team and Territory Tables
-- This migration creates the missing team and territory tables that were defined
-- in the RBAC schema but may not have been created in the database

-- 0. Ensure prerequisites are met
DO $$
BEGIN
    -- Check if profiles table has organization_id column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'organization_id'
    ) THEN
        RAISE EXCEPTION 'profiles table is missing organization_id column. Please run the RBAC migration first.';
    END IF;
    
    -- Check if organizations table exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'organizations'
    ) THEN
        RAISE EXCEPTION 'organizations table does not exist. Please run the RBAC migration first.';
    END IF;
END $$;

-- 1. First, check what tables already exist
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '===========================================';
    RAISE NOTICE 'Checking for existing tables...';
    RAISE NOTICE '===========================================';
    
    -- Check for each table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'teams') THEN
        RAISE NOTICE '✓ teams table already exists';
    ELSE
        RAISE NOTICE '✗ teams table does not exist';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'team_members') THEN
        RAISE NOTICE '✓ team_members table already exists';
    ELSE
        RAISE NOTICE '✗ team_members table does not exist';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'territories') THEN
        RAISE NOTICE '✓ territories table already exists';
    ELSE
        RAISE NOTICE '✗ territories table does not exist';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_territories') THEN
        RAISE NOTICE '✓ user_territories table already exists';
    ELSE
        RAISE NOTICE '✗ user_territories table does not exist';
    END IF;
END $$;

-- 2. Create territories table
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

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_territories_organization ON territories(organization_id);
CREATE INDEX IF NOT EXISTS idx_territories_parent ON territories(parent_territory_id);

-- 3. Create user_territories table
CREATE TABLE IF NOT EXISTS user_territories (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    territory_id UUID REFERENCES territories(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID REFERENCES profiles(id),
    is_primary BOOLEAN DEFAULT false,
    PRIMARY KEY (user_id, territory_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_territories_user ON user_territories(user_id);
CREATE INDEX IF NOT EXISTS idx_user_territories_territory ON user_territories(territory_id);

-- 4. Create teams table
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_teams_organization ON teams(organization_id);
CREATE INDEX IF NOT EXISTS idx_teams_lead ON teams(team_lead_id);
CREATE INDEX IF NOT EXISTS idx_teams_parent ON teams(parent_team_id);

-- 5. Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    role VARCHAR(100),
    PRIMARY KEY (team_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);

-- 6. Create helper function if it doesn't exist
-- This function is used by RLS policies to get user's organization
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

-- 7. Enable Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_territories ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS Policies

-- Teams policies
DROP POLICY IF EXISTS "Users can view teams in their organization" ON teams;
CREATE POLICY "Users can view teams in their organization" ON teams
FOR SELECT USING (
    organization_id = get_user_organization(auth.uid())
);

DROP POLICY IF EXISTS "Managers can manage teams" ON teams;
CREATE POLICY "Managers can manage teams" ON teams
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND organization_id = teams.organization_id
        AND role IN ('admin', 'manager')
    )
);

-- Team members policies
DROP POLICY IF EXISTS "Users can view team members" ON team_members;
CREATE POLICY "Users can view team members" ON team_members
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM teams
        WHERE teams.id = team_members.team_id
        AND teams.organization_id = get_user_organization(auth.uid())
    )
);

DROP POLICY IF EXISTS "Team leads can manage members" ON team_members;
CREATE POLICY "Team leads can manage members" ON team_members
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM teams
        WHERE teams.id = team_members.team_id
        AND (
            teams.team_lead_id = auth.uid() OR
            EXISTS (
                SELECT 1 FROM profiles
                WHERE id = auth.uid()
                AND organization_id = teams.organization_id
                AND role IN ('admin', 'manager')
            )
        )
    )
);

-- Territories policies
DROP POLICY IF EXISTS "Users can view territories in their organization" ON territories;
CREATE POLICY "Users can view territories in their organization" ON territories
FOR SELECT USING (
    organization_id = get_user_organization(auth.uid())
);

DROP POLICY IF EXISTS "Managers can manage territories" ON territories;
CREATE POLICY "Managers can manage territories" ON territories
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND organization_id = territories.organization_id
        AND role IN ('admin', 'manager')
    )
);

-- User territories policies
DROP POLICY IF EXISTS "Users can view territory assignments" ON user_territories;
CREATE POLICY "Users can view territory assignments" ON user_territories
FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM territories
        WHERE territories.id = user_territories.territory_id
        AND territories.organization_id = get_user_organization(auth.uid())
    )
);

DROP POLICY IF EXISTS "Managers can manage territory assignments" ON user_territories;
CREATE POLICY "Managers can manage territory assignments" ON user_territories
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'manager')
        AND organization_id = (
            SELECT organization_id FROM territories
            WHERE id = user_territories.territory_id
        )
    )
);

-- 9. Create some sample data for testing
DO $$
DECLARE
    v_org_id UUID;
    v_admin_id UUID;
    v_territory_jakarta UUID;
    v_territory_bandung UUID;
    v_team_sales UUID;
BEGIN
    -- Get organization and admin user
    SELECT id INTO v_org_id FROM organizations WHERE slug = 'pakeaja' LIMIT 1;
    SELECT id INTO v_admin_id FROM profiles WHERE role = 'admin' AND email = 'akevinzakaria@cepatservicestation.com' LIMIT 1;
    
    IF v_org_id IS NOT NULL AND v_admin_id IS NOT NULL THEN
        -- Create sample territories
        INSERT INTO territories (organization_id, name, code, description)
        VALUES 
            (v_org_id, 'Jakarta', 'JKT', 'Greater Jakarta Area')
        ON CONFLICT (code) DO NOTHING
        RETURNING id INTO v_territory_jakarta;
        
        INSERT INTO territories (organization_id, name, code, description, parent_territory_id)
        VALUES 
            (v_org_id, 'Bandung', 'BDG', 'Greater Bandung Area', v_territory_jakarta)
        ON CONFLICT (code) DO NOTHING
        RETURNING id INTO v_territory_bandung;
        
        -- Create sample team
        INSERT INTO teams (organization_id, name, description, team_lead_id)
        VALUES 
            (v_org_id, 'Sales Team Jakarta', 'Main sales team for Jakarta region', v_admin_id)
        ON CONFLICT DO NOTHING
        RETURNING id INTO v_team_sales;
        
        -- Add admin to the team
        IF v_team_sales IS NOT NULL THEN
            INSERT INTO team_members (team_id, user_id, role)
            VALUES (v_team_sales, v_admin_id, 'Team Lead')
            ON CONFLICT DO NOTHING;
        END IF;
        
        -- Assign admin to Jakarta territory
        IF v_territory_jakarta IS NOT NULL THEN
            INSERT INTO user_territories (user_id, territory_id, assigned_by, is_primary)
            VALUES (v_admin_id, v_territory_jakarta, v_admin_id, true)
            ON CONFLICT DO NOTHING;
        END IF;
        
        RAISE NOTICE 'Sample data created successfully';
    ELSE
        RAISE NOTICE 'Skipping sample data - organization or admin user not found';
    END IF;
END $$;

-- 10. Create helper views for easier querying
CREATE OR REPLACE VIEW team_hierarchy AS
SELECT 
    t.id,
    t.name,
    t.description,
    t.organization_id,
    t.team_lead_id,
    tl.full_name as team_lead_name,
    t.parent_team_id,
    pt.name as parent_team_name,
    t.created_at,
    t.updated_at
FROM teams t
LEFT JOIN profiles tl ON t.team_lead_id = tl.id
LEFT JOIN teams pt ON t.parent_team_id = pt.id;

CREATE OR REPLACE VIEW user_team_memberships AS
SELECT 
    tm.user_id,
    u.full_name as user_name,
    u.email as user_email,
    u.role as user_role,
    tm.team_id,
    t.name as team_name,
    tm.role as team_role,
    tm.joined_at
FROM team_members tm
JOIN profiles u ON tm.user_id = u.id
JOIN teams t ON tm.team_id = t.id;

CREATE OR REPLACE VIEW user_territory_assignments AS
SELECT 
    ut.user_id,
    u.full_name as user_name,
    u.email as user_email,
    u.role as user_role,
    ut.territory_id,
    t.name as territory_name,
    t.code as territory_code,
    ut.is_primary,
    ut.assigned_at,
    ut.assigned_by,
    ab.full_name as assigned_by_name
FROM user_territories ut
JOIN profiles u ON ut.user_id = u.id
JOIN territories t ON ut.territory_id = t.id
LEFT JOIN profiles ab ON ut.assigned_by = ab.id;

-- Grant access to views
GRANT SELECT ON team_hierarchy TO authenticated;
GRANT SELECT ON user_team_memberships TO authenticated;
GRANT SELECT ON user_territory_assignments TO authenticated;

-- 11. Verify table creation
DO $$
DECLARE
    v_table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('teams', 'team_members', 'territories', 'user_territories');
    
    RAISE NOTICE '';
    RAISE NOTICE '===========================================';
    IF v_table_count = 4 THEN
        RAISE NOTICE 'SUCCESS: All 4 tables created successfully!';
    ELSE
        RAISE NOTICE 'WARNING: Only % of 4 tables were created', v_table_count;
    END IF;
    RAISE NOTICE '===========================================';
    
    -- Show table counts
    RAISE NOTICE 'Table counts:';
    EXECUTE 'SELECT COUNT(*) FROM teams' INTO v_table_count;
    RAISE NOTICE '  - teams: % records', v_table_count;
    
    EXECUTE 'SELECT COUNT(*) FROM team_members' INTO v_table_count;
    RAISE NOTICE '  - team_members: % records', v_table_count;
    
    EXECUTE 'SELECT COUNT(*) FROM territories' INTO v_table_count;
    RAISE NOTICE '  - territories: % records', v_table_count;
    
    EXECUTE 'SELECT COUNT(*) FROM user_territories' INTO v_table_count;
    RAISE NOTICE '  - user_territories: % records', v_table_count;
END $$;