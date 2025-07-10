-- ============================================================================
-- VERIFICATION SCRIPT - Run this to check if setup was successful
-- ============================================================================

-- Check if all tables were created
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check if custom types were created
SELECT 
  typname as type_name,
  enumlabel as values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid 
WHERE typname IN (
  'user_role', 
  'lead_stage', 
  'lead_temperature_status', 
  'deal_type', 
  'activity_type', 
  'canvassing_outcome', 
  'canvassing_priority', 
  'project_segment'
)
ORDER BY typname, e.enumsortorder;

-- Check if storage bucket was created
SELECT 
  id,
  name,
  public
FROM storage.buckets 
WHERE id = 'canvassing-photos';

-- Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;

-- Success message
SELECT 'PakeAja CRM database setup completed successfully!' as status;