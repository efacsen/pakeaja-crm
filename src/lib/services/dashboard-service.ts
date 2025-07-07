import { createClient } from '@/lib/supabase/client';
import { DashboardData, TeamKPI, PersonalKPI, ProjectStatus, UserRole } from '@/types/dashboard';

export const dashboardService = {
  async getDashboardData(userId?: string, viewingAsRole?: UserRole): Promise<DashboardData> {
    const supabase = createClient();
    
    // Get current user if no specific userId provided
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;
    
    if (!targetUserId) {
      throw new Error('No user ID available');
    }

    // Get user details
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', targetUserId)
      .single();

    const userRole = viewingAsRole || userData?.role || 'sales_rep';

    // Get team KPI data (for managers and above)
    let teamKpi: TeamKPI | null = null;
    if (['superadmin', 'admin', 'sales_manager'].includes(userRole)) {
      teamKpi = await this.getTeamKPI();
    }

    // Get personal KPI data
    const personalKpi = await this.getPersonalKPI(targetUserId, userData?.full_name || 'Unknown User');

    // Get active projects
    const activeProjects = await this.getActiveProjects();

    return {
      team_kpi: teamKpi!,
      personal_kpi: personalKpi,
      active_projects: activeProjects,
      recent_activities: [],
      notifications: [],
    };
  },

  async getTeamKPI(): Promise<TeamKPI> {
    const supabase = createClient();
    
    // Get all sales team members
    const { data: teamMembers } = await supabase
      .from('users')
      .select('*')
      .in('role', ['sales_rep', 'sales_manager']);

    const teamMembersCount = teamMembers?.length || 0;

    // Get leads data for the current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: leads } = await supabase
      .from('leads')
      .select('*')
      .gte('created_at', startOfMonth.toISOString());

    const totalLeads = leads?.length || 0;
    const qualifiedLeads = leads?.filter(l => l.status === 'qualified').length || 0;
    const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

    // Get canvassing reports for the month
    const { data: canvassingReports } = await supabase
      .from('canvassing_reports')
      .select('*')
      .gte('created_at', startOfMonth.toISOString());

    const totalVisits = canvassingReports?.length || 0;

    // Calculate mock revenue data (in real app, this would come from actual sales data)
    const totalRevenue = 2850000000;
    const revenueTarget = 3000000000;
    const revenueAchievementPercentage = Math.round((totalRevenue / revenueTarget) * 100);

    // Get top performers (mock data for now)
    const topPerformers = teamMembers?.slice(0, 3).map((member, index) => ({
      id: member.id,
      name: member.full_name || 'Unknown',
      revenue: (950000000 - (index * 170000000)),
      deals_closed: 6 - index,
      achievement_percentage: 118 - (index * 20),
    })) || [];

    return {
      id: '1',
      team_id: 'team-jakarta',
      team_name: 'Team Jakarta',
      period: 'monthly',
      total_revenue: totalRevenue,
      revenue_target: revenueTarget,
      revenue_achievement_percentage: revenueAchievementPercentage,
      total_leads: totalLeads,
      qualified_leads: qualifiedLeads,
      conversion_rate: conversionRate,
      total_visits: totalVisits,
      total_quotes: Math.round(totalVisits * 0.18), // Estimate 18% of visits result in quotes
      quotes_won: Math.round(totalVisits * 0.12), // Estimate 12% win rate
      win_rate: 64,
      pipeline_value: 4500000000,
      average_deal_size: 250000000,
      average_sales_cycle_days: 21,
      top_performers: topPerformers,
      team_members_count: teamMembersCount,
      active_members_today: Math.round(teamMembersCount * 0.75), // Estimate 75% active
    };
  },

  async getPersonalKPI(userId: string, userName: string): Promise<PersonalKPI> {
    const supabase = createClient();
    
    // Get user's leads
    const { data: userLeads } = await supabase
      .from('leads')
      .select('*')
      .eq('assigned_to', userId);

    const leadsAssigned = userLeads?.length || 0;
    const leadsContacted = userLeads?.filter(l => 
      l.status === 'contacted' || l.status === 'qualified' || l.status === 'proposal'
    ).length || 0;
    const leadsQualified = userLeads?.filter(l => l.status === 'qualified').length || 0;

    // Get user's canvassing reports for the month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: userCanvassing } = await supabase
      .from('canvassing_reports')
      .select('*')
      .eq('sales_rep_id', userId)
      .gte('created_at', startOfMonth.toISOString());

    const visitsCompleted = userCanvassing?.length || 0;

    // Get today's activities
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const { data: todayActivities } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startOfToday.toISOString());

    const activitiesToday = todayActivities?.length || 0;

    // Mock data for other metrics (in real app, these would come from actual data)
    return {
      id: userId,
      user_id: userId,
      user_name: userName,
      period: 'monthly',
      personal_revenue: 950000000,
      personal_target: 800000000,
      achievement_percentage: 118,
      rank_in_team: 1,
      visits_completed: visitsCompleted,
      visits_target: 30,
      quotes_created: Math.round(visitsCompleted * 0.4), // Estimate 40% of visits result in quotes
      quotes_won: Math.round(visitsCompleted * 0.2), // Estimate 20% win rate
      leads_assigned: leadsAssigned,
      leads_contacted: leadsContacted,
      leads_qualified: leadsQualified,
      follow_ups_pending: userLeads?.filter(l => l.status === 'contacted').length || 0,
      activities_today: activitiesToday,
      calls_made: todayActivities?.filter(a => a.type === 'call').length || 0,
      emails_sent: todayActivities?.filter(a => a.type === 'email').length || 0,
      meetings_scheduled: todayActivities?.filter(a => a.type === 'meeting').length || 0,
      daily_visit_streak: 5,
      weekly_target_streak: 3,
    };
  },

  async getActiveProjects(): Promise<ProjectStatus[]> {
    const supabase = createClient();
    
    // For now, return mock data as we don't have a projects table yet
    // In real implementation, this would fetch from actual projects table
    return [
      {
        id: '1',
        project_name: 'Coating Pabrik PT Sinar Jaya',
        client_name: 'PT Sinar Jaya Konstruksi',
        status: 'in_progress',
        progress_percentage: 65,
        start_date: '2024-01-15',
        end_date: '2024-03-30',
        days_remaining: 45,
        is_overdue: false,
        contract_value: 850000000,
        invoiced_amount: 550000000,
        paid_amount: 400000000,
        outstanding_amount: 150000000,
        total_milestones: 5,
        completed_milestones: 3,
        current_milestone: 'Aplikasi Cat Eksterior',
        next_milestone_date: '2024-02-28',
        project_manager: 'Rudi Hermawan',
        team_members: ['Ahmad', 'Budi', 'Citra'],
        risk_level: 'low',
        issues_count: 1,
      },
      {
        id: '2',
        project_name: 'Waterproofing Mall Central',
        client_name: 'CV Mitra Abadi',
        status: 'planning',
        progress_percentage: 15,
        start_date: '2024-03-01',
        end_date: '2024-05-15',
        days_remaining: 75,
        is_overdue: false,
        contract_value: 425000000,
        invoiced_amount: 0,
        paid_amount: 0,
        outstanding_amount: 0,
        total_milestones: 4,
        completed_milestones: 0,
        current_milestone: 'Persiapan dan Survey',
        next_milestone_date: '2024-03-10',
        project_manager: 'Dewi Lestari',
        team_members: ['Eko', 'Fitri'],
        risk_level: 'medium',
        issues_count: 2,
      },
    ];
  },

  async getRecentActivities() {
    const supabase = createClient();
    
    // Get recent activities
    const { data: activities } = await supabase
      .from('activities')
      .select(`
        *,
        leads (
          company_name
        ),
        users (
          full_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    return activities?.map(activity => ({
      id: activity.id,
      type: activity.type,
      description: activity.description,
      user_name: activity.users?.full_name || 'Unknown User',
      company_name: activity.leads?.company_name || 'Unknown Company',
      created_at: activity.created_at,
    })) || [];
  },

  async getStats() {
    const supabase = createClient();
    
    // Get customer count
    const { count: customerCount } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });

    // Get canvassing stats
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: canvassingToday } = await supabase
      .from('canvassing_reports')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfToday.toISOString());

    const { count: canvassingMonth } = await supabase
      .from('canvassing_reports')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString());

    // Mock data for calculations and projects (as we don't have these tables yet)
    return {
      totalCustomers: customerCount || 0,
      totalCalculations: 42, // Mock
      activeProjects: 2, // Mock
      monthlyRevenue: 2850000000, // Mock
      canvassingToday: canvassingToday || 0,
      canvassingMonth: canvassingMonth || 0,
    };
  },
};