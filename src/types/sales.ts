import { Comment } from './comments';

export type DealType = 'supply' | 'apply' | 'supply_apply';
export type LeadStage = 'lead' | 'qualified' | 'negotiation' | 'closing' | 'won' | 'lost';
export type TemperatureStatus = 'cold' | 'warm' | 'hot' | 'critical';
export type Currency = 'IDR' | 'USD';

export interface Lead {
  id: string;
  lead_number: string;
  customer_id?: string;
  
  // Basic Info
  project_name: string;
  project_description?: string;
  project_address?: string;
  
  // Deal Details
  deal_type: DealType;
  stage: LeadStage;
  sub_stage?: string;
  
  // Temperature Tracking
  temperature: number;
  temperature_status: TemperatureStatus;
  stage_entered_at: string;
  days_in_stage: number;
  
  // Financial
  estimated_value?: number;
  quoted_value?: number;
  final_value?: number;
  currency: Currency;
  probability: number;
  margin_percentage?: number;
  
  // Sales Info
  assigned_to: string;
  source?: string;
  campaign?: string;
  competitor_info?: string;
  
  // Dates
  expected_close_date?: string;
  actual_close_date?: string;
  
  // Win/Loss Tracking
  won_date?: string;
  lost_date?: string;
  lost_reason?: string;
  lost_competitor?: string;
  lost_notes?: string;
  
  // After Sales
  after_sales_status?: string;
  po_number?: string;
  po_date?: string;
  delivery_date?: string;
  payment_terms?: string;
  payment_status?: string;
  
  // Commission Tracking
  commission_calculated?: boolean;
  commission_amount?: number;
  commission_paid_date?: string;
  
  // Comments
  comment_count?: number;
  unread_comment_count?: number;
  last_comment_at?: string;
  last_comment_by?: string;
  
  // Canvassing Origin
  canvassing_report_id?: string;
  is_from_canvassing?: boolean;
  
  // Metadata
  created_at: string;
  updated_at: string;
  created_by: string;
  
  // Relations
  customer?: Customer;
  activities?: LeadActivity[];
  quotes?: LeadQuote[];
  comments?: Comment[];
}

export interface Customer {
  id: string;
  company_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  territory?: string;
  npwp?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: string;
  activity_date: string;
  title: string;
  description?: string;
  outcome?: string;
  next_action?: string;
  next_action_date?: string;
  temperature_impact: number;
  created_by: string;
  created_at: string;
}

export interface LeadQuote {
  id: string;
  lead_id: string;
  quote_number: string;
  version: number;
  
  // Quote Details
  items: QuoteItem[];
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  
  // Terms
  validity_days: number;
  payment_terms?: string;
  delivery_terms?: string;
  notes?: string;
  
  // Status
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  sent_date?: string;
  viewed_date?: string;
  response_date?: string;
  
  created_at: string;
  created_by: string;
}

export interface QuoteItem {
  product_name: string;
  product_code?: string;
  description?: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
}

export interface TemperatureChange {
  id: string;
  lead_id: string;
  from_temperature: number;
  to_temperature: number;
  from_status: TemperatureStatus;
  to_status: TemperatureStatus;
  trigger_event?: string;
  changed_at: string;
  changed_by: string;
}

export interface AfterSalesActivity {
  id: string;
  lead_id: string;
  activity_type: string;
  activity_date: string;
  notes?: string;
  status?: string;
  created_by: string;
}

export interface LostReason {
  reason: string;
  competitor?: string;
  notes?: string;
}

export interface SalesTarget {
  id: string;
  sales_rep_id: string;
  month: number;
  year: number;
  target_amount: number;
  achieved_amount: number;
  achievement_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface CommissionSetting {
  id: string;
  deal_type: string;
  min_achievement: number;
  max_achievement: number;
  commission_rate: number;
  sales_portion: number;
  admin_portion: number;
  effective_from: string;
  effective_to?: string;
  created_at: string;
}

// Quick action types
export interface QuickAction {
  icon: any;
  label: string;
  action: string;
  color?: string;
}

// Filter types
export interface LeadFilters {
  stage?: LeadStage;
  temperature_status?: TemperatureStatus;
  deal_type?: DealType;
  assigned_to?: string;
  date_range?: {
    start: string;
    end: string;
  };
  search?: string;
}

// Dashboard stats
export interface PipelineStats {
  total_leads: number;
  total_value: number;
  avg_deal_size: number;
  conversion_rate: number;
  avg_sales_cycle: number;
  by_stage: Record<LeadStage, {
    count: number;
    value: number;
  }>;
  by_temperature: Record<TemperatureStatus, number>;
  top_performers: Array<{
    id: string;
    name: string;
    revenue: number;
    deals_won: number;
  }>;
}

// Stage configurations
export interface LeadStageConfig {
  id: LeadStage;
  name: string;
  color: string;
  icon?: string;
  order: number;
  sub_stages?: SubStageConfig[];
}

export interface SubStageConfig {
  id: string;
  name: string;
  order: number;
}

export const LEAD_STAGES: LeadStageConfig[] = [
  { 
    id: 'lead', 
    name: 'Lead', 
    color: '#3b82f6', 
    order: 1,
    sub_stages: [
      { id: 'new', name: 'New Lead', order: 1 },
      { id: 'contacted', name: 'Contacted', order: 2 },
      { id: 'interested', name: 'Interested', order: 3 }
    ]
  },
  { 
    id: 'qualified', 
    name: 'Qualified', 
    color: '#f97316', 
    order: 2,
    sub_stages: [
      { id: 'gathering_specs', name: 'Gathering Specs', order: 1 },
      { id: 'site_survey', name: 'Site Survey', order: 2 },
      { id: 'preparing_quote', name: 'Preparing Quote', order: 3 }
    ]
  },
  { 
    id: 'negotiation', 
    name: 'Negotiation', 
    color: '#ef4444', 
    order: 3,
    sub_stages: [
      { id: 'quote_sent', name: 'Quote Sent', order: 1 },
      { id: 'revising_terms', name: 'Revising Terms', order: 2 },
      { id: 'final_negotiation', name: 'Final Negotiation', order: 3 }
    ]
  },
  { 
    id: 'closing', 
    name: 'Closing', 
    color: '#a855f7', 
    order: 4,
    sub_stages: [
      { id: 'awaiting_approval', name: 'Awaiting Approval', order: 1 },
      { id: 'po_pending', name: 'Contract/PO Pending', order: 2 }
    ]
  },
  { id: 'won', name: 'Won', color: '#10b981', order: 5 },
  { id: 'lost', name: 'Lost', color: '#6b7280', order: 6 },
];

// View types
export interface SalesPipelineView {
  type: 'kanban' | 'list' | 'analytics';
  filters: LeadFilters;
  sort: {
    field: keyof Lead;
    direction: 'asc' | 'desc';
  };
}

// Territory list
export const TERRITORIES = [
  'Jakarta & Tangerang',
  'Bekasi & Karawang',
  'Bandung',
  'Surabaya',
  'Medan',
  'Others/National'
];

// Lost reasons
export const LOST_REASONS = [
  { value: 'price_too_high', label: 'Price too high (Harga terlalu mahal)' },
  { value: 'lost_to_competitor', label: 'Lost to competitor' },
  { value: 'project_cancelled', label: 'Project cancelled/postponed' },
  { value: 'cannot_meet_specs', label: 'Cannot meet specifications' },
  { value: 'cannot_meet_timeline', label: 'Cannot meet timeline' },
  { value: 'payment_terms', label: 'Payment terms not acceptable' },
  { value: 'no_response', label: 'No response after follow-up' },
  { value: 'in_house_team', label: 'Customer chose in-house team' },
  { value: 'relationship_issue', label: 'Relationship/trust issue' },
  { value: 'location_too_far', label: 'Distance/location too far' }
];

// Competitors
export const COMPETITORS = [
  'Competitor A (Local)',
  'Competitor B (Local)',
  'National Chain 1',
  'National Chain 2',
  'Direct Principal (Nippon/Jotun direct)',
  'In-house Team',
  'Other'
];

// Payment terms
export const PAYMENT_TERMS = [
  { value: 'CBD', label: 'CBD (Cash Before Delivery)' },
  { value: 'COD', label: 'COD (Cash on Delivery)' },
  { value: 'NET7', label: 'NET 7' },
  { value: 'NET14', label: 'NET 14' },
  { value: 'NET30', label: 'NET 30' },
  { value: 'PROGRESS_30_40_30', label: 'Progress 30-40-30' },
  { value: 'DP30', label: 'DP 30% + Pelunasan' }
];