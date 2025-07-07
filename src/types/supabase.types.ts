export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          role: 'sales_rep' | 'sales_manager' | 'admin' | 'field_sales' | 'estimator'
          full_name: string
          phone: string | null
          territory: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'sales_rep' | 'sales_manager' | 'admin' | 'field_sales' | 'estimator'
          full_name: string
          phone?: string | null
          territory?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'sales_rep' | 'sales_manager' | 'admin' | 'field_sales' | 'estimator'
          full_name?: string
          phone?: string | null
          territory?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          company_name: string
          contact_person: string | null
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          territory: string | null
          npwp: string | null
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_name: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          territory?: string | null
          npwp?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          territory?: string | null
          npwp?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      canvassing_reports: {
        Row: {
          id: string
          visit_date: string
          company_name: string
          company_address: string | null
          contact_person: string
          contact_position: string | null
          contact_phone: string | null
          contact_email: string | null
          visit_outcome: 'interested' | 'not_interested' | 'follow_up_needed' | 'already_customer' | 'competitor_locked'
          project_segment: 'residential' | 'commercial' | 'industrial' | 'infrastructure' | 'marine' | 'others'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          potential_type: 'area' | 'materials' | 'value' | null
          potential_area: number | null
          potential_materials: string | null
          potential_value: number | null
          current_supplier: string | null
          competitor_price: number | null
          decision_timeline: string | null
          next_action: string | null
          next_action_date: string | null
          general_notes: string | null
          gps_latitude: number | null
          gps_longitude: number | null
          is_synced: boolean
          sales_rep_id: string
          sales_rep_name: string
          lead_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          visit_date: string
          company_name: string
          company_address?: string | null
          contact_person: string
          contact_position?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          visit_outcome: 'interested' | 'not_interested' | 'follow_up_needed' | 'already_customer' | 'competitor_locked'
          project_segment: 'residential' | 'commercial' | 'industrial' | 'infrastructure' | 'marine' | 'others'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          potential_type?: 'area' | 'materials' | 'value' | null
          potential_area?: number | null
          potential_materials?: string | null
          potential_value?: number | null
          current_supplier?: string | null
          competitor_price?: number | null
          decision_timeline?: string | null
          next_action?: string | null
          next_action_date?: string | null
          general_notes?: string | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          is_synced?: boolean
          sales_rep_id: string
          sales_rep_name: string
          lead_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          visit_date?: string
          company_name?: string
          company_address?: string | null
          contact_person?: string
          contact_position?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          visit_outcome?: 'interested' | 'not_interested' | 'follow_up_needed' | 'already_customer' | 'competitor_locked'
          project_segment?: 'residential' | 'commercial' | 'industrial' | 'infrastructure' | 'marine' | 'others'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          potential_type?: 'area' | 'materials' | 'value' | null
          potential_area?: number | null
          potential_materials?: string | null
          potential_value?: number | null
          current_supplier?: string | null
          competitor_price?: number | null
          decision_timeline?: string | null
          next_action?: string | null
          next_action_date?: string | null
          general_notes?: string | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          is_synced?: boolean
          sales_rep_id?: string
          sales_rep_name?: string
          lead_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      canvassing_photos: {
        Row: {
          id: string
          report_id: string
          photo_url: string
          photo_type: string | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          report_id: string
          photo_url: string
          photo_type?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          report_id?: string
          photo_url?: string
          photo_type?: string | null
          uploaded_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          customer_id: string | null
          project_name: string
          project_description: string | null
          project_address: string | null
          deal_type: 'supply' | 'apply' | 'supply_apply'
          stage: 'lead' | 'qualified' | 'negotiation' | 'closing' | 'won' | 'lost'
          temperature: number
          temperature_status: 'cold' | 'warm' | 'hot' | 'critical'
          probability: number
          estimated_value: number | null
          expected_close_date: string | null
          source: string | null
          is_from_canvassing: boolean
          canvassing_report_id: string | null
          assigned_to: string
          created_by: string | null
          won_date: string | null
          lost_date: string | null
          lost_reason: string | null
          lost_competitor: string | null
          lost_notes: string | null
          actual_value: number | null
          stage_entered_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          project_name: string
          project_description?: string | null
          project_address?: string | null
          deal_type: 'supply' | 'apply' | 'supply_apply'
          stage?: 'lead' | 'qualified' | 'negotiation' | 'closing' | 'won' | 'lost'
          temperature?: number
          temperature_status?: 'cold' | 'warm' | 'hot' | 'critical'
          probability?: number
          estimated_value?: number | null
          expected_close_date?: string | null
          source?: string | null
          is_from_canvassing?: boolean
          canvassing_report_id?: string | null
          assigned_to: string
          created_by?: string | null
          won_date?: string | null
          lost_date?: string | null
          lost_reason?: string | null
          lost_competitor?: string | null
          lost_notes?: string | null
          actual_value?: number | null
          stage_entered_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string | null
          project_name?: string
          project_description?: string | null
          project_address?: string | null
          deal_type?: 'supply' | 'apply' | 'supply_apply'
          stage?: 'lead' | 'qualified' | 'negotiation' | 'closing' | 'won' | 'lost'
          temperature?: number
          temperature_status?: 'cold' | 'warm' | 'hot' | 'critical'
          probability?: number
          estimated_value?: number | null
          expected_close_date?: string | null
          source?: string | null
          is_from_canvassing?: boolean
          canvassing_report_id?: string | null
          assigned_to?: string
          created_by?: string | null
          won_date?: string | null
          lost_date?: string | null
          lost_reason?: string | null
          lost_competitor?: string | null
          lost_notes?: string | null
          actual_value?: number | null
          stage_entered_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      lead_activities: {
        Row: {
          id: string
          lead_id: string
          activity_type: string
          title: string
          description: string | null
          outcome: string | null
          next_action: string | null
          next_action_date: string | null
          temperature_impact: number
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          activity_type: string
          title: string
          description?: string | null
          outcome?: string | null
          next_action?: string | null
          next_action_date?: string | null
          temperature_impact?: number
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          activity_type?: string
          title?: string
          description?: string | null
          outcome?: string | null
          next_action?: string | null
          next_action_date?: string | null
          temperature_impact?: number
          created_by?: string | null
          created_at?: string
        }
      }
      lead_comments: {
        Row: {
          id: string
          lead_id: string
          parent_id: string | null
          content: string
          author_id: string
          is_edited: boolean
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          parent_id?: string | null
          content: string
          author_id: string
          is_edited?: boolean
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          parent_id?: string | null
          content?: string
          author_id?: string
          is_edited?: boolean
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      comment_mentions: {
        Row: {
          id: string
          comment_id: string
          mentioned_user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          comment_id: string
          mentioned_user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          comment_id?: string
          mentioned_user_id?: string | null
          created_at?: string
        }
      }
      comment_read_status: {
        Row: {
          id: string
          comment_id: string
          user_id: string
          read_at: string
        }
        Insert: {
          id?: string
          comment_id: string
          user_id: string
          read_at?: string
        }
        Update: {
          id?: string
          comment_id?: string
          user_id?: string
          read_at?: string
        }
      }
    }
    Views: {
      lead_stats: {
        Row: {
          id: string
          stage: string
          temperature: number
          temperature_status: string
          probability: number
          estimated_value: number | null
          assigned_to: string
          assigned_to_name: string | null
          activity_count: number
          comment_count: number
          unread_comment_count: number
          last_activity_at: string | null
          last_comment_at: string | null
          days_in_stage: number
        }
      }
    }
    Functions: {}
    Enums: {
      user_role: 'sales_rep' | 'sales_manager' | 'admin' | 'field_sales' | 'estimator'
      lead_stage: 'lead' | 'qualified' | 'negotiation' | 'closing' | 'won' | 'lost'
      lead_temperature_status: 'cold' | 'warm' | 'hot' | 'critical'
      deal_type: 'supply' | 'apply' | 'supply_apply'
      activity_type: 'phone_call' | 'email_sent' | 'meeting_scheduled' | 'meeting_completed' | 
        'quote_sent' | 'site_visit' | 'check_availability' | 'apply_discount' | 
        'quote_revised' | 'escalate_manager' | 'request_po' | 'extend_timeline' | 
        'follow_up' | 'note_added'
      canvassing_outcome: 'interested' | 'not_interested' | 'follow_up_needed' | 
        'already_customer' | 'competitor_locked'
      canvassing_priority: 'low' | 'medium' | 'high' | 'urgent'
      project_segment: 'residential' | 'commercial' | 'industrial' | 
        'infrastructure' | 'marine' | 'others'
    }
  }
}