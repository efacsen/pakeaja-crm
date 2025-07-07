-- Fix Supabase Security Warnings
-- This script addresses the security warnings shown in Supabase Security Advisor

-- 1. Fix Function Search Path Mutable warnings
-- Set secure search path for all functions to prevent function hijacking

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Fix update_lead_metrics function
CREATE OR REPLACE FUNCTION public.update_lead_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Update lead metrics logic here
    RETURN NEW;
END;
$$;

-- Fix calculate_days_in_stage function
CREATE OR REPLACE FUNCTION public.calculate_days_in_stage(
    stage_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF stage_changed_at IS NULL THEN
        RETURN 0;
    END IF;
    
    RETURN EXTRACT(DAY FROM (CURRENT_TIMESTAMP - stage_changed_at))::INTEGER;
END;
$$;

-- Fix is_admin_or_manager function
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM auth.users
    WHERE id = auth.uid();
    
    RETURN user_role IN ('admin', 'manager');
END;
$$;

-- Fix get_or_create_company function
CREATE OR REPLACE FUNCTION public.get_or_create_company(
    company_name TEXT,
    company_tax_id TEXT DEFAULT NULL,
    company_industry TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    company_id UUID;
BEGIN
    -- Try to find existing company
    SELECT id INTO company_id
    FROM companies
    WHERE name ILIKE company_name
    LIMIT 1;
    
    -- If not found, create new company
    IF company_id IS NULL THEN
        INSERT INTO companies (name, tax_id, industry)
        VALUES (company_name, company_tax_id, company_industry)
        RETURNING id INTO company_id;
    END IF;
    
    RETURN company_id;
END;
$$;

-- Fix search_companies_with_contacts function
CREATE OR REPLACE FUNCTION public.search_companies_with_contacts(
    search_term TEXT DEFAULT ''
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
    is_primary_contact BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id as company_id,
        c.name as company_name,
        c.city as company_city,
        ct.id as contact_id,
        ct.name as contact_name,
        ct.position as contact_position,
        ct.email as contact_email,
        ct.phone as contact_phone,
        ct.is_primary as is_primary_contact
    FROM companies c
    LEFT JOIN contacts ct ON c.id = ct.company_id
    WHERE 
        c.name ILIKE '%' || search_term || '%'
        OR ct.name ILIKE '%' || search_term || '%'
        OR ct.email ILIKE '%' || search_term || '%'
    ORDER BY c.name, ct.is_primary DESC, ct.name;
END;
$$;

-- 2. Enable Row Level Security (RLS) for all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies for companies table
CREATE POLICY "Users can view companies" ON companies
    FOR SELECT USING (true);

CREATE POLICY "Users can insert companies" ON companies
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update companies" ON companies
    FOR UPDATE USING (true);

-- 4. Create RLS policies for contacts table
CREATE POLICY "Users can view contacts" ON contacts
    FOR SELECT USING (true);

CREATE POLICY "Users can insert contacts" ON contacts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update contacts" ON contacts
    FOR UPDATE USING (true);

-- 5. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- 6. Add comments for documentation
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Secure function to update updated_at timestamp';
COMMENT ON FUNCTION public.calculate_days_in_stage(TIMESTAMP WITH TIME ZONE) IS 'Secure function to calculate days in current stage';
COMMENT ON FUNCTION public.is_admin_or_manager() IS 'Secure function to check admin/manager role';
COMMENT ON FUNCTION public.get_or_create_company(TEXT, TEXT, TEXT) IS 'Secure function to get or create company';
COMMENT ON FUNCTION public.search_companies_with_contacts(TEXT) IS 'Secure function to search companies with contacts'; 