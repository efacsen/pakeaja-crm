# 🔧 Setup Company Functions for Calculator

The calculator feature needs database functions to create companies. Please run the following SQL in your Supabase SQL Editor:

## Steps:

1. **Go to Supabase Dashboard**
   - Visit your [Supabase project](https://app.supabase.com)
   - Navigate to **SQL Editor** in the left sidebar

2. **Run the Migration**
   - Click "New query"
   - Copy and paste the contents of `/supabase/migrations/20250109_create_company_functions.sql`
   - Click "Run"

3. **Verify Installation**
   Run this query to check if the functions were created:
   ```sql
   SELECT routine_name 
   FROM information_schema.routines 
   WHERE routine_type = 'FUNCTION' 
   AND routine_name IN ('get_or_create_company', 'search_companies_with_contacts');
   ```

   You should see both functions listed.

## What These Functions Do:

### `get_or_create_company`
- Checks if a company exists by name
- Creates it if it doesn't exist
- Returns the company ID
- Used by the calculator when adding new companies

### `search_companies_with_contacts`
- Searches companies and their contacts
- Used by the autocomplete in calculator
- Returns matching companies and contacts

## Testing:

After running the migration, test the calculator:
1. Go to http://localhost:3002/dashboard/calculator
2. Try to create a new company in the company field
3. It should now work without errors!

## Troubleshooting:

If you get permission errors:
- Make sure you're running the SQL as the database owner
- Check that the GRANT statements at the end of the script executed successfully

If the functions still don't work:
- Clear your browser cache and refresh
- Check the browser console for any errors
- Verify the functions exist using the verification query above