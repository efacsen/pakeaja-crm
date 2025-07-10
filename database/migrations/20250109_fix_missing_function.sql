-- Quick fix for missing get_user_organization function
-- Run this if you get: ERROR: 42883: function get_user_organization(uuid) does not exist

-- Create the helper function
CREATE OR REPLACE FUNCTION get_user_organization(user_id UUID)
RETURNS UUID AS $$
DECLARE
    v_org_id UUID;
BEGIN
    SELECT organization_id INTO v_org_id
    FROM profiles
    WHERE id = user_id
    LIMIT 1;
    
    RETURN v_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_organization(UUID) TO authenticated;

-- Verify it was created
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'get_user_organization'
    ) THEN
        RAISE NOTICE '✅ Function get_user_organization created successfully';
    ELSE
        RAISE EXCEPTION '❌ Failed to create get_user_organization function';
    END IF;
END $$;