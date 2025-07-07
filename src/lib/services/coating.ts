import { createClient } from '@/lib/supabase/client'
import { CoatingCalculation, CoatingMaterial, Customer, CalculationFormData } from '@/types/coating'

const supabase = createClient()

export class CoatingService {
  // Coating Calculations
  static async getCalculations(): Promise<CoatingCalculation[]> {
    const { data, error } = await supabase
      .from('coating_calculations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async getCalculationById(id: string): Promise<CoatingCalculation | null> {
    const { data, error } = await supabase
      .from('coating_calculations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  static async createCalculation(calculation: CalculationFormData): Promise<CoatingCalculation> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('coating_calculations')
      .insert({
        ...calculation,
        created_by: user.id,
        status: 'draft' as const,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateCalculation(id: string, updates: Partial<CalculationFormData>): Promise<CoatingCalculation> {
    const { data, error } = await supabase
      .from('coating_calculations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteCalculation(id: string): Promise<void> {
    const { error } = await supabase
      .from('coating_calculations')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  static async updateCalculationStatus(id: string, status: 'draft' | 'sent' | 'accepted' | 'rejected'): Promise<void> {
    const { error } = await supabase
      .from('coating_calculations')
      .update({ status })
      .eq('id', id)

    if (error) throw error
  }

  // Coating Materials
  static async getMaterials(): Promise<CoatingMaterial[]> {
    const { data, error } = await supabase
      .from('coating_materials')
      .select('*')
      .eq('active', true)
      .order('name')

    if (error) throw error
    return data || []
  }

  static async getMaterialsByType(type: string): Promise<CoatingMaterial[]> {
    const { data, error } = await supabase
      .from('coating_materials')
      .select('*')
      .eq('type', type)
      .eq('active', true)
      .order('name')

    if (error) throw error
    return data || []
  }

  static async createMaterial(material: Omit<CoatingMaterial, 'id' | 'organization_id' | 'created_at' | 'updated_at'>): Promise<CoatingMaterial> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Get user's organization_id from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (!profile?.organization_id) throw new Error('User organization not found')

    const { data, error } = await supabase
      .from('coating_materials')
      .insert({
        ...material,
        organization_id: profile.organization_id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Customers
  static async getCustomers(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  }

  static async createCustomer(customer: Omit<Customer, 'id' | 'organization_id' | 'created_by' | 'created_at' | 'updated_at'>): Promise<Customer> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Get user's organization_id from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (!profile?.organization_id) throw new Error('User organization not found')

    const { data, error } = await supabase
      .from('customers')
      .insert({
        ...customer,
        organization_id: profile.organization_id,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Calculation with customer details
  static async getCalculationsWithCustomers(): Promise<(CoatingCalculation & { customer: Customer })[]> {
    const { data, error } = await supabase
      .from('coating_calculations')
      .select(`
        *,
        customer:customers(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Dashboard statistics
  static async getCalculationStats(): Promise<{
    total_calculations: number
    total_value: number
    pending_quotes: number
    accepted_quotes: number
  }> {
    const { data, error } = await supabase
      .from('coating_calculations')
      .select('final_quote, status')

    if (error) throw error

    const stats = {
      total_calculations: data?.length || 0,
      total_value: data?.reduce((sum, calc) => sum + calc.final_quote, 0) || 0,
      pending_quotes: data?.filter(calc => calc.status === 'sent').length || 0,
      accepted_quotes: data?.filter(calc => calc.status === 'accepted').length || 0,
    }

    return stats
  }
}