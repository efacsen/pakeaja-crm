# Supabase Dashboard Migration Guide

This is the easiest way to apply the RBAC migration without installing any tools.

## Step-by-Step Instructions

### 1. Open Supabase Dashboard
- Go to your Supabase project
- Click on "SQL Editor" in the left sidebar

### 2. Create New Query
- Click "New query" button
- Name it "RBAC Migration"

### 3. Copy Migration SQL
Open the file: `../supabase/migrations/20250108_master_rbac_migration.sql`
Copy ALL contents (Ctrl+A, Ctrl+C or Cmd+A, Cmd+C)

### 4. Paste and Run
- Paste the SQL into the query editor
- Click "Run" button (or press Ctrl+Enter / Cmd+Enter)

### 5. Check Results
You should see:
- Green success messages
- "RBAC migration completed successfully!"
- "User akevinzakaria@cepatservicestation.com has been granted admin role."

### 6. Verify Your Admin Role
Create a new query and run:
```sql
SELECT 
    email, 
    role, 
    department, 
    position 
FROM profiles 
WHERE email = 'akevinzakaria@cepatservicestation.com';
```

Should show:
- role: admin
- department: Management
- position: System Administrator

## Visual Guide

### Finding SQL Editor
1. Look for the cylinder/database icon in sidebar
2. Click "SQL Editor"

### Running Queries
1. Green "Run" button executes the query
2. Results appear below
3. Green checkmarks = success
4. Red X = errors (see troubleshooting)

## Troubleshooting

### "type already exists" Error
Run this first:
```sql
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS permission_action CASCADE;
DROP TYPE IF EXISTS resource_type CASCADE;
```
Then run the migration again.

### "permission denied" Error
Contact Supabase support - your database user needs CREATE privileges.

### No User Found
Make sure you've logged in at least once with akevinzakaria@cepatservicestation.com

## After Migration

1. **Log out** of your application
2. **Log back in** to refresh your session
3. **Check profile page** - should show "Administrator"
4. **Visit /dashboard/users** - should be accessible

## Alternative: Table Editor

If you just need to update your role:
1. Go to "Table Editor"
2. Select "profiles" table
3. Find your email
4. Edit the row
5. Change role to "admin"
6. Save

But this won't create the full RBAC structure - use SQL migration for complete setup.