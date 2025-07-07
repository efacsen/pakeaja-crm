-- ============================================================================
-- FIX RLS POLICIES - Resolve infinite recursion issue
-- ============================================================================

-- First, drop all existing policies to clean slate
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Admins and managers can view all users" ON public.users;

DROP POLICY IF EXISTS "Users can view customers they created" ON public.customers;
DROP POLICY IF EXISTS "Users can create customers" ON public.customers;
DROP POLICY IF EXISTS "Users can update customers they created" ON public.customers;
DROP POLICY IF EXISTS "Managers can view all customers" ON public.customers;

DROP POLICY IF EXISTS "Users can view their own canvassing reports" ON public.canvassing_reports;
DROP POLICY IF EXISTS "Users can create their own canvassing reports" ON public.canvassing_reports;
DROP POLICY IF EXISTS "Users can update their own canvassing reports" ON public.canvassing_reports;
DROP POLICY IF EXISTS "Managers can view all canvassing reports" ON public.canvassing_reports;

DROP POLICY IF EXISTS "Users can view assigned leads" ON public.leads;
DROP POLICY IF EXISTS "Users can update assigned leads" ON public.leads;
DROP POLICY IF EXISTS "Users can create leads" ON public.leads;
DROP POLICY IF EXISTS "Managers can view all leads" ON public.leads;

DROP POLICY IF EXISTS "Users can view activities for their leads" ON public.activities;
DROP POLICY IF EXISTS "Users can create activities" ON public.activities;
DROP POLICY IF EXISTS "Users can update their own activities" ON public.activities;

DROP POLICY IF EXISTS "Users can view comments on their leads" ON public.comments;
DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;

-- ============================================================================
-- CREATE CORRECTED RLS POLICIES (without infinite recursion)
-- ============================================================================

-- Users policies (simplified to avoid recursion)
CREATE POLICY "users_select_own" ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "users_insert_own" ON public.users FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Customers policies
CREATE POLICY "customers_select_own" ON public.customers FOR SELECT 
  USING (created_by = auth.uid());

CREATE POLICY "customers_insert_own" ON public.customers FOR INSERT 
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "customers_update_own" ON public.customers FOR UPDATE 
  USING (created_by = auth.uid());

CREATE POLICY "customers_delete_own" ON public.customers FOR DELETE 
  USING (created_by = auth.uid());

-- Canvassing reports policies
CREATE POLICY "canvassing_select_own" ON public.canvassing_reports FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "canvassing_insert_own" ON public.canvassing_reports FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "canvassing_update_own" ON public.canvassing_reports FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "canvassing_delete_own" ON public.canvassing_reports FOR DELETE 
  USING (user_id = auth.uid());

-- Leads policies
CREATE POLICY "leads_select_assigned" ON public.leads FOR SELECT 
  USING (assigned_to = auth.uid());

CREATE POLICY "leads_insert_assigned" ON public.leads FOR INSERT 
  WITH CHECK (assigned_to = auth.uid());

CREATE POLICY "leads_update_assigned" ON public.leads FOR UPDATE 
  USING (assigned_to = auth.uid());

CREATE POLICY "leads_delete_assigned" ON public.leads FOR DELETE 
  USING (assigned_to = auth.uid());

-- Activities policies
CREATE POLICY "activities_select_own" ON public.activities FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "activities_insert_own" ON public.activities FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "activities_update_own" ON public.activities FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "activities_delete_own" ON public.activities FOR DELETE 
  USING (user_id = auth.uid());

-- Comments policies
CREATE POLICY "comments_select_own" ON public.comments FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "comments_insert_own" ON public.comments FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "comments_update_own" ON public.comments FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "comments_delete_own" ON public.comments FOR DELETE 
  USING (user_id = auth.uid());

-- ============================================================================
-- ADD MANAGER/ADMIN OVERRIDE POLICIES (separate from user policies)
-- ============================================================================

-- Create function to check if user is admin/manager
CREATE OR REPLACE FUNCTION is_admin_or_manager()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'sales_manager')
  );
$$;

-- Admin/Manager can see all data
CREATE POLICY "admin_manager_all_users" ON public.users FOR ALL 
  USING (is_admin_or_manager());

CREATE POLICY "admin_manager_all_customers" ON public.customers FOR ALL 
  USING (is_admin_or_manager());

CREATE POLICY "admin_manager_all_canvassing" ON public.canvassing_reports FOR ALL 
  USING (is_admin_or_manager());

CREATE POLICY "admin_manager_all_leads" ON public.leads FOR ALL 
  USING (is_admin_or_manager());

CREATE POLICY "admin_manager_all_activities" ON public.activities FOR ALL 
  USING (is_admin_or_manager());

CREATE POLICY "admin_manager_all_comments" ON public.comments FOR ALL 
  USING (is_admin_or_manager());

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
SELECT 'RLS policies fixed successfully! No more infinite recursion.' as status;