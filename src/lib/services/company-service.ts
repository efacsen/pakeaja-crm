import { createClient } from '@/lib/supabase/client';

export interface Company {
  id: string;
  name: string;
  tax_id?: string;
  industry?: string;
  company_type?: string;
  website?: string;
  address?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  country?: string;
  credit_limit?: number;
  payment_terms?: number;
  discount_percentage?: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  company_id: string;
  name: string;
  position?: string;
  department?: string;
  email?: string;
  mobile_phone?: string;
  office_phone?: string;
  whatsapp?: string;
  preferred_language?: string;
  preferred_contact_method?: string;
  is_primary: boolean;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyWithContacts extends Company {
  contacts?: Contact[];
}

export interface SearchResult {
  company_id: string;
  company_name: string;
  company_city?: string;
  contact_id?: string;
  contact_name?: string;
  contact_position?: string;
  contact_email?: string;
  contact_phone?: string;
  match_type: 'company' | 'contact';
}

export const companyService = {
  // Search companies and contacts
  async searchCompaniesWithContacts(searchTerm: string, limit: number = 10): Promise<SearchResult[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .rpc('search_companies_with_contacts', {
        search_term: searchTerm,
        limit_count: limit
      });

    if (error) {
      console.error('Error searching companies:', error);
      return [];
    }

    return data || [];
  },

  // Get or create company
  async getOrCreateCompany(companyName: string, city?: string, address?: string): Promise<string | null> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .rpc('get_or_create_company', {
        p_company_name: companyName,
        p_city: city,
        p_address: address
      });

    if (error) {
      console.error('Error getting/creating company:', error);
      return null;
    }

    return data;
  },

  // Get company by ID with contacts
  async getCompanyWithContacts(companyId: string): Promise<CompanyWithContacts | null> {
    const supabase = createClient();
    
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (companyError || !company) {
      console.error('Error fetching company:', companyError);
      return null;
    }

    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('is_primary', { ascending: false })
      .order('name');

    if (contactsError) {
      console.error('Error fetching contacts:', contactsError);
    }

    return {
      ...company,
      contacts: contacts || []
    };
  },

  // Get all companies
  async getAllCompanies(): Promise<Company[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('status', 'active')
      .order('name');

    if (error) {
      console.error('Error fetching companies:', error);
      return [];
    }

    return data || [];
  },

  // Get contacts for a company
  async getCompanyContacts(companyId: string): Promise<Contact[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('is_primary', { ascending: false })
      .order('name');

    if (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }

    return data || [];
  },

  // Create new company
  async createCompany(company: Partial<Company>): Promise<Company | null> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('companies')
      .insert(company)
      .select()
      .single();

    if (error) {
      console.error('Error creating company:', error);
      return null;
    }

    return data;
  },

  // Create new contact
  async createContact(contact: Partial<Contact>): Promise<Contact | null> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('contacts')
      .insert(contact)
      .select()
      .single();

    if (error) {
      console.error('Error creating contact:', error);
      return null;
    }

    return data;
  },

  // Update company
  async updateCompany(id: string, updates: Partial<Company>): Promise<Company | null> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating company:', error);
      return null;
    }

    return data;
  },

  // Update contact
  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact | null> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('contacts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating contact:', error);
      return null;
    }

    return data;
  },
};