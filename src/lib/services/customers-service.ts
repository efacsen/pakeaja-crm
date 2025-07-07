import { 
  Customer, 
  CreateCustomerRequest, 
  UpdateCustomerRequest, 
  CustomerFilters, 
  CustomerListResponse,
  CustomerStats 
} from '@/types/customers';

export class CustomersService {
  private storageKey = 'horizon-customers';

  // Create new customer
  async createCustomer(data: CreateCustomerRequest, userId: string = 'demo-user-123'): Promise<{ data: Customer | null; error: string | null }> {
    try {
      const customer: Customer = {
        id: `customer-${Date.now()}`,
        ...data,
        status: data.status || 'prospect',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: userId,
      };

      const existingCustomers = this.getStoredCustomers();
      
      // Check for duplicate email
      const existingEmail = existingCustomers.find(c => c.email.toLowerCase() === data.email.toLowerCase());
      if (existingEmail) {
        return { data: null, error: 'Customer with this email already exists' };
      }

      existingCustomers.push(customer);
      this.saveCustomers(existingCustomers);

      return { data: customer, error: null };
    } catch (error) {
      console.error('Error creating customer:', error);
      return { data: null, error: 'Failed to create customer' };
    }
  }

  // Update existing customer
  async updateCustomer(id: string, data: UpdateCustomerRequest): Promise<{ data: Customer | null; error: string | null }> {
    try {
      const existingCustomers = this.getStoredCustomers();
      const customerIndex = existingCustomers.findIndex(c => c.id === id);
      
      if (customerIndex === -1) {
        return { data: null, error: 'Customer not found' };
      }

      // Check for duplicate email if email is being updated
      if (data.email) {
        const duplicateEmail = existingCustomers.find(c => 
          c.id !== id && c.email.toLowerCase() === data.email!.toLowerCase()
        );
        if (duplicateEmail) {
          return { data: null, error: 'Another customer with this email already exists' };
        }
      }

      const updatedCustomer: Customer = {
        ...existingCustomers[customerIndex],
        ...data,
        updated_at: new Date().toISOString(),
      };

      existingCustomers[customerIndex] = updatedCustomer;
      this.saveCustomers(existingCustomers);

      return { data: updatedCustomer, error: null };
    } catch (error) {
      console.error('Error updating customer:', error);
      return { data: null, error: 'Failed to update customer' };
    }
  }

  // Get customer by ID
  async getCustomer(id: string): Promise<{ data: Customer | null; error: string | null }> {
    try {
      const customers = this.getStoredCustomers();
      const customer = customers.find(c => c.id === id);
      
      return { data: customer || null, error: customer ? null : 'Customer not found' };
    } catch (error) {
      console.error('Error fetching customer:', error);
      return { data: null, error: 'Failed to fetch customer' };
    }
  }

  // List customers with filters and pagination
  async listCustomers(
    filters: CustomerFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: CustomerListResponse | null; error: string | null }> {
    try {
      let customers = this.getStoredCustomers();

      // Apply filters
      if (filters.customer_type) {
        customers = customers.filter(c => c.customer_type === filters.customer_type);
      }
      if (filters.status) {
        customers = customers.filter(c => c.status === filters.status);
      }
      if (filters.lead_source) {
        customers = customers.filter(c => c.lead_source === filters.lead_source);
      }
      if (filters.city) {
        customers = customers.filter(c => 
          c.city.toLowerCase().includes(filters.city!.toLowerCase())
        );
      }
      if (filters.state) {
        customers = customers.filter(c => 
          c.state.toLowerCase().includes(filters.state!.toLowerCase())
        );
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        customers = customers.filter(c => 
          c.name.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.phone.toLowerCase().includes(searchLower) ||
          (c.company && c.company.toLowerCase().includes(searchLower))
        );
      }

      // Sort by updated_at desc
      customers.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      // Pagination
      const total = customers.length;
      const startIndex = (page - 1) * limit;
      const paginatedCustomers = customers.slice(startIndex, startIndex + limit);

      return {
        data: {
          customers: paginatedCustomers,
          total,
          page,
          limit,
        },
        error: null,
      };
    } catch (error) {
      console.error('Error listing customers:', error);
      return { data: null, error: 'Failed to list customers' };
    }
  }

  // Delete customer
  async deleteCustomer(id: string): Promise<{ error: string | null }> {
    try {
      const existingCustomers = this.getStoredCustomers();
      const filteredCustomers = existingCustomers.filter(c => c.id !== id);
      
      if (existingCustomers.length === filteredCustomers.length) {
        return { error: 'Customer not found' };
      }
      
      this.saveCustomers(filteredCustomers);
      return { error: null };
    } catch (error) {
      console.error('Error deleting customer:', error);
      return { error: 'Failed to delete customer' };
    }
  }

  // Get customer statistics
  async getCustomerStats(): Promise<{ data: CustomerStats | null; error: string | null }> {
    try {
      const customers = this.getStoredCustomers();
      
      const stats: CustomerStats = {
        total: customers.length,
        active: customers.filter(c => c.status === 'active').length,
        prospects: customers.filter(c => c.status === 'prospect').length,
        by_type: {
          residential: customers.filter(c => c.customer_type === 'residential').length,
          commercial: customers.filter(c => c.customer_type === 'commercial').length,
          industrial: customers.filter(c => c.customer_type === 'industrial').length,
        },
        by_source: {
          website: customers.filter(c => c.lead_source === 'website').length,
          referral: customers.filter(c => c.lead_source === 'referral').length,
          social_media: customers.filter(c => c.lead_source === 'social_media').length,
          cold_call: customers.filter(c => c.lead_source === 'cold_call').length,
          advertisement: customers.filter(c => c.lead_source === 'advertisement').length,
          other: customers.filter(c => c.lead_source === 'other').length,
        },
        recent_customers: customers
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5),
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting customer stats:', error);
      return { data: null, error: 'Failed to get customer statistics' };
    }
  }

  // Search customers by name or email
  async searchCustomers(query: string): Promise<{ data: Customer[] | null; error: string | null }> {
    try {
      const customers = this.getStoredCustomers();
      const searchLower = query.toLowerCase();
      
      const results = customers.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        (c.company && c.company.toLowerCase().includes(searchLower))
      );

      return { data: results, error: null };
    } catch (error) {
      console.error('Error searching customers:', error);
      return { data: null, error: 'Failed to search customers' };
    }
  }

  // Helper methods
  private getStoredCustomers(): Customer[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : this.getSampleCustomers();
    } catch {
      return this.getSampleCustomers();
    }
  }

  private saveCustomers(customers: Customer[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(customers));
  }

  // Generate sample customers for development
  private getSampleCustomers(): Customer[] {
    const sampleCustomers: Customer[] = [
      {
        id: 'customer-1',
        name: 'Budi Santoso',
        email: 'budi.santoso@ptbangunabadi.co.id',
        phone: '021-5678-9012',
        company: 'PT. Bangun Abadi',
        address: 'Jl. Sudirman No. 123',
        city: 'Jakarta Pusat',
        state: 'DKI Jakarta',
        zip_code: '10110',
        customer_type: 'commercial',
        lead_source: 'website',
        status: 'active',
        notes: 'Lebih suka sistem coating epoxy',
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: 'demo-user-123',
      },
      {
        id: 'customer-2',
        name: 'Sari Wijaya',
        email: 'sari.wijaya@gmail.com',
        phone: '0812-3456-7890',
        address: 'Jl. Kemang Raya No. 456',
        city: 'Jakarta Selatan',
        state: 'DKI Jakarta',
        zip_code: '12730',
        customer_type: 'residential',
        lead_source: 'referral',
        status: 'prospect',
        notes: 'Tertarik dengan coating lantai garasi',
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: 'demo-user-123',
      },
      {
        id: 'customer-3',
        name: 'Ahmad Hidayat',
        email: 'ahmad.hidayat@cvmajujaya.co.id',
        phone: '031-8765-4321',
        company: 'CV. Maju Jaya',
        address: 'Jl. Raya Tandes No. 789',
        city: 'Surabaya',
        state: 'Jawa Timur',
        zip_code: '60186',
        customer_type: 'industrial',
        lead_source: 'advertisement',
        status: 'active',
        notes: 'Fasilitas besar, beberapa proyek coating',
        created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: 'demo-user-123',
      },
    ];

    // Save sample data
    this.saveCustomers(sampleCustomers);
    return sampleCustomers;
  }
}

// Export singleton instance
export const customersService = new CustomersService();