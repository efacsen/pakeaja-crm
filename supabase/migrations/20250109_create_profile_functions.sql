-- Create functions for profile management
-- This ensures we have all the necessary functions for profile creation

-- Function to create profile if missing (for auth callback)
CREATE OR REPLACE FUNCTION create_profile_if_missing(
    user_id UUID,
    user_email TEXT,
    user_name TEXT DEFAULT NULL,
    user_role user_role DEFAULT 'sales'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    default_org_id UUID;
    profile_exists BOOLEAN;
BEGIN
    -- Check if profile already exists
    SELECT EXISTS(
        SELECT 1 FROM profiles WHERE id = user_id
    ) INTO profile_exists;
    
    IF profile_exists THEN
        RETURN FALSE; -- Profile already exists
    END IF;
    
    -- Get the default organization (PakeAja)
    SELECT id INTO default_org_id 
    FROM organizations 
    WHERE slug = 'pakeaja' 
    LIMIT 1;
    
    -- Create the organization if it doesn't exist
    IF default_org_id IS NULL THEN
        INSERT INTO organizations (name, slug, settings)
        VALUES ('PakeAja', 'pakeaja', '{}')
        RETURNING id INTO default_org_id;
    END IF;
    
    -- Insert new profile
    INSERT INTO profiles (
        id,
        email,
        full_name,
        role,
        organization_id,
        is_active,
        department,
        position,
        joined_at,
        created_at,
        updated_at
    ) VALUES (
        user_id,
        user_email,
        COALESCE(user_name, user_email),
        user_role,
        default_org_id,
        true,
        'Sales',
        'Sales Representative',
        CURRENT_DATE,
        NOW(),
        NOW()
    );
    
    RETURN TRUE; -- Profile created successfully
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_profile_if_missing TO authenticated;

-- Function to get user's complete profile information
CREATE OR REPLACE FUNCTION get_user_profile(user_id UUID)
RETURNS TABLE (
    id UUID,
    email TEXT,
    full_name TEXT,
    role user_role,
    organization_id UUID,
    organization_name TEXT,
    is_active BOOLEAN,
    department TEXT,
    position TEXT,
    joined_at DATE,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.email,
        p.full_name,
        p.role,
        p.organization_id,
        o.name as organization_name,
        p.is_active,
        p.department,
        p.position,
        p.joined_at,
        p.created_at,
        p.updated_at
    FROM profiles p
    LEFT JOIN organizations o ON p.organization_id = o.id
    WHERE p.id = user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_profile TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION create_profile_if_missing IS 'Creates a user profile if it does not exist. Used by auth callback flow.';
COMMENT ON FUNCTION get_user_profile IS 'Retrieves complete user profile information with organization details.';