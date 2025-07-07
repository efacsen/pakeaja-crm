export interface ProjectDetails {
  projectName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectAddress: string;
  projectDate: Date;
  notes?: string;
}

export interface SurfaceMeasurement {
  id: string;
  name: string;
  length: number; // meters
  width: number; // meters
  height?: number; // meters
  quantity: number;
  unit: 'sqm'; // square meters only
  surfaceType: 'floor' | 'wall' | 'ceiling' | 'exterior' | 'metal' | 'concrete';
  condition: 'new' | 'good' | 'fair' | 'poor';
  preparation: 'none' | 'light' | 'moderate' | 'heavy';
}

export interface CoatingProduct {
  id: string;
  name: string;
  nameId?: string; // Indonesian name
  type: 'epoxy' | 'polyurethane' | 'acrylic' | 'cat-besi' | 'cat-tembok' | 'marine';
  category: 'primer' | 'basecoat' | 'topcoat' | 'sealer';
  coverage: number; // m² per liter
  pricePerLiter: number; // Rupiah
  dryTime: number; // hours
  recoatTime: number; // hours
  description: string;
  descriptionId?: string; // Indonesian description
  features: string[];
  featuresId?: string[]; // Indonesian features
}

export interface CoatingSystem {
  id: string;
  name: string;
  nameId?: string; // Indonesian name
  description: string;
  descriptionId?: string; // Indonesian description
  products: {
    product: CoatingProduct;
    coats: number;
    thickness: number; // microns
  }[];
  totalThickness: number; // microns
  systemType: 'standard' | 'heavy-duty' | 'decorative' | 'chemical-resistant' | 'marine' | 'industrial';
  warranty: number; // years
}

export interface LaborRate {
  id: string;
  name: string;
  nameId?: string; // Indonesian name
  ratePerHour: number; // Rupiah
  ratePerSqm: number; // Rupiah per m²
  taskType: 'surface-prep' | 'application' | 'finishing';
}

export interface CostBreakdown {
  materials: {
    products: {
      product: CoatingProduct;
      quantity: number; // liters
      totalCost: number; // Rupiah
    }[];
    totalMaterialCost: number; // Rupiah
  };
  labor: {
    tasks: {
      description: string;
      descriptionId?: string;
      hours: number;
      rate: number; // Rupiah per m²
      totalCost: number; // Rupiah
    }[];
    totalLaborCost: number; // Rupiah
  };
  equipment: {
    items: {
      name: string;
      nameId?: string;
      dailyRate: number; // Rupiah
      days: number;
      totalCost: number; // Rupiah
    }[];
    totalEquipmentCost: number; // Rupiah
  };
  additionalCosts: {
    name: string;
    nameId?: string;
    cost: number; // Rupiah
  }[];
  mobilizationCost: number; // Rupiah - Biaya Mobilisasi
  subtotal: number; // Rupiah
  overhead: number; // percentage
  profit: number; // percentage
  ppn: number; // PPN/VAT 11%
  totalCost: number; // Rupiah
}

export interface CalculatorFormData {
  projectDetails: ProjectDetails;
  surfaces: SurfaceMeasurement[];
  selectedSystem: CoatingSystem | null;
  customProducts: CoatingProduct[];
  laborRates: LaborRate[];
  costBreakdown: CostBreakdown | null;
  status: 'draft' | 'completed' | 'sent';
  createdAt: Date;
  updatedAt: Date;
}

export interface CalculatorStep {
  id: number;
  name: string;
  title: string;
  description: string;
  isComplete: boolean;
}

export const CALCULATOR_STEPS: CalculatorStep[] = [
  {
    id: 1,
    name: 'project-details',
    title: 'Detail Proyek',
    description: 'Informasi proyek dan klien',
    isComplete: false,
  },
  {
    id: 2,
    name: 'surface-measurements',
    title: 'Pengukuran',
    description: 'Ukur dan tentukan area coating',
    isComplete: false,
  },
  {
    id: 3,
    name: 'coating-selection',
    title: 'Pilih Coating',
    description: 'Pilih sistem dan produk coating',
    isComplete: false,
  },
  {
    id: 4,
    name: 'cost-calculation',
    title: 'Kalkulasi Biaya',
    description: 'Hitung material, tenaga kerja, dan total',
    isComplete: false,
  },
  {
    id: 5,
    name: 'review',
    title: 'Tinjau & Buat',
    description: 'Tinjau dan buat penawaran',
    isComplete: false,
  },
];

export const DEFAULT_COATING_PRODUCTS: CoatingProduct[] = [
  {
    id: 'epoxy-primer-100',
    name: 'Epoxy Primer EP-100',
    nameId: 'Epoxy Primer EP-100',
    type: 'epoxy',
    category: 'primer',
    coverage: 8, // m² per liter
    pricePerLiter: 175000, // Rp 175.000
    dryTime: 4,
    recoatTime: 8,
    description: 'High-build epoxy primer for concrete and metal surfaces',
    descriptionId: 'Epoxy primer berkualitas tinggi untuk permukaan beton dan logam',
    features: ['Excellent adhesion', 'Moisture tolerant', 'Anti-corrosion'],
    featuresId: ['Daya rekat sangat baik', 'Tahan kelembaban', 'Anti korosi'],
  },
  {
    id: 'epoxy-base-200',
    name: 'Epoxy Coating EC-200',
    nameId: 'Epoxy Coating EC-200',
    type: 'epoxy',
    category: 'basecoat',
    coverage: 6, // m² per liter
    pricePerLiter: 285000, // Rp 285.000
    dryTime: 6,
    recoatTime: 12,
    description: '100% solids epoxy coating system',
    descriptionId: 'Sistem coating epoxy 100% solid',
    features: ['High durability', 'Chemical resistant', 'Self-leveling'],
    featuresId: ['Daya tahan tinggi', 'Tahan bahan kimia', 'Self-leveling'],
  },
  {
    id: 'pu-top-300',
    name: 'PU Topcoat PT-300',
    nameId: 'PU Topcoat PT-300',
    type: 'polyurethane',
    category: 'topcoat',
    coverage: 10, // m² per liter
    pricePerLiter: 350000, // Rp 350.000
    dryTime: 4,
    recoatTime: 8,
    description: 'UV-stable polyurethane topcoat',
    descriptionId: 'Lapisan akhir polyurethane tahan UV',
    features: ['UV resistant', 'Abrasion resistant', 'High gloss'],
    featuresId: ['Tahan sinar UV', 'Tahan abrasi', 'Kilap tinggi'],
  },
  {
    id: 'cat-besi-400',
    name: 'Metal Paint MP-400',
    nameId: 'Cat Besi MP-400',
    type: 'cat-besi',
    category: 'basecoat',
    coverage: 12, // m² per liter
    pricePerLiter: 125000, // Rp 125.000
    dryTime: 3,
    recoatTime: 6,
    description: 'Premium metal paint for steel structures',
    descriptionId: 'Cat besi premium untuk struktur baja',
    features: ['Anti-rust', 'Weather resistant', 'Easy application'],
    featuresId: ['Anti karat', 'Tahan cuaca', 'Mudah diaplikasikan'],
  },
  {
    id: 'marine-coating-500',
    name: 'Marine Coating MC-500',
    nameId: 'Marine Coating MC-500',
    type: 'marine',
    category: 'basecoat',
    coverage: 7, // m² per liter
    pricePerLiter: 425000, // Rp 425.000
    dryTime: 8,
    recoatTime: 16,
    description: 'Heavy-duty marine coating for offshore structures',
    descriptionId: 'Coating marine tugas berat untuk struktur lepas pantai',
    features: ['Salt water resistant', 'Impact resistant', 'Long lasting'],
    featuresId: ['Tahan air laut', 'Tahan benturan', 'Tahan lama'],
  },
];

export const DEFAULT_COATING_SYSTEMS: CoatingSystem[] = [
  {
    id: 'standard-epoxy',
    name: 'Standard Epoxy System',
    nameId: 'Sistem Epoxy Standar',
    description: 'Durable epoxy coating system for general industrial use',
    descriptionId: 'Sistem coating epoxy tahan lama untuk penggunaan industri umum',
    products: [
      { product: DEFAULT_COATING_PRODUCTS[0], coats: 1, thickness: 150 }, // 150 microns
      { product: DEFAULT_COATING_PRODUCTS[1], coats: 2, thickness: 200 }, // 200 microns per coat
      { product: DEFAULT_COATING_PRODUCTS[2], coats: 1, thickness: 100 }, // 100 microns
    ],
    totalThickness: 450, // 450 microns total
    systemType: 'standard',
    warranty: 5,
  },
  {
    id: 'heavy-duty-marine',
    name: 'Heavy-Duty Marine System',
    nameId: 'Sistem Marine Tugas Berat',
    description: 'Marine-grade coating system for offshore and coastal structures',
    descriptionId: 'Sistem coating marine untuk struktur lepas pantai dan pesisir',
    products: [
      { product: DEFAULT_COATING_PRODUCTS[0], coats: 1, thickness: 200 },
      { product: DEFAULT_COATING_PRODUCTS[4], coats: 2, thickness: 250 },
      { product: DEFAULT_COATING_PRODUCTS[2], coats: 1, thickness: 150 },
    ],
    totalThickness: 600, // 600 microns total
    systemType: 'marine',
    warranty: 10,
  },
  {
    id: 'metal-protection',
    name: 'Metal Protection System',
    nameId: 'Sistem Proteksi Logam',
    description: 'Anti-corrosion coating system for metal structures',
    descriptionId: 'Sistem coating anti korosi untuk struktur logam',
    products: [
      { product: DEFAULT_COATING_PRODUCTS[0], coats: 1, thickness: 100 },
      { product: DEFAULT_COATING_PRODUCTS[3], coats: 2, thickness: 125 },
    ],
    totalThickness: 350, // 350 microns total
    systemType: 'standard',
    warranty: 3,
  },
];

export const DEFAULT_LABOR_RATES: LaborRate[] = [
  {
    id: 'prep-standard',
    name: 'Surface Preparation',
    nameId: 'Persiapan Permukaan',
    ratePerHour: 75000, // Rp 75.000
    ratePerSqm: 35000, // Rp 35.000 per m²
    taskType: 'surface-prep',
  },
  {
    id: 'application-standard',
    name: 'Coating Application',
    nameId: 'Aplikasi Coating',
    ratePerHour: 100000, // Rp 100.000
    ratePerSqm: 45000, // Rp 45.000 per m²
    taskType: 'application',
  },
  {
    id: 'finishing-standard',
    name: 'Finishing & Quality Control',
    nameId: 'Finishing & Kontrol Kualitas',
    ratePerHour: 85000, // Rp 85.000
    ratePerSqm: 25000, // Rp 25.000 per m²
    taskType: 'finishing',
  },
];