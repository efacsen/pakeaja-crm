-- Check Current Database State
-- Run these queries to understand your current database structure

-- 1. Check if profiles table has email column
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. Check current user data (join auth.users with profiles)
SELECT 
    u.id,
    u.email as auth_email,
    p.full_name,
    p.role,
    p.email as profile_email,
    p.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'akevinzakaria@cepatservicestation.com';

-- 3. Check if user exists in profiles
SELECT EXISTS(
    SELECT 1 
    FROM profiles p
    JOIN auth.users u ON p.id = u.id
    WHERE u.email = 'akevinzakaria@cepatservicestation.com'
) as user_exists;

-- 4. Check existing types in database
SELECT typname 
FROM pg_type 
WHERE typname IN ('user_role', 'permission_action', 'resource_type');

-- 5. Check existing tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'organizations', 'permissions', 'teams', 'territories')
ORDER BY table_name;