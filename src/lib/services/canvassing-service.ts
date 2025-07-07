import { 
  CanvassingReport, 
  CreateCanvassingReportRequest, 
  CanvassingReportFilters, 
  CanvassingReportListResponse,
  CanvassingStats,
  CanvassingPhoto
} from '@/types/canvassing';
import { customersService } from './customers-service';
import { Customer } from '@/types/customers';
import { mockPipelineService } from './sales/mock-pipeline.service';
import { Lead, DealType } from '@/types/sales';

export class CanvassingService {
  private storageKey = 'horizon-canvassing-reports';
  private offlineQueueKey = 'horizon-canvassing-offline-queue';
  private photosStorageKey = 'horizon-canvassing-photos';

  // Create new canvassing report
  async createReport(
    data: CreateCanvassingReportRequest, 
    userId: string = 'demo-user-123',
    userName: string = 'Demo User',
    isOffline: boolean = false
  ): Promise<{ data: CanvassingReport | null; error: string | null }> {
    try {
      // Handle photos
      const photos: CanvassingPhoto[] = [];
      if (data.photos && data.photos.length > 0) {
        for (let i = 0; i < data.photos.length; i++) {
          const photo = data.photos[i];
          if (photo instanceof File) {
            // For offline mode, convert to base64
            if (isOffline) {
              const base64 = await this.fileToBase64(photo);
              photos.push({
                id: `photo-${Date.now()}-${i}`,
                local_uri: base64,
                caption: `Photo ${i + 1}`,
                timestamp: new Date().toISOString(),
                gps_latitude: data.gps_latitude,
                gps_longitude: data.gps_longitude,
                is_uploaded: false
              });
            } else {
              // In online mode, we'd upload to storage
              // For now, simulate with local storage
              photos.push({
                id: `photo-${Date.now()}-${i}`,
                url: `/api/photos/${Date.now()}-${i}`, // Simulated URL
                caption: `Photo ${i + 1}`,
                timestamp: new Date().toISOString(),
                gps_latitude: data.gps_latitude,
                gps_longitude: data.gps_longitude,
                is_uploaded: true
              });
            }
          } else if (typeof photo === 'string') {
            photos.push({
              id: `photo-${Date.now()}-${i}`,
              url: photo,
              caption: `Photo ${i + 1}`,
              timestamp: new Date().toISOString(),
              is_uploaded: true
            });
          }
        }
      }

      const report: CanvassingReport = {
        id: `canvassing-${Date.now()}`,
        sales_rep_id: userId,
        sales_rep_name: userName,
        ...data,
        photos,
        is_synced: !isOffline,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_offline: isOffline,
        local_id: isOffline ? `local-${Date.now()}` : undefined
      };

      // If offline, add to queue
      if (isOffline) {
        this.addToOfflineQueue(report);
      }

      // Save to local storage
      const existingReports = this.getStoredReports();
      existingReports.push(report);
      this.saveReports(existingReports);

      // Auto-create lead in pipeline if visit outcome is positive
      if (!isOffline && !data.lead_id && this.shouldCreateLead(report)) {
        const leadResult = await this.createPipelineLead(report, userId, userName);
        if (leadResult.data) {
          report.lead_id = leadResult.data.id;
          report.auto_created_lead = true;
          this.updateReport(report.id, { 
            lead_id: leadResult.data.id, 
            auto_created_lead: true 
          });
        }
      }

      return { data: report, error: null };
    } catch (error) {
      console.error('Error creating canvassing report:', error);
      return { data: null, error: 'Failed to create canvassing report' };
    }
  }

  // Update existing report
  async updateReport(id: string, updates: Partial<CanvassingReport>): Promise<{ data: CanvassingReport | null; error: string | null }> {
    try {
      const reports = this.getStoredReports();
      const index = reports.findIndex(r => r.id === id);
      
      if (index === -1) {
        return { data: null, error: 'Report not found' };
      }

      const updatedReport: CanvassingReport = {
        ...reports[index],
        ...updates,
        updated_at: new Date().toISOString()
      };

      reports[index] = updatedReport;
      this.saveReports(reports);

      return { data: updatedReport, error: null };
    } catch (error) {
      console.error('Error updating report:', error);
      return { data: null, error: 'Failed to update report' };
    }
  }

  // Get report by ID
  async getReport(id: string): Promise<{ data: CanvassingReport | null; error: string | null }> {
    try {
      const reports = this.getStoredReports();
      const report = reports.find(r => r.id === id);
      
      return { data: report || null, error: report ? null : 'Report not found' };
    } catch (error) {
      console.error('Error fetching report:', error);
      return { data: null, error: 'Failed to fetch report' };
    }
  }

  // List reports with filters
  async listReports(
    filters: CanvassingReportFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: CanvassingReportListResponse | null; error: string | null }> {
    try {
      let reports = this.getStoredReports();

      // Apply filters
      if (filters.sales_rep_id) {
        reports = reports.filter(r => r.sales_rep_id === filters.sales_rep_id);
      }
      if (filters.visit_outcome) {
        reports = reports.filter(r => r.visit_outcome === filters.visit_outcome);
      }
      if (filters.project_segment) {
        reports = reports.filter(r => r.project_segment === filters.project_segment);
      }
      if (filters.date_from) {
        reports = reports.filter(r => new Date(r.visit_date) >= new Date(filters.date_from!));
      }
      if (filters.date_to) {
        reports = reports.filter(r => new Date(r.visit_date) <= new Date(filters.date_to!));
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        reports = reports.filter(r => 
          r.company_name.toLowerCase().includes(searchLower) ||
          r.contact_person.toLowerCase().includes(searchLower)
        );
      }
      if (filters.has_potential !== undefined) {
        reports = reports.filter(r => 
          filters.has_potential ? (r.potential_value && r.potential_value > 0) : !r.potential_value
        );
      }
      if (filters.is_synced !== undefined) {
        reports = reports.filter(r => r.is_synced === filters.is_synced);
      }

      // Sort by visit date desc
      reports.sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime());

      // Pagination
      const total = reports.length;
      const startIndex = (page - 1) * limit;
      const paginatedReports = reports.slice(startIndex, startIndex + limit);

      return {
        data: {
          reports: paginatedReports,
          total,
          page,
          limit,
        },
        error: null,
      };
    } catch (error) {
      console.error('Error listing reports:', error);
      return { data: null, error: 'Failed to list reports' };
    }
  }

  // Get statistics
  async getStats(salesRepId?: string): Promise<{ data: CanvassingStats | null; error: string | null }> {
    try {
      let reports = this.getStoredReports();
      
      if (salesRepId) {
        reports = reports.filter(r => r.sales_rep_id === salesRepId);
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const stats: CanvassingStats = {
        total_visits: reports.length,
        visits_today: reports.filter(r => new Date(r.visit_date) >= today).length,
        visits_this_week: reports.filter(r => new Date(r.visit_date) >= weekStart).length,
        visits_this_month: reports.filter(r => new Date(r.visit_date) >= monthStart).length,
        
        by_outcome: {
          interested: reports.filter(r => r.visit_outcome === 'interested').length,
          not_interested: reports.filter(r => r.visit_outcome === 'not_interested').length,
          follow_up_needed: reports.filter(r => r.visit_outcome === 'follow_up_needed').length,
          already_customer: reports.filter(r => r.visit_outcome === 'already_customer').length,
          competitor_locked: reports.filter(r => r.visit_outcome === 'competitor_locked').length,
        },
        
        by_segment: {
          decorative: reports.filter(r => r.project_segment === 'decorative').length,
          floor: reports.filter(r => r.project_segment === 'floor').length,
          marine: reports.filter(r => r.project_segment === 'marine').length,
          protective: reports.filter(r => r.project_segment === 'protective').length,
          steel: reports.filter(r => r.project_segment === 'steel').length,
          waterproofing: reports.filter(r => r.project_segment === 'waterproofing').length,
          others: reports.filter(r => r.project_segment === 'others').length,
        },
        
        total_potential_value: reports.reduce((sum, r) => sum + (r.potential_value || 0), 0),
        total_potential_area: reports.reduce((sum, r) => sum + (r.potential_area || 0), 0),
        
        top_sales_reps: this.getTopSalesReps(reports),
        upcoming_follow_ups: this.getUpcomingFollowUps(reports),
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting stats:', error);
      return { data: null, error: 'Failed to get statistics' };
    }
  }

  // Convert existing canvassing report to lead
  async convertToLead(
    reportId: string,
    userId: string = 'demo-user-123',
    userName: string = 'Demo User'
  ): Promise<{ data: Lead | null; error: string | null }> {
    const reports = this.getStoredReports();
    const report = reports.find(r => r.id === reportId);
    
    if (!report) {
      return { data: null, error: 'Report not found' };
    }
    
    if (report.lead_id) {
      return { data: null, error: 'Lead already exists for this report' };
    }
    
    // Create lead in pipeline
    const result = await this.createPipelineLead(report, userId, userName);
    
    if (result.data) {
      // Update report with lead_id
      this.updateReport(reportId, {
        lead_id: result.data.id,
        auto_created_lead: false // Manual conversion
      });
    }
    
    return result;
  }

  // Sync offline reports
  async syncOfflineReports(): Promise<{ synced: number; failed: number; errors: string[] }> {
    const queue = this.getOfflineQueue();
    let synced = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const report of queue) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mark as synced
        await this.updateReport(report.id, { is_synced: true, sync_error: undefined });
        
        // Create lead if needed
        if (!report.lead_id && this.shouldCreateLead(report)) {
          const leadResult = await this.createPipelineLead(report, 'demo-user-123', 'Demo User');
          if (leadResult.data) {
            await this.updateReport(report.id, { 
              lead_id: leadResult.data.id, 
              auto_created_lead: true 
            });
          }
        }
        
        synced++;
      } catch (error) {
        failed++;
        errors.push(`Failed to sync report ${report.id}: ${error}`);
        await this.updateReport(report.id, { 
          sync_error: error instanceof Error ? error.message : 'Sync failed' 
        });
      }
    }

    // Clear synced items from queue
    this.clearSyncedFromQueue();

    return { synced, failed, errors };
  }

  // Private helper methods
  private shouldCreateLead(report: CanvassingReport): boolean {
    // Create lead for interested or follow-up needed outcomes
    return report.visit_outcome === 'interested' || report.visit_outcome === 'follow_up_needed';
  }

  private async createPipelineLead(
    report: CanvassingReport, 
    userId: string,
    userName: string
  ): Promise<{ data: Lead | null; error: string | null }> {
    try {
      // First, create or get customer
      let customerId: string | undefined;
      
      // Check if company already exists as customer
      const { data: customers } = await customersService.searchCustomers(report.company_name);
      
      if (customers && customers.length > 0) {
        customerId = customers[0].id;
        // Update existing customer with latest info
        await customersService.updateCustomer(customers[0].id, {
          last_contact_date: report.visit_date,
          notes: `${customers[0].notes || ''}\n\nCanvassing ${report.visit_date}: ${report.general_notes || 'No notes'}`
        });
      } else {
        // Create new customer
        const customerResult = await customersService.createCustomer({
          name: report.contact_person,
          email: report.contact_email || '',
          phone: report.contact_phone || '',
          company: report.company_name,
          address: report.company_address || '',
          city: 'Jakarta',
          state: 'DKI Jakarta',
          zip_code: '10110',
          customer_type: this.mapSegmentToCustomerType(report.project_segment),
          lead_source: 'cold_call',
          status: 'prospect',
          notes: `Position: ${report.contact_position}\nCanvassing ${report.visit_date}: ${report.general_notes || 'No notes'}`
        });
        
        if (customerResult.data) {
          customerId = customerResult.data.id;
        }
      }

      // Determine deal type based on project segment
      const dealType = this.getDealTypeFromSegment(report.project_segment);
      
      // Calculate initial temperature based on priority and outcome
      const temperature = this.calculateInitialTemperature(report.priority, report.visit_outcome);
      
      // Create lead in sales pipeline
      const leadData = {
        project_name: `${report.company_name} - ${report.project_segment} Project`,
        project_description: report.general_notes || `Potential ${report.project_segment} coating project`,
        project_address: report.company_address,
        customer_id: customerId,
        deal_type: dealType,
        estimated_value: report.potential_value || 0,
        probability: this.getInitialProbability(report.priority),
        temperature,
        source: 'canvassing',
        assigned_to: userName,
        canvassing_report_id: report.id,
        is_from_canvassing: true,
        expected_close_date: report.next_action_date,
        notes: `Canvassing visit on ${report.visit_date}\nOutcome: ${report.visit_outcome}\nNext action: ${report.next_action || 'None'}`
      };

      const result = await mockPipelineService.createLead(leadData);
      
      if (result.error) {
        return { data: null, error: result.error };
      }

      // Log initial activity
      if (result.data) {
        await mockPipelineService.logActivity(
          result.data.id,
          'canvassing_visit',
          `Initial canvassing visit - ${report.visit_outcome}`,
          0
        );
      }

      return { data: result.data, error: null };
    } catch (error) {
      console.error('Error creating pipeline lead:', error);
      return { data: null, error: 'Failed to create lead in pipeline' };
    }
  }

  private getDealTypeFromSegment(segment: CanvassingReport['project_segment']): DealType {
    // For coating projects, most involve both supply and application
    switch (segment) {
      case 'decorative':
      case 'floor':
      case 'waterproofing':
        return 'supply_apply'; // Usually both supply and apply
      case 'protective':
      case 'marine':
      case 'steel':
        return 'supply_apply'; // Industrial usually needs application
      default:
        return 'supply'; // Default to supply only
    }
  }

  private calculateInitialTemperature(
    priority: CanvassingReport['priority'], 
    outcome: CanvassingReport['visit_outcome']
  ): number {
    let baseTemp = 0;
    
    // Base temperature from outcome
    switch (outcome) {
      case 'interested':
        baseTemp = 50; // Warm
        break;
      case 'follow_up_needed':
        baseTemp = 25; // Cold but potential
        break;
      default:
        baseTemp = 0;
    }
    
    // Adjust based on priority
    switch (priority) {
      case 'urgent':
        return Math.min(100, baseTemp + 35); // Hot to Critical
      case 'high':
        return Math.min(100, baseTemp + 25); // Boost significantly
      case 'medium':
        return Math.min(100, baseTemp + 10); // Slight boost
      default:
        return baseTemp;
    }
  }

  private getInitialProbability(priority: CanvassingReport['priority']): number {
    switch (priority) {
      case 'urgent':
        return 40; // Higher initial probability
      case 'high':
        return 30;
      case 'medium':
        return 20;
      default:
        return 10; // Low priority = low initial probability
    }
  }

  private mapSegmentToCustomerType(segment: CanvassingReport['project_segment']): 'residential' | 'commercial' | 'industrial' {
    switch (segment) {
      case 'decorative':
        return 'residential';
      case 'marine':
      case 'protective':
      case 'steel':
        return 'industrial';
      default:
        return 'commercial';
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  private getStoredReports(): CanvassingReport[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveReports(reports: CanvassingReport[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(reports));
  }

  private getOfflineQueue(): CanvassingReport[] {
    try {
      const stored = localStorage.getItem(this.offlineQueueKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private addToOfflineQueue(report: CanvassingReport): void {
    const queue = this.getOfflineQueue();
    queue.push(report);
    localStorage.setItem(this.offlineQueueKey, JSON.stringify(queue));
  }

  private clearSyncedFromQueue(): void {
    const reports = this.getStoredReports();
    const unsyncedReports = reports.filter(r => !r.is_synced);
    localStorage.setItem(this.offlineQueueKey, JSON.stringify(unsyncedReports));
  }

  private getTopSalesReps(reports: CanvassingReport[]): CanvassingStats['top_sales_reps'] {
    const repStats: Record<string, { name: string; visit_count: number; potential_value: number }> = {};
    
    reports.forEach(report => {
      const repId = report.sales_rep_id;
      if (!repStats[repId]) {
        repStats[repId] = {
          name: report.sales_rep_name || 'Unknown',
          visit_count: 0,
          potential_value: 0
        };
      }
      repStats[repId].visit_count++;
      repStats[repId].potential_value += report.potential_value || 0;
    });

    return Object.entries(repStats)
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.potential_value - a.potential_value)
      .slice(0, 5);
  }

  private getUpcomingFollowUps(reports: CanvassingReport[]): CanvassingStats['upcoming_follow_ups'] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return reports
      .filter(r => r.next_action_date && new Date(r.next_action_date) >= today)
      .sort((a, b) => new Date(a.next_action_date!).getTime() - new Date(b.next_action_date!).getTime())
      .slice(0, 10)
      .map(r => ({
        report_id: r.id,
        company_name: r.company_name,
        next_action_date: r.next_action_date!,
        sales_rep_name: r.sales_rep_name || 'Unknown'
      }));
  }
}

// Export singleton instance
export const canvassingService = new CanvassingService();