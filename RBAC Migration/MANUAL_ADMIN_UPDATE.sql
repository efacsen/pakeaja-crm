-- Manual Admin Update Script
-- Use this if the full migration is having issues

-- Step 1: Find your user ID
SELECT 
    u.id,
    u.email,
    p.role,
    p.full_name
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'akevinzakaria@cepatservicestation.com';

-- Step 2: If user exists, update to admin role
-- Replace [USER_ID] with the ID from step 1
UPDATE profiles 
SET 
    role = 'admin'::user_role,
    department = 'Management',
    position = 'System Administrator',
    is_active = true,
    updated_at = NOW()
WHERE id = '[USER_ID]';

-- Alternative: Update using subquery (run this directly)
UPDATE profiles 
SET 
    role = 'admin'::user_role,
    department = 'Management',
    position = 'System Administrator',
    is_active = true,
    updated_at = NOW()
WHERE id = (
    SELECT id 
    FROM auth.users 
    WHERE email = 'akevinzakaria@cepatservicestation.com'
);

-- Step 3: Verify the update
SELECT 
    u.email,
    p.role,
    p.department,
    p.position
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email = 'akevinzakaria@cepatservicestation.com';