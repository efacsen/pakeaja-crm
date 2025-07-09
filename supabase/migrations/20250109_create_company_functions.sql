-- Create function to get or create a company
CREATE OR REPLACE FUNCTION get_or_create_company(
  p_company_name TEXT,
  p_city TEXT DEFAULT NULL,
  p_address TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_company_id UUID;
BEGIN
  -- First try to find existing company by exact name match
  SELECT id INTO v_company_id
  FROM companies
  WHERE LOWER(TRIM(name)) = LOWER(TRIM(p_company_name))
  LIMIT 1;
  
  -- If not found, create new company
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_or_create_company TO authenticated;

-- Create function to search companies with contacts
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
      c.name AS company_name,
      c.city AS company_city,
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
      c.name AS company_name,
      c.city AS company_city,
      con.id AS contact_id,
      con.name AS contact_name,
      con.position AS contact_position,
      con.email AS contact_email,
      con.mobile_phone AS contact_phone,
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
      WHEN match_type = 'company' THEN 0 
      ELSE 1 
    END,
    company_name,
    contact_name
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION search_companies_with_contacts TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION get_or_create_company IS 'Gets existing company by name or creates a new one if it doesn''t exist';
COMMENT ON FUNCTION search_companies_with_contacts IS 'Searches for companies and their contacts by name, email, or phone';