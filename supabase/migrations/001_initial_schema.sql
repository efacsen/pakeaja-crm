-- Migration: 001_initial_schema
-- Description: Comprehensive CRM database schema for Horizon Suite
-- Created: 2024-12-19

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- CUSTOM ENUM TYPES
-- =============================================

-- User roles
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Project status
CREATE TYPE project_status AS ENUM ('planning', 'active', 'on_hold', 'completed', 'cancelled');

-- Sales opportunity stages
CREATE TYPE sales_stage AS ENUM ('lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost');

-- Coating calculation status
CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'accepted', 'rejected');

-- Coating types
CREATE TYPE coating_type AS ENUM ('primer', 'base_coat', 'top_coat', 'clear_coat', 'specialty', 'protective', 'decorative');

-- Unit types for materials
CREATE TYPE unit_type AS ENUM ('liter', 'kg', 'gallon', 'pound', 'sqm', 'sqft');

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

-- =============================================
-- PROFILES TABLE (extends auth.users)
-- =============================================
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CUSTOMERS TABLE
-- =============================================
CREATE TABLE customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address JSONB DEFAULT '{}', -- {street, city, state, zip, country}
    notes TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- COATING MATERIALS TABLE
-- =============================================
CREATE TABLE coating_materials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type coating_type NOT NULL,
    cost_per_unit DECIMAL(10,2) NOT NULL CHECK (cost_per_unit >= 0),
    unit_type unit_type NOT NULL,
    coverage_per_unit DECIMAL(10,2) NOT NULL CHECK (coverage_per_unit > 0), -- coverage per unit (e.g., sqm per liter)
    supplier TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- COATING CALCULATIONS TABLE
-- =============================================
CREATE TABLE coating_calculations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    surface_area DECIMAL(10,2) NOT NULL CHECK (surface_area > 0),
    coating_type coating_type NOT NULL,
    coating_thickness DECIMAL(8,3) NOT NULL CHECK (coating_thickness > 0), -- in millimeters
    number_of_coats INTEGER NOT NULL DEFAULT 1 CHECK (number_of_coats > 0),
    material_cost_per_unit DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (material_cost_per_unit >= 0),
    labor_cost_per_unit DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (labor_cost_per_unit >= 0),
    material_total DECIMAL(10,2) GENERATED ALWAYS AS (
        surface_area * material_cost_per_unit * number_of_coats
    ) STORED,
    labor_total DECIMAL(10,2) GENERATED ALWAYS AS (
        surface_area * labor_cost_per_unit * number_of_coats
    ) STORED,
    overhead_percentage DECIMAL(5,2) DEFAULT 0 CHECK (overhead_percentage >= 0 AND overhead_percentage <= 100),
    profit_margin DECIMAL(5,2) DEFAULT 0 CHECK (profit_margin >= 0 AND profit_margin <= 100),
    final_quote DECIMAL(10,2) GENERATED ALWAYS AS (
        (surface_area * material_cost_per_unit * number_of_coats + 
         surface_area * labor_cost_per_unit * number_of_coats) * 
        (1 + overhead_percentage / 100) * 
        (1 + profit_margin / 100)
    ) STORED,
    status quote_status DEFAULT 'draft',
    valid_until DATE,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure valid_until is in the future
    CONSTRAINT check_valid_until CHECK (valid_until IS NULL OR valid_until > CURRENT_DATE)
);

-- =============================================
-- PROJECTS TABLE
-- =============================================
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status project_status DEFAULT 'planning',
    estimated_value DECIMAL(12,2) DEFAULT 0 CHECK (estimated_value >= 0),
    actual_value DECIMAL(12,2) DEFAULT 0 CHECK (actual_value >= 0),
    start_date DATE,
    end_date DATE,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
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
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    value DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (value >= 0),
    stage sales_stage DEFAULT 'lead',
    probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100), -- percentage
    expected_close_date DATE,
    actual_close_date DATE,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure actual_close_date is after expected_close_date if both are set
    CONSTRAINT check_close_dates CHECK (
        actual_close_date IS NULL OR 
        expected_close_date IS NULL OR 
        actual_close_date >= expected_close_date
    )
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
$$ LANGUAGE 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_organizations_updated_at 
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at 
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coating_materials_updated_at 
    BEFORE UPDATE ON coating_materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coating_calculations_updated_at 
    BEFORE UPDATE ON coating_calculations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_opportunities_updated_at 
    BEFORE UPDATE ON sales_opportunities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- PERFORMANCE INDEXES
-- =============================================

-- Organizations indexes
CREATE INDEX idx_organizations_name ON organizations(name);

-- Profiles indexes
CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Customers indexes
CREATE INDEX idx_customers_organization_id ON customers(organization_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_created_by ON customers(created_by);

-- Coating materials indexes
CREATE INDEX idx_coating_materials_organization_id ON coating_materials(organization_id);
CREATE INDEX idx_coating_materials_type ON coating_materials(type);
CREATE INDEX idx_coating_materials_active ON coating_materials(active);
CREATE INDEX idx_coating_materials_name ON coating_materials(name);

-- Coating calculations indexes
CREATE INDEX idx_coating_calculations_organization_id ON coating_calculations(organization_id);
CREATE INDEX idx_coating_calculations_customer_id ON coating_calculations(customer_id);
CREATE INDEX idx_coating_calculations_created_by ON coating_calculations(created_by);
CREATE INDEX idx_coating_calculations_status ON coating_calculations(status);
CREATE INDEX idx_coating_calculations_coating_type ON coating_calculations(coating_type);
CREATE INDEX idx_coating_calculations_valid_until ON coating_calculations(valid_until);
CREATE INDEX idx_coating_calculations_created_at ON coating_calculations(created_at);

-- Projects indexes
CREATE INDEX idx_projects_organization_id ON projects(organization_id);
CREATE INDEX idx_projects_customer_id ON projects(customer_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_start_date ON projects(start_date);
CREATE INDEX idx_projects_end_date ON projects(end_date);

-- Sales opportunities indexes
CREATE INDEX idx_sales_opportunities_organization_id ON sales_opportunities(organization_id);
CREATE INDEX idx_sales_opportunities_customer_id ON sales_opportunities(customer_id);
CREATE INDEX idx_sales_opportunities_stage ON sales_opportunities(stage);
CREATE INDEX idx_sales_opportunities_created_by ON sales_opportunities(created_by);
CREATE INDEX idx_sales_opportunities_expected_close_date ON sales_opportunities(expected_close_date);
CREATE INDEX idx_sales_opportunities_actual_close_date ON sales_opportunities(actual_close_date);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE coating_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE coating_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_opportunities ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's organization
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

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role = 'admin'
        FROM profiles 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Organizations policies
CREATE POLICY "Users can view their organization" ON organizations
    FOR SELECT USING (
        id = get_user_organization()
    );

CREATE POLICY "Admins can update their organization" ON organizations
    FOR UPDATE USING (
        id = get_user_organization() AND is_admin()
    );

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view profiles in their organization" ON profiles
    FOR SELECT USING (
        organization_id = get_user_organization()
    );

CREATE POLICY "Admins can update profiles in their organization" ON profiles
    FOR UPDATE USING (
        organization_id = get_user_organization() AND is_admin()
    );

-- Customers policies
CREATE POLICY "Users can view customers in their organization" ON customers
    FOR SELECT USING (
        organization_id = get_user_organization()
    );

CREATE POLICY "Users can insert customers in their organization" ON customers
    FOR INSERT WITH CHECK (
        organization_id = get_user_organization()
    );

CREATE POLICY "Users can update customers in their organization" ON customers
    FOR UPDATE USING (
        organization_id = get_user_organization()
    );

CREATE POLICY "Admins can delete customers in their organization" ON customers
    FOR DELETE USING (
        organization_id = get_user_organization() AND is_admin()
    );

-- Coating materials policies
CREATE POLICY "Users can view coating materials in their organization" ON coating_materials
    FOR SELECT USING (
        organization_id = get_user_organization()
    );

CREATE POLICY "Users can insert coating materials in their organization" ON coating_materials
    FOR INSERT WITH CHECK (
        organization_id = get_user_organization()
    );

CREATE POLICY "Users can update coating materials in their organization" ON coating_materials
    FOR UPDATE USING (
        organization_id = get_user_organization()
    );

CREATE POLICY "Admins can delete coating materials in their organization" ON coating_materials
    FOR DELETE USING (
        organization_id = get_user_organization() AND is_admin()
    );

-- Coating calculations policies
CREATE POLICY "Users can view coating calculations in their organization" ON coating_calculations
    FOR SELECT USING (
        organization_id = get_user_organization()
    );

CREATE POLICY "Users can insert coating calculations in their organization" ON coating_calculations
    FOR INSERT WITH CHECK (
        organization_id = get_user_organization()
    );

CREATE POLICY "Users can update their own coating calculations" ON coating_calculations
    FOR UPDATE USING (
        organization_id = get_user_organization() AND 
        (created_by = auth.uid() OR is_admin())
    );

CREATE POLICY "Users can delete their own coating calculations" ON coating_calculations
    FOR DELETE USING (
        organization_id = get_user_organization() AND 
        (created_by = auth.uid() OR is_admin())
    );

-- Projects policies
CREATE POLICY "Users can view projects in their organization" ON projects
    FOR SELECT USING (
        organization_id = get_user_organization()
    );

CREATE POLICY "Users can insert projects in their organization" ON projects
    FOR INSERT WITH CHECK (
        organization_id = get_user_organization()
    );

CREATE POLICY "Users can update projects in their organization" ON projects
    FOR UPDATE USING (
        organization_id = get_user_organization()
    );

CREATE POLICY "Admins can delete projects in their organization" ON projects
    FOR DELETE USING (
        organization_id = get_user_organization() AND is_admin()
    );

-- Sales opportunities policies
CREATE POLICY "Users can view sales opportunities in their organization" ON sales_opportunities
    FOR SELECT USING (
        organization_id = get_user_organization()
    );

CREATE POLICY "Users can insert sales opportunities in their organization" ON sales_opportunities
    FOR INSERT WITH CHECK (
        organization_id = get_user_organization()
    );

CREATE POLICY "Users can update sales opportunities in their organization" ON sales_opportunities
    FOR UPDATE USING (
        organization_id = get_user_organization()
    );

CREATE POLICY "Admins can delete sales opportunities in their organization" ON sales_opportunities
    FOR DELETE USING (
        organization_id = get_user_organization() AND is_admin()
    );

-- =============================================
-- PROFILE CREATION TRIGGER
-- =============================================

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- Customer summary view with related data counts
CREATE VIEW customer_summary AS
SELECT 
    c.*,
    COALESCE(calc.calculation_count, 0) as calculation_count,
    COALESCE(calc.total_quoted_value, 0) as total_quoted_value,
    COALESCE(proj.project_count, 0) as project_count,
    COALESCE(proj.total_project_value, 0) as total_project_value,
    COALESCE(opp.opportunity_count, 0) as opportunity_count,
    COALESCE(opp.total_opportunity_value, 0) as total_opportunity_value,
    creator.full_name as created_by_name
FROM customers c
LEFT JOIN (
    SELECT 
        customer_id,
        COUNT(*) as calculation_count,
        SUM(final_quote) as total_quoted_value
    FROM coating_calculations
    GROUP BY customer_id
) calc ON c.id = calc.customer_id
LEFT JOIN (
    SELECT 
        customer_id,
        COUNT(*) as project_count,
        SUM(COALESCE(actual_value, estimated_value)) as total_project_value
    FROM projects
    GROUP BY customer_id
) proj ON c.id = proj.customer_id
LEFT JOIN (
    SELECT 
        customer_id,
        COUNT(*) as opportunity_count,
        SUM(value) as total_opportunity_value
    FROM sales_opportunities
    GROUP BY customer_id
) opp ON c.id = opp.customer_id
LEFT JOIN profiles creator ON c.created_by = creator.id;

-- Project summary view with customer and creator details
CREATE VIEW project_summary AS
SELECT 
    p.*,
    c.name as customer_name,
    c.email as customer_email,
    creator.full_name as created_by_name
FROM projects p
JOIN customers c ON p.customer_id = c.id
LEFT JOIN profiles creator ON p.created_by = creator.id;

-- Sales pipeline view with customer details
CREATE VIEW sales_pipeline AS
SELECT 
    so.*,
    c.name as customer_name,
    c.email as customer_email,
    creator.full_name as created_by_name,
    CASE 
        WHEN so.stage = 'won' THEN so.value
        ELSE so.value * (so.probability / 100.0)
    END as weighted_value
FROM sales_opportunities so
JOIN customers c ON so.customer_id = c.id
LEFT JOIN profiles creator ON so.created_by = creator.id;

-- Coating calculations summary view
CREATE VIEW coating_calculations_summary AS
SELECT 
    cc.*,
    c.name as customer_name,
    c.email as customer_email,
    creator.full_name as created_by_name,
    CASE 
        WHEN cc.valid_until < CURRENT_DATE THEN 'expired'
        WHEN cc.valid_until <= CURRENT_DATE + INTERVAL '7 days' THEN 'expiring_soon'
        ELSE 'valid'
    END as validity_status
FROM coating_calculations cc
JOIN customers c ON cc.customer_id = c.id
LEFT JOIN profiles creator ON cc.created_by = creator.id;

-- =============================================
-- SAMPLE DATA FUNCTIONS
-- =============================================

-- Function to create sample organization and admin user
CREATE OR REPLACE FUNCTION create_sample_organization(
    org_name TEXT,
    admin_user_id UUID
) RETURNS UUID AS $$
DECLARE
    org_id UUID;
BEGIN
    -- Create organization
    INSERT INTO organizations (name, settings)
    VALUES (org_name, '{"timezone": "UTC", "currency": "USD"}')
    RETURNING id INTO org_id;
    
    -- Update user profile to be admin of this organization
    UPDATE profiles 
    SET organization_id = org_id, role = 'admin'
    WHERE id = admin_user_id;
    
    RETURN org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 