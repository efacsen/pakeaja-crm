-- Fix database restructuring issues

-- Step 1: Drop the constraint if it exists and recreate contacts table properly
DROP TABLE IF EXISTS contacts CASCADE;

-- Step 2: Create contacts table without the WHERE clause in constraint
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Personal information
  name VARCHAR NOT NULL,
  position VARCHAR,
  department VARCHAR,
  
  -- Contact information
  email VARCHAR,
  mobile_phone VARCHAR,
  office_phone VARCHAR,
  whatsapp VARCHAR,
  
  -- Preferences
  preferred_language VARCHAR DEFAULT 'id',
  preferred_contact_method VARCHAR DEFAULT 'whatsapp',
  
  -- Status
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Create a trigger to ensure only one primary contact per company
CREATE OR REPLACE FUNCTION ensure_one_primary_contact() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    UPDATE contacts 
    SET is_primary = false 
    WHERE company_id = NEW.company_id 
      AND id != NEW.id 
      AND is_primary = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ensure_one_primary_contact
  BEFORE INSERT OR UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION ensure_one_primary_contact();

-- Step 3: Create indexes for contacts
CREATE INDEX idx_contacts_company_id ON contacts(company_id);
CREATE INDEX idx_contacts_name ON contacts(name);
CREATE INDEX idx_contacts_email ON contacts(email);

-- Step 4: Create RLS policies for contacts
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
      AND users.role IN ('sales_rep', 'sales_manager', 'admin')
    )
  );

CREATE POLICY "Sales and above can update contacts" ON contacts
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('sales_rep', 'sales_manager', 'admin')
    )
  );

-- Step 5: Fix the migration query for existing customers
-- First, let's check what columns exist in customers table
DO $$
BEGIN
  -- Only run migration if customers table has data
  IF EXISTS (SELECT 1 FROM customers LIMIT 1) THEN
    -- Migrate customer data to contacts
    INSERT INTO contacts (
      company_id,
      name,
      email,
      mobile_phone,
      is_primary,
      created_at,
      updated_at,
      created_by
    )
    SELECT 
      c.id as company_id,
      cust.full_name as name,
      cust.email,
      cust.phone as mobile_phone,
      true as is_primary,
      cust.created_at,
      cust.updated_at,
      cust.created_by
    FROM customers cust
    JOIN companies c ON c.name = cust.company_name
    WHERE cust.full_name IS NOT NULL 
      AND NOT EXISTS (
        SELECT 1 FROM contacts ct 
        WHERE ct.company_id = c.id 
        AND ct.email = cust.email
      );
  END IF;
END $$;

-- Step 6: Update the company search function to handle NULL contacts
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
      ct.id as contact_id,
      ct.name as contact_name,
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
      ct.id as contact_id,
      ct.name as contact_name,
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
  SELECT DISTINCT ON (id, contact_id)
    id as company_id,
    name as company_name,
    city as company_city,
    contact_id,
    contact_name as contact_name,
    position as contact_position,
    email as contact_email,
    mobile_phone as contact_phone,
    match_type
  FROM (
    SELECT * FROM company_matches
    UNION ALL
    SELECT * FROM contact_matches
  ) combined
  ORDER BY id, contact_id, priority, name
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create the company contacts view
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

-- Step 8: Grant permissions
GRANT ALL ON contacts TO authenticated;
GRANT SELECT ON company_contacts TO authenticated;

-- Add some test data to verify everything works
DO $$
BEGIN
  -- Only add test data if companies table is empty
  IF NOT EXISTS (SELECT 1 FROM companies WHERE name = 'PT Sinar Jaya' LIMIT 1) THEN
    -- Insert a test company
    INSERT INTO companies (name, city, address, industry, status)
    VALUES ('PT Sinar Jaya', 'Jakarta', 'Jl. Industri No. 123', 'Construction', 'active');
    
    -- Insert test contacts
    INSERT INTO contacts (company_id, name, position, email, mobile_phone, is_primary)
    SELECT 
      id,
      'Budi Santoso',
      'Purchasing Manager',
      'budi@sinarjaya.co.id',
      '081234567890',
      true
    FROM companies WHERE name = 'PT Sinar Jaya';
    
    INSERT INTO contacts (company_id, name, position, email, mobile_phone, is_primary)
    SELECT 
      id,
      'Siti Nurhasanah',
      'Project Manager',
      'siti@sinarjaya.co.id',
      '081234567891',
      false
    FROM companies WHERE name = 'PT Sinar Jaya';
  END IF;
END $$;

-- Verify the setup
SELECT 'Setup completed successfully!' as status;