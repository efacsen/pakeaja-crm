import { CalculatorFormData } from './calculator';

export interface Quote {
  id: string;
  quote_number: string;
  project_name: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  project_address: string;
  project_date: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  total_cost: number;
  cost_per_sqft: number;
  total_area: number;
  calculator_data: CalculatorFormData;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  sent_at?: string;
  approved_at?: string;
  expires_at?: string;
}

export interface CreateQuoteRequest {
  project_name: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  project_address: string;
  project_date: string;
  calculator_data: CalculatorFormData;
  notes?: string;
}

export interface UpdateQuoteRequest extends Partial<CreateQuoteRequest> {
  status?: Quote['status'];
}

export interface QuoteFilters {
  status?: Quote['status'];
  client_name?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface QuoteListResponse {
  quotes: Quote[];
  total: number;
  page: number;
  limit: number;
}