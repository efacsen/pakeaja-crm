# RBAC Migration and Implementation Plan

## Overview
This plan outlines the steps to properly implement the RBAC system, fix existing issues, and update your user (akevinzakaria@cepatservicestation.com) to admin role.

## Critical Issues Identified

### 1. Type Conflicts
- **Problem**: Two different `user_role` enums exist in migrations
- **Impact**: Migrations will fail due to duplicate type definitions
- **Solution**: Create a unified migration that handles the transition

### 2. Table Structure Conflicts
- **Problem**: Old migrations create `users` table, new RBAC uses `profiles`
- **Impact**: Foreign key references will fail
- **Solution**: Consolidate into profiles table

### 3. Code References to Old Roles
- **Problem**: 88 files still reference old role types
- **Impact**: Application will break after migration
- **Solution**: Update critical files first, use compatibility layer

### 4. Middleware Async Issue
- **Problem**: `createClient()` called without await in RBAC middleware
- **Impact**: Middleware won't work properly
- **Solution**: Fix the async/await usage

## Migration Strategy

### Step 1: Create Master Migration File
Create a single migration that handles all transitions properly:

```sql
-- RBAC Master Migration
-- This replaces all previous migrations to avoid conflicts

-- 1. Drop existing types if they exist
DROP TYPE IF EXISTS user_role CASCADE;

-- 2. Create new user_role enum with all roles
CREATE TYPE user_role AS ENUM (
    'admin', 'manager', 'sales', 'estimator', 
    'project_manager', 'foreman', 'inspector', 'client'
);

-- 3. Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Insert default organization
INSERT INTO organizations (name, slug) 
VALUES ('PakeAja', 'pakeaja')
ON CONFLICT (slug) DO NOTHING;

-- 5. Ensure profiles table has all required columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id),
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS department VARCHAR(100),
ADD COLUMN IF NOT EXISTS position VARCHAR(100),
ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS joined_at DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS reports_to UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 6. Update role column to use new enum
ALTER TABLE profiles 
ALTER COLUMN role TYPE user_role 
USING CASE 
    WHEN role::text = 'superadmin' THEN 'admin'::user_role
    WHEN role::text = 'admin' THEN 'admin'::user_role
    WHEN role::text = 'sales_rep' THEN 'sales'::user_role
    WHEN role::text = 'sales_manager' THEN 'manager'::user_role
    WHEN role::text = 'estimator' THEN 'estimator'::user_role
    WHEN role::text = 'project_manager' THEN 'project_manager'::user_role
    WHEN role::text = 'foreman' THEN 'foreman'::user_role
    WHEN role::text = 'customer' THEN 'client'::user_role
    WHEN role::text = 'client' THEN 'client'::user_role
    ELSE 'sales'::user_role
END;

-- 7. Set organization_id for all existing profiles
UPDATE profiles 
SET organization_id = (SELECT id FROM organizations WHERE slug = 'pakeaja' LIMIT 1)
WHERE organization_id IS NULL;

-- 8. Create other RBAC tables
CREATE TYPE IF NOT EXISTS permission_action AS ENUM ('create', 'read', 'update', 'delete', 'approve', 'export');
CREATE TYPE IF NOT EXISTS resource_type AS ENUM (
    'users', 'contacts', 'leads', 'opportunities', 'quotes', 'projects', 
    'materials', 'calculations', 'reports', 'documents', 'settings'
);

-- ... (rest of RBAC schema from 20250108_create_rbac_schema.sql)
```

### Step 2: Update Your User to Admin

After running the migration, execute this query to make yourself admin:

```sql
-- Update specific user to admin role
UPDATE profiles 
SET 
    role = 'admin'::user_role,
    department = 'Management',
    position = 'System Administrator',
    updated_at = NOW()
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- Verify the update
SELECT id, email, full_name, role, organization_id, department, position 
FROM profiles 
WHERE email = 'akevinzakaria@cepatservicestation.com';
```

## psql Commands to Execute

### 1. Connect to Your Supabase Database
```bash
# Get your database URL from Supabase dashboard
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### 2. Run Migrations in Order
```sql
-- First, check what tables exist
\dt

-- Check existing user roles
SELECT DISTINCT role FROM profiles;

-- Run the master migration (copy the content from above)
-- ... (paste migration content)

-- Update your user to admin
UPDATE profiles 
SET role = 'admin'::user_role
WHERE email = 'akevinzakaria@cepatservicestation.com';

-- Verify
SELECT email, role FROM profiles WHERE email = 'akevinzakaria@cepatservicestation.com';
```

## Code Fixes Required

### Priority 1: Fix Middleware (Immediate)
```typescript
// src/middleware/rbac.ts - Line 71
// Change from:
const supabase = createClient();
// To:
const supabase = await createClient();
```

### Priority 2: Update Admin Check (Immediate)
```typescript
// src/lib/auth/admin-check.ts
// Change all 'superadmin' to 'admin'
```

### Priority 3: Update Critical Components
1. Dashboard layout - role checks
2. API routes - permission checks
3. Navigation components - role-based visibility

### Use Compatibility Layer
For non-critical components, use the auth-compat.ts mapping:
```typescript
import { roleMapping } from '@/types/auth-compat';

// Convert old role to new role
const newRole = roleMapping[oldRole] || 'sales';
```

## Testing Checklist

### After Migration:
- [ ] Your user has admin role
- [ ] Can access /dashboard/users
- [ ] Navigation shows admin sections
- [ ] Profile page shows correct role
- [ ] Other users retain their converted roles

### After Code Fixes:
- [ ] Middleware properly checks permissions
- [ ] Admin routes are accessible
- [ ] No TypeScript errors for role types
- [ ] Navigation items show correctly

## Rollback Plan

If issues occur:
1. **Database**: Keep backup of current state before migration
2. **Code**: Git commit before changes
3. **Quick Fix**: Can manually update role in Supabase dashboard

## Recommended Execution Order

1. **Backup current database state**
2. **Run master migration via psql**
3. **Update your user to admin**
4. **Fix middleware async issue**
5. **Update admin-check.ts**
6. **Test basic functionality**
7. **Gradually update other components**

## Alternative: Quick Fix via Supabase Dashboard

If you prefer not to use psql:
1. Go to Supabase Dashboard > SQL Editor
2. Run the migration queries
3. Use Table Editor to manually update your role to 'admin'

## Notes
- The migration handles role conversion automatically
- Existing data is preserved
- New tables are created for RBAC functionality
- Your existing profile will be linked to the default organization
- All permission structures will be created automatically

This plan ensures a smooth transition to the RBAC system while maintaining data integrity and application functionality.