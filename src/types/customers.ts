export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  customer_type: 'residential' | 'commercial' | 'industrial';
  lead_source: 'website' | 'referral' | 'social_media' | 'cold_call' | 'advertisement' | 'other';
  status: 'active' | 'inactive' | 'prospect';
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  
  // Calculated fields
  total_quotes?: number;
  total_projects?: number;
  lifetime_value?: number;
  last_contact?: string;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  customer_type: Customer['customer_type'];
  lead_source: Customer['lead_source'];
  status?: Customer['status'];
  notes?: string;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {}

export interface CustomerFilters {
  customer_type?: Customer['customer_type'];
  status?: Customer['status'];
  lead_source?: Customer['lead_source'];
  search?: string;
  city?: string;
  state?: string;
}

export interface CustomerListResponse {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
}

export interface CustomerStats {
  total: number;
  active: number;
  prospects: number;
  by_type: {
    residential: number;
    commercial: number;
    industrial: number;
  };
  by_source: Record<Customer['lead_source'], number>;
  recent_customers: Customer[];
}