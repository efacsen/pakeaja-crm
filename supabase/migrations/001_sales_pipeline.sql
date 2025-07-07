-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table if not exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'sales_rep',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  territory TEXT,
  npwp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leads/opportunities table with temperature tracking
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id),
  
  -- Basic Info
  project_name TEXT NOT NULL,
  project_description TEXT,
  project_address TEXT,
  
  -- Deal Details
  deal_type TEXT CHECK (deal_type IN ('supply', 'apply', 'supply_apply')),
  stage TEXT DEFAULT 'lead' CHECK (stage IN ('lead', 'qualified', 'negotiation', 'closing', 'won', 'lost')),
  sub_stage TEXT,
  
  -- Temperature Tracking
  temperature DECIMAL DEFAULT 0,
  temperature_status TEXT DEFAULT 'cold' CHECK (temperature_status IN ('cold', 'warm', 'hot', 'critical')),
  stage_entered_at TIMESTAMPTZ DEFAULT NOW(),
  days_in_stage INTEGER GENERATED ALWAYS AS (
    EXTRACT(DAY FROM NOW() - stage_entered_at)::INTEGER
  ) STORED,
  
  -- Financial
  estimated_value DECIMAL,
  quoted_value DECIMAL,
  final_value DECIMAL,
  currency TEXT DEFAULT 'IDR',
  probability INTEGER DEFAULT 10,
  margin_percentage DECIMAL,
  
  -- Sales Info
  assigned_to UUID REFERENCES public.profiles(id),
  source TEXT,
  campaign TEXT,
  competitor_info TEXT,
  
  -- Dates
  expected_close_date DATE,
  actual_close_date DATE,
  
  -- Win/Loss Tracking
  won_date TIMESTAMPTZ,
  lost_date TIMESTAMPTZ,
  lost_reason TEXT,
  lost_competitor TEXT,
  lost_notes TEXT,
  
  -- After Sales
  after_sales_status TEXT,
  po_number TEXT,
  po_date DATE,
  delivery_date DATE,
  payment_terms TEXT,
  payment_status TEXT,
  
  -- Commission Tracking
  commission_calculated BOOLEAN DEFAULT FALSE,
  commission_amount DECIMAL,
  commission_paid_date DATE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id)
);

-- Create temperature history table
CREATE TABLE IF NOT EXISTS public.temperature_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  from_temperature DECIMAL,
  to_temperature DECIMAL,
  from_status TEXT,
  to_status TEXT,
  trigger_event TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  changed_by UUID REFERENCES public.profiles(id)
);

-- Create activities table
CREATE TABLE IF NOT EXISTS public.lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_date TIMESTAMPTZ DEFAULT NOW(),
  title TEXT,
  description TEXT,
  outcome TEXT,
  next_action TEXT,
  next_action_date DATE,
  temperature_impact INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS public.lead_quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  quote_number TEXT UNIQUE NOT NULL,
  version INTEGER DEFAULT 1,
  
  -- Quote Details
  items JSONB,
  subtotal DECIMAL,
  tax_amount DECIMAL,
  total_amount DECIMAL,
  
  -- Terms
  validity_days INTEGER DEFAULT 30,
  payment_terms TEXT,
  delivery_terms TEXT,
  notes TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
  sent_date TIMESTAMPTZ,
  viewed_date TIMESTAMPTZ,
  response_date TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id)
);

-- Create after sales activities table
CREATE TABLE IF NOT EXISTS public.after_sales_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_date TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  status TEXT,
  created_by UUID REFERENCES public.profiles(id)
);

-- Create commission settings table
CREATE TABLE IF NOT EXISTS public.commission_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_type TEXT NOT NULL,
  min_achievement DECIMAL,
  max_achievement DECIMAL,
  commission_rate DECIMAL,
  sales_portion DECIMAL DEFAULT 0.85,
  admin_portion DECIMAL DEFAULT 0.15,
  effective_from DATE,
  effective_to DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sales targets table
CREATE TABLE IF NOT EXISTS public.sales_targets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sales_rep_id UUID REFERENCES public.profiles(id),
  month INTEGER,
  year INTEGER,
  target_amount DECIMAL,
  achieved_amount DECIMAL DEFAULT 0,
  achievement_percentage DECIMAL GENERATED ALWAYS AS (
    CASE WHEN target_amount > 0 THEN (achieved_amount / target_amount * 100) ELSE 0 END
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX idx_leads_stage ON public.leads(stage);
CREATE INDEX idx_leads_temperature ON public.leads(temperature);
CREATE INDEX idx_leads_customer ON public.leads(customer_id);
CREATE INDEX idx_activities_lead ON public.lead_activities(lead_id);
CREATE INDEX idx_activities_date ON public.lead_activities(activity_date);

-- Create views for common queries
CREATE OR REPLACE VIEW public.pipeline_summary AS
SELECT 
  stage,
  COUNT(*) as count,
  SUM(estimated_value) as total_value,
  AVG(temperature) as avg_temperature,
  AVG(days_in_stage) as avg_days_in_stage
FROM public.leads
WHERE stage NOT IN ('won', 'lost')
GROUP BY stage;

CREATE OR REPLACE VIEW public.sales_performance AS
SELECT 
  p.id,
  p.full_name,
  COUNT(CASE WHEN l.stage = 'won' THEN 1 END) as deals_won,
  COUNT(CASE WHEN l.stage = 'lost' THEN 1 END) as deals_lost,
  SUM(CASE WHEN l.stage = 'won' THEN l.final_value ELSE 0 END) as revenue,
  AVG(CASE WHEN l.stage IN ('won', 'lost') THEN l.probability END) as avg_close_rate
FROM public.profiles p
LEFT JOIN public.leads l ON l.assigned_to = p.id
WHERE p.role IN ('sales_rep', 'sales_manager')
GROUP BY p.id, p.full_name;

-- Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temperature_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.after_sales_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads
CREATE POLICY "Sales reps can view all leads" ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sales reps can edit their own leads" ON public.leads
  FOR UPDATE
  TO authenticated
  USING (assigned_to = auth.uid());

CREATE POLICY "Sales managers can edit all leads" ON public.leads
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'sales_manager'
  ));

-- Functions for temperature management
CREATE OR REPLACE FUNCTION update_lead_temperature()
RETURNS TRIGGER AS $$
DECLARE
  old_status TEXT;
  new_status TEXT;
BEGIN
  -- Determine temperature status based on temperature value
  IF NEW.temperature <= 25 THEN
    NEW.temperature_status = 'cold';
  ELSIF NEW.temperature <= 50 THEN
    NEW.temperature_status = 'warm';
  ELSIF NEW.temperature <= 75 THEN
    NEW.temperature_status = 'hot';
  ELSE
    NEW.temperature_status = 'critical';
  END IF;
  
  -- Record temperature change if significant
  IF OLD.temperature IS DISTINCT FROM NEW.temperature THEN
    INSERT INTO public.temperature_history (
      lead_id, 
      from_temperature, 
      to_temperature,
      from_status,
      to_status,
      changed_by
    ) VALUES (
      NEW.id,
      OLD.temperature,
      NEW.temperature,
      OLD.temperature_status,
      NEW.temperature_status,
      NEW.updated_by
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for temperature updates
CREATE TRIGGER update_lead_temperature_trigger
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  WHEN (OLD.temperature IS DISTINCT FROM NEW.temperature)
  EXECUTE FUNCTION update_lead_temperature();

-- Function to calculate commission
CREATE OR REPLACE FUNCTION calculate_commission(
  p_sales_rep_id UUID,
  p_month INTEGER,
  p_year INTEGER
) RETURNS TABLE (
  total_sales DECIMAL,
  achievement_rate DECIMAL,
  commission_rate DECIMAL,
  commission_amount DECIMAL,
  sales_portion DECIMAL,
  admin_portion DECIMAL
) AS $$
DECLARE
  v_target DECIMAL;
  v_achieved DECIMAL;
  v_achievement_rate DECIMAL;
  v_commission_rate DECIMAL;
  v_commission_amount DECIMAL;
BEGIN
  -- Get target
  SELECT target_amount INTO v_target
  FROM public.sales_targets
  WHERE sales_rep_id = p_sales_rep_id
    AND month = p_month
    AND year = p_year;
  
  -- Calculate achieved amount (payments received)
  SELECT SUM(final_value) INTO v_achieved
  FROM public.leads
  WHERE assigned_to = p_sales_rep_id
    AND EXTRACT(MONTH FROM won_date) = p_month
    AND EXTRACT(YEAR FROM won_date) = p_year
    AND stage = 'won'
    AND payment_status = 'paid';
  
  -- Calculate achievement rate
  v_achievement_rate := CASE 
    WHEN v_target > 0 THEN (v_achieved / v_target * 100)
    ELSE 0
  END;
  
  -- Get commission rate based on achievement
  SELECT commission_rate INTO v_commission_rate
  FROM public.commission_settings
  WHERE deal_type = 'supply'
    AND v_achievement_rate >= min_achievement
    AND v_achievement_rate < max_achievement
    AND CURRENT_DATE BETWEEN effective_from AND COALESCE(effective_to, CURRENT_DATE)
  LIMIT 1;
  
  -- Calculate commission
  v_commission_amount := v_achieved * v_commission_rate / 100;
  
  RETURN QUERY
  SELECT 
    v_achieved,
    v_achievement_rate,
    v_commission_rate,
    v_commission_amount,
    v_commission_amount * 0.85,
    v_commission_amount * 0.15;
END;
$$ LANGUAGE plpgsql;

-- Insert default commission settings
INSERT INTO public.commission_settings (deal_type, min_achievement, max_achievement, commission_rate, effective_from)
VALUES 
  ('supply', 0, 80, 0.5, CURRENT_DATE),
  ('supply', 80, 100, 1.0, CURRENT_DATE),
  ('supply', 100, 120, 1.0, CURRENT_DATE),
  ('supply', 120, 999999, 1.25, CURRENT_DATE),
  ('supply_apply', 0, 999999, 1.0, CURRENT_DATE);