# Database Migration Guide for Horizon Suite CRM

This guide explains how to set up the comprehensive database schema for your Horizon Suite CRM application.

## Overview

The database schema includes:
- **6 main tables** with proper relationships
- **Row Level Security (RLS)** policies for multi-tenant security
- **Performance indexes** for optimal query performance
- **Automated triggers** for updated_at timestamps
- **Custom functions** for common operations
- **Views** for complex queries
- **Data validation** with constraints and checks

## Tables Structure

### 1. **profiles** (extends auth.users)
- Stores user profile information
- Links to Supabase Auth users
- Includes role-based access control

### 2. **organizations** 
- Multi-tenant organization structure
- JSONB settings for flexible configuration
- Central hub for all business data

### 3. **customers**
- Customer relationship management
- JSONB address for flexible location data
- Organization-scoped with RLS

### 4. **coating_calculations**
- Specialized coating cost calculations
- Auto-calculated total_cost and final_price
- Support for multiple coating types and layers

### 5. **projects**
- Project management with status tracking
- Customer relationships and assignments
- Date validation constraints

### 6. **sales_opportunities**
- Sales pipeline management
- Stage-based opportunity tracking
- Probability and value forecasting

## Migration Steps

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Create a new query

### Step 2: Execute the Schema

Copy and paste the contents of `schema.sql` into the SQL Editor and run it. The script will:

1. ✅ Enable required extensions
2. ✅ Create custom enum types
3. ✅ Create all tables with proper constraints
4. ✅ Set up foreign key relationships
5. ✅ Create performance indexes
6. ✅ Enable Row Level Security
7. ✅ Create security policies
8. ✅ Set up automated triggers
9. ✅ Create utility functions
10. ✅ Create summary views

### Step 3: Verify Installation

Run these queries to verify everything was created correctly:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

### Step 4: Set Up Initial Data

After running the schema, you'll need to set up initial data:

#### Create Your Organization
```sql
INSERT INTO organizations (name, settings) VALUES 
('Your Company Name', '{"timezone": "UTC", "currency": "USD"}');
```

#### Update Your Profile
```sql
-- First, sign up through your application to create the auth user
-- Then update your profile with organization info
UPDATE profiles 
SET 
    full_name = 'Your Name',
    role = 'admin',
    organization_id = (SELECT id FROM organizations WHERE name = 'Your Company Name')
WHERE id = auth.uid();
```

## Security Features

### Row Level Security (RLS)
- **Organization-scoped**: Users can only access data within their organization
- **Role-based permissions**: Different access levels for admin/manager/user roles
- **Owner-based access**: Users can modify their own records

### Key Security Policies:
- Users can only view/edit profiles in their organization
- Only admins can update organization settings
- Users can CRUD customers within their organization
- Calculations can be edited by creators or managers
- Projects can be managed by creators, assignees, or managers
- Sales opportunities follow similar access patterns

## Performance Optimizations

### Indexes Created:
- **Primary lookups**: All foreign keys indexed
- **Common queries**: Organization, customer, date-based queries
- **Search operations**: Email, name, status fields
- **Reporting**: Created_at timestamps for time-based queries

### Generated Columns:
- `total_cost` in coating_calculations (material_cost + labor_cost)
- `final_price` in coating_calculations (total_cost * (1 + margin/100))

## Custom Functions

### `get_user_organization()`
Returns the current user's organization ID for queries.

### `is_admin_or_manager()`
Checks if the current user has admin or manager privileges.

## Views for Complex Queries

### `customer_summary`
Provides customer data with project and opportunity counts.

### `project_summary`
Includes project data with customer and assignee details.

## Data Validation

### Constraints:
- Surface area must be positive
- Costs must be non-negative
- Margin must be 0-100%
- Probability must be 0-100%
- End dates must be after start dates

### Enum Types:
- `user_role`: admin, manager, user
- `project_status`: planning, active, on_hold, completed, cancelled
- `sales_stage`: prospecting, qualification, proposal, negotiation, closed_won, closed_lost
- `coating_type`: primer, base_coat, top_coat, clear_coat, specialty

## Backup and Maintenance

### Regular Backups
Supabase automatically handles backups, but consider:
- Exporting critical data periodically
- Testing restore procedures
- Monitoring database performance

### Schema Updates
When updating the schema:
1. Test changes in a development environment
2. Use migrations for production changes
3. Update TypeScript types accordingly
4. Regenerate types: `npx supabase gen types typescript --project-id YOUR_PROJECT_ID`

## Troubleshooting

### Common Issues:

1. **RLS Blocking Queries**: Ensure users have proper organization assignments
2. **Foreign Key Errors**: Check that referenced records exist
3. **Permission Denied**: Verify user roles and organization membership
4. **Type Errors**: Ensure enum values match defined types

### Debug Queries:
```sql
-- Check user's organization
SELECT * FROM profiles WHERE id = auth.uid();

-- Check RLS policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Check user permissions
SELECT has_table_privilege('customers', 'SELECT');
```

## Next Steps

After successful migration:
1. Set up your application environment variables
2. Test database connections from your Next.js app
3. Implement user onboarding flow
4. Set up data seeding for development
5. Configure monitoring and alerts

Your Horizon Suite CRM database is now ready for production use! 🚀 