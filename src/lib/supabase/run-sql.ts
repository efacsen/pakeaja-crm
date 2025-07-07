import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with the service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function runSQL() {
  const sql = `
-- Create Company Search Functions for PakeAja CRM
-- These functions enable searching companies and contacts with autocomplete

-- =====================================================
-- 1. SEARCH COMPANIES WITH CONTACTS FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION search_companies_with_contacts(
  search_term TEXT,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  company_id UUID,
  company_name VARCHAR,
  company_city VARCHAR,
  contact_id UUID,
  contact_name VARCHAR,
  contact_position VARCHAR,
  contact_email VARCHAR,
  contact_phone VARCHAR,
  match_type VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  -- Search companies
  SELECT 
    c.id as company_id,
    c.name as company_name,
    c.city as company_city,
    NULL::UUID as contact_id,
    NULL::VARCHAR as contact_name,
    NULL::VARCHAR as contact_position,
    NULL::VARCHAR as contact_email,
    NULL::VARCHAR as contact_phone,
    'company'::VARCHAR as match_type
  FROM companies c
  WHERE c.status = 'active'
    AND (
      c.name ILIKE '%' || search_term || '%' OR
      c.city ILIKE '%' || search_term || '%'
    )
  
  UNION ALL
  
  -- Search contacts
  SELECT 
    c.id as company_id,
    c.name as company_name,
    c.city as company_city,
    ct.id as contact_id,
    ct.name as contact_name,
    ct.position as contact_position,
    ct.email as contact_email,
    ct.mobile_phone as contact_phone,
    'contact'::VARCHAR as match_type
  FROM contacts ct
  INNER JOIN companies c ON c.id = ct.company_id
  WHERE ct.is_active = true
    AND c.status = 'active'
    AND (
      ct.name ILIKE '%' || search_term || '%' OR
      ct.email ILIKE '%' || search_term || '%' OR
      ct.mobile_phone ILIKE '%' || search_term || '%'
    )
  
  ORDER BY 
    CASE 
      WHEN company_name ILIKE search_term || '%' THEN 1
      WHEN company_name ILIKE '%' || search_term || '%' THEN 2
      ELSE 3
    END,
    company_name,
    match_type DESC,
    contact_name
  
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 2. GET OR CREATE COMPANY FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION get_or_create_company(
  p_company_name TEXT,
  p_city TEXT DEFAULT NULL,
  p_address TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_company_id UUID;
BEGIN
  -- First try to find existing company
  SELECT id INTO v_company_id
  FROM companies
  WHERE LOWER(name) = LOWER(TRIM(p_company_name))
  LIMIT 1;
  
  -- If not found, create new
  IF v_company_id IS NULL THEN
    INSERT INTO companies (
      name,
      city,
      address,
      status,
      created_at,
      updated_at
    ) VALUES (
      TRIM(p_company_name),
      p_city,
      p_address,
      'active',
      NOW(),
      NOW()
    )
    RETURNING id INTO v_company_id;
  END IF;
  
  RETURN v_company_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. GRANT PERMISSIONS
-- =====================================================
GRANT EXECUTE ON FUNCTION search_companies_with_contacts(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_or_create_company(TEXT, TEXT, TEXT) TO authenticated;
  `;

  const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    console.error('Error running SQL:', error);
    // Try running directly
    const { data, error: directError } = await (supabase as any).rpc('search_companies_with_contacts', {
      search_term: 'test',
      limit_count: 1
    });
    
    if (directError) {
      console.log('Functions may not exist yet. Please run the SQL manually in Supabase SQL Editor.');
    } else {
      console.log('Functions already exist!');
    }
  } else {
    console.log('SQL executed successfully!');
  }
}

runSQL().catch(console.error);