export interface WorkItem {
  id: string;
  name: string;
  category: 'preparation' | 'coating' | 'equipment' | 'safety' | 'other';
  requiresArea?: boolean;
  unit?: string;
}

export const WORK_ITEMS: WorkItem[] = [
  // Preparation Work
  { id: 'mobdemob', name: 'MOBDEMOB', category: 'preparation' },
  { id: 'bongkar_scaffolding', name: 'BONGKAR/PASANG SCAFFOLDING', category: 'preparation' },
  { id: 'bongkar_gondola', name: 'BONGKAR/PASANG GONDOLA', category: 'preparation' },
  { id: 'bongkar_existing', name: 'BONGKAR EXISTING MATERIAL', category: 'preparation' },
  { id: 'surface_preparation', name: 'SURFACE PREPARATION', category: 'preparation', requiresArea: true, unit: 'm²' },
  
  // Coating Work
  { id: 'cat_interior', name: 'CAT INTERIOR', category: 'coating', requiresArea: true, unit: 'm²' },
  { id: 'cat_exterior', name: 'CAT EXTERIOR', category: 'coating', requiresArea: true, unit: 'm²' },
  { id: 'cat_tekstur', name: 'CAT TEKSTUR', category: 'coating', requiresArea: true, unit: 'm²' },
  { id: 'repair', name: 'REPAIR', category: 'coating', requiresArea: true, unit: 'm²' },
  { id: 'floor_coating', name: 'FLOOR COATING', category: 'coating', requiresArea: true, unit: 'm²' },
  { id: 'waterproofing', name: 'WATERPROOFING', category: 'coating', requiresArea: true, unit: 'm²' },
  { id: 'marine_coating', name: 'MARINE COATING', category: 'coating', requiresArea: true, unit: 'm²' },
  { id: 'protective_coating', name: 'PROTECTIVE COATING', category: 'coating', requiresArea: true, unit: 'm²' },
  
  // Equipment & Tools
  { id: 'sewa_alat', name: 'SEWA ALAT (EQUIPMENT)', category: 'equipment' },
  { id: 'alat_kerja', name: 'ALAT KERJA (TOOLS)', category: 'equipment' },
  
  // Safety
  { id: 'alat_keselamatan', name: 'ALAT KESELAMATAN (SAFETY)', category: 'safety' },
];

export const WORK_ITEM_CATEGORIES = {
  preparation: 'Persiapan',
  coating: 'Pengecatan',
  equipment: 'Peralatan',
  safety: 'Keselamatan',
  other: 'Lainnya',
} as const;