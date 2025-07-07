import { createClient } from '@/lib/supabase/client';
import { Company, Contact } from './company-service';

export interface CustomerView {
  id: string; // company_id
  name: string; // company name
  email: string; // primary contact email
  phone: string; // primary contact phone
  company?: string; // same as name for consistency
  address: string;
  city: string;
  state: string;
  zip_code: string;
  customer_type: 'residential' | 'commercial' | 'industrial';
  lead_source: 'website' | 'referral' | 'social_media' | 'cold_call' | 'advertisement' | 'canvassing' | 'other';
  status: 'active' | 'inactive' | 'prospect';
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  
  // Additional fields
  total_quotes?: number;
  total_projects?: number;
  lifetime_value?: number;
  last_contact?: string;
  
  // Related data
  primary_contact?: Contact;
  contacts?: Contact[];
}

export interface CustomerFilters {
  customer_type?: string;
  status?: string;
  lead_source?: string;
  search?: string;
  city?: string;
  state?: string;
}

export class SupabaseCustomersService {
  private supabase = createClient();

  async listCustomers(
    filters: CustomerFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: { customers: CustomerView[]; total: number } | null; error: string | null }> {
    try {
      let query = this.supabase
        .from('companies')
        .select(`
          *,
          contacts!inner(*)
        `, { count: 'exact' })
        .eq('contacts.is_primary', true);

      // Apply filters
      if (filters.customer_type) {
        query = query.eq('company_type', filters.customer_type);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,city.ilike.%${filters.search}%`);
      }
      if (filters.city) {
        query = query.eq('city', filters.city);
      }

      // Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching customers:', error);
        return { data: null, error: error.message };
      }

      // Transform to CustomerView format
      const customers: CustomerView[] = (data || []).map(company => {
        const primaryContact = company.contacts?.[0];
        return {
          id: company.id,
          name: company.name,
          email: primaryContact?.email || '',
          phone: primaryContact?.mobile_phone || '',
          company: company.name,
          address: company.address || '',
          city: company.city || '',
          state: company.state_province || '',
          zip_code: company.postal_code || '',
          customer_type: (company.company_type as any) || 'commercial',
          lead_source: 'other',
          status: company.status === 'active' ? 'active' : 'prospect',
          notes: company.notes,
          created_at: company.created_at,
          updated_at: company.updated_at,
          created_by: company.created_by || '',
          primary_contact: primaryContact,
          contacts: company.contacts,
        };
      });

      return { 
        data: { 
          customers, 
          total: count || 0 
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error in listCustomers:', error);
      return { data: null, error: 'Failed to fetch customers' };
    }
  }

  async createCustomer(
    data: any,
    userId: string = 'demo-user-123'
  ): Promise<{ data: CustomerView | null; error: string | null }> {
    try {
      // The customer is already created via CompanyAutocomplete
      // Just fetch the created company with contacts
      if (data.company_id) {
        const { data: company, error } = await this.supabase
          .from('companies')
          .select(`
            *,
            contacts(*)
          `)
          .eq('id', data.company_id)
          .single();

        if (error) {
          return { data: null, error: error.message };
        }

        const primaryContact = company.contacts?.find((c: any) => c.is_primary) || company.contacts?.[0];
        
        const customer: CustomerView = {
          id: company.id,
          name: company.name,
          email: primaryContact?.email || '',
          phone: primaryContact?.mobile_phone || '',
          company: company.name,
          address: company.address || '',
          city: company.city || '',
          state: company.state_province || '',
          zip_code: company.postal_code || '',
          customer_type: company.company_type || 'commercial',
          lead_source: data.lead_source || 'other',
          status: company.status === 'active' ? 'active' : 'prospect',
          notes: company.notes,
          created_at: company.created_at,
          updated_at: company.updated_at,
          created_by: userId,
          primary_contact: primaryContact,
          contacts: company.contacts,
        };

        return { data: customer, error: null };
      }

      return { data: null, error: 'Company ID is required' };
    } catch (error) {
      console.error('Error creating customer:', error);
      return { data: null, error: 'Failed to create customer' };
    }
  }

  async updateCustomer(
    id: string,
    data: any
  ): Promise<{ data: CustomerView | null; error: string | null }> {
    // Updates are handled in the form by updating company and contact directly
    return this.getCustomer(id);
  }

  async getCustomer(id: string): Promise<{ data: CustomerView | null; error: string | null }> {
    try {
      const { data: company, error } = await this.supabase
        .from('companies')
        .select(`
          *,
          contacts(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      const primaryContact = company.contacts?.find((c: any) => c.is_primary) || company.contacts?.[0];
      
      const customer: CustomerView = {
        id: company.id,
        name: company.name,
        email: primaryContact?.email || '',
        phone: primaryContact?.mobile_phone || '',
        company: company.name,
        address: company.address || '',
        city: company.city || '',
        state: company.state_province || '',
        zip_code: company.postal_code || '',
        customer_type: company.company_type || 'commercial',
        lead_source: 'other',
        status: company.status === 'active' ? 'active' : 'prospect',
        notes: company.notes,
        created_at: company.created_at,
        updated_at: company.updated_at,
        created_by: company.created_by || '',
        primary_contact: primaryContact,
        contacts: company.contacts,
      };

      return { data: customer, error: null };
    } catch (error) {
      console.error('Error fetching customer:', error);
      return { data: null, error: 'Failed to fetch customer' };
    }
  }

  async deleteCustomer(id: string): Promise<{ error: string | null }> {
    try {
      // Soft delete by updating status
      const { error } = await this.supabase
        .from('companies')
        .update({ status: 'inactive' })
        .eq('id', id);

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Error deleting customer:', error);
      return { error: 'Failed to delete customer' };
    }
  }

  async getStats(): Promise<{ data: any; error: string | null }> {
    try {
      // Get total counts by status
      const { data: statusCounts, error: statusError } = await this.supabase
        .from('companies')
        .select('status', { count: 'exact', head: false })
        .select('status');

      if (statusError) {
        return { data: null, error: statusError.message };
      }

      // Get counts by type
      const { data: typeCounts, error: typeError } = await this.supabase
        .from('companies')
        .select('company_type', { count: 'exact', head: false })
        .select('company_type');

      if (typeError) {
        return { data: null, error: typeError.message };
      }

      // Process the data
      const stats = {
        total: statusCounts?.length || 0,
        active: statusCounts?.filter(c => c.status === 'active').length || 0,
        prospects: statusCounts?.filter(c => c.status === 'prospect').length || 0,
        by_type: {
          residential: typeCounts?.filter(c => c.company_type === 'residential').length || 0,
          commercial: typeCounts?.filter(c => c.company_type === 'commercial').length || 0,
          industrial: typeCounts?.filter(c => c.company_type === 'industrial').length || 0,
        },
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { data: null, error: 'Failed to fetch stats' };
    }
  }
}

export const supabaseCustomersService = new SupabaseCustomersService();