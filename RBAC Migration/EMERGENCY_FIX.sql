-- EMERGENCY FIX - Just get your profile working
-- Run this if other scripts fail

-- 1. Disable RLS temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Make sure you're an admin
UPDATE profiles 
SET 
  role = 'admin'::user_role,
  is_active = true,
  email = 'akevinzakaria@cepatservicestation.com'
WHERE id = 'fc500bff-dc42-4595-a156-800d745129d2';

-- If no rows updated, insert
INSERT INTO profiles (
  id, 
  email, 
  full_name, 
  role, 
  organization_id, 
  is_active
)
SELECT 
  'fc500bff-dc42-4595-a156-800d745129d2',
  'akevinzakaria@cepatservicestation.com',
  'Kevin Zakaria',
  'admin'::user_role,
  (SELECT id FROM organizations WHERE slug = 'pakeaja' LIMIT 1),
  true
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE id = 'fc500bff-dc42-4595-a156-800d745129d2'
);

-- 3. Check it worked
SELECT 
  email,
  role::text as role,
  is_active,
  'Your profile is now admin!' as message
FROM profiles
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- 4. Re-enable RLS (the existing policies should work now)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;