export interface CanvassingReport {
  id: string;
  sales_rep_id: string;
  sales_rep_name?: string;
  
  // Company Information
  company_id?: string;
  company_name: string;
  contact_id?: string;
  contact_person: string;
  contact_position: string;
  contact_phone?: string;
  contact_email?: string;
  company_address?: string;
  
  // Visit Details
  visit_date: string;
  visit_outcome: 'interested' | 'not_interested' | 'follow_up_needed' | 'already_customer' | 'competitor_locked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Project Potential
  potential_type: 'area' | 'materials' | 'value';
  potential_area?: number; // in m²
  potential_materials?: string; // description of materials needed
  potential_value?: number; // in Rupiah
  project_segment: 'decorative' | 'floor' | 'marine' | 'protective' | 'steel' | 'waterproofing' | 'others';
  
  // Communication
  last_communication_date?: string;
  next_action?: 'call' | 'visit' | 'send_proposal' | 'send_sample' | 'technical_presentation' | 'negotiation' | 'other';
  next_action_date?: string;
  next_action_notes?: string;
  
  // Documentation
  photos: CanvassingPhoto[];
  general_notes?: string;
  
  // Location
  gps_latitude?: number;
  gps_longitude?: number;
  gps_accuracy?: number;
  
  // CRM Integration
  lead_id?: string; // If linked to existing lead
  auto_created_lead?: boolean;
  
  // Sync Status
  is_synced: boolean;
  sync_error?: string;
  local_id?: string; // For offline-created reports
  
  // Metadata
  created_at: string;
  updated_at: string;
  created_offline?: boolean;
}

export interface CanvassingPhoto {
  id: string;
  url?: string; // When uploaded
  local_uri?: string; // When offline
  caption?: string;
  timestamp: string;
  gps_latitude?: number;
  gps_longitude?: number;
  is_uploaded: boolean;
}

export interface CreateCanvassingReportRequest {
  company_id?: string;
  company_name: string;
  contact_id?: string;
  contact_person: string;
  contact_position: string;
  contact_phone?: string;
  contact_email?: string;
  company_address?: string;
  visit_date: string;
  visit_outcome: CanvassingReport['visit_outcome'];
  priority: CanvassingReport['priority'];
  potential_type: CanvassingReport['potential_type'];
  potential_area?: number;
  potential_materials?: string;
  potential_value?: number;
  project_segment: CanvassingReport['project_segment'];
  last_communication_date?: string;
  next_action?: CanvassingReport['next_action'];
  next_action_date?: string;
  next_action_notes?: string;
  photos: File[] | string[]; // Files for upload, strings for URLs
  general_notes?: string;
  gps_latitude?: number;
  gps_longitude?: number;
  lead_id?: string;
}

export interface CanvassingReportFilters {
  sales_rep_id?: string;
  visit_outcome?: CanvassingReport['visit_outcome'];
  project_segment?: CanvassingReport['project_segment'];
  date_from?: string;
  date_to?: string;
  search?: string; // Search in company name, contact person
  has_potential?: boolean;
  is_synced?: boolean;
}

export interface CanvassingReportListResponse {
  reports: CanvassingReport[];
  total: number;
  page: number;
  limit: number;
}

export interface CanvassingStats {
  total_visits: number;
  visits_today: number;
  visits_this_week: number;
  visits_this_month: number;
  
  by_outcome: {
    interested: number;
    not_interested: number;
    follow_up_needed: number;
    already_customer: number;
    competitor_locked: number;
  };
  
  by_segment: {
    decorative: number;
    floor: number;
    marine: number;
    protective: number;
    steel: number;
    waterproofing: number;
    others: number;
  };
  
  total_potential_value: number;
  total_potential_area: number;
  
  top_sales_reps: Array<{
    id: string;
    name: string;
    visit_count: number;
    potential_value: number;
  }>;
  
  upcoming_follow_ups: Array<{
    report_id: string;
    company_name: string;
    next_action_date: string;
    sales_rep_name: string;
  }>;
}