import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase.types';
import { Lead, LeadActivity, LeadStage } from '@/types/sales';
import { Comment } from '@/types/comments';

type DbLead = Database['public']['Tables']['leads']['Row'];
type DbActivity = Database['public']['Tables']['lead_activities']['Row'];
type DbComment = Database['public']['Tables']['lead_comments']['Row'];
type DbCustomer = Database['public']['Tables']['customers']['Row'];

export class SupabasePipelineService {
  private supabase = createClient();

  /**
   * Get all leads with filters
   */
  async getLeads(filters?: {
    assignedTo?: string;
    stage?: LeadStage;
    search?: string;
  }): Promise<{ data: Lead[]; error: string | null }> {
    try {
      // Use the lead_stats view for enriched data
      let query = this.supabase
        .from('leads')
        .select(`
          *,
          customer:customers(*),
          activities:lead_activities(
            *,
            created_by_user:users!created_by(full_name)
          ),
          comments:lead_comments(
            count
          ),
          _stats:lead_stats!id(
            activity_count,
            comment_count,
            unread_comment_count,
            days_in_stage
          )
        `)
        .not('stage', 'in', '(won,lost)');

      // Apply filters
      if (filters?.assignedTo) {
        query = query.eq('assigned_to', filters.assignedTo);
      }
      if (filters?.stage) {
        query = query.eq('stage', filters.stage);
      }
      if (filters?.search) {
        query = query.or(`project_name.ilike.%${filters.search}%,customer.company_name.ilike.%${filters.search}%`);
      }

      // Order by stage and temperature
      query = query.order('temperature', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching leads:', error);
        return { data: [], error: error.message };
      }

      // Convert to app format
      const leads = data.map(lead => this.convertLeadToAppFormat(lead));
      return { data: leads, error: null };
    } catch (error) {
      console.error('Error in getLeads:', error);
      return { data: [], error: 'Failed to fetch leads' };
    }
  }

  /**
   * Create a new lead
   */
  async createLead(
    leadData: {
      customerId?: string;
      projectName: string;
      projectDescription?: string;
      dealType: 'supply' | 'apply' | 'supply_apply';
      estimatedValue?: number;
      expectedCloseDate?: string;
      assignedTo: string;
    },
    userId: string
  ): Promise<{ data: Lead | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('leads')
        .insert({
          customer_id: leadData.customerId,
          project_name: leadData.projectName,
          project_description: leadData.projectDescription,
          deal_type: leadData.dealType,
          estimated_value: leadData.estimatedValue,
          expected_close_date: leadData.expectedCloseDate,
          assigned_to: leadData.assignedTo,
          created_by: userId,
          source: 'manual',
        })
        .select(`
          *,
          customer:customers(*),
          activities:lead_activities(*),
          _stats:lead_stats!id(*)
        `)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: this.convertLeadToAppFormat(data), error: null };
    } catch (error) {
      console.error('Error creating lead:', error);
      return { data: null, error: 'Failed to create lead' };
    }
  }

  /**
   * Update lead stage
   */
  async updateLeadStage(
    leadId: string,
    newStage: LeadStage
  ): Promise<{ data: Lead | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('leads')
        .update({ 
          stage: newStage,
          stage_entered_at: new Date().toISOString()
        })
        .eq('id', leadId)
        .select(`
          *,
          customer:customers(*),
          activities:lead_activities(*),
          _stats:lead_stats!id(*)
        `)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      // Log activity
      await this.logActivity(
        leadId,
        'note_added',
        `Stage changed to ${newStage}`,
        undefined,
        0
      );

      return { data: this.convertLeadToAppFormat(data), error: null };
    } catch (error) {
      console.error('Error updating lead stage:', error);
      return { data: null, error: 'Failed to update stage' };
    }
  }

  /**
   * Update lead details
   */
  async updateLead(
    leadId: string,
    updates: Partial<Lead>
  ): Promise<{ data: Lead | null; error: string | null }> {
    try {
      const updateData: any = {};
      
      // Map app fields to DB fields
      if (updates.estimatedValue !== undefined) updateData.estimated_value = updates.estimatedValue;
      if (updates.probability !== undefined) updateData.probability = updates.probability;
      if (updates.expectedCloseDate !== undefined) updateData.expected_close_date = updates.expectedCloseDate;
      if (updates.temperature !== undefined) {
        updateData.temperature = updates.temperature;
        updateData.temperature_status = this.getTemperatureStatus(updates.temperature);
      }

      const { data, error } = await this.supabase
        .from('leads')
        .update(updateData)
        .eq('id', leadId)
        .select(`
          *,
          customer:customers(*),
          activities:lead_activities(*),
          _stats:lead_stats!id(*)
        `)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: this.convertLeadToAppFormat(data), error: null };
    } catch (error) {
      console.error('Error updating lead:', error);
      return { data: null, error: 'Failed to update lead' };
    }
  }

  /**
   * Mark lead as won
   */
  async markLeadWon(
    leadId: string,
    actualValue: number
  ): Promise<{ data: Lead | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('leads')
        .update({
          stage: 'won',
          won_date: new Date().toISOString(),
          actual_value: actualValue,
          probability: 100,
          temperature: 100,
          temperature_status: 'critical'
        })
        .eq('id', leadId)
        .select(`
          *,
          customer:customers(*),
          activities:lead_activities(*),
          _stats:lead_stats!id(*)
        `)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      // Log activity
      await this.logActivity(
        leadId,
        'note_added',
        'Deal Won!',
        `Deal closed for ${this.formatCurrency(actualValue)}`,
        10
      );

      return { data: this.convertLeadToAppFormat(data), error: null };
    } catch (error) {
      console.error('Error marking lead as won:', error);
      return { data: null, error: 'Failed to mark as won' };
    }
  }

  /**
   * Mark lead as lost
   */
  async markLeadLost(
    leadId: string,
    reason: string,
    competitor?: string,
    notes?: string
  ): Promise<{ data: Lead | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('leads')
        .update({
          stage: 'lost',
          lost_date: new Date().toISOString(),
          lost_reason: reason,
          lost_competitor: competitor,
          lost_notes: notes,
          probability: 0,
          temperature: 0,
          temperature_status: 'cold'
        })
        .eq('id', leadId)
        .select(`
          *,
          customer:customers(*),
          activities:lead_activities(*),
          _stats:lead_stats!id(*)
        `)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      // Log activity
      await this.logActivity(
        leadId,
        'note_added',
        'Deal Lost',
        `Reason: ${reason}${competitor ? `, Competitor: ${competitor}` : ''}`,
        -20
      );

      return { data: this.convertLeadToAppFormat(data), error: null };
    } catch (error) {
      console.error('Error marking lead as lost:', error);
      return { data: null, error: 'Failed to mark as lost' };
    }
  }

  /**
   * Log an activity
   */
  async logActivity(
    leadId: string,
    type: string,
    title: string,
    description?: string,
    temperatureImpact: number = 0,
    outcome?: string,
    nextAction?: string,
    nextActionDate?: string
  ): Promise<{ data: LeadActivity | null; error: string | null }> {
    try {
      const { data: activity, error } = await this.supabase
        .from('lead_activities')
        .insert({
          lead_id: leadId,
          activity_type: type,
          title,
          description,
          outcome,
          next_action: nextAction,
          next_action_date: nextActionDate,
          temperature_impact: temperatureImpact,
          created_by: (await this.supabase.auth.getUser()).data.user?.id
        })
        .select('*, created_by_user:users!created_by(full_name)')
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: this.convertActivityToAppFormat(activity), error: null };
    } catch (error) {
      console.error('Error logging activity:', error);
      return { data: null, error: 'Failed to log activity' };
    }
  }

  /**
   * Get activities for a lead
   */
  async getLeadActivities(leadId: string): Promise<{ data: LeadActivity[]; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('lead_activities')
        .select('*, created_by_user:users!created_by(full_name)')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error: error.message };
      }

      const activities = data.map(activity => this.convertActivityToAppFormat(activity));
      return { data: activities, error: null };
    } catch (error) {
      console.error('Error fetching activities:', error);
      return { data: [], error: 'Failed to fetch activities' };
    }
  }

  /**
   * Add a comment to a lead
   */
  async addComment(
    leadId: string,
    content: string,
    parentId?: string,
    mentions?: string[]
  ): Promise<{ data: Comment | null; error: string | null }> {
    try {
      const user = (await this.supabase.auth.getUser()).data.user;
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      // Create comment
      const { data: comment, error } = await this.supabase
        .from('lead_comments')
        .insert({
          lead_id: leadId,
          parent_id: parentId,
          content,
          author_id: user.id
        })
        .select(`
          *,
          author:users!author_id(id, full_name, role),
          replies:lead_comments(
            *,
            author:users!author_id(id, full_name, role)
          )
        `)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      // Create mentions
      if (mentions && mentions.length > 0) {
        await this.supabase
          .from('comment_mentions')
          .insert(
            mentions.map(userId => ({
              comment_id: comment.id,
              mentioned_user_id: userId
            }))
          );
      }

      return { data: this.convertCommentToAppFormat(comment), error: null };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { data: null, error: 'Failed to add comment' };
    }
  }

  /**
   * Get comments for a lead
   */
  async getLeadComments(leadId: string): Promise<{ data: Comment[]; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('lead_comments')
        .select(`
          *,
          author:users!author_id(id, full_name, role),
          replies:lead_comments!parent_id(
            *,
            author:users!author_id(id, full_name, role)
          )
        `)
        .eq('lead_id', leadId)
        .is('parent_id', null)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error: error.message };
      }

      const comments = data.map(comment => this.convertCommentToAppFormat(comment));
      return { data: comments, error: null };
    } catch (error) {
      console.error('Error fetching comments:', error);
      return { data: [], error: 'Failed to fetch comments' };
    }
  }

  /**
   * Get pipeline statistics
   */
  async getPipelineStats(userId?: string): Promise<{ data: any; error: string | null }> {
    try {
      let query = this.supabase
        .from('leads')
        .select('stage, estimated_value, temperature_status');

      if (userId) {
        query = query.eq('assigned_to', userId);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      // Calculate stats
      const stats = {
        byStage: this.groupBy(data, 'stage'),
        byTemperature: this.groupBy(data, 'temperature_status'),
        totalValue: data.reduce((sum, lead) => sum + (lead.estimated_value || 0), 0),
        averageValue: data.length > 0 ? 
          data.reduce((sum, lead) => sum + (lead.estimated_value || 0), 0) / data.length : 0,
        count: data.length
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching pipeline stats:', error);
      return { data: null, error: 'Failed to fetch stats' };
    }
  }

  /**
   * Get won and lost deals
   */
  async getClosedDeals(
    type: 'won' | 'lost',
    limit: number = 50
  ): Promise<{ data: Lead[]; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('leads')
        .select(`
          *,
          customer:customers(*),
          activities:lead_activities(*),
          _stats:lead_stats!id(*)
        `)
        .eq('stage', type)
        .order(type === 'won' ? 'won_date' : 'lost_date', { ascending: false })
        .limit(limit);

      if (error) {
        return { data: [], error: error.message };
      }

      const leads = data.map(lead => this.convertLeadToAppFormat(lead));
      return { data: leads, error: null };
    } catch (error) {
      console.error('Error fetching closed deals:', error);
      return { data: [], error: 'Failed to fetch closed deals' };
    }
  }

  /**
   * Private helper methods
   */
  private convertLeadToAppFormat(dbLead: any): Lead {
    const stats = dbLead._stats?.[0] || {};
    
    return {
      id: dbLead.id,
      customer: dbLead.customer ? {
        id: dbLead.customer.id,
        company_name: dbLead.customer.company_name,
        contact_person: dbLead.customer.contact_person,
        email: dbLead.customer.email,
        phone: dbLead.customer.phone,
        address: dbLead.customer.address,
        territory: dbLead.customer.territory
      } : undefined,
      project_name: dbLead.project_name,
      project_description: dbLead.project_description,
      project_address: dbLead.project_address,
      deal_type: dbLead.deal_type,
      stage: dbLead.stage,
      temperature: dbLead.temperature,
      temperature_status: dbLead.temperature_status,
      probability: dbLead.probability,
      estimated_value: dbLead.estimated_value,
      expected_close_date: dbLead.expected_close_date,
      source: dbLead.source,
      is_from_canvassing: dbLead.is_from_canvassing,
      assigned_to: dbLead.assigned_to,
      assigned_to_name: stats.assigned_to_name,
      activities: dbLead.activities?.map((a: any) => this.convertActivityToAppFormat(a)) || [],
      days_in_stage: stats.days_in_stage || 0,
      activity_count: stats.activity_count || 0,
      comment_count: stats.comment_count || 0,
      unread_comment_count: stats.unread_comment_count || 0,
      last_activity_at: stats.last_activity_at,
      last_comment_at: stats.last_comment_at,
      last_comment_by: null, // Would need join to get this
      won_date: dbLead.won_date,
      lost_date: dbLead.lost_date,
      lost_reason: dbLead.lost_reason,
      lost_competitor: dbLead.lost_competitor,
      lost_notes: dbLead.lost_notes,
      actual_value: dbLead.actual_value,
      created_at: dbLead.created_at,
      updated_at: dbLead.updated_at
    };
  }

  private convertActivityToAppFormat(dbActivity: any): LeadActivity {
    return {
      id: dbActivity.id,
      lead_id: dbActivity.lead_id,
      type: dbActivity.activity_type,
      title: dbActivity.title,
      description: dbActivity.description,
      outcome: dbActivity.outcome,
      next_action: dbActivity.next_action,
      next_action_date: dbActivity.next_action_date,
      temperature_impact: dbActivity.temperature_impact,
      created_by: dbActivity.created_by_user?.full_name || 'Unknown',
      created_at: dbActivity.created_at
    };
  }

  private convertCommentToAppFormat(dbComment: any): Comment {
    return {
      id: dbComment.id,
      lead_id: dbComment.lead_id,
      parent_id: dbComment.parent_id,
      author_id: dbComment.author.id,
      author_name: dbComment.author.full_name,
      author_role: dbComment.author.role,
      content: dbComment.content,
      is_edited: dbComment.is_edited,
      is_deleted: dbComment.is_deleted,
      replies: dbComment.replies?.map((r: any) => this.convertCommentToAppFormat(r)) || [],
      reply_count: dbComment.replies?.length || 0,
      created_at: dbComment.created_at,
      updated_at: dbComment.updated_at
    };
  }

  private getTemperatureStatus(temperature: number): 'cold' | 'warm' | 'hot' | 'critical' {
    if (temperature >= 80) return 'critical';
    if (temperature >= 60) return 'hot';
    if (temperature >= 40) return 'warm';
    return 'cold';
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  private groupBy(data: any[], key: string): Record<string, number> {
    return data.reduce((acc, item) => {
      const value = item[key];
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }
}

export const supabasePipelineService = new SupabasePipelineService();