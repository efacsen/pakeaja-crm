# 🔧 Fix Company Functions Error

## Quick Fix for "function name 'get_or_create_company' is not unique" Error

### Step 1: Go to Supabase SQL Editor
1. Open your [Supabase Dashboard](https://app.supabase.com)
2. Click on **SQL Editor** in the left sidebar

### Step 2: Run the Fix Migration
1. Click **"New query"**
2. Copy ALL content from: `/supabase/migrations/20250109_fix_company_functions.sql`
3. Paste it into the SQL editor
4. Click **"Run"** button

### Step 3: Verify Success
After running, you should see a result table showing:
```
routine_name              | routine_type | data_type
-------------------------|--------------|----------
get_or_create_company    | FUNCTION     | uuid
search_companies_with_contacts | FUNCTION | record
```

### Step 4: Test the Calculator
1. Go to http://localhost:3002/dashboard/calculator
2. Login as manager (manager@pakeaja.com)
3. Try creating a new company - it should work now!

## What This Fix Does:
- Drops ALL existing versions of the functions (handles different parameter signatures)
- Recreates them with the correct signatures
- Ensures proper permissions for authenticated users

## If You Still Get Errors:
1. Check if you have admin/owner permissions in Supabase
2. Try running each DROP statement individually first
3. Then run the CREATE statements

## Success Indicators:
✅ No errors when running the SQL
✅ The verification query shows both functions
✅ Calculator can create new companies without errors
✅ Company search autocomplete works