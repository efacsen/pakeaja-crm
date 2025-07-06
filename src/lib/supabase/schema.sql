-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'user');
CREATE TYPE project_status AS ENUM ('planning', 'active', 'on_hold', 'completed', 'cancelled');
CREATE TYPE sales_stage AS ENUM ('prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
CREATE TYPE coating_type AS ENUM ('primer', 'base_coat', 'top_coat', 'clear_coat', 'specialty');

-- =============================================
-- PROFILES TABLE (extends auth.users)
-- =============================================
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    organization_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ORGANIZATIONS TABLE
-- =============================================
CREATE TABLE organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for profiles -> organizations
ALTER TABLE profiles 
ADD CONSTRAINT fk_profiles_organization 
FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL;

-- =============================================
-- CUSTOMERS TABLE
-- =============================================
CREATE TABLE customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address JSONB DEFAULT '{}', -- {street, city, state, zip, country}
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- COATING CALCULATIONS TABLE
-- =============================================
CREATE TABLE coating_calculations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    surface_area DECIMAL(10,2) NOT NULL CHECK (surface_area > 0),
    coating_type coating_type NOT NULL,
    layers INTEGER NOT NULL DEFAULT 1 CHECK (layers > 0),
    material_cost DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (material_cost >= 0),
    labor_cost DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (labor_cost >= 0),
    total_cost DECIMAL(10,2) GENERATED ALWAYS AS (material_cost + labor_cost) STORED,
    margin DECIMAL(5,2) DEFAULT 0 CHECK (margin >= 0 AND margin <= 100), -- percentage
    final_price DECIMAL(10,2) GENERATED ALWAYS AS (
        (material_cost + labor_cost) * (1 + margin / 100)
    ) STORED,
    notes TEXT,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PROJECTS TABLE
-- =============================================
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status project_status DEFAULT 'planning',
    estimated_value DECIMAL(12,2) DEFAULT 0 CHECK (estimated_value >= 0),
    actual_value DECIMAL(12,2) DEFAULT 0 CHECK (actual_value >= 0),
    start_date DATE,
    end_date DATE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure end_date is after start_date
    CONSTRAINT check_project_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

-- =============================================
-- SALES OPPORTUNITIES TABLE
-- =============================================
CREATE TABLE sales_opportunities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    value DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (value >= 0),
    stage sales_stage DEFAULT 'prospecting',
    probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100), -- percentage
    close_date DATE,
    actual_close_date DATE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- UPDATED_AT TRIGGERS
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coating_calculations_updated_at BEFORE UPDATE ON coating_calculations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_opportunities_updated_at BEFORE UPDATE ON sales_opportunities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- PERFORMANCE INDEXES
-- =============================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Organizations indexes
CREATE INDEX idx_organizations_name ON organizations(name);

-- Customers indexes
CREATE INDEX idx_customers_organization_id ON customers(organization_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_created_by ON customers(created_by);

-- Coating calculations indexes
CREATE INDEX idx_coating_calculations_customer_id ON coating_calculations(customer_id);
CREATE INDEX idx_coating_calculations_organization_id ON coating_calculations(organization_id);
CREATE INDEX idx_coating_calculations_created_by ON coating_calculations(created_by);
CREATE INDEX idx_coating_calculations_coating_type ON coating_calculations(coating_type);
CREATE INDEX idx_coating_calculations_created_at ON coating_calculations(created_at);

-- Projects indexes
CREATE INDEX idx_projects_customer_id ON projects(customer_id);
CREATE INDEX idx_projects_organization_id ON projects(organization_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_assigned_to ON projects(assigned_to);
CREATE INDEX idx_projects_start_date ON projects(start_date);
CREATE INDEX idx_projects_end_date ON projects(end_date);

-- Sales opportunities indexes
CREATE INDEX idx_sales_opportunities_customer_id ON sales_opportunities(customer_id);
CREATE INDEX idx_sales_opportunities_organization_id ON sales_opportunities(organization_id);
CREATE INDEX idx_sales_opportunities_stage ON sales_opportunities(stage);
CREATE INDEX idx_sales_opportunities_created_by ON sales_opportunities(created_by);
CREATE INDEX idx_sales_opportunities_assigned_to ON sales_opportunities(assigned_to);
CREATE INDEX idx_sales_opportunities_close_date ON sales_opportunities(close_date);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE coating_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_opportunities ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view profiles in their organization" ON profiles
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Organizations policies
CREATE POLICY "Users can view their organization" ON organizations
    FOR SELECT USING (
        id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can update their organization" ON organizations
    FOR UPDATE USING (
        id IN (
            SELECT organization_id FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Customers policies
CREATE POLICY "Users can view customers in their organization" ON customers
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can insert customers in their organization" ON customers
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update customers in their organization" ON customers
    FOR UPDATE USING (
        organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can delete customers in their organization" ON customers
    FOR DELETE USING (
        organization_id IN (
            SELECT organization_id FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- Coating calculations policies
CREATE POLICY "Users can view calculations in their organization" ON coating_calculations
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can insert calculations in their organization" ON coating_calculations
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own calculations" ON coating_calculations
    FOR UPDATE USING (
        created_by = auth.uid() OR 
        organization_id IN (
            SELECT organization_id FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can delete their own calculations" ON coating_calculations
    FOR DELETE USING (
        created_by = auth.uid() OR 
        organization_id IN (
            SELECT organization_id FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- Projects policies
CREATE POLICY "Users can view projects in their organization" ON projects
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can insert projects in their organization" ON projects
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update projects they created or are assigned to" ON projects
    FOR UPDATE USING (
        created_by = auth.uid() OR 
        assigned_to = auth.uid() OR
        organization_id IN (
            SELECT organization_id FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Managers can delete projects in their organization" ON projects
    FOR DELETE USING (
        organization_id IN (
            SELECT organization_id FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- Sales opportunities policies
CREATE POLICY "Users can view opportunities in their organization" ON sales_opportunities
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can insert opportunities in their organization" ON sales_opportunities
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update opportunities they created or are assigned to" ON sales_opportunities
    FOR UPDATE USING (
        created_by = auth.uid() OR 
        assigned_to = auth.uid() OR
        organization_id IN (
            SELECT organization_id FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Managers can delete opportunities in their organization" ON sales_opportunities
    FOR DELETE USING (
        organization_id IN (
            SELECT organization_id FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- =============================================
-- FUNCTIONS FOR COMMON QUERIES
-- =============================================

-- Function to get user's organization
CREATE OR REPLACE FUNCTION get_user_organization()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT organization_id 
        FROM profiles 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin/manager
CREATE OR REPLACE FUNCTION is_admin_or_manager()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role IN ('admin', 'manager')
        FROM profiles 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- View for customer summary with project and opportunity counts
CREATE VIEW customer_summary AS
SELECT 
    c.*,
    COALESCE(p.project_count, 0) as project_count,
    COALESCE(so.opportunity_count, 0) as opportunity_count,
    COALESCE(so.total_opportunity_value, 0) as total_opportunity_value
FROM customers c
LEFT JOIN (
    SELECT 
        customer_id, 
        COUNT(*) as project_count
    FROM projects 
    GROUP BY customer_id
) p ON c.id = p.customer_id
LEFT JOIN (
    SELECT 
        customer_id, 
        COUNT(*) as opportunity_count,
        SUM(value) as total_opportunity_value
    FROM sales_opportunities 
    GROUP BY customer_id
) so ON c.id = so.customer_id;

-- View for project summary with customer details
CREATE VIEW project_summary AS
SELECT 
    p.*,
    c.name as customer_name,
    c.email as customer_email,
    creator.full_name as created_by_name,
    assignee.full_name as assigned_to_name
FROM projects p
JOIN customers c ON p.customer_id = c.id
LEFT JOIN profiles creator ON p.created_by = creator.id
LEFT JOIN profiles assignee ON p.assigned_to = assignee.id;

-- =============================================
-- INITIAL DATA SETUP
-- =============================================

-- This will be handled by your application's onboarding process
-- but here's an example of how to set up initial data:

-- Insert default organization (you'll want to do this programmatically)
-- INSERT INTO organizations (name, settings) VALUES 
-- ('Default Organization', '{"timezone": "UTC", "currency": "USD"}');

-- Note: Profiles will be automatically created via triggers when users sign up
-- through Supabase Auth, but you'll need to handle the organization assignment
-- in your application logic. 