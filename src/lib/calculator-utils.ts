import { 
  SurfaceMeasurement, 
  CoatingProduct, 
  CoatingSystem, 
  CostBreakdown,
  LaborRate 
} from '@/types/calculator';

export function calculateSurfaceArea(surface: SurfaceMeasurement): number {
  const area = surface.length * surface.width * surface.quantity;
  return area; // Already in square meters
}

export function calculateTotalArea(surfaces: SurfaceMeasurement[]): number {
  return surfaces.reduce((total, surface) => total + calculateSurfaceArea(surface), 0);
}

export function calculateProductQuantity(
  area: number, 
  product: CoatingProduct, 
  coats: number
): number {
  const totalArea = area * coats;
  const litersNeeded = totalArea / product.coverage;
  return Math.ceil(litersNeeded * 1.1); // Add 10% waste factor
}

export function calculateMaterialCost(
  surfaces: SurfaceMeasurement[],
  system: CoatingSystem
): CostBreakdown['materials'] {
  const totalArea = calculateTotalArea(surfaces);
  
  const products = system.products.map(({ product, coats }) => {
    const quantity = calculateProductQuantity(totalArea, product, coats);
    const totalCost = quantity * product.pricePerLiter;
    
    return {
      product,
      quantity,
      totalCost,
    };
  });
  
  const totalMaterialCost = products.reduce((sum, p) => sum + p.totalCost, 0);
  
  return {
    products,
    totalMaterialCost,
  };
}

export function calculateLaborCost(
  surfaces: SurfaceMeasurement[],
  laborRates: LaborRate[]
): CostBreakdown['labor'] {
  const totalArea = calculateTotalArea(surfaces);
  
  const tasks = laborRates.map(rate => {
    const hours = totalArea / 10; // Assume 10 m² per hour as base
    const totalCost = totalArea * rate.ratePerSqm;
    
    return {
      description: rate.name,
      descriptionId: rate.nameId,
      hours,
      rate: rate.ratePerSqm,
      totalCost,
    };
  });
  
  const totalLaborCost = tasks.reduce((sum, t) => sum + t.totalCost, 0);
  
  return {
    tasks,
    totalLaborCost,
  };
}

export function calculateEquipmentCost(
  surfaces: SurfaceMeasurement[]
): CostBreakdown['equipment'] {
  const totalArea = calculateTotalArea(surfaces);
  const days = Math.ceil(totalArea / 100); // Assume 100 m² per day
  
  const items = [
    {
      name: 'Surface Grinder',
      nameId: 'Mesin Gerinda Permukaan',
      dailyRate: 1500000, // Rp 1.500.000
      days,
      totalCost: 1500000 * days,
    },
    {
      name: 'Dust Collection System',
      nameId: 'Sistem Pengumpul Debu',
      dailyRate: 800000, // Rp 800.000
      days,
      totalCost: 800000 * days,
    },
    {
      name: 'Spray Equipment',
      nameId: 'Peralatan Spray',
      dailyRate: 500000, // Rp 500.000
      days,
      totalCost: 500000 * days,
    },
  ];
  
  const totalEquipmentCost = items.reduce((sum, i) => sum + i.totalCost, 0);
  
  return {
    items,
    totalEquipmentCost,
  };
}

export function calculateTotalCost(
  surfaces: SurfaceMeasurement[],
  system: CoatingSystem,
  laborRates: LaborRate[],
  overheadPercent: number = 10,
  profitPercent: number = 15,
  ppnPercent: number = 11, // PPN 11%
  mobilizationPercent: number = 5
): CostBreakdown {
  const materials = calculateMaterialCost(surfaces, system);
  const labor = calculateLaborCost(surfaces, laborRates);
  const equipment = calculateEquipmentCost(surfaces);
  
  const additionalCosts = [
    { 
      name: 'Permits & Insurance', 
      nameId: 'Perizinan & Asuransi',
      cost: 2500000 // Rp 2.500.000
    },
    { 
      name: 'Quality Control & Testing',
      nameId: 'Kontrol Kualitas & Testing',
      cost: 1500000 // Rp 1.500.000
    },
    {
      name: 'Safety Equipment',
      nameId: 'Peralatan Keselamatan',
      cost: 1000000 // Rp 1.000.000
    }
  ];
  
  const baseCost = 
    materials.totalMaterialCost + 
    labor.totalLaborCost + 
    equipment.totalEquipmentCost +
    additionalCosts.reduce((sum, c) => sum + c.cost, 0);
  
  // Biaya Mobilisasi (Mobilization Cost)
  const mobilizationCost = baseCost * (mobilizationPercent / 100);
  
  const subtotal = baseCost + mobilizationCost;
  
  const overhead = subtotal * (overheadPercent / 100);
  const profit = subtotal * (profitPercent / 100);
  const beforePPN = subtotal + overhead + profit;
  const ppn = beforePPN * (ppnPercent / 100);
  const totalCost = beforePPN + ppn;
  
  return {
    materials,
    labor,
    equipment,
    additionalCosts,
    mobilizationCost,
    subtotal,
    overhead: overheadPercent,
    profit: profitPercent,
    ppn: ppnPercent,
    totalCost,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatArea(area: number): string {
  // Use English formatting for consistency
  return `${area.toFixed(2)} m²`;
}

export function formatNumber(num: number, decimals: number = 0): string {
  // Use English formatting with commas for thousands
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

