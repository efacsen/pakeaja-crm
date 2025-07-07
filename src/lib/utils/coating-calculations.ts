import { CalculationFormData, CalculationResults } from '@/types/coating'

export function calculateCoatingCosts(data: CalculationFormData): CalculationResults {
  // Basic calculations
  const material_total = data.surface_area * data.material_cost_per_unit * data.number_of_coats
  const labor_total = data.surface_area * data.labor_cost_per_unit * data.number_of_coats
  const subtotal = material_total + labor_total
  
  // Overhead calculation
  const overhead_amount = subtotal * (data.overhead_percentage / 100)
  const total_with_overhead = subtotal + overhead_amount
  
  // Profit calculation
  const profit_amount = total_with_overhead * (data.profit_margin / 100)
  const final_quote = total_with_overhead + profit_amount
  
  // Additional metrics
  const cost_per_sqm = final_quote / data.surface_area
  const cost_per_coat = final_quote / data.number_of_coats
  
  return {
    material_total,
    labor_total,
    subtotal,
    overhead_amount,
    total_with_overhead,
    profit_amount,
    final_quote,
    cost_per_sqm,
    cost_per_coat,
  }
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatArea(area: number, unit: string = 'sqm'): string {
  return `${area.toLocaleString()} ${unit}`
}

export function getCoatingTypeDisplayName(type: string): string {
  const displayNames: Record<string, string> = {
    primer: 'Primer',
    base_coat: 'Base Coat',
    top_coat: 'Top Coat',
    clear_coat: 'Clear Coat',
    specialty: 'Specialty',
    protective: 'Protective',
    decorative: 'Decorative',
  }
  return displayNames[type] || type
}

export function getUnitTypeDisplayName(unit: string): string {
  const displayNames: Record<string, string> = {
    liter: 'Liter',
    kg: 'Kilogram',
    gallon: 'Gallon',
    pound: 'Pound',
    sqm: 'Square Meter',
    sqft: 'Square Foot',
  }
  return displayNames[unit] || unit
}

export function calculateMaterialUsage(
  surface_area: number,
  coating_thickness: number,
  number_of_coats: number,
  coverage_per_unit: number
): number {
  // Calculate total volume needed based on surface area, thickness, and coats
  const total_volume = surface_area * (coating_thickness / 1000) * number_of_coats // thickness in mm to m
  const units_needed = total_volume / coverage_per_unit
  return Math.ceil(units_needed * 1.1) // Add 10% waste factor
}

export function validateCalculationData(data: Partial<CalculationFormData>): string[] {
  const errors: string[] = []
  
  if (!data.customer_id) {
    errors.push('Customer is required')
  }
  
  if (!data.project_name?.trim()) {
    errors.push('Project name is required')
  }
  
  if (!data.surface_area || data.surface_area <= 0) {
    errors.push('Surface area must be greater than 0')
  }
  
  if (!data.coating_thickness || data.coating_thickness <= 0) {
    errors.push('Coating thickness must be greater than 0')
  }
  
  if (!data.number_of_coats || data.number_of_coats < 1) {
    errors.push('Number of coats must be at least 1')
  }
  
  if (data.material_cost_per_unit === undefined || data.material_cost_per_unit < 0) {
    errors.push('Material cost must be 0 or greater')
  }
  
  if (data.labor_cost_per_unit === undefined || data.labor_cost_per_unit < 0) {
    errors.push('Labor cost must be 0 or greater')
  }
  
  if (data.overhead_percentage === undefined || data.overhead_percentage < 0 || data.overhead_percentage > 100) {
    errors.push('Overhead percentage must be between 0 and 100')
  }
  
  if (data.profit_margin === undefined || data.profit_margin < 0 || data.profit_margin > 100) {
    errors.push('Profit margin must be between 0 and 100')
  }
  
  return errors
}