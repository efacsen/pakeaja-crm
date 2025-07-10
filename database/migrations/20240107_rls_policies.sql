-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canvassing_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canvassing_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_read_status ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all users in their organization" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Customers policies
CREATE POLICY "Users can view all customers" ON public.customers
  FOR SELECT USING (true);

CREATE POLICY "Users can create customers" ON public.customers
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update customers" ON public.customers
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Canvassing reports policies
CREATE POLICY "Sales reps can view their own reports" ON public.canvassing_reports
  FOR SELECT USING (
    sales_rep_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('sales_manager', 'admin'))
  );

CREATE POLICY "Sales reps can create reports" ON public.canvassing_reports
  FOR INSERT WITH CHECK (sales_rep_id = auth.uid());

CREATE POLICY "Sales reps can update their own reports" ON public.canvassing_reports
  FOR UPDATE USING (sales_rep_id = auth.uid());

-- Canvassing photos policies
CREATE POLICY "Users can view photos for accessible reports" ON public.canvassing_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.canvassing_reports r
      WHERE r.id = report_id AND (
        r.sales_rep_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('sales_manager', 'admin'))
      )
    )
  );

CREATE POLICY "Users can upload photos for their reports" ON public.canvassing_photos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.canvassing_reports r
      WHERE r.id = report_id AND r.sales_rep_id = auth.uid()
    )
  );

-- Leads policies
CREATE POLICY "Sales reps can view their assigned leads" ON public.leads
  FOR SELECT USING (
    assigned_to = auth.uid() OR
    created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('sales_manager', 'admin'))
  );

CREATE POLICY "Sales reps can create leads" ON public.leads
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Sales reps can update their assigned leads" ON public.leads
  FOR UPDATE USING (
    assigned_to = auth.uid() OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('sales_manager', 'admin'))
  );

-- Lead activities policies
CREATE POLICY "Users can view activities for accessible leads" ON public.lead_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = lead_id AND (
        l.assigned_to = auth.uid() OR
        l.created_by = auth.uid() OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('sales_manager', 'admin'))
      )
    )
  );

CREATE POLICY "Users can create activities for accessible leads" ON public.lead_activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = lead_id AND (
        l.assigned_to = auth.uid() OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('sales_manager', 'admin'))
      )
    )
  );

-- Lead comments policies
CREATE POLICY "Users can view comments for accessible leads" ON public.lead_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = lead_id AND (
        l.assigned_to = auth.uid() OR
        l.created_by = auth.uid() OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('sales_manager', 'admin'))
      )
    )
  );

CREATE POLICY "Users can create comments for accessible leads" ON public.lead_comments
  FOR INSERT WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = lead_id AND (
        l.assigned_to = auth.uid() OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('sales_manager', 'admin'))
      )
    )
  );

CREATE POLICY "Users can update their own comments" ON public.lead_comments
  FOR UPDATE USING (author_id = auth.uid());

-- Comment mentions policies
CREATE POLICY "Users can view mentions" ON public.comment_mentions
  FOR SELECT USING (
    mentioned_user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.lead_comments c
      WHERE c.id = comment_id AND c.author_id = auth.uid()
    )
  );

CREATE POLICY "Users can create mentions" ON public.comment_mentions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.lead_comments c
      WHERE c.id = comment_id AND c.author_id = auth.uid()
    )
  );

-- Comment read status policies
CREATE POLICY "Users can view their own read status" ON public.comment_read_status
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can mark comments as read" ON public.comment_read_status
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their read status" ON public.comment_read_status
  FOR UPDATE USING (user_id = auth.uid());