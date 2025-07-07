export interface Material {
  id: string;
  
  // Basic Information
  product_code: string;
  product_name: string;
  manufacturer: 'NIPPON' | 'JOTUN' | 'KANSAI' | 'DULUX' | 'SKK' | 'PROPAN' | 'OTHER';
  manufacturer_other?: string;
  category: 'primer' | 'intermediate' | 'finish' | 'thinner' | 'additive' | 'specialty';
  sub_category?: string; // e.g., "Zinc Rich", "High Build", "Anti-Fouling"
  
  // Technical Specifications
  product_type: string; // e.g., "Epoxy", "Polyurethane", "Alkyd"
  finish_type?: 'gloss' | 'semi-gloss' | 'satin' | 'matt' | 'flat';
  color_range?: string; // e.g., "RAL, BS, Custom"
  
  // Application Data
  spreading_rates: SpreadingRate[]; // Different rates for different DFT
  volume_solids: number; // Percentage
  specific_gravity: number;
  flash_point?: number; // Celsius
  
  // Film Thickness
  dft_min: number; // Minimum Dry Film Thickness in microns
  dft_max: number; // Maximum Dry Film Thickness in microns
  dft_recommended: number; // Recommended DFT in microns
  wft_per_dft?: number; // WFT needed for 1 micron DFT
  
  // Drying Times (at 25°C)
  pot_life?: string; // e.g., "8 hours at 25°C"
  touch_dry?: number; // minutes
  hard_dry?: number; // hours
  full_cure?: number; // days
  recoat_min?: number; // hours
  recoat_max?: number; // days
  
  // Mixing Information
  mix_ratio?: string; // e.g., "4:1 by volume"
  thinner_type?: string; // e.g., "Thinner 1260"
  thinner_percentage_brush?: number; // % for brush/roll
  thinner_percentage_spray?: number; // % for spray
  
  // Packaging
  packaging_sizes: PackagingSize[];
  shelf_life?: number; // months
  
  // Application Methods
  application_methods: ApplicationMethod[];
  
  // Loss Factors
  loss_factor_brush: number; // percentage
  loss_factor_spray: number; // percentage
  
  // System Compatibility
  compatible_primers?: string[]; // Product codes
  compatible_intermediates?: string[]; // Product codes
  compatible_finishes?: string[]; // Product codes
  
  // Version Control
  tds_version: string;
  tds_date: string;
  msds_version?: string;
  
  // Pricing (optional - can be updated separately)
  unit_price?: number; // Price per unit (L or Kg)
  price_per_liter?: number;
  price_per_kg?: number;
  price_updated_at?: string;
  
  // Stock Information
  minimum_order?: number; // Minimum order quantity
  lead_time_days?: number; // Lead time in days
  
  // Status
  active?: boolean; // Alias for is_active
  is_active: boolean;
  is_discontinued: boolean;
  replacement_product_id?: string;
  
  // Metadata
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by?: string;
}

export interface SpreadingRate {
  dft: number; // Target DFT in microns
  theoretical_coverage: number; // m²/liter
  practical_coverage_brush: number; // m²/liter with loss factor
  practical_coverage_spray: number; // m²/liter with loss factor
}

export interface PackagingSize {
  size: number; // Size in liters or kg
  unit: 'liter' | 'kg';
  container?: 'can' | 'gallon' | 'pail' | 'drum'; // Container type
  sku?: string;
  barcode?: string;
}

export interface ApplicationMethod {
  method: 'brush' | 'roller' | 'conventional_spray' | 'airless_spray' | 'electrostatic_spray';
  nozzle_size?: string; // e.g., "0.017-0.021\""
  pressure?: string; // e.g., "2000-2500 psi"
  notes?: string;
}

export interface MaterialImportData {
  // Simplified structure for CSV/Excel import
  product_code: string;
  product_name: string;
  manufacturer: string;
  category: string;
  product_type: string;
  volume_solids: number;
  spreading_rate_theoretical: number; // at recommended DFT
  dft_recommended: number;
  packaging_sizes: string; // e.g., "1L,4L,20L"
  loss_factor_brush?: number;
  loss_factor_spray?: number;
  pot_life?: string;
  touch_dry?: number;
  hard_dry?: number;
  recoat_min?: number;
  recoat_max?: number;
  mix_ratio?: string;
  thinner_type?: string;
  price_per_liter?: number;
}

export interface MaterialFilter {
  manufacturer?: Material['manufacturer'];
  category?: Material['category'];
  product_type?: string;
  is_active?: boolean;
  search?: string; // Search in product name, code
}

export interface MaterialSystem {
  id: string;
  name: string;
  description: string;
  environment_type: 'C1' | 'C2' | 'C3' | 'C4' | 'C5-I' | 'C5-M' | 'CX'; // ISO 12944
  substrate: 'steel' | 'concrete' | 'wood' | 'galvanized' | 'aluminum' | 'other';
  
  // System Components
  surface_preparation: string; // e.g., "Sa 2.5"
  primer: SystemComponent;
  intermediate?: SystemComponent;
  finish: SystemComponent;
  
  // System Properties
  total_dft: number; // Total system DFT in microns
  expected_lifetime: string; // e.g., "15 years"
  warranty_years?: number;
  
  // Metadata
  created_at: string;
  created_by: string;
  is_approved: boolean;
  approved_by?: string;
  approved_at?: string;
}

export interface SystemComponent {
  material_id: string;
  material?: Material; // Populated when fetched
  coats: number;
  dft_per_coat: number;
  total_dft: number;
}

export interface MaterialImportResult {
  success: boolean;
  total_rows: number;
  imported: number;
  updated: number;
  errors: ImportError[];
}

export interface ImportError {
  row: number;
  field: string;
  value: any;
  message: string;
}

// For TDS OCR extraction
export interface TDSExtractionResult {
  product_name?: string;
  product_code?: string;
  manufacturer?: string;
  volume_solids?: number;
  spreading_rate?: number;
  dft_recommended?: number;
  pot_life?: string;
  drying_times?: {
    touch_dry?: number;
    hard_dry?: number;
    full_cure?: number;
  };
  mix_ratio?: string;
  application_data?: {
    brush_thinner?: number;
    spray_thinner?: number;
    temperature_range?: string;
  };
  confidence_scores: Record<string, number>; // Confidence for each extracted field
  raw_text: string; // Full extracted text for reference
}