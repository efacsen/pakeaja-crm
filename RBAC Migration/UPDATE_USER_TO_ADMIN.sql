-- Update User to Admin Role
-- Run this after applying the master RBAC migration

-- Check current user status
SELECT id, email, full_name, role, department, position, organization_id, is_active
FROM profiles 
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- Update user to admin role
UPDATE profiles 
SET 
    role = 'admin'::user_role,
    department = 'Management',
    position = 'System Administrator',
    is_active = true,
    updated_at = NOW()
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- Verify the update
SELECT id, email, full_name, role, department, position, organization_id, is_active
FROM profiles 
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- Check permissions for admin role
SELECT COUNT(*) as permission_count 
FROM permissions 
WHERE role = 'admin' 
AND organization_id = (
    SELECT organization_id 
    FROM profiles 
    WHERE email = 'akevinzakaria@cepatservicestation.com'
);

-- Success message
DO $$
DECLARE
    v_role user_role;
    v_name text;
BEGIN
    SELECT role, full_name INTO v_role, v_name
    FROM profiles 
    WHERE email = 'akevinzakaria@cepatservicestation.com';
    
    IF v_role = 'admin' THEN
        RAISE NOTICE 'SUCCESS: User % (akevinzakaria@cepatservicestation.com) has been granted admin role!', v_name;
    ELSE
        RAISE WARNING 'FAILED: User role update did not work. Current role: %', v_role;
    END IF;
END $$;