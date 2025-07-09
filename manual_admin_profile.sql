-- MANUAL ADMIN PROFILE CREATION
-- Run this AFTER emergency_profile_fix.sql to create your admin profile

-- 1. Direct admin profile creation for immediate access
DO $$
DECLARE
    admin_user_id UUID := 'fc500bff-dc42-4595-a156-800d745129d2';
    admin_email TEXT := 'akevinzakaria@cepatservicestation.com';
    default_org_id UUID;
    profile_exists BOOLEAN := FALSE;
BEGIN
    -- Get default organization
    SELECT id INTO default_org_id FROM organizations WHERE slug = 'pakeaja' LIMIT 1;
    
    -- Check if profile already exists
    SELECT EXISTS(SELECT 1 FROM profiles WHERE id = admin_user_id) INTO profile_exists;
    
    IF profile_exists THEN
        -- Update existing profile to admin
        UPDATE profiles 
        SET 
            role = 'admin'::user_role,
            is_active = true,
            department = 'Management',
            position = 'System Administrator',
            full_name = 'Kevin Zakaria',
            email = admin_email,
            organization_id = default_org_id,
            updated_at = NOW()
        WHERE id = admin_user_id;
        
        RAISE NOTICE '✅ Updated existing profile to admin for: %', admin_email;
    ELSE
        -- Create new admin profile
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
            admin_user_id,
            admin_email,
            'Kevin Zakaria',
            'admin'::user_role,
            default_org_id,
            true,
            'Management',
            'System Administrator',
            CURRENT_DATE,
            NOW(),
            NOW()
        );
        
        RAISE NOTICE '✅ Created new admin profile for: %', admin_email;
    END IF;
END $$;

-- 2. Verify admin profile creation
SELECT 'ADMIN PROFILE VERIFICATION' as check_type;
SELECT 
    id,
    email,
    full_name,
    role::text,
    is_active,
    department,
    position,
    organization_id,
    'Admin profile ready' as status
FROM profiles 
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- 3. Test admin profile access
DO $$
DECLARE
    admin_accessible BOOLEAN := FALSE;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM profiles 
        WHERE email = 'akevinzakaria@cepatservicestation.com' 
        AND role = 'admin' 
        AND is_active = true
    ) INTO admin_accessible;
    
    IF admin_accessible THEN
        RAISE NOTICE '✅ Admin profile is accessible and properly configured';
    ELSE
        RAISE WARNING '❌ Admin profile access test failed';
    END IF;
END $$;

-- 4. Final status
SELECT 
    'ADMIN PROFILE CREATED' as status,
    'You should now be able to access css.pakeaja.com' as message,
    'Try logging in again' as next_step;