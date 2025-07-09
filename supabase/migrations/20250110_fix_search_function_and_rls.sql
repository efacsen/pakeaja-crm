-- Fix the ambiguous column reference in search_companies_with_contacts function
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
      WHEN combined.match_type = 'company' THEN 0 
      ELSE 1 
    END,
    combined.company_name,
    combined.contact_name
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add missing RLS policies for companies table
CREATE POLICY "Users can insert companies"
ON companies FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update companies"
ON companies FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Users can delete their own companies"
ON companies FOR DELETE
TO authenticated
USING (created_by = auth.uid());

-- Add missing RLS policies for contacts table
CREATE POLICY "Users can insert contacts"
ON contacts FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update contacts"
ON contacts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Users can delete their own contacts"
ON contacts FOR DELETE
TO authenticated
USING (created_by = auth.uid());

-- Grant permissions on the updated function
GRANT EXECUTE ON FUNCTION search_companies_with_contacts(TEXT, INTEGER) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION search_companies_with_contacts(TEXT, INTEGER) IS 'Searches for companies and their contacts by name, email, or phone - fixed ambiguous column reference';