-- COMPLETE FIX FOR RLS POLICIES AND PROFILE SETUP
-- This script safely handles existing policies and ensures your admin profile is set up

-- Step 1: Show current policies (for debugging)
SELECT 
    pol.polname as policy_name,
    CASE pol.polcmd 
        WHEN 'r' THEN 'SELECT'
        WHEN 'a' THEN 'INSERT'
        WHEN 'w' THEN 'UPDATE'
        WHEN 'd' THEN 'DELETE'
        WHEN '*' THEN 'ALL'
    END as operation
FROM pg_policy pol 
JOIN pg_class rel ON pol.polrelid = rel.oid 
WHERE rel.relname = 'profiles';

-- Step 2: Temporarily disable RLS to avoid any issues
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 3: Drop ALL existing policies on profiles table (comprehensive)
DO $$ 
DECLARE
    pol record;
BEGIN
    -- Loop through all policies and drop them
    FOR pol IN 
        SELECT polname 
        FROM pg_policy p 
        JOIN pg_class c ON p.polrelid = c.oid 
        WHERE c.relname = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', pol.polname);
        RAISE NOTICE 'Dropped policy: %', pol.polname;
    END LOOP;
END $$;

-- Step 4: Ensure your profile exists with admin role
DO $$
DECLARE
    v_org_id UUID;
    v_user_id UUID := 'fc500bff-dc42-4595-a156-800d745129d2';
    v_email TEXT := 'akevinzakaria@cepatservicestation.com';
BEGIN
    -- Get the default organization
    SELECT id INTO v_org_id FROM organizations WHERE slug = 'pakeaja' LIMIT 1;
    
    -- Check if profile exists
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = v_user_id) THEN
        -- Insert the profile
        INSERT INTO profiles (
            id, 
            email, 
            full_name, 
            role, 
            organization_id, 
            is_active,
            joined_at,
            created_at,
            updated_at
        ) VALUES (
            v_user_id,
            v_email,
            'Kevin Zakaria',
            'admin'::user_role,
            v_org_id,
            true,
            CURRENT_DATE,
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Profile created for %', v_email;
    ELSE
        -- Update existing profile to ensure admin role
        UPDATE profiles 
        SET 
            role = 'admin'::user_role,
            is_active = true,
            email = COALESCE(email, v_email),
            organization_id = COALESCE(organization_id, v_org_id),
            updated_at = NOW()
        WHERE id = v_user_id;
        RAISE NOTICE 'Profile updated for %', v_email;
    END IF;
END $$;

-- Step 5: Create clean, non-recursive RLS policies
-- Policy 1: Users can view their own profile
CREATE POLICY "profiles_select_own" ON profiles
    FOR SELECT 
    USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE 
    USING (auth.uid() = id);

-- Policy 3: Users can insert their own profile (during signup)
CREATE POLICY "profiles_insert_own" ON profiles
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Policy 4: Service role bypass for system operations
CREATE POLICY "profiles_service_role" ON profiles
    FOR ALL 
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Policy 5: Allow users to see other profiles in their organization (non-recursive)
CREATE POLICY "profiles_select_same_org" ON profiles
    FOR SELECT
    USING (
        id != auth.uid() -- Prevent recursion by excluding self
        AND organization_id IS NOT NULL
        AND organization_id IN (
            SELECT organization_id 
            FROM profiles 
            WHERE id = auth.uid() 
            LIMIT 1
        )
    );

-- Step 6: Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 7: Verify the setup
DO $$
DECLARE
    v_count INTEGER;
    v_role TEXT;
    v_active BOOLEAN;
BEGIN
    -- Check if we can query the specific user
    SELECT COUNT(*), MAX(role::text), MAX(is_active::text::boolean)
    INTO v_count, v_role, v_active
    FROM profiles
    WHERE email = 'akevinzakaria@cepatservicestation.com';
    
    RAISE NOTICE '';
    RAISE NOTICE '========== VERIFICATION RESULTS ==========';
    IF v_count > 0 THEN
        RAISE NOTICE '✅ Profile found!';
        RAISE NOTICE '   Role: %', v_role;
        RAISE NOTICE '   Active: %', v_active;
        IF v_role = 'admin' AND v_active THEN
            RAISE NOTICE '✅ Everything looks good! You should now be able to access the site.';
        ELSE
            RAISE NOTICE '⚠️  Profile exists but may need role/active status update';
        END IF;
    ELSE
        RAISE NOTICE '❌ Profile not found or not accessible';
    END IF;
    
    -- Show current policies
    RAISE NOTICE '';
    RAISE NOTICE 'Current RLS policies on profiles table:';
    FOR v_role IN 
        SELECT pol.polname 
        FROM pg_policy pol 
        JOIN pg_class rel ON pol.polrelid = rel.oid 
        WHERE rel.relname = 'profiles'
        ORDER BY pol.polname
    LOOP
        RAISE NOTICE '   - %', v_role;
    END LOOP;
    RAISE NOTICE '==========================================';
END $$;

-- Step 8: Final query to show your profile
SELECT 
    id,
    email,
    full_name,
    role::text as role,
    is_active,
    organization_id,
    CASE 
        WHEN role = 'admin' AND is_active = true THEN '✅ Ready to go!'
        ELSE '⚠️  May need adjustment'
    END as status
FROM profiles
WHERE email = 'akevinzakaria@cepatservicestation.com';