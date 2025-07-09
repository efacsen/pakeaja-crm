import { createClient } from '@/lib/supabase/client';
import { startOfDay, endOfDay, format } from 'date-fns';

export interface DailyReportActivity {
  customer_visits: number;
  calls_made: number;
  proposals_sent: number;
  deals_won: number;
  deals_lost: number;
  follow_ups: number;
}

export interface DailyReport {
  id: string;
  user_id: string;
  report_date: string;
  report_type: 'daily' | 'weekly';
  customer_visits: number;
  calls_made: number;
  proposals_sent: number;
  deals_won: number;
  deals_lost: number;
  follow_ups: number;
  summary: string | null;
  challenges: string | null;
  tomorrow_plan: string | null;
  status: 'draft' | 'submitted' | 'approved';
  submitted_at: string | null;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyReportWithUser extends DailyReport {
  user_name: string;
  user_email: string;
  user_role: string;
  approved_by_name: string | null;
}

export interface CreateDailyReportData {
  report_date?: string;
  report_type?: 'daily' | 'weekly';
  customer_visits: number;
  calls_made: number;
  proposals_sent: number;
  deals_won: number;
  deals_lost: number;
  follow_ups: number;
  summary: string;
  challenges: string;
  tomorrow_plan: string;
  status?: 'draft' | 'submitted';
}

export interface DailyReportFilters {
  user_id?: string;
  start_date?: string;
  end_date?: string;
  status?: 'draft' | 'submitted' | 'approved';
  report_type?: 'daily' | 'weekly';
}

export class DailyReportsService {
  private supabase = createClient();

  // Get today's report for the current user
  async getTodayReport(): Promise<{ data: DailyReport | null; error: string | null }> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const today = format(new Date(), 'yyyy-MM-dd');
      
      const { data, error } = await this.supabase
        .from('daily_reports')
        .select('*')
        .eq('user_id', user.id)
        .eq('report_date', today)
        .eq('report_type', 'daily')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching today report:', error);
      return { data: null, error: 'Failed to fetch today report' };
    }
  }

  // Create or update a daily report
  async saveDailyReport(reportData: CreateDailyReportData): Promise<{ data: DailyReport | null; error: string | null }> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const report_date = reportData.report_date || format(new Date(), 'yyyy-MM-dd');
      
      // Check if report already exists
      const { data: existingReport } = await this.supabase
        .from('daily_reports')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('report_date', report_date)
        .eq('report_type', reportData.report_type || 'daily')
        .single();

      const reportPayload = {
        user_id: user.id,
        report_date,
        report_type: reportData.report_type || 'daily',
        customer_visits: reportData.customer_visits,
        calls_made: reportData.calls_made,
        proposals_sent: reportData.proposals_sent,
        deals_won: reportData.deals_won,
        deals_lost: reportData.deals_lost,
        follow_ups: reportData.follow_ups,
        summary: reportData.summary,
        challenges: reportData.challenges,
        tomorrow_plan: reportData.tomorrow_plan,
        status: reportData.status || 'draft',
        submitted_at: reportData.status === 'submitted' ? new Date().toISOString() : null,
      };

      let result;
      
      if (existingReport) {
        // Don't update if already submitted/approved
        if (existingReport.status !== 'draft' && reportData.status !== 'submitted') {
          return { data: null, error: 'Cannot update submitted or approved report' };
        }
        
        // Update existing report
        result = await this.supabase
          .from('daily_reports')
          .update(reportPayload)
          .eq('id', existingReport.id)
          .select()
          .single();
      } else {
        // Create new report
        result = await this.supabase
          .from('daily_reports')
          .insert([reportPayload])
          .select()
          .single();
      }

      if (result.error) {
        return { data: null, error: result.error.message };
      }

      return { data: result.data, error: null };
    } catch (error) {
      console.error('Error saving daily report:', error);
      return { data: null, error: 'Failed to save daily report' };
    }
  }

  // Submit a draft report
  async submitReport(reportId: string): Promise<{ data: DailyReport | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('daily_reports')
        .update({ 
          status: 'submitted',
          submitted_at: new Date().toISOString()
        })
        .eq('id', reportId)
        .eq('status', 'draft')
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error submitting report:', error);
      return { data: null, error: 'Failed to submit report' };
    }
  }

  // Get reports with filters
  async getReports(filters?: DailyReportFilters): Promise<{ data: DailyReportWithUser[] | null; error: string | null }> {
    try {
      let query = this.supabase
        .from('daily_reports_with_user')
        .select('*')
        .order('report_date', { ascending: false });

      if (filters?.user_id) {
        query = query.eq('user_id', filters.user_id);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.report_type) {
        query = query.eq('report_type', filters.report_type);
      }

      if (filters?.start_date) {
        query = query.gte('report_date', filters.start_date);
      }

      if (filters?.end_date) {
        query = query.lte('report_date', filters.end_date);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching reports:', error);
      return { data: null, error: 'Failed to fetch reports' };
    }
  }

  // Get team reports for managers
  async getTeamReports(teamId?: string, date?: string): Promise<{ data: DailyReportWithUser[] | null; error: string | null }> {
    try {
      const reportDate = date || format(new Date(), 'yyyy-MM-dd');
      
      let query = this.supabase
        .from('daily_reports_with_user')
        .select('*')
        .eq('report_date', reportDate)
        .order('submitted_at', { ascending: false });

      if (teamId) {
        // Filter by team members if team ID provided
        const { data: teamMembers } = await this.supabase
          .from('team_members')
          .select('user_id')
          .eq('team_id', teamId);

        if (teamMembers && teamMembers.length > 0) {
          const userIds = teamMembers.map(m => m.user_id);
          query = query.in('user_id', userIds);
        }
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching team reports:', error);
      return { data: null, error: 'Failed to fetch team reports' };
    }
  }

  // Approve a report (managers only)
  async approveReport(reportId: string): Promise<{ data: DailyReport | null; error: string | null }> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await this.supabase
        .from('daily_reports')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: user.id
        })
        .eq('id', reportId)
        .eq('status', 'submitted')
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error approving report:', error);
      return { data: null, error: 'Failed to approve report' };
    }
  }

  // Get report statistics
  async getReportStats(userId?: string, startDate?: string, endDate?: string): Promise<{ data: any | null; error: string | null }> {
    try {
      let query = this.supabase
        .from('daily_reports')
        .select('customer_visits, calls_made, proposals_sent, deals_won, deals_lost, follow_ups');

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (startDate) {
        query = query.gte('report_date', startDate);
      }

      if (endDate) {
        query = query.lte('report_date', endDate);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      // Calculate totals
      const stats = {
        total_customer_visits: 0,
        total_calls_made: 0,
        total_proposals_sent: 0,
        total_deals_won: 0,
        total_deals_lost: 0,
        total_follow_ups: 0,
        report_count: data?.length || 0,
      };

      if (data && data.length > 0) {
        data.forEach(report => {
          stats.total_customer_visits += report.customer_visits || 0;
          stats.total_calls_made += report.calls_made || 0;
          stats.total_proposals_sent += report.proposals_sent || 0;
          stats.total_deals_won += report.deals_won || 0;
          stats.total_deals_lost += report.deals_lost || 0;
          stats.total_follow_ups += report.follow_ups || 0;
        });
      }

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching report stats:', error);
      return { data: null, error: 'Failed to fetch report stats' };
    }
  }
}

export const dailyReportsService = new DailyReportsService();