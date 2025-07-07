-- Fix the search function ambiguity error

DROP FUNCTION IF EXISTS search_companies_with_contacts;

CREATE OR REPLACE FUNCTION search_companies_with_contacts(
  search_term VARCHAR,
  limit_count INTEGER DEFAULT 10
) RETURNS TABLE (
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
  WITH company_matches AS (
    SELECT 
      c.id,
      c.name,
      c.city,
      ct.id as ct_id,
      ct.name as ct_name,
      ct.position,
      ct.email,
      ct.mobile_phone,
      'company'::VARCHAR as match_type,
      1 as priority
    FROM companies c
    LEFT JOIN contacts ct ON ct.company_id = c.id AND ct.is_primary = true
    WHERE c.name ILIKE '%' || search_term || '%'
      AND c.status = 'active'
  ),
  contact_matches AS (
    SELECT 
      c.id,
      c.name,
      c.city,
      ct.id as ct_id,
      ct.name as ct_name,
      ct.position,
      ct.email,
      ct.mobile_phone,
      'contact'::VARCHAR as match_type,
      2 as priority
    FROM contacts ct
    JOIN companies c ON c.id = ct.company_id
    WHERE ct.name ILIKE '%' || search_term || '%'
      AND ct.is_active = true
      AND c.status = 'active'
  )
  SELECT DISTINCT ON (combined.id, combined.ct_id)
    combined.id::UUID as company_id,
    combined.name::VARCHAR as company_name,
    combined.city::VARCHAR as company_city,
    combined.ct_id::UUID as contact_id,
    combined.ct_name::VARCHAR as contact_name,
    combined.position::VARCHAR as contact_position,
    combined.email::VARCHAR as contact_email,
    combined.mobile_phone::VARCHAR as contact_phone,
    combined.match_type::VARCHAR
  FROM (
    SELECT * FROM company_matches
    UNION ALL
    SELECT * FROM contact_matches
  ) combined
  ORDER BY combined.id, combined.ct_id, combined.priority, combined.name
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test the function
SELECT * FROM search_companies_with_contacts('PT', 5);
SELECT * FROM search_companies_with_contacts('Budi', 5);