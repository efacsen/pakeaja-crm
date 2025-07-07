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
          company_name: data.company_name,
          company_address: data.company_address,
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
    data: CanvassingReport[]; 
    total: number; 
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

      const { data, count, error } = await query;

      if (error) {
        return { data: [], total: 0, error: error.message };
      }

      // Convert to app format
      const reports = data.map(report => this.convertToAppFormat(report));
      
      return { data: reports, total: count || 0, error: null };
    } catch (error) {
      console.error('Error fetching canvassing reports:', error);
      return { data: [], total: 0, error: 'Failed to fetch reports' };
    }
  }

  /**
   * Get a single report by ID
   */
  async getReportById(id: string): Promise<{ data: CanvassingReport | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('canvassing_reports')
        .select('*, canvassing_photos(photo_url)')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: this.convertToAppFormat(data), error: null };
    } catch (error) {
      console.error('Error fetching report:', error);
      return { data: null, error: 'Failed to fetch report' };
    }
  }

  /**
   * Update a canvassing report
   */
  async updateReport(
    id: string,
    updates: Partial<CreateCanvassingReportRequest>
  ): Promise<{ data: CanvassingReport | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('canvassing_reports')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: this.convertToAppFormat(data), error: null };
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
    userId: string,
    userName: string
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

      // Create lead
      const leadId = await this.createLeadFromReport(report, userId, userName);
      
      if (!leadId) {
        return { data: null, error: 'Failed to create lead' };
      }

      // Update report with lead reference
      await this.supabase
        .from('canvassing_reports')
        .update({ lead_id: leadId })
        .eq('id', reportId);

      return { data: { leadId }, error: null };
    } catch (error) {
      console.error('Error converting to lead:', error);
      return { data: null, error: 'Failed to convert to lead' };
    }
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
        total_potential_value: data.reduce((sum, r) => sum + (r.potential_value || 0), 0),
        conversion_rate: this.calculateConversionRate(data),
      };

      return { data: analytics, error: null };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return { data: null, error: 'Failed to fetch analytics' };
    }
  }

  /**
   * Private helper methods
   */
  private async uploadPhotos(photos: File[], reportId: string): Promise<string[]> {
    const uploadPromises = photos.map(async (photo, index) => {
      const fileName = `canvassing/${reportId}/${Date.now()}_${index}.jpg`;
      const { data, error } = await this.supabase.storage
        .from('canvassing-photos')
        .upload(fileName, photo, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (error) {
        console.error('Photo upload error:', error);
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from('canvassing-photos')
        .getPublicUrl(fileName);

      return publicUrl;
    });

    const results = await Promise.all(uploadPromises);
    return results.filter(url => url !== null) as string[];
  }

  private async createLeadFromReport(
    report: DbCanvassingReport,
    userId: string,
    userName: string
  ): Promise<string | null> {
    try {
      // First, create or find customer
      let customerId: string | null = null;
      
      // Check if customer exists
      const { data: existingCustomer } = await this.supabase
        .from('customers')
        .select('id')
        .eq('company_name', report.company_name)
        .single();

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        // Create new customer
        const { data: newCustomer, error: customerError } = await this.supabase
          .from('customers')
          .insert({
            company_name: report.company_name,
            contact_person: report.contact_person,
            email: report.contact_email,
            phone: report.contact_phone,
            address: report.company_address,
            created_by: userId,
          })
          .select()
          .single();

        if (customerError || !newCustomer) {
          console.error('Error creating customer:', customerError);
          return null;
        }
        customerId = newCustomer.id;
      }

      // Calculate initial temperature based on priority
      const initialTemperature = report.priority === 'urgent' ? 60 : 
                               report.priority === 'high' ? 40 : 20;

      // Create lead
      const { data: lead, error: leadError } = await this.supabase
        .from('leads')
        .insert({
          customer_id: customerId,
          project_name: `${report.company_name} - ${report.project_segment}`,
          project_description: report.general_notes,
          project_address: report.company_address,
          deal_type: 'supply_apply', // Default
          stage: 'lead',
          temperature: initialTemperature,
          temperature_status: initialTemperature >= 60 ? 'hot' : 
                            initialTemperature >= 40 ? 'warm' : 'cold',
          probability: 20,
          estimated_value: report.potential_value,
          expected_close_date: report.decision_timeline ? 
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
          source: 'canvassing',
          is_from_canvassing: true,
          canvassing_report_id: report.id,
          assigned_to: userId,
          created_by: userId,
        })
        .select()
        .single();

      if (leadError || !lead) {
        console.error('Error creating lead:', leadError);
        return null;
      }

      // Log activity
      await this.supabase
        .from('lead_activities')
        .insert({
          lead_id: lead.id,
          activity_type: 'note_added',
          title: 'Lead created from canvassing visit',
          description: `Canvassing visit on ${report.visit_date}. Outcome: ${report.visit_outcome}`,
          temperature_impact: 0,
          created_by: userId,
        });

      return lead.id;
    } catch (error) {
      console.error('Error creating lead from report:', error);
      return null;
    }
  }

  private convertToAppFormat(dbReport: any): CanvassingReport {
    return {
      id: dbReport.id,
      visit_date: dbReport.visit_date,
      company_name: dbReport.company_name,
      company_address: dbReport.company_address,
      contact_person: dbReport.contact_person,
      contact_position: dbReport.contact_position,
      contact_phone: dbReport.contact_phone,
      contact_email: dbReport.contact_email,
      visit_outcome: dbReport.visit_outcome,
      project_segment: dbReport.project_segment,
      priority: dbReport.priority,
      potential_type: dbReport.potential_type,
      potential_area: dbReport.potential_area,
      potential_materials: dbReport.potential_materials,
      potential_value: dbReport.potential_value,
      current_supplier: dbReport.current_supplier,
      competitor_price: dbReport.competitor_price,
      decision_timeline: dbReport.decision_timeline,
      next_action: dbReport.next_action,
      next_action_date: dbReport.next_action_date,
      general_notes: dbReport.general_notes,
      gps_latitude: dbReport.gps_latitude,
      gps_longitude: dbReport.gps_longitude,
      is_synced: dbReport.is_synced,
      sales_rep_id: dbReport.sales_rep_id,
      sales_rep_name: dbReport.sales_rep_name,
      lead_id: dbReport.lead_id,
      auto_created_lead: !!dbReport.lead_id,
      photos: dbReport.canvassing_photos?.map((p: any) => p.photo_url) || [],
      created_at: dbReport.created_at,
      updated_at: dbReport.updated_at,
    };
  }

  private groupBy(data: any[], key: string): Record<string, number> {
    return data.reduce((acc, item) => {
      const value = item[key];
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }

  private calculateConversionRate(data: any[]): number {
    const converted = data.filter(r => 
      r.visit_outcome === 'interested' || r.visit_outcome === 'follow_up_needed'
    ).length;
    return data.length > 0 ? (converted / data.length) * 100 : 0;
  }
}

export const supabaseCanvassingService = new SupabaseCanvassingService();