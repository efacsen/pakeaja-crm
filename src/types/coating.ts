export type CoatingType = 'primer' | 'base_coat' | 'top_coat' | 'clear_coat' | 'specialty' | 'protective' | 'decorative'
export type UnitType = 'liter' | 'kg' | 'gallon' | 'pound' | 'sqm' | 'sqft'
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected'

export interface CoatingMaterial {
  id: string
  organization_id: string
  name: string
  type: CoatingType
  cost_per_unit: number
  unit_type: UnitType
  coverage_per_unit: number
  supplier: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface CoatingCalculation {
  id: string
  organization_id: string
  customer_id: string
  project_name: string
  surface_area: number
  coating_type: CoatingType
  coating_thickness: number
  number_of_coats: number
  material_cost_per_unit: number
  labor_cost_per_unit: number
  material_total: number
  labor_total: number
  overhead_percentage: number
  profit_margin: number
  final_quote: number
  status: QuoteStatus
  valid_until: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  organization_id: string
  name: string
  email: string | null
  phone: string | null
  address: {
    street?: string
    city?: string
    state?: string
    zip?: string
    country?: string
  }
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface CalculationFormData {
  customer_id: string
  project_name: string
  surface_area: number
  coating_type: CoatingType
  coating_thickness: number
  number_of_coats: number
  material_cost_per_unit: number
  labor_cost_per_unit: number
  overhead_percentage: number
  profit_margin: number
  valid_until: string | null
}

export interface CalculationResults {
  material_total: number
  labor_total: number
  subtotal: number
  overhead_amount: number
  total_with_overhead: number
  profit_amount: number
  final_quote: number
  cost_per_sqm: number
  cost_per_coat: number
}