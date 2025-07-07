import { Lead, LeadActivity, Customer, LostReason, LeadStage, DealType } from '@/types/sales';

export class MockPipelineService {
  private storageKey = 'horizon-sales-leads';
  private customersKey = 'horizon-sales-customers';
  private activitiesKey = 'horizon-sales-activities';

  // Temperature thresholds
  private readonly TEMP_THRESHOLDS = {
    COLD: { min: -20, max: 25 },
    WARM: { min: 26, max: 50 },
    HOT: { min: 51, max: 75 },
    CRITICAL: { min: 76, max: 100 }
  };

  // Temperature impact values
  private readonly TEMP_IMPACTS = {
    phone_call: 10,
    email_sent: 5,
    email_received: 5,
    meeting_scheduled: 20,
    site_visit: 30,
    quote_sent: 25,
    quote_revised: 15,
    positive_response: 20,
    negative_response: -15,
    no_response: -5
  };

  // Create a new lead
  async createLead(data: Partial<Lead>): Promise<{ data: Lead | null; error: any }> {
    try {
      const leadNumber = await this.generateLeadNumber();
      const lead: Lead = {
        id: `lead-${Date.now()}`,
        lead_number: leadNumber,
        project_name: data.project_name || '',
        deal_type: data.deal_type || 'supply',
        stage: 'lead',
        sub_stage: 'new',
        temperature: 0,
        temperature_status: 'cold',
        stage_entered_at: new Date().toISOString(),
        days_in_stage: 0,
        probability: 10,
        currency: 'IDR',
        assigned_to: data.assigned_to || 'demo-user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: data.assigned_to || 'demo-user',
        ...data
      };

      const leads = this.getStoredLeads();
      leads.push(lead);
      this.saveLeads(leads);

      // Log activity
      await this.logActivity(lead.id, 'lead_created', 'Lead created', 0);

      return { data: lead, error: null };
    } catch (error) {
      console.error('Error creating lead:', error);
      return { data: null, error };
    }
  }

  // Get all leads
  async getLeads(): Promise<{ data: Lead[] | null; error: any }> {
    try {
      const leads = this.getStoredLeads();
      const customers = this.getStoredCustomers();
      
      // Attach customer data
      const enrichedLeads = leads.map(lead => ({
        ...lead,
        customer: customers.find(c => c.id === lead.customer_id),
        days_in_stage: Math.floor(
          (Date.now() - new Date(lead.stage_entered_at).getTime()) / (1000 * 60 * 60 * 24)
        )
      }));

      return { data: enrichedLeads, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Update lead
  async updateLead(id: string, updates: Partial<Lead>): Promise<{ data: Lead | null; error: any }> {
    try {
      const leads = this.getStoredLeads();
      const index = leads.findIndex(l => l.id === id);
      
      if (index === -1) {
        return { data: null, error: 'Lead not found' };
      }

      const updatedLead = {
        ...leads[index],
        ...updates,
        updated_at: new Date().toISOString()
      };

      leads[index] = updatedLead;
      this.saveLeads(leads);

      return { data: updatedLead, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Update lead temperature
  async updateLeadTemperature(
    leadId: string, 
    activityType: string,
    manualAdjustment?: number,
    reason?: string
  ): Promise<{ data: Lead | null; error: any }> {
    try {
      const { data: lead } = await this.getLead(leadId);
      if (!lead) throw new Error('Lead not found');

      let newTemp = lead.temperature;
      
      if (manualAdjustment !== undefined) {
        newTemp = Math.max(-20, Math.min(100, lead.temperature + manualAdjustment));
      } else {
        const impact = this.TEMP_IMPACTS[activityType as keyof typeof this.TEMP_IMPACTS] || 0;
        newTemp = Math.max(-20, Math.min(100, lead.temperature + impact));
      }

      const newStatus = this.getTemperatureStatus(newTemp);

      return await this.updateLead(leadId, {
        temperature: newTemp,
        temperature_status: newStatus
      });
    } catch (error) {
      return { data: null, error };
    }
  }

  // Move lead stage
  async moveLeadStage(
    leadId: string,
    newStage: LeadStage,
    subStage?: string
  ): Promise<{ data: Lead | null; error: any }> {
    try {
      const { data: lead } = await this.getLead(leadId);
      if (!lead) throw new Error('Lead not found');

      const probability = this.calculateProbability(newStage, lead.temperature, lead.deal_type);

      const updatedLead = await this.updateLead(leadId, {
        stage: newStage,
        sub_stage: subStage,
        stage_entered_at: new Date().toISOString(),
        probability
      });

      // Log stage change
      await this.logActivity(
        leadId,
        'stage_change',
        `Moved to ${newStage}${subStage ? ' - ' + subStage : ''}`,
        0
      );

      // Adjust temperature based on stage progression
      if (this.isForwardProgress(lead.stage, newStage)) {
        await this.updateLeadTemperature(leadId, 'stage_progress', 10);
      }

      return updatedLead;
    } catch (error) {
      return { data: null, error };
    }
  }

  // Handle deal won
  async handleDealWon(leadId: string, finalValue: number, poNumber?: string): Promise<{ data: Lead | null; error: any }> {
    const updatedLead = await this.updateLead(leadId, {
      stage: 'won',
      won_date: new Date().toISOString(),
      actual_close_date: new Date().toISOString(),
      final_value: finalValue,
      po_number: poNumber,
      after_sales_status: 'po_pending',
      temperature: 100,
      temperature_status: 'critical',
      probability: 100
    });

    await this.logActivity(leadId, 'deal_won', 'Deal closed - Won', 0);
    return updatedLead;
  }

  // Handle deal lost
  async handleDealLost(leadId: string, reason: LostReason): Promise<{ data: Lead | null; error: any }> {
    const updatedLead = await this.updateLead(leadId, {
      stage: 'lost',
      lost_date: new Date().toISOString(),
      actual_close_date: new Date().toISOString(),
      lost_reason: reason.reason,
      lost_competitor: reason.competitor,
      lost_notes: reason.notes,
      temperature: -20,
      temperature_status: 'cold',
      probability: 0
    });

    await this.logActivity(
      leadId,
      'deal_lost',
      `Deal lost - Reason: ${reason.reason}`,
      0
    );

    return updatedLead;
  }

  // Log activity
  async logActivity(
    leadId: string,
    activityType: string,
    title: string,
    temperatureImpact: number,
    description?: string
  ): Promise<{ data: LeadActivity | null; error: any }> {
    try {
      const activity: LeadActivity = {
        id: `activity-${Date.now()}`,
        lead_id: leadId,
        activity_type: activityType,
        activity_date: new Date().toISOString(),
        title,
        description,
        temperature_impact: temperatureImpact,
        created_by: 'demo-user',
        created_at: new Date().toISOString()
      };

      const activities = this.getStoredActivities();
      activities.push(activity);
      this.saveActivities(activities);

      // Update temperature if there's an impact
      if (temperatureImpact !== 0) {
        await this.updateLeadTemperature(leadId, activityType);
      }

      return { data: activity, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get lead by ID
  async getLead(id: string): Promise<{ data: Lead | null; error: any }> {
    try {
      const leads = this.getStoredLeads();
      const lead = leads.find(l => l.id === id);
      return { data: lead || null, error: lead ? null : 'Lead not found' };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Create customer
  async createCustomer(data: Partial<Customer>): Promise<{ data: Customer | null; error: any }> {
    try {
      const customer: Customer = {
        id: `customer-${Date.now()}`,
        company_name: data.company_name || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...data
      };

      const customers = this.getStoredCustomers();
      customers.push(customer);
      this.saveCustomers(customers);

      return { data: customer, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Helper methods
  private getStoredLeads(): Lead[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : this.generateSampleLeads();
    } catch {
      return this.generateSampleLeads();
    }
  }

  private saveLeads(leads: Lead[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(leads));
  }

  private getStoredCustomers(): Customer[] {
    try {
      const stored = localStorage.getItem(this.customersKey);
      return stored ? JSON.parse(stored) : this.generateSampleCustomers();
    } catch {
      return this.generateSampleCustomers();
    }
  }

  private saveCustomers(customers: Customer[]): void {
    localStorage.setItem(this.customersKey, JSON.stringify(customers));
  }

  private getStoredActivities(): LeadActivity[] {
    try {
      const stored = localStorage.getItem(this.activitiesKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveActivities(activities: LeadActivity[]): void {
    localStorage.setItem(this.activitiesKey, JSON.stringify(activities));
  }

  private async generateLeadNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = date.getMonth() + 1;
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
    const leads = this.getStoredLeads();
    const sequence = String(leads.length + 1).padStart(5, '0');
    return `L/${year}/${monthNames[month - 1]}/${sequence}`;
  }

  private getTemperatureStatus(temperature: number): 'cold' | 'warm' | 'hot' | 'critical' {
    if (temperature <= this.TEMP_THRESHOLDS.COLD.max) return 'cold';
    if (temperature <= this.TEMP_THRESHOLDS.WARM.max) return 'warm';
    if (temperature <= this.TEMP_THRESHOLDS.HOT.max) return 'hot';
    return 'critical';
  }

  private calculateProbability(stage: LeadStage, temperature: number, dealType?: DealType): number {
    const baseProb = {
      lead: 10,
      qualified: 25,
      negotiation: 50,
      closing: 75,
      won: 100,
      lost: 0
    };

    let probability = baseProb[stage] || 10;

    // Adjust for temperature
    const tempBonus = Math.floor(temperature / 10) * 2;
    probability += tempBonus;

    // Adjust for deal type
    if (dealType === 'supply') {
      probability *= 1.2;
    } else if (dealType === 'supply_apply') {
      probability *= 0.8;
    }

    return Math.min(100, Math.max(0, Math.round(probability)));
  }

  private isForwardProgress(oldStage: LeadStage, newStage: LeadStage): boolean {
    const stageOrder: LeadStage[] = ['lead', 'qualified', 'negotiation', 'closing', 'won'];
    const oldIndex = stageOrder.indexOf(oldStage);
    const newIndex = stageOrder.indexOf(newStage);
    return newIndex > oldIndex;
  }

  async markLeadWon(leadId: string, finalValue: number): Promise<{ data: Lead | null; error: string | null }> {
    return this.handleDealWon(leadId, finalValue);
  }

  async markLeadLost(leadId: string, reason: LostReason): Promise<{ data: Lead | null; error: string | null }> {
    return this.handleDealLost(leadId, reason);
  }

  async reactivateLead(leadId: string): Promise<{ data: Lead | null; error: string | null }> {
    const leads = this.getLeads();
    const lead = leads.find(l => l.id === leadId);
    
    if (!lead) {
      return { data: null, error: 'Lead not found' };
    }

    if (lead.stage !== 'lost') {
      return { data: null, error: 'Can only reactivate lost leads' };
    }

    // Reset lead to qualified stage
    lead.stage = 'qualified';
    lead.temperature = 40; // Warm temperature
    lead.temperature_status = 'warm';
    lead.closed_at = null;
    lead.final_value = null;
    lead.lost_reason = null;
    lead.lost_notes = null;
    lead.probability = 30;
    lead.days_in_stage = 0;
    lead.stage_changed_at = new Date().toISOString();

    // Log reactivation activity
    const activity: Activity = {
      id: this.generateId(),
      lead_id: leadId,
      type: 'reactivation',
      title: 'Lead Reactivated',
      description: 'Lead was reactivated and moved back to Qualified stage',
      temperature_impact: 15,
      created_by: 'demo-user',
      created_at: new Date().toISOString(),
    };

    if (!lead.activities) lead.activities = [];
    lead.activities.unshift(activity);

    this.saveLeads(leads);
    return { data: lead, error: null };
  }

  // Generate sample data
  private generateSampleCustomers(): Customer[] {
    const customers: Customer[] = [
      {
        id: 'customer-1',
        company_name: 'PT. Bangun Sejahtera',
        contact_person: 'Budi Santoso',
        email: 'budi@bangungsejahtera.co.id',
        phone: '0812-3456-7890',
        address: 'Jl. Industri Raya No. 123',
        city: 'Jakarta',
        territory: 'Jakarta & Tangerang',
        npwp: '12.345.678.9-012.000',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'customer-2',
        company_name: 'CV. Maju Bersama',
        contact_person: 'Siti Nurhaliza',
        email: 'siti@majubersama.com',
        phone: '0821-9876-5432',
        address: 'Kawasan Industri MM2100',
        city: 'Bekasi',
        territory: 'Bekasi & Karawang',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    this.saveCustomers(customers);
    return customers;
  }

  private generateSampleLeads(): Lead[] {
    const leads: Lead[] = [
      {
        id: 'lead-1',
        lead_number: 'L/24/JAN/00001',
        customer_id: 'customer-1',
        project_name: 'Coating Lantai Gudang Baru',
        project_description: 'Aplikasi epoxy coating untuk lantai gudang seluas 5000m²',
        project_address: 'Kawasan Industri Cikarang',
        deal_type: 'supply_apply',
        stage: 'negotiation',
        sub_stage: 'quote_sent',
        temperature: 65,
        temperature_status: 'hot',
        stage_entered_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        days_in_stage: 2,
        estimated_value: 850000000,
        quoted_value: 825000000,
        currency: 'IDR',
        probability: 70,
        margin_percentage: 28,
        assigned_to: 'demo-user',
        source: 'referral',
        expected_close_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'demo-user'
      },
      {
        id: 'lead-2',
        lead_number: 'L/24/JAN/00002',
        customer_id: 'customer-2',
        project_name: 'Cat Dinding Pabrik',
        project_description: 'Pengecatan ulang dinding pabrik dengan cat protective',
        project_address: 'MM2100 Industrial Estate',
        deal_type: 'supply',
        stage: 'qualified',
        sub_stage: 'site_survey',
        temperature: 35,
        temperature_status: 'warm',
        stage_entered_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        days_in_stage: 5,
        estimated_value: 125000000,
        currency: 'IDR',
        probability: 35,
        assigned_to: 'demo-user',
        source: 'canvassing',
        expected_close_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'demo-user'
      },
      {
        id: 'lead-3',
        lead_number: 'L/24/JAN/00003',
        project_name: 'Protective Coating Tangki',
        deal_type: 'apply',
        stage: 'lead',
        sub_stage: 'new',
        temperature: 10,
        temperature_status: 'cold',
        stage_entered_at: new Date().toISOString(),
        days_in_stage: 0,
        estimated_value: 350000000,
        currency: 'IDR',
        probability: 15,
        assigned_to: 'demo-user',
        source: 'website',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'demo-user'
      },
      {
        id: 'lead-4',
        lead_number: 'L/23/DES/00234',
        customer_id: 'customer-1',
        project_name: 'Floor Coating Warehouse Extension',
        deal_type: 'supply_apply',
        stage: 'won',
        temperature: 100,
        temperature_status: 'critical',
        stage_entered_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        days_in_stage: 30,
        estimated_value: 650000000,
        final_value: 625000000,
        currency: 'IDR',
        probability: 100,
        margin_percentage: 32,
        assigned_to: 'demo-user',
        won_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        closed_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        po_number: 'PO/2023/12/0456',
        after_sales_status: 'in_progress',
        payment_terms: 'PROGRESS_30_40_30',
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'demo-user'
      },
      {
        id: 'lead-5',
        lead_number: 'L/24/JAN/00004',
        project_name: 'Marine Coating Kapal Tanker',
        deal_type: 'supply',
        stage: 'closing',
        sub_stage: 'po_waiting',
        temperature: 85,
        temperature_status: 'critical',
        stage_entered_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        days_in_stage: 1,
        estimated_value: 1250000000,
        quoted_value: 1200000000,
        currency: 'IDR',
        probability: 85,
        margin_percentage: 35,
        assigned_to: 'demo-user',
        source: 'referral',
        expected_close_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'demo-user'
      },
      {
        id: 'lead-6',
        lead_number: 'L/23/DES/00235',
        customer_id: 'customer-2',
        project_name: 'Cat Decorative Interior Office',
        deal_type: 'supply',
        stage: 'lost',
        temperature: 0,
        temperature_status: 'cold',
        stage_entered_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        days_in_stage: 15,
        estimated_value: 85000000,
        currency: 'IDR',
        probability: 0,
        assigned_to: 'demo-user',
        source: 'cold_call',
        lost_reason: 'price',
        lost_notes: 'Customer chose competitor with 20% lower price',
        closed_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'demo-user'
      }
    ];

    this.saveLeads(leads);
    return leads;
  }
}

// Export singleton instance
export const mockPipelineService = new MockPipelineService();