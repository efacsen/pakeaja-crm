# 🔧 Fix Storage Access Issue

The test shows that the `canvassing-photos` bucket is missing. Here's how to fix it:

## Option 1: Using Supabase Dashboard UI (Recommended)

1. **Go to your Supabase Dashboard**
   - Visit https://app.supabase.com
   - Select your project

2. **Navigate to Storage**
   - Click on "Storage" in the left sidebar

3. **Create New Bucket**
   - Click "New bucket" button
   - Enter bucket name: `canvassing-photos`
   - ✅ Check "Public bucket" option
   - Click "Save"

4. **Set Bucket Policies**
   - Click on the `canvassing-photos` bucket
   - Go to "Policies" tab
   - Click "New Policy"
   - Select "For full customization" 
   - Create these 4 policies:

   **Policy 1: INSERT**
   - Name: `Authenticated users can upload photos`
   - Allowed operation: INSERT
   - Target roles: authenticated
   - WITH CHECK expression: `true`

   **Policy 2: SELECT**
   - Name: `Authenticated users can view photos`
   - Allowed operation: SELECT
   - Target roles: authenticated
   - USING expression: `true`

   **Policy 3: UPDATE**
   - Name: `Users can update own photos`
   - Allowed operation: UPDATE
   - Target roles: authenticated
   - USING expression: `auth.uid()::text = (storage.foldername(name))[1]`
   - WITH CHECK expression: `auth.uid()::text = (storage.foldername(name))[1]`

   **Policy 4: DELETE**
   - Name: `Users can delete own photos`
   - Allowed operation: DELETE
   - Target roles: authenticated
   - USING expression: `auth.uid()::text = (storage.foldername(name))[1]`

## Option 2: Using SQL Editor

1. **Go to SQL Editor in Supabase Dashboard**
   - Click on "SQL Editor" in the left sidebar

2. **Run the Setup Script**
   - Copy the contents of `supabase/setup-storage.sql`
   - Paste into the SQL editor
   - Click "Run"

## Option 3: Quick Fix (Minimal Setup)

If you just want to pass the test quickly:

1. Go to Supabase Dashboard > Storage
2. Click "New bucket"
3. Name: `canvassing-photos`
4. Check "Public bucket"
5. Save

This creates the bucket with default policies that allow authenticated users to manage files.

## Verify the Fix

After creating the bucket:

1. Go back to http://localhost:3002/test-supabase
2. Click "Run Tests" again
3. All 4 tests should now pass ✅

## Troubleshooting

If the test still fails:

1. **Check bucket name**: Must be exactly `canvassing-photos` (with hyphen, not underscore)
2. **Check permissions**: Ensure your Supabase user has storage admin rights
3. **Clear cache**: Hard refresh the test page (Ctrl+Shift+R or Cmd+Shift+R)
4. **Check logs**: Look at browser console for any errors

## Why This Bucket?

The `canvassing-photos` bucket is used for:
- Storing photos taken during field visits
- Customer site documentation
- Project progress photos
- Sales team field reports

Once fixed, the canvassing feature at `/dashboard/canvassing` will be able to store photos properly.