-- ============================================================================
-- PAKEAJA CRM - COMPLETE DATABASE SETUP
-- ============================================================================
-- Copy this entire script and paste it into Supabase SQL Editor
-- Then click "Run" to create all tables, policies, and storage

-- ============================================================================
-- 1. ENABLE EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. CREATE CUSTOM TYPES
-- ============================================================================
CREATE TYPE user_role AS ENUM ('sales_rep', 'sales_manager', 'admin', 'field_sales', 'estimator');
CREATE TYPE lead_stage AS ENUM ('lead', 'qualified', 'negotiation', 'closing', 'won', 'lost');
CREATE TYPE lead_temperature_status AS ENUM ('cold', 'warm', 'hot', 'critical');
CREATE TYPE deal_type AS ENUM ('supply', 'apply', 'supply_apply');
CREATE TYPE activity_type AS ENUM (
  'phone_call', 'email_sent', 'meeting_scheduled', 'meeting_completed',
  'quote_sent', 'site_visit', 'check_availability', 'apply_discount',
  'quote_revised', 'escalate_manager', 'request_po', 'extend_timeline',
  'follow_up', 'note_added'
);
CREATE TYPE canvassing_outcome AS ENUM (
  'interested', 'not_interested', 'follow_up_needed', 
  'already_customer', 'competitor_locked'
);
CREATE TYPE canvassing_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE project_segment AS ENUM (
  'residential', 'commercial', 'industrial', 
  'infrastructure', 'marine', 'others'
);

-- ============================================================================
-- 3. CREATE CORE TABLES
-- ============================================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'sales_rep',
  full_name TEXT NOT NULL,
  phone TEXT,
  territory TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE public.customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  territory TEXT,
  npwp TEXT, -- Indonesian tax number
  notes TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Canvassing Reports table
CREATE TABLE public.canvassing_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  company_name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT NOT NULL,
  gps_coordinates TEXT,
  
  -- Visit details
  visit_date DATE NOT NULL,
  visit_time TIME,
  duration_minutes INTEGER,
  
  -- Business info
  business_type TEXT,
  project_segment project_segment,
  project_value DECIMAL(15,2),
  timeline_months INTEGER,
  
  -- Interaction
  outcome canvassing_outcome NOT NULL,
  decision_maker_met BOOLEAN DEFAULT false,
  competitors_mentioned TEXT[],
  pain_points TEXT,
  opportunities TEXT,
  
  -- Follow-up
  priority canvassing_priority DEFAULT 'medium',
  follow_up_date DATE,
  next_action TEXT,
  
  -- Photos and documents
  photo_urls TEXT[],
  notes TEXT,
  
  -- Auto-fields
  converted_to_lead BOOLEAN DEFAULT false,
  lead_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table
CREATE TABLE public.leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id),
  canvassing_report_id UUID REFERENCES public.canvassing_reports(id),
  assigned_to UUID REFERENCES public.users(id),
  
  -- Lead info
  title TEXT NOT NULL,
  description TEXT,
  stage lead_stage DEFAULT 'lead',
  temperature lead_temperature_status DEFAULT 'cold',
  deal_type deal_type DEFAULT 'supply_apply',
  
  -- Business details
  project_name TEXT,
  project_segment project_segment,
  estimated_value DECIMAL(15,2),
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  
  -- Contact info
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  company_name TEXT,
  address TEXT,
  
  -- Auto-calculated fields
  days_in_stage INTEGER DEFAULT 0,
  last_activity_date TIMESTAMPTZ,
  activity_count INTEGER DEFAULT 0,
  
  -- Metadata
  source TEXT DEFAULT 'canvassing',
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  won_at TIMESTAMPTZ,
  lost_at TIMESTAMPTZ,
  lost_reason TEXT
);

-- Activities table
CREATE TABLE public.activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  
  -- Activity details
  type activity_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  
  -- Scheduling
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  
  -- Outcomes
  outcome TEXT,
  next_action TEXT,
  follow_up_date DATE,
  
  -- Metadata
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments table (for collaboration)
CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  parent_id UUID REFERENCES public.comments(id), -- For threading
  
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT true, -- false for client-visible comments
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX idx_canvassing_reports_user_date ON public.canvassing_reports(user_id, visit_date DESC);
CREATE INDEX idx_canvassing_reports_outcome ON public.canvassing_reports(outcome);
CREATE INDEX idx_canvassing_reports_follow_up ON public.canvassing_reports(follow_up_date) WHERE follow_up_date IS NOT NULL;

CREATE INDEX idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX idx_leads_stage ON public.leads(stage);
CREATE INDEX idx_leads_temperature ON public.leads(temperature);
CREATE INDEX idx_leads_close_date ON public.leads(expected_close_date);
CREATE INDEX idx_leads_last_activity ON public.leads(last_activity_date DESC);

CREATE INDEX idx_activities_lead_id ON public.activities(lead_id);
CREATE INDEX idx_activities_user_id ON public.activities(user_id);
CREATE INDEX idx_activities_scheduled ON public.activities(scheduled_at) WHERE scheduled_at IS NOT NULL;

CREATE INDEX idx_comments_lead_id ON public.comments(lead_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id) WHERE parent_id IS NOT NULL;

-- ============================================================================
-- 5. CREATE TRIGGERS FOR AUTO-UPDATES
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_canvassing_reports_updated_at BEFORE UPDATE ON public.canvassing_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update lead metrics when activities change
CREATE OR REPLACE FUNCTION update_lead_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update activity count and last activity date
  UPDATE public.leads 
  SET 
    activity_count = (
      SELECT COUNT(*) 
      FROM public.activities 
      WHERE lead_id = COALESCE(NEW.lead_id, OLD.lead_id)
    ),
    last_activity_date = (
      SELECT MAX(created_at) 
      FROM public.activities 
      WHERE lead_id = COALESCE(NEW.lead_id, OLD.lead_id)
    )
  WHERE id = COALESCE(NEW.lead_id, OLD.lead_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lead_metrics_trigger 
  AFTER INSERT OR UPDATE OR DELETE ON public.activities 
  FOR EACH ROW EXECUTE FUNCTION update_lead_metrics();

-- Function to auto-calculate days in stage
CREATE OR REPLACE FUNCTION calculate_days_in_stage()
RETURNS TRIGGER AS $$
BEGIN
  -- Reset days in stage when stage changes
  IF OLD.stage != NEW.stage THEN
    NEW.days_in_stage = 0;
  ELSE
    NEW.days_in_stage = EXTRACT(DAY FROM NOW() - NEW.updated_at);
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_days_in_stage_trigger 
  BEFORE UPDATE ON public.leads 
  FOR EACH ROW EXECUTE FUNCTION calculate_days_in_stage();

-- ============================================================================
-- 6. ENABLE ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canvassing_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 7. CREATE RLS POLICIES
-- ============================================================================

-- Users policies
CREATE POLICY "Users can view their own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Admin and managers can see all users
CREATE POLICY "Admins and managers can view all users" ON public.users FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'sales_manager')
    )
  );

-- Customers policies
CREATE POLICY "Users can view customers they created" ON public.customers FOR SELECT 
  USING (created_by = auth.uid());

CREATE POLICY "Users can create customers" ON public.customers FOR INSERT 
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update customers they created" ON public.customers FOR UPDATE 
  USING (created_by = auth.uid());

-- Managers can see all customers
CREATE POLICY "Managers can view all customers" ON public.customers FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'sales_manager')
    )
  );

-- Canvassing reports policies
CREATE POLICY "Users can view their own canvassing reports" ON public.canvassing_reports FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own canvassing reports" ON public.canvassing_reports FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own canvassing reports" ON public.canvassing_reports FOR UPDATE 
  USING (user_id = auth.uid());

-- Managers can see all canvassing reports
CREATE POLICY "Managers can view all canvassing reports" ON public.canvassing_reports FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'sales_manager')
    )
  );

-- Leads policies
CREATE POLICY "Users can view assigned leads" ON public.leads FOR SELECT 
  USING (assigned_to = auth.uid());

CREATE POLICY "Users can update assigned leads" ON public.leads FOR UPDATE 
  USING (assigned_to = auth.uid());

CREATE POLICY "Users can create leads" ON public.leads FOR INSERT 
  WITH CHECK (assigned_to = auth.uid());

-- Managers can see all leads
CREATE POLICY "Managers can view all leads" ON public.leads FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'sales_manager')
    )
  );

-- Activities policies
CREATE POLICY "Users can view activities for their leads" ON public.activities FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.leads 
      WHERE id = activities.lead_id 
      AND assigned_to = auth.uid()
    )
  );

CREATE POLICY "Users can create activities" ON public.activities FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own activities" ON public.activities FOR UPDATE 
  USING (user_id = auth.uid());

-- Comments policies
CREATE POLICY "Users can view comments on their leads" ON public.comments FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.leads 
      WHERE id = comments.lead_id 
      AND assigned_to = auth.uid()
    )
  );

CREATE POLICY "Users can create comments" ON public.comments FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE 
  USING (user_id = auth.uid());

-- ============================================================================
-- 8. CREATE STORAGE BUCKET AND POLICIES
-- ============================================================================

-- Insert storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('canvassing-photos', 'canvassing-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Authenticated users can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'canvassing-photos' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Authenticated users can view photos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'canvassing-photos' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can update their own photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'canvassing-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'canvassing-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- 9. INSERT SAMPLE DATA (OPTIONAL)
-- ============================================================================

-- This will be populated when users register through the app
-- You can add sample data here if needed for testing

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- Your PakeAja CRM database is now ready!
-- 
-- Next steps:
-- 1. Go to your app: https://pakeaja-crm.vercel.app
-- 2. Register a new account (this will create your first user)
-- 3. Start using the CRM features
-- 
-- Tables created:
-- - users (user management)
-- - customers (customer data)
-- - canvassing_reports (field sales reports)  
-- - leads (sales pipeline)
-- - activities (sales activities)
-- - comments (collaboration)
-- - canvassing-photos (storage bucket)
-- ============================================================================