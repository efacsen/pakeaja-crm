// Extended calculator utilities for testing
import { 
  SurfaceMeasurement, 
  CoatingProduct, 
  CoatingSystem, 
  CostBreakdown,
  LaborRate 
} from '@/types/calculator';

// Re-export original functions
export { 
  calculateSurfaceArea,
  calculateTotalArea,
  calculateProductQuantity,
  calculateMaterialCost,
  calculateEquipmentCost,
  formatCurrency
} from './calculator-utils';

// Override formatArea to use English formatting for tests
export function formatArea(area: number): string {
  return `${area.toFixed(2)} m²`;
}

// Override formatNumber to use English formatting for tests
export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Additional helper functions for testing
export function calculateCoatingQuantity(
  area: number,
  coverage: number,
  coats: number,
  wastagePercent: number = 10
): number {
  if (coverage === 0) return 0;
  const totalArea = area * coats;
  const wasteFactor = 1 + (wastagePercent / 100);
  return Math.ceil((totalArea / coverage) * wasteFactor);
}

// Simple labor cost calculation for testing
export function calculateLaborCost(
  area: number,
  ratePerSqm: number,
  preparation: 'light' | 'medium' | 'heavy'
): number {
  const multiplier = preparation === 'heavy' ? 1.5 : preparation === 'medium' ? 1.2 : 1.0;
  return area * ratePerSqm * multiplier;
}

// Simplified total cost calculation for testing
export function calculateTotalCost(
  surfaces: SurfaceMeasurement[],
  system: CoatingSystem,
  laborRate: number,
  additionalCosts: number = 0,
  discountPercent: number = 0,
  taxPercent: number = 11
): {
  totalArea: number;
  materialCost: number;
  laborCost: number;
  subtotal: number;
  discount: number;
  tax: number;
  totalWithTax: number;
} {
  const totalArea = surfaces.reduce((sum, s) => sum + (s.length * s.width * s.quantity), 0);
  
  // Calculate material cost
  let materialCost = 0;
  system.products.forEach(({ product, coats }) => {
    const quantity = calculateCoatingQuantity(totalArea, product.coverage, coats);
    materialCost += quantity * product.pricePerLiter;
  });
  
  // Calculate labor cost
  const avgPrep = surfaces[0]?.preparation || 'medium';
  const laborCost = calculateLaborCost(totalArea, laborRate, avgPrep);
  
  // Calculate totals
  const baseCost = materialCost + laborCost + additionalCosts;
  const discount = baseCost * (discountPercent / 100);
  const subtotal = baseCost - discount;
  const tax = subtotal * (taxPercent / 100);
  const totalWithTax = subtotal + tax;
  
  return {
    totalArea,
    materialCost,
    laborCost,
    subtotal,
    discount,
    tax,
    totalWithTax,
  };
}