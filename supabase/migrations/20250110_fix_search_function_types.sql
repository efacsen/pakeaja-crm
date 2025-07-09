-- Fix the type mismatch in search_companies_with_contacts function
CREATE OR REPLACE FUNCTION search_companies_with_contacts(
  search_term TEXT,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  company_id UUID,
  company_name TEXT,
  company_city TEXT,
  contact_id UUID,
  contact_name TEXT,
  contact_position TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  match_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH company_matches AS (
    SELECT 
      c.id AS company_id,
      c.name::TEXT AS company_name,
      c.city::TEXT AS company_city,
      NULL::UUID AS contact_id,
      NULL::TEXT AS contact_name,
      NULL::TEXT AS contact_position,
      NULL::TEXT AS contact_email,
      NULL::TEXT AS contact_phone,
      'company'::TEXT AS match_type
    FROM companies c
    WHERE 
      c.status = 'active' AND
      (
        c.name ILIKE '%' || search_term || '%' OR
        c.city ILIKE '%' || search_term || '%'
      )
  ),
  contact_matches AS (
    SELECT 
      con.company_id,
      c.name::TEXT AS company_name,
      c.city::TEXT AS company_city,
      con.id AS contact_id,
      con.name::TEXT AS contact_name,
      con.position::TEXT AS contact_position,
      con.email::TEXT AS contact_email,
      con.mobile_phone::TEXT AS contact_phone,
      'contact'::TEXT AS match_type
    FROM contacts con
    INNER JOIN companies c ON con.company_id = c.id
    WHERE 
      con.is_active = true AND
      c.status = 'active' AND
      (
        con.name ILIKE '%' || search_term || '%' OR
        con.email ILIKE '%' || search_term || '%' OR
        con.mobile_phone ILIKE '%' || search_term || '%'
      )
  )
  SELECT * FROM (
    SELECT * FROM company_matches
    UNION ALL
    SELECT * FROM contact_matches
  ) combined
  ORDER BY 
    CASE 
      WHEN combined.match_type = 'company' THEN 0 
      ELSE 1 
    END,
    combined.company_name,
    combined.contact_name
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;