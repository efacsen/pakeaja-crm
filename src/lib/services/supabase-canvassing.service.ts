import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase.types';
import { CanvassingReport, CreateCanvassingReportRequest } from '@/types/canvassing';

type DbCanvassingReport = Database['public']['Tables']['canvassing_reports']['Row'];
type DbCanvassingPhoto = Database['public']['Tables']['canvassing_photos']['Row'];

export class SupabaseCanvassingService {
  private supabase = createClient();

  /**
   * Create a new canvassing report
   */
  async createReport(
    data: CreateCanvassingReportRequest,
    userId: string,
    userName: string
  ): Promise<{ data: CanvassingReport | null; error: string | null }> {
    try {
      // Create the report
      const { data: report, error: reportError } = await this.supabase
        .from('canvassing_reports')
        .insert({
          visit_date: data.visit_date,
          company_id: data.company_id,
          company_name: data.company_name,
          company_address: data.company_address,
          contact_id: data.contact_id,
          contact_person: data.contact_person,
          contact_position: data.contact_position,
          contact_phone: data.contact_phone,
          contact_email: data.contact_email,
          visit_outcome: data.visit_outcome,
          project_segment: data.project_segment,
          priority: data.priority,
          potential_type: data.potential_type,
          potential_area: data.potential_area,
          potential_materials: data.potential_materials,
          potential_value: data.potential_value,
          current_supplier: data.current_supplier,
          competitor_price: data.competitor_price,
          decision_timeline: data.decision_timeline,
          next_action: data.next_action,
          next_action_date: data.next_action_date,
          general_notes: data.general_notes,
          gps_latitude: data.gps_latitude,
          gps_longitude: data.gps_longitude,
          sales_rep_id: userId,
          sales_rep_name: userName,
        })
        .select()
        .single();

      if (reportError) {
        return { data: null, error: reportError.message };
      }

      // Upload photos if any
      if (data.photos && data.photos.length > 0) {
        const photoUrls = await this.uploadPhotos(data.photos, report.id);
        
        // Save photo references
        if (photoUrls.length > 0) {
          await this.supabase
            .from('canvassing_photos')
            .insert(
              photoUrls.map(url => ({
                report_id: report.id,
                photo_url: url,
              }))
            );
        }
      }

      // Auto-create lead if outcome is positive
      if (data.visit_outcome === 'interested' || data.visit_outcome === 'follow_up_needed') {
        await this.createLeadFromReport(report, userId, userName);
      }

      // Convert to app format
      const convertedReport = this.convertToAppFormat(report);
      return { data: convertedReport, error: null };
    } catch (error) {
      console.error('Error creating canvassing report:', error);
      return { data: null, error: 'Failed to create report' };
    }
  }

  /**
   * Get all canvassing reports with filters
   * Also aliased as listReports for compatibility
   */
  async getReports(filters?: {
    salesRepId?: string;
    outcome?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ 
    data: { reports: CanvassingReport[]; total: number } | null; 
    error: string | null 
  }> {
    try {
      let query = this.supabase
        .from('canvassing_reports')
        .select('*, canvassing_photos(photo_url)', { count: 'exact' });

      // Apply filters
      if (filters?.salesRepId) {
        query = query.eq('sales_rep_id', filters.salesRepId);
      }
      if (filters?.outcome) {
        query = query.eq('visit_outcome', filters.outcome);
      }
      if (filters?.dateFrom) {
        query = query.gte('visit_date', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('visit_date', filters.dateTo);
      }
      if (filters?.search) {
        query = query.or(`company_name.ilike.%${filters.search}%,contact_person.ilike.%${filters.search}%`);
      }

      // Pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query
        .order('visit_date', { ascending: false })
        .range(from, to);

      const { data, error, count } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      // Convert to app format
      const reports = data.map(report => this.convertToAppFormat(report));

      return { 
        data: { 
          reports, 
          total: count || 0 
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error getting reports:', error);
      return { data: null, error: 'Failed to get reports' };
    }
  }

  // Alias for compatibility
  async listReports(
    filters?: any,
    page?: number,
    limit?: number
  ): Promise<{ 
    data: { reports: CanvassingReport[]; total: number } | null; 
    error: string | null 
  }> {
    return this.getReports({ ...filters, page, limit });
  }

  /**
   * Get stats for canvassing
   */
  async getStats(): Promise<{ data: any; error: string | null }> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      // Get visits today
      const { count: visitsToday } = await this.supabase
        .from('canvassing_reports')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Get visits this month
      const { count: visitsMonth } = await this.supabase
        .from('canvassing_reports')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      return {
        data: {
          visits_today: visitsToday || 0,
          visits_this_month: visitsMonth || 0,
        },
        error: null,
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return { data: null, error: 'Failed to get stats' };
    }
  }

  /**
   * Update a canvassing report
   */
  async updateReport(
    id: string,
    updates: Partial<CanvassingReport>
  ): Promise<{ data: CanvassingReport | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('canvassing_reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      const convertedReport = this.convertToAppFormat(data);
      return { data: convertedReport, error: null };
    } catch (error) {
      console.error('Error updating report:', error);
      return { data: null, error: 'Failed to update report' };
    }
  }

  /**
   * Delete a canvassing report
   */
  async deleteReport(id: string): Promise<{ error: string | null }> {
    try {
      const { error } = await this.supabase
        .from('canvassing_reports')
        .delete()
        .eq('id', id);

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Error deleting report:', error);
      return { error: 'Failed to delete report' };
    }
  }

  /**
   * Convert canvassing report to lead
   */
  async convertToLead(
    reportId: string,
    userId?: string,
    userName?: string
  ): Promise<{ data: { leadId: string } | null; error: string | null }> {
    try {
      // Get the report
      const { data: report, error: fetchError } = await this.supabase
        .from('canvassing_reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (fetchError || !report) {
        return { data: null, error: 'Report not found' };
      }

      // Check if already converted
      if (report.lead_id) {
        return { data: { leadId: report.lead_id }, error: null };
      }

      // Get current user if not provided
      if (!userId) {
        const { data: { user } } = await this.supabase.auth.getUser();
        userId = user?.id;
        userName = user?.email;
      }

      // Create lead
      const leadId = await this.createLeadFromReport(report, userId!, userName!);
      
      if (!leadId) {
        return { data: null, error: 'Failed to create lead' };
      }

      // Update report with lead reference
      await this.supabase
        .from('canvassing_reports')
        .update({ lead_id: leadId, converted_to_lead: true })
        .eq('id', reportId);

      return { data: { leadId }, error: null };
    } catch (error) {
      console.error('Error converting to lead:', error);
      return { data: null, error: 'Failed to convert to lead' };
    }
  }

  /**
   * Sync offline reports - placeholder for now
   */
  async syncOfflineReports(): Promise<{ synced: number; failed: number }> {
    // In a real implementation, this would sync offline reports
    return { synced: 0, failed: 0 };
  }

  /**
   * Get analytics data
   */
  async getAnalytics(
    dateFrom?: string,
    dateTo?: string
  ): Promise<{ data: any; error: string | null }> {
    try {
      let query = this.supabase
        .from('canvassing_reports')
        .select('visit_outcome, project_segment, priority, potential_value, created_at');

      if (dateFrom) {
        query = query.gte('visit_date', dateFrom);
      }
      if (dateTo) {
        query = query.lte('visit_date', dateTo);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      // Process analytics
      const analytics = {
        total_visits: data.length,
        outcomes: this.groupBy(data, 'visit_outcome'),
        segments: this.groupBy(data, 'project_segment'),
        priorities: this.groupBy(data, 'priority'),
        total_potential: data.reduce((sum, r) => sum + (r.potential_value || 0), 0),
      };

      return { data: analytics, error: null };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return { data: null, error: 'Failed to get analytics' };
    }
  }

  /**
   * Helper: Convert DB format to app format
   */
  private convertToAppFormat(dbReport: any): CanvassingReport {
    return {
      id: dbReport.id,
      sales_rep_id: dbReport.sales_rep_id || dbReport.user_id,
      sales_rep_name: dbReport.sales_rep_name,
      company_id: dbReport.company_id,
      company_name: dbReport.company_name,
      contact_id: dbReport.contact_id,
      contact_person: dbReport.contact_person,
      contact_position: dbReport.contact_position,
      contact_phone: dbReport.contact_phone || dbReport.phone,
      contact_email: dbReport.contact_email || dbReport.email,
      company_address: dbReport.company_address || dbReport.address,
      visit_date: dbReport.visit_date,
      visit_outcome: dbReport.visit_outcome || dbReport.outcome,
      priority: dbReport.priority || 'medium',
      potential_type: dbReport.potential_type || 'value',
      potential_area: dbReport.potential_area,
      potential_materials: dbReport.potential_materials,
      potential_value: dbReport.potential_value || dbReport.project_value,
      project_segment: dbReport.project_segment,
      last_communication_date: dbReport.last_communication_date,
      next_action: dbReport.next_action,
      next_action_date: dbReport.next_action_date || dbReport.follow_up_date,
      next_action_notes: dbReport.next_action_notes,
      photos: dbReport.canvassing_photos?.map((p: any) => ({
        id: p.id,
        url: p.photo_url,
        timestamp: p.created_at,
        is_uploaded: true,
      })) || [],
      general_notes: dbReport.general_notes || dbReport.notes,
      gps_latitude: dbReport.gps_latitude,
      gps_longitude: dbReport.gps_longitude,
      lead_id: dbReport.lead_id,
      auto_created_lead: dbReport.converted_to_lead,
      is_synced: true,
      created_at: dbReport.created_at,
      updated_at: dbReport.updated_at,
      current_supplier: dbReport.current_supplier,
      competitor_price: dbReport.competitor_price,
      decision_timeline: dbReport.decision_timeline,
    };
  }

  /**
   * Helper: Upload photos
   */
  private async uploadPhotos(photos: File[] | string[], reportId: string): Promise<string[]> {
    const urls: string[] = [];

    for (const photo of photos) {
      if (typeof photo === 'string') {
        urls.push(photo);
      } else {
        // Upload file to Supabase Storage
        const fileName = `canvassing/${reportId}/${Date.now()}-${photo.name}`;
        const { data, error } = await this.supabase.storage
          .from('canvassing-photos')
          .upload(fileName, photo);

        if (!error && data) {
          const { data: urlData } = this.supabase.storage
            .from('canvassing-photos')
            .getPublicUrl(data.path);
          
          urls.push(urlData.publicUrl);
        }
      }
    }

    return urls;
  }

  /**
   * Helper: Create lead from report
   */
  private async createLeadFromReport(
    report: any,
    userId: string,
    userName: string
  ): Promise<string | null> {
    try {
      const { data: lead, error } = await this.supabase
        .from('leads')
        .insert({
          company_id: report.company_id,
          company_name: report.company_name,
          contact_person: report.contact_person,
          contact_email: report.contact_email || report.email,
          contact_phone: report.contact_phone || report.phone,
          project_name: `Potential Project - ${report.company_name}`,
          project_description: report.general_notes || report.notes,
          estimated_value: report.potential_value || report.project_value || 0,
          status: 'new',
          source: 'canvassing',
          assigned_to: userId,
          created_by: userId,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating lead:', error);
        return null;
      }

      return lead.id;
    } catch (error) {
      console.error('Error creating lead from report:', error);
      return null;
    }
  }

  /**
   * Helper: Group by key
   */
  private groupBy(data: any[], key: string): Record<string, number> {
    return data.reduce((acc, item) => {
      const value = item[key] || 'unknown';
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }
}

// Export singleton instance
export const supabaseCanvassingService = new SupabaseCanvassingService();