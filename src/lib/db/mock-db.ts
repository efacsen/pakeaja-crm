// Mock database for development
// This simulates database operations using localStorage

import { v4 as uuidv4 } from 'uuid';

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Calculation {
  id: string;
  user_id: string;
  customer_id?: string;
  status: 'draft' | 'completed' | 'sent';
  project_name: string;
  project_date?: string;
  project_address?: string;
  calculation_data: unknown; // The full CalculatorFormData
  total_area?: number;
  total_cost?: number;
  currency: string;
  created_at: string;
  updated_at: string;
  sent_at?: string;
}

const CUSTOMERS_KEY = 'pakeaja_customers';
const CALCULATIONS_KEY = 'pakeaja_calculations';

// Helper to get current user ID
const getCurrentUserId = () => {
  const authData = localStorage.getItem('pakeaja-dev-auth');
  if (!authData) return null;
  const user = JSON.parse(authData);
  return user.id;
};

// Customer operations
export const customerDb = {
  async getAll(): Promise<Customer[]> {
    const userId = getCurrentUserId();
    if (!userId) return [];
    
    const data = localStorage.getItem(CUSTOMERS_KEY);
    const customers = data ? JSON.parse(data) : [];
    return customers.filter((c: Customer) => c.user_id === userId);
  },

  async getById(id: string): Promise<Customer | null> {
    const customers = await this.getAll();
    return customers.find(c => c.id === id) || null;
  },

  async create(customer: Omit<Customer, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Customer> {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    const newCustomer: Customer = {
      ...customer,
      id: uuidv4(),
      user_id: userId,
      country: customer.country || 'Indonesia',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const data = localStorage.getItem(CUSTOMERS_KEY);
    const customers = data ? JSON.parse(data) : [];
    customers.push(newCustomer);
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));

    return newCustomer;
  },

  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    const data = localStorage.getItem(CUSTOMERS_KEY);
    const customers = data ? JSON.parse(data) : [];
    const index = customers.findIndex((c: Customer) => c.id === id && c.user_id === getCurrentUserId());
    
    if (index === -1) throw new Error('Customer not found');

    customers[index] = {
      ...customers[index],
      ...updates,
      id, // Ensure ID doesn't change
      user_id: customers[index].user_id, // Ensure user_id doesn't change
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    return customers[index];
  },

  async delete(id: string): Promise<void> {
    const data = localStorage.getItem(CUSTOMERS_KEY);
    const customers = data ? JSON.parse(data) : [];
    const filtered = customers.filter((c: Customer) => !(c.id === id && c.user_id === getCurrentUserId()));
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(filtered));
  },

  async search(query: string): Promise<Customer[]> {
    const customers = await this.getAll();
    const lowercaseQuery = query.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(lowercaseQuery) ||
      c.email.toLowerCase().includes(lowercaseQuery) ||
      c.company?.toLowerCase().includes(lowercaseQuery) ||
      c.phone?.includes(query)
    );
  },
};

// Calculation operations
export const calculationDb = {
  async getAll(): Promise<Calculation[]> {
    const userId = getCurrentUserId();
    if (!userId) return [];
    
    const data = localStorage.getItem(CALCULATIONS_KEY);
    const calculations = data ? JSON.parse(data) : [];
    return calculations.filter((c: Calculation) => c.user_id === userId);
  },

  async getById(id: string): Promise<Calculation | null> {
    const calculations = await this.getAll();
    return calculations.find(c => c.id === id) || null;
  },

  async create(calculation: Omit<Calculation, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Calculation> {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    const newCalculation: Calculation = {
      ...calculation,
      id: uuidv4(),
      user_id: userId,
      currency: calculation.currency || 'IDR',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const data = localStorage.getItem(CALCULATIONS_KEY);
    const calculations = data ? JSON.parse(data) : [];
    calculations.push(newCalculation);
    localStorage.setItem(CALCULATIONS_KEY, JSON.stringify(calculations));

    return newCalculation;
  },

  async update(id: string, updates: Partial<Calculation>): Promise<Calculation> {
    const data = localStorage.getItem(CALCULATIONS_KEY);
    const calculations = data ? JSON.parse(data) : [];
    const index = calculations.findIndex((c: Calculation) => c.id === id && c.user_id === getCurrentUserId());
    
    if (index === -1) throw new Error('Calculation not found');

    calculations[index] = {
      ...calculations[index],
      ...updates,
      id, // Ensure ID doesn't change
      user_id: calculations[index].user_id, // Ensure user_id doesn't change
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(CALCULATIONS_KEY, JSON.stringify(calculations));
    return calculations[index];
  },

  async delete(id: string): Promise<void> {
    const data = localStorage.getItem(CALCULATIONS_KEY);
    const calculations = data ? JSON.parse(data) : [];
    const filtered = calculations.filter((c: Calculation) => !(c.id === id && c.user_id === getCurrentUserId()));
    localStorage.setItem(CALCULATIONS_KEY, JSON.stringify(filtered));
  },

  async getByCustomer(customerId: string): Promise<Calculation[]> {
    const calculations = await this.getAll();
    return calculations.filter(c => c.customer_id === customerId);
  },

  async getByStatus(status: 'draft' | 'completed' | 'sent'): Promise<Calculation[]> {
    const calculations = await this.getAll();
    return calculations.filter(c => c.status === status);
  },
};