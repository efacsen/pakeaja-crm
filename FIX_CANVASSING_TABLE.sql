-- Fix canvassing_reports table to match the application structure

-- First, let's add the missing columns
ALTER TABLE canvassing_reports 
  ADD COLUMN IF NOT EXISTS company_address TEXT,
  ADD COLUMN IF NOT EXISTS contact_position TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS visit_outcome VARCHAR,
  ADD COLUMN IF NOT EXISTS potential_type VARCHAR,
  ADD COLUMN IF NOT EXISTS potential_area NUMERIC,
  ADD COLUMN IF NOT EXISTS potential_materials TEXT,
  ADD COLUMN IF NOT EXISTS potential_value NUMERIC,
  ADD COLUMN IF NOT EXISTS current_supplier TEXT,
  ADD COLUMN IF NOT EXISTS competitor_price NUMERIC,
  ADD COLUMN IF NOT EXISTS decision_timeline VARCHAR,
  ADD COLUMN IF NOT EXISTS next_action_date DATE,
  ADD COLUMN IF NOT EXISTS general_notes TEXT,
  ADD COLUMN IF NOT EXISTS gps_latitude NUMERIC,
  ADD COLUMN IF NOT EXISTS gps_longitude NUMERIC,
  ADD COLUMN IF NOT EXISTS sales_rep_id UUID,
  ADD COLUMN IF NOT EXISTS sales_rep_name VARCHAR,
  ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id),
  ADD COLUMN IF NOT EXISTS contact_id UUID REFERENCES contacts(id),
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id);

-- Update existing columns if needed
ALTER TABLE canvassing_reports 
  ALTER COLUMN outcome TYPE VARCHAR,
  ALTER COLUMN project_segment TYPE VARCHAR,
  ALTER COLUMN priority TYPE VARCHAR;

-- Create photos table if it doesn't exist
CREATE TABLE IF NOT EXISTS canvassing_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES canvassing_reports(id) ON DELETE CASCADE,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for photos
CREATE INDEX IF NOT EXISTS idx_canvassing_photos_report_id ON canvassing_photos(report_id);

-- Grant permissions
GRANT ALL ON canvassing_photos TO authenticated;

-- Update RLS policies for canvassing_reports to use created_by
DROP POLICY IF EXISTS "Users can view all canvassing reports" ON canvassing_reports;
DROP POLICY IF EXISTS "Sales reps can create canvassing reports" ON canvassing_reports;
DROP POLICY IF EXISTS "Sales reps can update their own reports" ON canvassing_reports;

CREATE POLICY "Users can view all canvassing reports" ON canvassing_reports
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Sales and above can create canvassing reports" ON canvassing_reports
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('sales_rep', 'sales_manager', 'admin')
    )
  );

CREATE POLICY "Users can update their own reports" ON canvassing_reports
  FOR UPDATE TO authenticated
  USING (created_by = auth.uid() OR sales_rep_id = auth.uid());

-- Add RLS for photos table
ALTER TABLE canvassing_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all photos" ON canvassing_photos
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can insert photos for their reports" ON canvassing_photos
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM canvassing_reports 
      WHERE canvassing_reports.id = report_id 
      AND (canvassing_reports.created_by = auth.uid() OR canvassing_reports.sales_rep_id = auth.uid())
    )
  );

-- Set default values for created_by
ALTER TABLE canvassing_reports 
  ALTER COLUMN created_by SET DEFAULT auth.uid();

SELECT 'Canvassing table structure fixed!' as status;