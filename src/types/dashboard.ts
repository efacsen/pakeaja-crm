export interface TeamKPI {
  id: string;
  team_id: string;
  team_name: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  
  // Sales Metrics
  total_revenue: number;
  revenue_target: number;
  revenue_achievement_percentage: number;
  
  // Lead Metrics
  total_leads: number;
  qualified_leads: number;
  conversion_rate: number;
  
  // Activity Metrics
  total_visits: number;
  total_quotes: number;
  quotes_won: number;
  win_rate: number;
  
  // Pipeline Metrics
  pipeline_value: number;
  average_deal_size: number;
  average_sales_cycle_days: number;
  
  // Team Performance
  top_performers: TeamMember[];
  team_members_count: number;
  active_members_today: number;
}

export interface PersonalKPI {
  id: string;
  user_id: string;
  user_name: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  
  // Sales Performance
  personal_revenue: number;
  personal_target: number;
  achievement_percentage: number;
  rank_in_team: number;
  
  // Activity Metrics
  visits_completed: number;
  visits_target: number;
  quotes_created: number;
  quotes_won: number;
  
  // Lead Management
  leads_assigned: number;
  leads_contacted: number;
  leads_qualified: number;
  follow_ups_pending: number;
  
  // Productivity
  activities_today: number;
  calls_made: number;
  emails_sent: number;
  meetings_scheduled: number;
  
  // Streaks
  daily_visit_streak: number;
  weekly_target_streak: number;
}

export interface ProjectStatus {
  id: string;
  project_name: string;
  client_name: string;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  progress_percentage: number;
  
  // Timeline
  start_date: string;
  end_date: string;
  days_remaining: number;
  is_overdue: boolean;
  
  // Financials
  contract_value: number;
  invoiced_amount: number;
  paid_amount: number;
  outstanding_amount: number;
  
  // Milestones
  total_milestones: number;
  completed_milestones: number;
  current_milestone: string;
  next_milestone_date: string;
  
  // Team
  project_manager: string;
  team_members: string[];
  
  // Risks
  risk_level: 'low' | 'medium' | 'high';
  issues_count: number;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  revenue: number;
  deals_closed: number;
  achievement_percentage: number;
}

export interface DashboardData {
  team_kpi: TeamKPI;
  personal_kpi: PersonalKPI;
  active_projects: ProjectStatus[];
  recent_activities: Activity[];
  notifications: Notification[];
}

export interface Activity {
  id: string;
  type: 'visit' | 'quote' | 'deal_won' | 'deal_lost' | 'lead_created' | 'milestone_completed';
  title: string;
  description: string;
  user_name: string;
  user_avatar?: string;
  timestamp: string;
  related_entity?: {
    type: 'lead' | 'quote' | 'project' | 'client';
    id: string;
    name: string;
  };
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  is_read: boolean;
  action_url?: string;
}

// Role-based views
export type UserRole = 'admin' | 'admin' | 'manager' | 'sales' | 'project_manager' | 'viewer';

export interface RolePermissions {
  can_view_all_teams: boolean;
  can_view_all_users: boolean;
  can_switch_perspective: boolean;
  can_edit_targets: boolean;
  can_view_financials: boolean;
  can_manage_projects: boolean;
  can_export_data: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    can_view_all_teams: true,
    can_view_all_users: true,
    can_switch_perspective: true,
    can_edit_targets: true,
    can_view_financials: true,
    can_manage_projects: true,
    can_export_data: true,
  },
  admin: {
    can_view_all_teams: true,
    can_view_all_users: true,
    can_switch_perspective: false,
    can_edit_targets: true,
    can_view_financials: true,
    can_manage_projects: true,
    can_export_data: true,
  },
  manager: {
    can_view_all_teams: false,
    can_view_all_users: false,
    can_switch_perspective: false,
    can_edit_targets: false,
    can_view_financials: true,
    can_manage_projects: false,
    can_export_data: true,
  },
  sales: {
    can_view_all_teams: false,
    can_view_all_users: false,
    can_switch_perspective: false,
    can_edit_targets: false,
    can_view_financials: false,
    can_manage_projects: false,
    can_export_data: false,
  },
  project_manager: {
    can_view_all_teams: false,
    can_view_all_users: false,
    can_switch_perspective: false,
    can_edit_targets: false,
    can_view_financials: true,
    can_manage_projects: true,
    can_export_data: true,
  },
  viewer: {
    can_view_all_teams: false,
    can_view_all_users: false,
    can_switch_perspective: false,
    can_edit_targets: false,
    can_view_financials: false,
    can_manage_projects: false,
    can_export_data: false,
  },
};