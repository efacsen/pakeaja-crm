-- Database Restructuring: Companies and Contacts
-- This migration restructures the database to properly separate companies from contacts

-- Step 1: Create companies table (customer companies)
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  tax_id VARCHAR, -- NPWP in Indonesia
  industry VARCHAR,
  company_type VARCHAR, -- 'contractor', 'developer', 'manufacturer', etc.
  website VARCHAR,
  
  -- Address information
  address TEXT,
  city VARCHAR,
  state_province VARCHAR,
  postal_code VARCHAR,
  country VARCHAR DEFAULT 'Indonesia',
  
  -- Business information
  credit_limit DECIMAL(15,2) DEFAULT 0,
  payment_terms INTEGER DEFAULT 30, -- days
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  
  -- Status
  status VARCHAR DEFAULT 'active', -- 'active', 'inactive', 'blacklisted'
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  
  -- Ensure unique company names
  CONSTRAINT unique_company_name UNIQUE(name)
);

-- Step 2: Create contacts table (people at customer companies)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Personal information
  name VARCHAR NOT NULL,
  position VARCHAR, -- 'Purchasing Manager', 'Project Manager', etc.
  department VARCHAR,
  
  -- Contact information
  email VARCHAR,
  mobile_phone VARCHAR,
  office_phone VARCHAR,
  whatsapp VARCHAR, -- Important in Indonesia
  
  -- Preferences
  preferred_language VARCHAR DEFAULT 'id', -- 'id' or 'en'
  preferred_contact_method VARCHAR DEFAULT 'whatsapp', -- 'email', 'phone', 'whatsapp'
  
  -- Status
  is_primary BOOLEAN DEFAULT false, -- Primary contact for the company
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  
  -- Ensure one primary contact per company
  CONSTRAINT unique_primary_per_company UNIQUE(company_id, is_primary) WHERE is_primary = true
);

-- Step 3: Add indexes for better performance
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_city ON companies(city);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_contacts_company_id ON contacts(company_id);
CREATE INDEX idx_contacts_name ON contacts(name);
CREATE INDEX idx_contacts_email ON contacts(email);

-- Step 4: Create RLS policies for companies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all companies" ON companies
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Sales and above can create companies" ON companies
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('sales_rep', 'sales_manager', 'admin', 'superadmin')
    )
  );

CREATE POLICY "Sales and above can update companies" ON companies
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('sales_rep', 'sales_manager', 'admin', 'superadmin')
    )
  );

-- Step 5: Create RLS policies for contacts
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all contacts" ON contacts
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Sales and above can create contacts" ON contacts
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('sales_rep', 'sales_manager', 'admin', 'superadmin')
    )
  );

CREATE POLICY "Sales and above can update contacts" ON contacts
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('sales_rep', 'sales_manager', 'admin', 'superadmin')
    )
  );

-- Step 6: Migrate existing customer data to companies
-- This assumes your current customers table has company-like data
INSERT INTO companies (
  name,
  address,
  city,
  created_at,
  updated_at,
  created_by
)
SELECT DISTINCT
  COALESCE(company_name, name) as name,
  address,
  city,
  created_at,
  updated_at,
  created_by
FROM customers
WHERE NOT EXISTS (
  SELECT 1 FROM companies WHERE companies.name = COALESCE(customers.company_name, customers.name)
)
ON CONFLICT (name) DO NOTHING;

-- Step 7: Create contacts from existing customer data
INSERT INTO contacts (
  company_id,
  name,
  email,
  mobile_phone,
  position,
  is_primary,
  created_at,
  updated_at,
  created_by
)
SELECT 
  c.id as company_id,
  customers.contact_name as name,
  customers.email,
  customers.phone as mobile_phone,
  customers.position,
  true as is_primary, -- First contact is primary
  customers.created_at,
  customers.updated_at,
  customers.created_by
FROM customers
JOIN companies c ON c.name = COALESCE(customers.company_name, customers.name)
WHERE customers.contact_name IS NOT NULL 
  OR customers.email IS NOT NULL;

-- Step 8: Update leads table to reference companies instead of customers
ALTER TABLE leads 
  ADD COLUMN company_id UUID REFERENCES companies(id);

-- Migrate company references in leads
UPDATE leads 
SET company_id = (
  SELECT c.id 
  FROM companies c 
  JOIN customers cust ON c.name = COALESCE(cust.company_name, cust.name)
  WHERE leads.customer_id = cust.id
  LIMIT 1
);

-- Step 9: Add company_id to canvassing_reports
ALTER TABLE canvassing_reports
  ADD COLUMN company_id UUID REFERENCES companies(id),
  ADD COLUMN contact_id UUID REFERENCES contacts(id);

-- Step 10: Create view for easy company-contact lookup
CREATE OR REPLACE VIEW company_contacts AS
SELECT 
  c.id as company_id,
  c.name as company_name,
  c.city as company_city,
  c.status as company_status,
  ct.id as contact_id,
  ct.name as contact_name,
  ct.position,
  ct.email,
  ct.mobile_phone,
  ct.whatsapp,
  ct.is_primary
FROM companies c
LEFT JOIN contacts ct ON ct.company_id = c.id AND ct.is_active = true
ORDER BY c.name, ct.is_primary DESC, ct.name;

-- Step 11: Create function to get or create company
CREATE OR REPLACE FUNCTION get_or_create_company(
  p_company_name VARCHAR,
  p_city VARCHAR DEFAULT NULL,
  p_address TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_company_id UUID;
BEGIN
  -- Try to find existing company
  SELECT id INTO v_company_id
  FROM companies
  WHERE LOWER(name) = LOWER(p_company_name)
  LIMIT 1;
  
  -- If not found, create new company
  IF v_company_id IS NULL THEN
    INSERT INTO companies (name, city, address, created_by)
    VALUES (p_company_name, p_city, p_address, auth.uid())
    RETURNING id INTO v_company_id;
  END IF;
  
  RETURN v_company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 12: Create function to search companies with contacts
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
  match_type VARCHAR -- 'company' or 'contact'
) AS $$
BEGIN
  RETURN QUERY
  WITH company_matches AS (
    SELECT 
      c.id,
      c.name,
      c.city,
      ct.id as contact_id,
      ct.name as contact_name,
      ct.position,
      ct.email,
      ct.mobile_phone,
      'company' as match_type,
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
      ct.id as contact_id,
      ct.name as contact_name,
      ct.position,
      ct.email,
      ct.mobile_phone,
      'contact' as match_type,
      2 as priority
    FROM contacts ct
    JOIN companies c ON c.id = ct.company_id
    WHERE ct.name ILIKE '%' || search_term || '%'
      AND ct.is_active = true
      AND c.status = 'active'
  )
  SELECT DISTINCT ON (company_id, contact_id)
    company_id,
    company_name,
    company_city,
    contact_id,
    contact_name,
    contact_position,
    contact_email,
    contact_phone,
    match_type
  FROM (
    SELECT * FROM company_matches
    UNION ALL
    SELECT * FROM contact_matches
  ) combined
  ORDER BY priority, company_name, contact_name
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 13: Grant necessary permissions
GRANT ALL ON companies TO authenticated;
GRANT ALL ON contacts TO authenticated;
GRANT EXECUTE ON FUNCTION get_or_create_company TO authenticated;
GRANT EXECUTE ON FUNCTION search_companies_with_contacts TO authenticated;

-- Add helpful comments
COMMENT ON TABLE companies IS 'Customer companies (external organizations)';
COMMENT ON TABLE contacts IS 'Contact persons at customer companies';
COMMENT ON COLUMN companies.tax_id IS 'NPWP for Indonesian companies';
COMMENT ON COLUMN contacts.is_primary IS 'Primary contact for the company - only one per company';
COMMENT ON COLUMN contacts.whatsapp IS 'WhatsApp number - important for Indonesian business';