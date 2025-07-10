-- Verification script for database restructuring

-- Check if tables exist
SELECT 
  'companies' as table_name,
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'companies') as exists
UNION ALL
SELECT 
  'contacts' as table_name,
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contacts') as exists;

-- Check companies table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'companies'
ORDER BY ordinal_position;

-- Check contacts table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'contacts'
ORDER BY ordinal_position;

-- Check if data was migrated
SELECT 
  'Total companies' as metric,
  COUNT(*) as count
FROM companies
UNION ALL
SELECT 
  'Total contacts' as metric,
  COUNT(*) as count
FROM contacts
UNION ALL
SELECT 
  'Companies with contacts' as metric,
  COUNT(DISTINCT company_id) as count
FROM contacts;

-- Sample data check
SELECT 
  c.name as company_name,
  c.city,
  ct.name as contact_name,
  ct.position,
  ct.email,
  ct.is_primary
FROM companies c
LEFT JOIN contacts ct ON ct.company_id = c.id
LIMIT 10;

-- Test search function
SELECT * FROM search_companies_with_contacts('PT', 5);