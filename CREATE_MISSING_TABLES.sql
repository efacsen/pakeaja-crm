-- Create Missing Tables for PakeAja CRM
-- This migration creates all missing tables required by the application

-- =====================================================
-- 1. PROFILES TABLE (User profiles and organization mapping)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  full_name VARCHAR NOT NULL,
  avatar_url TEXT,
  phone VARCHAR,
  department VARCHAR,
  position VARCHAR,
  organization_id UUID,
  organization_name VARCHAR,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);

-- =====================================================
-- 2. COATING CALCULATIONS TABLES
-- =====================================================
CREATE TABLE IF NOT EXISTS coating_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Project Details
  project_name VARCHAR NOT NULL,
  company_id UUID REFERENCES companies(id),
  company_name VARCHAR,
  contact_id UUID REFERENCES contacts(id),
  contact_name VARCHAR,
  contact_email VARCHAR,
  contact_phone VARCHAR,
  project_address TEXT,
  project_date DATE,
  
  -- Surface Information
  surface_area DECIMAL(10,2) NOT NULL,
  surface_type VARCHAR,
  surface_condition VARCHAR,
  environment_type VARCHAR,
  
  -- Coating System
  coating_system_id VARCHAR,
  coating_system_name VARCHAR,
  total_thickness INTEGER,
  warranty_years INTEGER,
  
  -- Costs
  material_cost DECIMAL(15,2),
  labor_cost DECIMAL(15,2),
  equipment_cost DECIMAL(15,2),
  total_cost DECIMAL(15,2),
  profit_margin DECIMAL(5,2),
  final_price DECIMAL(15,2),
  
  -- Additional Costs
  mobilization_cost DECIMAL(15,2),
  engineering_cost DECIMAL(15,2),
  contingency_percentage DECIMAL(5,2),
  overhead_percentage DECIMAL(5,2),
  
  -- Status
  status VARCHAR DEFAULT 'draft', -- draft, sent, accepted, rejected, expired
  valid_until DATE,
  notes TEXT,
  
  -- Metadata
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_calculations_company_id ON coating_calculations(company_id);
CREATE INDEX idx_calculations_contact_id ON coating_calculations(contact_id);
CREATE INDEX idx_calculations_created_by ON coating_calculations(created_by);
CREATE INDEX idx_calculations_status ON coating_calculations(status);

-- Coating materials used in calculations
CREATE TABLE IF NOT EXISTS coating_calculation_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calculation_id UUID REFERENCES coating_calculations(id) ON DELETE CASCADE,
  
  -- Material Info
  material_id UUID,
  material_name VARCHAR NOT NULL,
  material_type VARCHAR, -- primer, intermediate, finish
  manufacturer VARCHAR,
  
  -- Application Details
  coats INTEGER DEFAULT 1,
  thickness_per_coat INTEGER, -- microns
  total_thickness INTEGER, -- microns
  coverage_rate DECIMAL(8,2), -- m²/liter
  
  -- Quantities
  volume_solids DECIMAL(5,2), -- percentage
  theoretical_usage DECIMAL(10,2), -- liters
  loss_factor DECIMAL(5,2) DEFAULT 30, -- percentage
  practical_usage DECIMAL(10,2), -- liters
  
  -- Packaging
  package_size DECIMAL(8,2), -- liters
  packages_needed INTEGER,
  
  -- Costs
  price_per_liter DECIMAL(10,2),
  total_price DECIMAL(15,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_calc_materials_calculation_id ON coating_calculation_materials(calculation_id);

-- =====================================================
-- 3. PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Information
  project_code VARCHAR UNIQUE,
  project_name VARCHAR NOT NULL,
  description TEXT,
  
  -- Related Entities
  company_id UUID REFERENCES companies(id),
  quote_id UUID,
  calculation_id UUID REFERENCES coating_calculations(id),
  
  -- Project Details
  project_type VARCHAR, -- supply_only, supply_apply, application_only
  contract_value DECIMAL(15,2),
  status VARCHAR DEFAULT 'planning', -- planning, in_progress, on_hold, completed, cancelled
  
  -- Timeline
  start_date DATE,
  end_date DATE,
  actual_start_date DATE,
  actual_end_date DATE,
  
  -- Progress
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  
  -- Location
  site_address TEXT,
  site_city VARCHAR,
  gps_latitude DECIMAL(10,7),
  gps_longitude DECIMAL(10,7),
  
  -- Team
  project_manager_id UUID REFERENCES users(id),
  foreman_id UUID REFERENCES users(id),
  
  -- Financial
  invoiced_amount DECIMAL(15,2) DEFAULT 0,
  paid_amount DECIMAL(15,2) DEFAULT 0,
  retention_amount DECIMAL(15,2) DEFAULT 0,
  
  -- Risk Management
  risk_level VARCHAR DEFAULT 'low', -- low, medium, high
  issues_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_company_id ON projects(company_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_project_manager ON projects(project_manager_id);

-- Project Milestones
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  milestone_name VARCHAR NOT NULL,
  description TEXT,
  sequence_number INTEGER,
  
  -- Progress
  status VARCHAR DEFAULT 'pending', -- pending, in_progress, completed
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  
  -- Timeline
  planned_start_date DATE,
  planned_end_date DATE,
  actual_start_date DATE,
  actual_end_date DATE,
  
  -- Financial
  milestone_value DECIMAL(15,2),
  invoice_percentage DECIMAL(5,2),
  is_invoiced BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_milestones_project_id ON project_milestones(project_id);

-- Project Team Members
CREATE TABLE IF NOT EXISTS project_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  role VARCHAR, -- project_manager, foreman, applicator, qc_inspector
  assigned_date DATE DEFAULT CURRENT_DATE,
  removed_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_team_members_project_id ON project_team_members(project_id);
CREATE INDEX idx_team_members_user_id ON project_team_members(user_id);

-- =====================================================
-- 4. QUOTES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number VARCHAR UNIQUE,
  
  -- Related Entities
  company_id UUID REFERENCES companies(id),
  contact_id UUID REFERENCES contacts(id),
  calculation_id UUID REFERENCES coating_calculations(id),
  lead_id UUID REFERENCES leads(id),
  
  -- Quote Details
  title VARCHAR NOT NULL,
  description TEXT,
  
  -- Validity
  issue_date DATE DEFAULT CURRENT_DATE,
  valid_until DATE,
  
  -- Terms
  payment_terms VARCHAR,
  delivery_terms VARCHAR,
  warranty_terms TEXT,
  special_conditions TEXT,
  
  -- Amounts
  subtotal DECIMAL(15,2),
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  discount_amount DECIMAL(15,2) DEFAULT 0,
  tax_percentage DECIMAL(5,2) DEFAULT 11, -- PPN 11%
  tax_amount DECIMAL(15,2),
  total_amount DECIMAL(15,2),
  
  -- Status
  status VARCHAR DEFAULT 'draft', -- draft, sent, viewed, accepted, rejected, expired
  sent_date TIMESTAMPTZ,
  viewed_date TIMESTAMPTZ,
  decided_date TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Versioning
  version INTEGER DEFAULT 1,
  parent_quote_id UUID REFERENCES quotes(id),
  
  -- Metadata
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quotes_company_id ON quotes(company_id);
CREATE INDEX idx_quotes_lead_id ON quotes(lead_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_quote_number ON quotes(quote_number);

-- Quote Items
CREATE TABLE IF NOT EXISTS quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  
  -- Item Details
  item_type VARCHAR, -- material, labor, equipment, other
  item_code VARCHAR,
  description TEXT NOT NULL,
  
  -- Quantities
  quantity DECIMAL(10,2),
  unit VARCHAR,
  unit_price DECIMAL(15,2),
  
  -- Amounts
  subtotal DECIMAL(15,2),
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  total DECIMAL(15,2),
  
  -- Ordering
  sequence_number INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quote_items_quote_id ON quote_items(quote_id);

-- Lead-Quote Junction Table
CREATE TABLE IF NOT EXISTS lead_quotes (
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (lead_id, quote_id)
);

-- =====================================================
-- 5. MATERIALS MASTER DATA
-- =====================================================
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Information
  material_code VARCHAR UNIQUE,
  product_name VARCHAR NOT NULL,
  product_type VARCHAR, -- epoxy, polyurethane, alkyd, etc.
  category VARCHAR, -- primer, intermediate, finish
  manufacturer VARCHAR NOT NULL,
  
  -- Technical Specifications
  volume_solids DECIMAL(5,2), -- percentage
  specific_gravity DECIMAL(5,3),
  flash_point DECIMAL(5,2), -- celsius
  pot_life_hours DECIMAL(5,2),
  
  -- Coverage and DFT
  theoretical_coverage DECIMAL(8,2), -- m²/liter at specified DFT
  recommended_dft_min INTEGER, -- microns
  recommended_dft_max INTEGER, -- microns
  
  -- Application
  application_method VARCHAR[], -- brush, roller, spray
  thinner_type VARCHAR,
  thinning_ratio_min DECIMAL(5,2), -- percentage
  thinning_ratio_max DECIMAL(5,2), -- percentage
  
  -- Drying Times (at 25°C)
  touch_dry_hours DECIMAL(5,2),
  hard_dry_hours DECIMAL(5,2),
  recoat_min_hours DECIMAL(5,2),
  recoat_max_hours DECIMAL(5,2),
  full_cure_days INTEGER,
  
  -- Packaging and Pricing
  standard_pack_size DECIMAL(8,2), -- liters
  price_per_liter DECIMAL(10,2),
  currency VARCHAR DEFAULT 'IDR',
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  discontinued_date DATE,
  replacement_material_id UUID REFERENCES materials(id),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_materials_manufacturer ON materials(manufacturer);
CREATE INDEX idx_materials_category ON materials(category);
CREATE INDEX idx_materials_product_type ON materials(product_type);

-- Material Compatibility
CREATE TABLE IF NOT EXISTS material_compatibility (
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
  compatible_with_id UUID REFERENCES materials(id) ON DELETE CASCADE,
  compatibility_type VARCHAR, -- primer_for, intermediate_for, topcoat_for
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (material_id, compatible_with_id)
);

-- =====================================================
-- 6. SUPPORTING TABLES
-- =====================================================

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR UNIQUE,
  
  -- Related Entities
  project_id UUID REFERENCES projects(id),
  quote_id UUID REFERENCES quotes(id),
  company_id UUID REFERENCES companies(id),
  
  -- Invoice Details
  invoice_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  
  -- Amounts
  subtotal DECIMAL(15,2),
  tax_amount DECIMAL(15,2),
  total_amount DECIMAL(15,2),
  paid_amount DECIMAL(15,2) DEFAULT 0,
  
  -- Status
  status VARCHAR DEFAULT 'draft', -- draft, sent, partial, paid, overdue, cancelled
  
  -- Payment
  payment_date DATE,
  payment_method VARCHAR,
  payment_reference VARCHAR,
  
  -- Metadata
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_project_id ON invoices(project_id);
CREATE INDEX idx_invoices_company_id ON invoices(company_id);
CREATE INDEX idx_invoices_status ON invoices(status);

-- Warranties
CREATE TABLE IF NOT EXISTS warranties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warranty_number VARCHAR UNIQUE,
  
  -- Related Entities
  project_id UUID REFERENCES projects(id),
  company_id UUID REFERENCES companies(id),
  
  -- Warranty Details
  start_date DATE,
  end_date DATE,
  warranty_years INTEGER,
  
  -- Coverage
  coverage_type VARCHAR, -- full, limited, materials_only
  coverage_details TEXT,
  exclusions TEXT,
  
  -- Status
  status VARCHAR DEFAULT 'active', -- active, expired, voided
  
  -- Claims
  claims_count INTEGER DEFAULT 0,
  last_claim_date DATE,
  
  -- Metadata
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_warranties_project_id ON warranties(project_id);
CREATE INDEX idx_warranties_company_id ON warranties(company_id);
CREATE INDEX idx_warranties_status ON warranties(status);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Related Entity (polymorphic)
  entity_type VARCHAR, -- project, quote, invoice, warranty
  entity_id UUID,
  
  -- Document Info
  document_type VARCHAR, -- contract, po, technical_sheet, msds, certificate, photo
  document_name VARCHAR NOT NULL,
  file_url TEXT,
  file_size INTEGER,
  mime_type VARCHAR,
  
  -- Metadata
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_entity ON documents(entity_type, entity_id);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Recipient
  user_id UUID REFERENCES users(id),
  
  -- Notification Details
  type VARCHAR, -- follow_up, deadline, approval, system
  title VARCHAR NOT NULL,
  message TEXT,
  
  -- Related Entity (polymorphic)
  entity_type VARCHAR,
  entity_id UUID,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  -- Action
  action_url TEXT,
  action_label VARCHAR,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Temperature History (for coating conditions)
CREATE TABLE IF NOT EXISTS temperature_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  
  -- Measurements
  temperature DECIMAL(5,2), -- celsius
  humidity DECIMAL(5,2), -- percentage
  dew_point DECIMAL(5,2), -- celsius
  substrate_temp DECIMAL(5,2), -- celsius
  
  -- Conditions
  weather_condition VARCHAR,
  wind_speed DECIMAL(5,2), -- m/s
  
  -- Location
  measurement_location VARCHAR,
  gps_latitude DECIMAL(10,7),
  gps_longitude DECIMAL(10,7),
  
  -- Metadata
  measured_by UUID REFERENCES users(id),
  measured_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_temperature_project_id ON temperature_history(project_id);

-- =====================================================
-- 7. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coating_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coating_calculation_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE temperature_history ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (can be refined based on requirements)
-- View policies (most data viewable by all authenticated users)
CREATE POLICY "Users can view all calculations" ON coating_calculations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view all projects" ON projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view all quotes" ON quotes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view all materials" ON materials FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can view their profile" ON profiles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Insert policies
CREATE POLICY "Users can create calculations" ON coating_calculations FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can create quotes" ON quotes FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can create projects" ON projects FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'project_manager'))
);

-- Update policies
CREATE POLICY "Users can update their calculations" ON coating_calculations FOR UPDATE TO authenticated USING (created_by = auth.uid());
CREATE POLICY "Users can update their quotes" ON quotes FOR UPDATE TO authenticated USING (created_by = auth.uid());
CREATE POLICY "Project managers can update projects" ON projects FOR UPDATE TO authenticated USING (
  project_manager_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- =====================================================
-- 8. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Auto-generate quote numbers
CREATE OR REPLACE FUNCTION generate_quote_number() RETURNS TRIGGER AS $$
BEGIN
  NEW.quote_number := 'QT-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || LPAD(NEXTVAL('quote_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS quote_number_seq;

CREATE TRIGGER trg_generate_quote_number
  BEFORE INSERT ON quotes
  FOR EACH ROW
  WHEN (NEW.quote_number IS NULL)
  EXECUTE FUNCTION generate_quote_number();

-- Auto-generate project codes
CREATE OR REPLACE FUNCTION generate_project_code() RETURNS TRIGGER AS $$
BEGIN
  NEW.project_code := 'PRJ-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || LPAD(NEXTVAL('project_code_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS project_code_seq;

CREATE TRIGGER trg_generate_project_code
  BEFORE INSERT ON projects
  FOR EACH ROW
  WHEN (NEW.project_code IS NULL)
  EXECUTE FUNCTION generate_project_code();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_calculations_updated_at BEFORE UPDATE ON coating_calculations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- 9. GRANT PERMISSIONS
-- =====================================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- =====================================================
-- 10. SAMPLE DATA
-- =====================================================

-- Insert sample materials
INSERT INTO materials (
  material_code, product_name, product_type, category, manufacturer,
  volume_solids, theoretical_coverage, recommended_dft_min, recommended_dft_max,
  price_per_liter, is_active
) VALUES 
  ('NIP-EP-PR-001', 'Nippon EA4 Primer', 'Epoxy', 'primer', 'NIPPON', 65, 8.5, 75, 100, 185000, true),
  ('NIP-EP-IN-001', 'Nippon EA4 Intermediate', 'Epoxy', 'intermediate', 'NIPPON', 65, 8.5, 75, 100, 195000, true),
  ('NIP-PU-FN-001', 'Nippon Polyurethane Finish', 'Polyurethane', 'finish', 'NIPPON', 55, 10.5, 50, 75, 225000, true),
  ('JOT-EP-PR-001', 'Jotamastic 90', 'Epoxy', 'primer', 'JOTUN', 70, 7.8, 100, 150, 210000, true),
  ('JOT-PU-FN-001', 'Hardtop XP', 'Polyurethane', 'finish', 'JOTUN', 58, 9.8, 50, 80, 245000, true)
ON CONFLICT (material_code) DO NOTHING;

SELECT 'All missing tables created successfully!' as status;