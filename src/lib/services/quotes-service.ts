import { createClient } from '@/lib/supabase/client';
import { Quote, CreateQuoteRequest, UpdateQuoteRequest, QuoteFilters, QuoteListResponse } from '@/types/quotes';
import { CalculatorFormData } from '@/types/calculator';

export class QuotesService {
  private supabase = createClient();

  // Generate unique quote number
  private generateQuoteNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const time = String(Date.now()).slice(-4);
    return `Q${year}${month}${day}-${time}`;
  }

  // Create new quote/draft
  async createQuote(data: CreateQuoteRequest, userId: string = 'demo-user-123'): Promise<{ data: Quote | null; error: string | null }> {
    try {
      // For development, use localStorage instead of Supabase
      const quote: Quote = {
        id: `quote-${Date.now()}`,
        quote_number: this.generateQuoteNumber(),
        project_name: data.project_name,
        client_name: data.client_name,
        client_email: data.client_email,
        client_phone: data.client_phone,
        project_address: data.project_address,
        project_date: data.project_date,
        status: 'draft',
        total_cost: data.calculator_data.costBreakdown?.totalCost || 0,
        cost_per_sqft: this.calculateCostPerSqft(data.calculator_data),
        total_area: this.calculateTotalArea(data.calculator_data),
        calculator_data: data.calculator_data,
        notes: data.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: userId,
      };

      // Store in localStorage for development
      const existingQuotes = this.getStoredQuotes();
      existingQuotes.push(quote);
      localStorage.setItem('pakeaja-quotes', JSON.stringify(existingQuotes));

      return { data: quote, error: null };
    } catch (error) {
      console.error('Error creating quote:', error);
      return { data: null, error: 'Failed to create quote' };
    }
  }

  // Update existing quote
  async updateQuote(id: string, data: UpdateQuoteRequest): Promise<{ data: Quote | null; error: string | null }> {
    try {
      const existingQuotes = this.getStoredQuotes();
      const quoteIndex = existingQuotes.findIndex(q => q.id === id);
      
      if (quoteIndex === -1) {
        return { data: null, error: 'Quote not found' };
      }

      const updatedQuote: Quote = {
        ...existingQuotes[quoteIndex],
        ...data,
        updated_at: new Date().toISOString(),
      };

      // Recalculate costs if calculator data changed
      if (data.calculator_data) {
        updatedQuote.total_cost = data.calculator_data.costBreakdown?.totalCost || 0;
        updatedQuote.cost_per_sqft = this.calculateCostPerSqft(data.calculator_data);
        updatedQuote.total_area = this.calculateTotalArea(data.calculator_data);
      }

      existingQuotes[quoteIndex] = updatedQuote;
      localStorage.setItem('pakeaja-quotes', JSON.stringify(existingQuotes));

      return { data: updatedQuote, error: null };
    } catch (error) {
      console.error('Error updating quote:', error);
      return { data: null, error: 'Failed to update quote' };
    }
  }

  // Get quote by ID
  async getQuote(id: string): Promise<{ data: Quote | null; error: string | null }> {
    try {
      const existingQuotes = this.getStoredQuotes();
      const quote = existingQuotes.find(q => q.id === id);
      
      return { data: quote || null, error: quote ? null : 'Quote not found' };
    } catch (error) {
      console.error('Error fetching quote:', error);
      return { data: null, error: 'Failed to fetch quote' };
    }
  }

  // List quotes with filters and pagination
  async listQuotes(
    filters: QuoteFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: QuoteListResponse | null; error: string | null }> {
    try {
      let quotes = this.getStoredQuotes();

      // Apply filters
      if (filters.status) {
        quotes = quotes.filter(q => q.status === filters.status);
      }
      if (filters.client_name) {
        quotes = quotes.filter(q => 
          q.client_name.toLowerCase().includes(filters.client_name!.toLowerCase())
        );
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        quotes = quotes.filter(q => 
          q.project_name.toLowerCase().includes(searchLower) ||
          q.client_name.toLowerCase().includes(searchLower) ||
          q.quote_number.toLowerCase().includes(searchLower)
        );
      }
      if (filters.date_from) {
        quotes = quotes.filter(q => q.created_at >= filters.date_from!);
      }
      if (filters.date_to) {
        quotes = quotes.filter(q => q.created_at <= filters.date_to!);
      }

      // Sort by created_at desc
      quotes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      // Pagination
      const total = quotes.length;
      const startIndex = (page - 1) * limit;
      const paginatedQuotes = quotes.slice(startIndex, startIndex + limit);

      return {
        data: {
          quotes: paginatedQuotes,
          total,
          page,
          limit,
        },
        error: null,
      };
    } catch (error) {
      console.error('Error listing quotes:', error);
      return { data: null, error: 'Failed to list quotes' };
    }
  }

  // Delete quote
  async deleteQuote(id: string): Promise<{ error: string | null }> {
    try {
      const existingQuotes = this.getStoredQuotes();
      const filteredQuotes = existingQuotes.filter(q => q.id !== id);
      
      localStorage.setItem('pakeaja-quotes', JSON.stringify(filteredQuotes));
      return { error: null };
    } catch (error) {
      console.error('Error deleting quote:', error);
      return { error: 'Failed to delete quote' };
    }
  }

  // Send quote (update status to 'sent')
  async sendQuote(id: string): Promise<{ data: Quote | null; error: string | null }> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

    return this.updateQuote(id, {
      status: 'sent',
      sent_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
    });
  }

  // Helper methods
  private getStoredQuotes(): Quote[] {
    try {
      const stored = localStorage.getItem('pakeaja-quotes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private calculateTotalArea(calculatorData: CalculatorFormData): number {
    if (!calculatorData.surfaces) return 0;
    return calculatorData.surfaces.reduce((total, surface) => {
      return total + (surface.length * surface.width * surface.quantity);
    }, 0);
  }

  private calculateCostPerSqft(calculatorData: CalculatorFormData): number {
    const totalArea = this.calculateTotalArea(calculatorData);
    const totalCost = calculatorData.costBreakdown?.totalCost || 0;
    return totalArea > 0 ? totalCost / totalArea : 0;
  }
}

// Export singleton instance
export const quotesService = new QuotesService();