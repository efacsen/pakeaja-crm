import { supabase } from '@/lib/supabase/client';
import { Lead, LeadActivity, TemperatureChange, LostReason } from '@/types/sales';

export class PipelineService {
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

  // Cooling rates by stage (per day)
  private readonly COOLING_RATES = {
    lead: { days: 3, rate: 10 },
    qualified: { days: 5, rate: 5 },
    negotiation: { days: 3, rate: 15 },
    closing: { days: 2, rate: 20 }
  };

  // Create a new lead
  async createLead(data: Partial<Lead>): Promise<{ data: Lead | null; error: any }> {
    try {
      // Generate lead number
      const leadNumber = await this.generateLeadNumber();
      
      const { data: lead, error } = await supabase
        .from('leads')
        .insert({
          ...data,
          lead_number: leadNumber,
          temperature: 0,
          temperature_status: 'cold',
          stage: 'lead',
          probability: this.calculateProbability('lead', 0, data.deal_type),
          created_by: data.assigned_to
        })
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await this.logActivity(lead.id, 'lead_created', 'Lead created', 0);

      return { data: lead, error: null };
    } catch (error) {
      console.error('Error creating lead:', error);
      return { data: null, error };
    }
  }

  // Update lead temperature based on activity
  async updateLeadTemperature(
    leadId: string, 
    activityType: string,
    manualAdjustment?: number,
    reason?: string
  ): Promise<{ data: Lead | null; error: any }> {
    try {
      // Get current lead data
      const { data: lead, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (fetchError) throw fetchError;

      // Calculate new temperature
      let newTemp = lead.temperature;
      
      if (manualAdjustment !== undefined) {
        newTemp = Math.max(-20, Math.min(100, lead.temperature + manualAdjustment));
      } else {
        const impact = this.TEMP_IMPACTS[activityType as keyof typeof this.TEMP_IMPACTS] || 0;
        newTemp = Math.max(-20, Math.min(100, lead.temperature + impact));
      }

      // Determine temperature status
      const newStatus = this.getTemperatureStatus(newTemp);

      // Update lead
      const { data: updatedLead, error: updateError } = await supabase
        .from('leads')
        .update({
          temperature: newTemp,
          temperature_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Log temperature change
      await supabase
        .from('temperature_history')
        .insert({
          lead_id: leadId,
          from_temperature: lead.temperature,
          to_temperature: newTemp,
          from_status: lead.temperature_status,
          to_status: newStatus,
          trigger_event: activityType,
          changed_by: lead.assigned_to
        });

      return { data: updatedLead, error: null };
    } catch (error) {
      console.error('Error updating temperature:', error);
      return { data: null, error };
    }
  }

  // Process automatic temperature cooling
  async processCoolingForAllLeads(): Promise<void> {
    try {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .in('stage', ['lead', 'qualified', 'negotiation', 'closing']);

      if (error) throw error;

      for (const lead of leads) {
        await this.applyCooling(lead);
      }
    } catch (error) {
      console.error('Error processing cooling:', error);
    }
  }

  // Apply cooling to a single lead
  private async applyCooling(lead: Lead): Promise<void> {
    const coolingConfig = this.COOLING_RATES[lead.stage as keyof typeof this.COOLING_RATES];
    if (!coolingConfig) return;

    // Check last activity
    const { data: activities } = await supabase
      .from('lead_activities')
      .select('*')
      .eq('lead_id', lead.id)
      .order('activity_date', { ascending: false })
      .limit(1);

    const lastActivity = activities?.[0];
    if (!lastActivity) return;

    const daysSinceActivity = Math.floor(
      (Date.now() - new Date(lastActivity.activity_date).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceActivity >= coolingConfig.days) {
      const coolingAmount = -coolingConfig.rate * (daysSinceActivity - coolingConfig.days + 1);
      await this.updateLeadTemperature(lead.id, 'auto_cooling', coolingAmount);
    }
  }

  // Move lead to next stage
  async moveLeadStage(
    leadId: string,
    newStage: string,
    subStage?: string
  ): Promise<{ data: Lead | null; error: any }> {
    try {
      const { data: lead, error } = await supabase
        .from('leads')
        .update({
          stage: newStage,
          sub_stage: subStage,
          stage_entered_at: new Date().toISOString(),
          probability: this.calculateProbability(newStage, 0, 'supply'), // Will be recalculated
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId)
        .select()
        .single();

      if (error) throw error;

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

      return { data: lead, error: null };
    } catch (error) {
      console.error('Error moving stage:', error);
      return { data: null, error };
    }
  }

  // Handle deal won
  async handleDealWon(leadId: string, finalValue: number, poNumber?: string): Promise<{ data: Lead | null; error: any }> {
    try {
      const { data: lead, error } = await supabase
        .from('leads')
        .update({
          stage: 'won',
          won_date: new Date().toISOString(),
          actual_close_date: new Date().toISOString(),
          final_value: finalValue,
          po_number: poNumber,
          after_sales_status: 'po_pending',
          temperature: 100,
          temperature_status: 'critical',
          probability: 100,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId)
        .select()
        .single();

      if (error) throw error;

      // Create after-sales tracking
      await supabase
        .from('after_sales_activities')
        .insert({
          lead_id: leadId,
          activity_type: 'deal_won',
          notes: `Deal won with value ${finalValue}`,
          status: 'po_pending',
          created_by: lead.assigned_to
        });

      // Log activity
      await this.logActivity(leadId, 'deal_won', 'Deal closed - Won', 0);

      return { data: lead, error: null };
    } catch (error) {
      console.error('Error handling won deal:', error);
      return { data: null, error };
    }
  }

  // Handle deal lost
  async handleDealLost(
    leadId: string,
    reason: LostReason
  ): Promise<{ data: Lead | null; error: any }> {
    try {
      const { data: lead, error } = await supabase
        .from('leads')
        .update({
          stage: 'lost',
          lost_date: new Date().toISOString(),
          actual_close_date: new Date().toISOString(),
          lost_reason: reason.reason,
          lost_competitor: reason.competitor,
          lost_notes: reason.notes,
          temperature: -20,
          temperature_status: 'cold',
          probability: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId)
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await this.logActivity(
        leadId,
        'deal_lost',
        `Deal lost - Reason: ${reason.reason}`,
        0
      );

      return { data: lead, error: null };
    } catch (error) {
      console.error('Error handling lost deal:', error);
      return { data: null, error };
    }
  }

  // Log activity
  async logActivity(
    leadId: string,
    activityType: string,
    title: string,
    temperatureImpact: number,
    description?: string,
    outcome?: string,
    nextAction?: string,
    nextActionDate?: string
  ): Promise<{ data: LeadActivity | null; error: any }> {
    try {
      const { data: activity, error } = await supabase
        .from('lead_activities')
        .insert({
          lead_id: leadId,
          activity_type: activityType,
          title,
          description,
          outcome,
          next_action: nextAction,
          next_action_date: nextActionDate,
          temperature_impact: temperatureImpact
        })
        .select()
        .single();

      if (error) throw error;

      // Update temperature if there's an impact
      if (temperatureImpact !== 0) {
        await this.updateLeadTemperature(leadId, activityType);
      }

      return { data: activity, error: null };
    } catch (error) {
      console.error('Error logging activity:', error);
      return { data: null, error };
    }
  }

  // Get pipeline summary
  async getPipelineSummary(): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabase
        .from('pipeline_summary')
        .select('*');

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error getting pipeline summary:', error);
      return { data: null, error };
    }
  }

  // Get sales performance
  async getSalesPerformance(salesRepId?: string): Promise<{ data: any; error: any }> {
    try {
      let query = supabase
        .from('sales_performance')
        .select('*');

      if (salesRepId) {
        query = query.eq('id', salesRepId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error getting sales performance:', error);
      return { data: null, error };
    }
  }

  // Helper methods
  private async generateLeadNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = date.getMonth() + 1;
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
    
    // Get count of leads this month
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const { count } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString());

    const sequence = String((count || 0) + 1).padStart(5, '0');
    return `L/${year}/${monthNames[month - 1]}/${sequence}`;
  }

  private getTemperatureStatus(temperature: number): string {
    if (temperature <= this.TEMP_THRESHOLDS.COLD.max) return 'cold';
    if (temperature <= this.TEMP_THRESHOLDS.WARM.max) return 'warm';
    if (temperature <= this.TEMP_THRESHOLDS.HOT.max) return 'hot';
    return 'critical';
  }

  private calculateProbability(stage: string, temperature: number, dealType?: string): number {
    const baseProb = {
      lead: 10,
      qualified: 25,
      negotiation: 50,
      closing: 75,
      won: 100,
      lost: 0
    };

    let probability = baseProb[stage as keyof typeof baseProb] || 10;

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

  private isForwardProgress(oldStage: string, newStage: string): boolean {
    const stageOrder = ['lead', 'qualified', 'negotiation', 'closing', 'won'];
    const oldIndex = stageOrder.indexOf(oldStage);
    const newIndex = stageOrder.indexOf(newStage);
    return newIndex > oldIndex;
  }
}

// Export singleton instance
export const pipelineService = new PipelineService();