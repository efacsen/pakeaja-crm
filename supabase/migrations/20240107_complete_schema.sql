-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
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

-- Canvassing reports table
CREATE TABLE public.canvassing_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  visit_date DATE NOT NULL,
  company_name TEXT NOT NULL,
  company_address TEXT,
  contact_person TEXT NOT NULL,
  contact_position TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  visit_outcome canvassing_outcome NOT NULL,
  project_segment project_segment NOT NULL,
  priority canvassing_priority DEFAULT 'medium',
  potential_type TEXT CHECK (potential_type IN ('area', 'materials', 'value')),
  potential_area NUMERIC,
  potential_materials TEXT,
  potential_value NUMERIC,
  current_supplier TEXT,
  competitor_price NUMERIC,
  decision_timeline TEXT,
  next_action TEXT,
  next_action_date DATE,
  general_notes TEXT,
  gps_latitude NUMERIC,
  gps_longitude NUMERIC,
  is_synced BOOLEAN DEFAULT true,
  sales_rep_id UUID REFERENCES public.users(id) NOT NULL,
  sales_rep_name TEXT NOT NULL,
  lead_id UUID, -- Reference to created lead
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Canvassing photos table
CREATE TABLE public.canvassing_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  report_id UUID REFERENCES public.canvassing_reports(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads/Pipeline table
CREATE TABLE public.leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id),
  project_name TEXT NOT NULL,
  project_description TEXT,
  project_address TEXT,
  deal_type deal_type NOT NULL,
  stage lead_stage NOT NULL DEFAULT 'lead',
  temperature INTEGER DEFAULT 20,
  temperature_status lead_temperature_status DEFAULT 'cold',
  probability INTEGER DEFAULT 20,
  estimated_value NUMERIC,
  expected_close_date DATE,
  source TEXT,
  is_from_canvassing BOOLEAN DEFAULT false,
  canvassing_report_id UUID REFERENCES public.canvassing_reports(id),
  assigned_to UUID REFERENCES public.users(id) NOT NULL,
  created_by UUID REFERENCES public.users(id),
  won_date DATE,
  lost_date DATE,
  lost_reason TEXT,
  lost_competitor TEXT,
  lost_notes TEXT,
  actual_value NUMERIC,
  stage_entered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lead activities table
CREATE TABLE public.lead_activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  outcome TEXT,
  next_action TEXT,
  next_action_date DATE,
  temperature_impact INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lead comments table (with threading support)
CREATE TABLE public.lead_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.lead_comments(id),
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.users(id) NOT NULL,
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comment mentions table
CREATE TABLE public.comment_mentions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  comment_id UUID REFERENCES public.lead_comments(id) ON DELETE CASCADE,
  mentioned_user_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comment read status table
CREATE TABLE public.comment_read_status (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  comment_id UUID REFERENCES public.lead_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_canvassing_reports_sales_rep ON canvassing_reports(sales_rep_id);
CREATE INDEX idx_canvassing_reports_outcome ON canvassing_reports(visit_outcome);
CREATE INDEX idx_canvassing_reports_date ON canvassing_reports(visit_date DESC);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_leads_customer ON leads(customer_id);
CREATE INDEX idx_lead_activities_lead ON lead_activities(lead_id);
CREATE INDEX idx_lead_activities_date ON lead_activities(created_at DESC);
CREATE INDEX idx_lead_comments_lead ON lead_comments(lead_id);
CREATE INDEX idx_comment_read_status_user ON comment_read_status(user_id);

-- Create views for easier querying
CREATE OR REPLACE VIEW lead_stats AS
SELECT 
  l.id,
  l.stage,
  l.temperature,
  l.temperature_status,
  l.probability,
  l.estimated_value,
  l.assigned_to,
  u.full_name as assigned_to_name,
  COUNT(DISTINCT la.id) as activity_count,
  COUNT(DISTINCT lc.id) as comment_count,
  COUNT(DISTINCT lc.id) FILTER (WHERE crs.user_id IS NULL) as unread_comment_count,
  MAX(la.created_at) as last_activity_at,
  MAX(lc.created_at) as last_comment_at,
  EXTRACT(DAY FROM NOW() - l.stage_entered_at) as days_in_stage
FROM leads l
LEFT JOIN users u ON l.assigned_to = u.id
LEFT JOIN lead_activities la ON l.id = la.lead_id
LEFT JOIN lead_comments lc ON l.id = lc.lead_id AND NOT lc.is_deleted
LEFT JOIN comment_read_status crs ON lc.id = crs.comment_id AND crs.user_id = l.assigned_to
GROUP BY l.id, u.full_name;

-- Create function to update temperature based on activity
CREATE OR REPLACE FUNCTION update_lead_temperature()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE leads
  SET 
    temperature = GREATEST(0, LEAST(100, temperature + NEW.temperature_impact)),
    temperature_status = CASE
      WHEN temperature + NEW.temperature_impact >= 80 THEN 'critical'::lead_temperature_status
      WHEN temperature + NEW.temperature_impact >= 60 THEN 'hot'::lead_temperature_status
      WHEN temperature + NEW.temperature_impact >= 40 THEN 'warm'::lead_temperature_status
      ELSE 'cold'::lead_temperature_status
    END,
    updated_at = NOW()
  WHERE id = NEW.lead_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lead_temperature_trigger
AFTER INSERT ON lead_activities
FOR EACH ROW
EXECUTE FUNCTION update_lead_temperature();

-- Create function to auto-update probability based on stage
CREATE OR REPLACE FUNCTION update_lead_probability()
RETURNS TRIGGER AS $$
BEGIN
  NEW.probability = CASE NEW.stage
    WHEN 'lead' THEN 20
    WHEN 'qualified' THEN 40
    WHEN 'negotiation' THEN 60
    WHEN 'closing' THEN 80
    WHEN 'won' THEN 100
    WHEN 'lost' THEN 0
    ELSE NEW.probability
  END;
  
  NEW.stage_entered_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lead_probability_trigger
BEFORE UPDATE OF stage ON leads
FOR EACH ROW
EXECUTE FUNCTION update_lead_probability();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_canvassing_reports_updated_at BEFORE UPDATE ON canvassing_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lead_comments_updated_at BEFORE UPDATE ON lead_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();