# Team & Territory Tables Setup Guide

## Overview
The team hierarchy and territory management features require database tables that haven't been created yet. This guide will help you set them up.

## Current Status
- ✅ RBAC system is implemented and working
- ✅ You have admin role in the database
- ❌ Team and territory tables don't exist yet
- ❌ TypeScript types need to be regenerated after creating tables

## Setup Instructions

### Option A: Quick Setup (Recommended)

1. **Run the migration in Supabase Dashboard**
   ```bash
   # Open your Supabase SQL Editor
   open https://supabase.com/dashboard/project/bemrgpgwaatizgxftzgg/sql
   ```

2. **Copy and paste the migration**
   - Open: `supabase/migrations/20250109_create_team_territory_tables.sql`
   - Copy the entire contents
   - Paste into SQL Editor
   - Click "Run"

3. **Run the setup script**
   ```bash
   ./scripts/setup-teams-territories.sh
   ```
   This will:
   - Guide you through the process
   - Regenerate TypeScript types
   - Verify the tables were created

### Option B: Manual Setup

1. **Run the migration**
   - Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/bemrgpgwaatizgxftzgg/sql)
   - Copy contents of `supabase/migrations/20250109_create_team_territory_tables.sql`
   - Run the query

2. **Regenerate types**
   ```bash
   npx supabase gen types typescript --project-id bemrgpgwaatizgxftzgg > src/types/database.types.ts
   ```

3. **Verify tables exist**
   Run this query in Supabase:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('teams', 'territories', 'team_members', 'user_territories');
   ```
   Should return 4 rows.

## What the Migration Creates

### 1. Tables
- **teams**: Organizational teams with hierarchy
- **team_members**: Team membership records
- **territories**: Geographic/logical territories
- **user_territories**: User-territory assignments

### 2. Sample Data
- Creates "Jakarta" and "Bandung" territories
- Creates "Sales Team Jakarta" team
- Assigns you as team lead
- Assigns you to Jakarta territory

### 3. Helper Views
- **team_hierarchy**: Teams with lead names and parent info
- **user_team_memberships**: User-team relationships
- **user_territory_assignments**: User-territory relationships

### 4. RLS Policies
- Users can view teams/territories in their organization
- Managers can manage teams and territories
- Team leads can manage their team members

## Verification

After running the migration, you should see:
```
===========================================
SUCCESS: All 4 tables created successfully!
===========================================
Table counts:
  - teams: 1 records
  - team_members: 1 records
  - territories: 2 records
  - user_territories: 1 records
```

## Next Steps

Once the tables are created and types are regenerated:

1. **Build Team Management UI** (`/dashboard/teams`)
   - List teams with hierarchy
   - Create/edit teams
   - Manage team members

2. **Build Territory Management UI** (`/dashboard/territories`)
   - List territories with hierarchy
   - Create/edit territories
   - Assign users to territories

3. **Update User Profile**
   - Show team memberships
   - Show territory assignments
   - Display reporting structure

## Troubleshooting

### "function get_user_organization(uuid) does not exist" Error
If you get this error, run this first:
```sql
-- Run in Supabase SQL Editor
-- File: supabase/migrations/20250109_fix_missing_function.sql
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

GRANT EXECUTE ON FUNCTION get_user_organization(UUID) TO authenticated;
```

Then run the team/territory migration again.

### Tables not created
- Check for errors in the SQL Editor output
- Ensure you have admin role
- Try running the CREATE TABLE statements individually

### Types not generating
- Ensure you're logged into Supabase CLI: `npx supabase login`
- Check your project ID is correct
- Try regenerating with: `npx supabase db types generate`

### RLS errors
- The migration uses `get_user_organization()` function
- This should have been created in the RBAC migration
- If missing, run the fix above

## Questions?

If you encounter any issues:
1. Check the SQL Editor for error messages
2. Verify your admin role is active
3. Ensure the RBAC migration was completed first