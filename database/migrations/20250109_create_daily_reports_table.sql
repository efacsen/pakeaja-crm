-- Create daily_reports table for sales team daily activity tracking
CREATE TABLE IF NOT EXISTS public.daily_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  report_date DATE NOT NULL,
  report_type TEXT CHECK (report_type IN ('daily', 'weekly')) DEFAULT 'daily',
  
  -- Activity metrics
  customer_visits INTEGER DEFAULT 0,
  calls_made INTEGER DEFAULT 0,
  proposals_sent INTEGER DEFAULT 0,
  deals_won INTEGER DEFAULT 0,
  deals_lost INTEGER DEFAULT 0,
  follow_ups INTEGER DEFAULT 0,
  
  -- Text summaries
  summary TEXT,
  challenges TEXT,
  tomorrow_plan TEXT,
  
  -- Metadata
  status TEXT CHECK (status IN ('draft', 'submitted', 'approved')) DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one report per user per day
  CONSTRAINT unique_user_report_date UNIQUE (user_id, report_date, report_type)
);

-- Create indexes for performance
CREATE INDEX idx_daily_reports_user_id ON public.daily_reports(user_id);
CREATE INDEX idx_daily_reports_report_date ON public.daily_reports(report_date);
CREATE INDEX idx_daily_reports_status ON public.daily_reports(status);
CREATE INDEX idx_daily_reports_user_date ON public.daily_reports(user_id, report_date);

-- Enable RLS
ALTER TABLE public.daily_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own reports
CREATE POLICY "Users can view own reports" 
ON public.daily_reports 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create their own reports
CREATE POLICY "Users can create own reports" 
ON public.daily_reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own draft reports
CREATE POLICY "Users can update own draft reports" 
ON public.daily_reports 
FOR UPDATE 
USING (auth.uid() = user_id AND status = 'draft')
WITH CHECK (auth.uid() = user_id);

-- Managers can view their team's reports
CREATE POLICY "Managers can view team reports" 
ON public.daily_reports 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
    AND p.role = 'manager'
  )
  OR EXISTS (
    SELECT 1 FROM public.team_members tm
    INNER JOIN public.teams t ON tm.team_id = t.id
    WHERE tm.user_id = daily_reports.user_id
    AND t.team_lead_id = auth.uid()
  )
);

-- Managers can approve reports
CREATE POLICY "Managers can approve team reports" 
ON public.daily_reports 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
    AND p.role = 'manager'
  )
  OR EXISTS (
    SELECT 1 FROM public.team_members tm
    INNER JOIN public.teams t ON tm.team_id = t.id
    WHERE tm.user_id = daily_reports.user_id
    AND t.team_lead_id = auth.uid()
  )
);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_daily_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_daily_reports_updated_at
BEFORE UPDATE ON public.daily_reports
FOR EACH ROW
EXECUTE FUNCTION update_daily_reports_updated_at();

-- Create view for report summaries with user info
CREATE VIEW public.daily_reports_with_user AS
SELECT 
  dr.*,
  p.full_name as user_name,
  p.email as user_email,
  p.role as user_role,
  ap.full_name as approved_by_name
FROM public.daily_reports dr
LEFT JOIN public.profiles p ON dr.user_id = p.id
LEFT JOIN public.profiles ap ON dr.approved_by = ap.id;

-- Grant access to the view
GRANT SELECT ON public.daily_reports_with_user TO authenticated;

-- Add comment for documentation
COMMENT ON TABLE public.daily_reports IS 'Stores daily and weekly sales activity reports submitted by team members';
COMMENT ON COLUMN public.daily_reports.customer_visits IS 'Number of customer visits made during the reporting period';
COMMENT ON COLUMN public.daily_reports.calls_made IS 'Number of sales calls made during the reporting period';
COMMENT ON COLUMN public.daily_reports.proposals_sent IS 'Number of proposals sent to customers';
COMMENT ON COLUMN public.daily_reports.deals_won IS 'Number of deals successfully closed';
COMMENT ON COLUMN public.daily_reports.deals_lost IS 'Number of deals lost or rejected';
COMMENT ON COLUMN public.daily_reports.follow_ups IS 'Number of follow-up activities completed';