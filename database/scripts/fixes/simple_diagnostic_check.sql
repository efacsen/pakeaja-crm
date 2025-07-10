-- SIMPLE DIAGNOSTIC CHECK - All results in one output
-- This will show everything in a single result table

WITH diagnostics AS (
    -- Check 1: Organizations
    SELECT 
        1 as check_order,
        'Organizations Table' as component,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'organizations') 
             THEN 'EXISTS' ELSE 'MISSING' END as status,
        '' as details
    
    UNION ALL
    
    -- Check 2: PakeAja Organization
    SELECT 
        2 as check_order,
        'PakeAja Organization' as component,
        CASE WHEN EXISTS (SELECT 1 FROM organizations WHERE slug = 'pakeaja') 
             THEN 'EXISTS' ELSE 'MISSING' END as status,
        '' as details
    
    UNION ALL
    
    -- Check 3: User Role Enum
    SELECT 
        3 as check_order,
        'user_role Enum Type' as component,
        CASE WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') 
             THEN 'EXISTS' ELSE 'MISSING' END as status,
        '' as details
    
    UNION ALL
    
    -- Check 4: Your Auth User
    SELECT 
        4 as check_order,
        'Your Auth User' as component,
        CASE WHEN EXISTS (SELECT 1 FROM auth.users WHERE email = 'akevinzakaria@cepatservicestation.com') 
             THEN 'EXISTS' ELSE 'MISSING' END as status,
        (SELECT id::text FROM auth.users WHERE email = 'akevinzakaria@cepatservicestation.com' LIMIT 1) as details
    
    UNION ALL
    
    -- Check 5: Your Profile
    SELECT 
        5 as check_order,
        'Your Profile' as component,
        CASE WHEN EXISTS (SELECT 1 FROM profiles WHERE email = 'akevinzakaria@cepatservicestation.com') 
             THEN 'EXISTS' ELSE 'MISSING' END as status,
        (SELECT 'Role: ' || role::text || ', Active: ' || is_active::text 
         FROM profiles WHERE email = 'akevinzakaria@cepatservicestation.com' LIMIT 1) as details
    
    UNION ALL
    
    -- Check 6: handle_new_user Function
    SELECT 
        6 as check_order,
        'handle_new_user Function' as component,
        CASE WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') 
             THEN 'EXISTS' ELSE 'MISSING' END as status,
        '' as details
    
    UNION ALL
    
    -- Check 7: create_profile_if_missing Function
    SELECT 
        7 as check_order,
        'create_profile_if_missing Function' as component,
        CASE WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'create_profile_if_missing') 
             THEN 'EXISTS' ELSE 'MISSING' END as status,
        '' as details
    
    UNION ALL
    
    -- Check 8: Auth Trigger
    SELECT 
        8 as check_order,
        'Auth User Trigger' as component,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') 
             THEN 'EXISTS' ELSE 'MISSING' END as status,
        '' as details
    
    UNION ALL
    
    -- Check 9: Service Role Policies
    SELECT 
        9 as check_order,
        'Service Role Policies' as component,
        CASE WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname LIKE '%service%') 
             THEN 'EXISTS' ELSE 'MISSING' END as status,
        (SELECT COUNT(*)::text || ' policies found' FROM pg_policies WHERE tablename = 'profiles' AND policyname LIKE '%service%') as details
    
    UNION ALL
    
    -- Check 10: Total Profiles Count
    SELECT 
        10 as check_order,
        'Total Profiles' as component,
        'COUNT' as status,
        (SELECT COUNT(*)::text || ' profiles, ' || COUNT(CASE WHEN role = 'admin' THEN 1 END)::text || ' admins' FROM profiles) as details
)
SELECT 
    component,
    CASE 
        WHEN status = 'EXISTS' THEN '✅ ' || status
        WHEN status = 'MISSING' THEN '❌ ' || status
        ELSE '📊 ' || status
    END as status,
    COALESCE(details, '') as details
FROM diagnostics
ORDER BY check_order;