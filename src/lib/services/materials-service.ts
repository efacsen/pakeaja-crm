import { 
  Material, 
  MaterialFilter, 
  MaterialImportData,
  MaterialImportResult,
  ImportError,
  SpreadingRate,
  PackagingSize,
  ApplicationMethod,
  MaterialSystem,
  SystemComponent
} from '@/types/materials';

export class MaterialsService {
  private storageKey = 'horizon-materials';
  private systemsStorageKey = 'horizon-material-systems';

  // Get all materials
  async getAllMaterials(): Promise<{ data: Material[] | null; error: string | null }> {
    try {
      const materials = this.getStoredMaterials();
      return { data: materials, error: null };
    } catch (error) {
      console.error('Error fetching materials:', error);
      return { data: null, error: 'Failed to fetch materials' };
    }
  }

  // Create material
  async createMaterial(
    data: Omit<Material, 'id' | 'created_at' | 'updated_at'>,
    userId: string = 'demo-user-123'
  ): Promise<{ data: Material | null; error: string | null }> {
    return this.upsertMaterial(data, userId);
  }

  // Update material
  async updateMaterial(
    id: string,
    data: Partial<Material>,
    userId: string = 'demo-user-123'
  ): Promise<{ data: Material | null; error: string | null }> {
    return this.upsertMaterial({ ...data, id }, userId);
  }

  // Delete material
  async deleteMaterial(id: string): Promise<{ data: boolean; error: string | null }> {
    try {
      const materials = this.getStoredMaterials();
      const index = materials.findIndex(m => m.id === id);
      
      if (index === -1) {
        return { data: false, error: 'Material not found' };
      }
      
      materials.splice(index, 1);
      this.saveMaterials(materials);
      return { data: true, error: null };
    } catch (error) {
      console.error('Error deleting material:', error);
      return { data: false, error: 'Failed to delete material' };
    }
  }

  // Create or update material
  async upsertMaterial(data: Partial<Material>, userId: string = 'demo-user-123'): Promise<{ data: Material | null; error: string | null }> {
    try {
      const materials = this.getStoredMaterials();
      
      if (data.id) {
        // Update existing
        const index = materials.findIndex(m => m.id === data.id);
        if (index === -1) {
          return { data: null, error: 'Material not found' };
        }
        
        const updated: Material = {
          ...materials[index],
          ...data,
          updated_at: new Date().toISOString(),
          updated_by: userId
        };
        
        materials[index] = updated;
        this.saveMaterials(materials);
        return { data: updated, error: null };
      } else {
        // Create new
        const newMaterial: Material = {
          id: `material-${Date.now()}`,
          created_at: new Date().toISOString(),
          created_by: userId,
          is_active: true,
          is_discontinued: false,
          volume_solids: 0,
          specific_gravity: 1,
          dft_min: 0,
          dft_max: 0,
          dft_recommended: 0,
          spreading_rates: [],
          packaging_sizes: [],
          application_methods: [],
          loss_factor_brush: 15,
          loss_factor_spray: 30,
          tds_version: '1.0',
          tds_date: new Date().toISOString(),
          ...data
        } as Material;
        
        materials.push(newMaterial);
        this.saveMaterials(materials);
        return { data: newMaterial, error: null };
      }
    } catch (error) {
      console.error('Error upserting material:', error);
      return { data: null, error: 'Failed to save material' };
    }
  }

  // Get material by ID
  async getMaterial(id: string): Promise<{ data: Material | null; error: string | null }> {
    try {
      const materials = this.getStoredMaterials();
      const material = materials.find(m => m.id === id);
      
      return { data: material || null, error: material ? null : 'Material not found' };
    } catch (error) {
      console.error('Error fetching material:', error);
      return { data: null, error: 'Failed to fetch material' };
    }
  }

  // Search materials
  async searchMaterials(
    filter: MaterialFilter = {},
    page: number = 1,
    limit: number = 50
  ): Promise<{ data: { materials: Material[]; total: number } | null; error: string | null }> {
    try {
      let materials = this.getStoredMaterials();
      
      // Apply filters
      if (filter.manufacturer) {
        materials = materials.filter(m => m.manufacturer === filter.manufacturer);
      }
      if (filter.category) {
        materials = materials.filter(m => m.category === filter.category);
      }
      if (filter.product_type) {
        materials = materials.filter(m => 
          m.product_type.toLowerCase().includes(filter.product_type!.toLowerCase())
        );
      }
      if (filter.is_active !== undefined) {
        materials = materials.filter(m => m.is_active === filter.is_active);
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        materials = materials.filter(m => 
          m.product_name.toLowerCase().includes(searchLower) ||
          m.product_code.toLowerCase().includes(searchLower) ||
          m.manufacturer.toLowerCase().includes(searchLower)
        );
      }
      
      // Sort by name
      materials.sort((a, b) => a.product_name.localeCompare(b.product_name));
      
      // Pagination
      const total = materials.length;
      const startIndex = (page - 1) * limit;
      const paginatedMaterials = materials.slice(startIndex, startIndex + limit);
      
      return {
        data: {
          materials: paginatedMaterials,
          total
        },
        error: null
      };
    } catch (error) {
      console.error('Error searching materials:', error);
      return { data: null, error: 'Failed to search materials' };
    }
  }

  // Import materials from CSV/Excel data
  async importMaterials(
    data: MaterialImportData[], 
    userId: string = 'demo-user-123'
  ): Promise<MaterialImportResult> {
    const result: MaterialImportResult = {
      success: false,
      total_rows: data.length,
      imported: 0,
      updated: 0,
      errors: []
    };

    try {
      const existingMaterials = this.getStoredMaterials();
      const materialsByCode = new Map(existingMaterials.map(m => [m.product_code, m]));

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const rowNumber = i + 2; // Assuming row 1 is headers

        try {
          // Validate required fields
          if (!row.product_code) {
            result.errors.push({
              row: rowNumber,
              field: 'product_code',
              value: row.product_code,
              message: 'Product code is required'
            });
            continue;
          }

          if (!row.product_name) {
            result.errors.push({
              row: rowNumber,
              field: 'product_name',
              value: row.product_name,
              message: 'Product name is required'
            });
            continue;
          }

          // Parse manufacturer
          const manufacturer = this.parseManufacturer(row.manufacturer);
          
          // Parse category
          const category = this.parseCategory(row.category);

          // Calculate spreading rates based on volume solids and DFT
          const spreadingRates = this.calculateSpreadingRates(
            row.volume_solids || 100,
            row.dft_recommended || 50,
            row.loss_factor_brush || 15,
            row.loss_factor_spray || 30
          );

          // Parse packaging sizes
          const packagingSizes = this.parsePackagingSizes(row.packaging_sizes);

          // Create material object
          const material: Partial<Material> = {
            product_code: row.product_code.trim(),
            product_name: row.product_name.trim(),
            manufacturer,
            manufacturer_other: manufacturer === 'OTHER' ? row.manufacturer : undefined,
            category,
            product_type: row.product_type || 'Unknown',
            volume_solids: row.volume_solids || 100,
            specific_gravity: 1, // Default, can be updated later
            spreading_rates: spreadingRates,
            dft_recommended: row.dft_recommended || 50,
            dft_min: Math.floor((row.dft_recommended || 50) * 0.8),
            dft_max: Math.ceil((row.dft_recommended || 50) * 1.2),
            packaging_sizes: packagingSizes,
            loss_factor_brush: row.loss_factor_brush || 15,
            loss_factor_spray: row.loss_factor_spray || 30,
            pot_life: row.pot_life,
            touch_dry: row.touch_dry,
            hard_dry: row.hard_dry ? row.hard_dry * 60 : undefined, // Convert hours to minutes
            recoat_min: row.recoat_min ? row.recoat_min * 60 : undefined, // Convert hours to minutes
            recoat_max: row.recoat_max ? row.recoat_max * 24 : undefined, // Convert days to hours
            mix_ratio: row.mix_ratio,
            thinner_type: row.thinner_type,
            price_per_liter: row.price_per_liter,
            price_updated_at: row.price_per_liter ? new Date().toISOString() : undefined,
            application_methods: this.getDefaultApplicationMethods(category),
            tds_version: '1.0',
            tds_date: new Date().toISOString(),
            is_active: true,
            is_discontinued: false,
          };

          // Check if material exists
          const existing = materialsByCode.get(row.product_code);
          
          if (existing) {
            // Update existing
            material.id = existing.id;
            const { error } = await this.upsertMaterial(material, userId);
            if (error) {
              result.errors.push({
                row: rowNumber,
                field: 'general',
                value: row.product_code,
                message: error
              });
            } else {
              result.updated++;
            }
          } else {
            // Create new
            const { error } = await this.upsertMaterial(material, userId);
            if (error) {
              result.errors.push({
                row: rowNumber,
                field: 'general',
                value: row.product_code,
                message: error
              });
            } else {
              result.imported++;
            }
          }
        } catch (error) {
          result.errors.push({
            row: rowNumber,
            field: 'general',
            value: row.product_code,
            message: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      result.success = result.errors.length === 0;
      return result;
    } catch (error) {
      console.error('Import error:', error);
      result.errors.push({
        row: 0,
        field: 'general',
        value: null,
        message: 'Import failed: ' + (error instanceof Error ? error.message : 'Unknown error')
      });
      return result;
    }
  }

  // Calculate spreading rates for different DFTs
  private calculateSpreadingRates(
    volumeSolids: number,
    recommendedDFT: number,
    lossBrush: number,
    lossSpray: number
  ): SpreadingRate[] {
    const rates: SpreadingRate[] = [];
    const dfts = [25, 50, 75, 100, 125, 150, 200, 250, 300];
    
    dfts.forEach(dft => {
      const theoretical = (volumeSolids * 10) / dft; // m²/L
      rates.push({
        dft,
        theoretical_coverage: Number(theoretical.toFixed(2)),
        practical_coverage_brush: Number((theoretical * (100 - lossBrush) / 100).toFixed(2)),
        practical_coverage_spray: Number((theoretical * (100 - lossSpray) / 100).toFixed(2))
      });
    });
    
    return rates;
  }

  private parseManufacturer(value: string): Material['manufacturer'] {
    const upper = value?.toUpperCase() || '';
    if (upper.includes('NIPPON')) return 'NIPPON';
    if (upper.includes('JOTUN')) return 'JOTUN';
    if (upper.includes('KANSAI')) return 'KANSAI';
    if (upper.includes('DULUX')) return 'DULUX';
    if (upper.includes('SKK')) return 'SKK';
    if (upper.includes('PROPAN')) return 'PROPAN';
    return 'OTHER';
  }

  private parseCategory(value: string): Material['category'] {
    const lower = value?.toLowerCase() || '';
    if (lower.includes('primer')) return 'primer';
    if (lower.includes('intermediate') || lower.includes('mid')) return 'intermediate';
    if (lower.includes('finish') || lower.includes('top')) return 'finish';
    if (lower.includes('thinner')) return 'thinner';
    if (lower.includes('additive')) return 'additive';
    return 'specialty';
  }

  private parsePackagingSizes(value: string): PackagingSize[] {
    if (!value) return [{ size: 20, unit: 'liter' }];
    
    const sizes: PackagingSize[] = [];
    const parts = value.split(',');
    
    parts.forEach(part => {
      const match = part.match(/(\d+(?:\.\d+)?)\s*(L|l|lt|liter|kg|KG)?/);
      if (match) {
        const size = parseFloat(match[1]);
        const unit = match[2]?.toLowerCase().includes('kg') ? 'kg' : 'liter';
        sizes.push({ size, unit });
      }
    });
    
    return sizes.length > 0 ? sizes : [{ size: 20, unit: 'liter' }];
  }

  private getDefaultApplicationMethods(category: Material['category']): ApplicationMethod[] {
    const methods: ApplicationMethod[] = [];
    
    if (category === 'primer' || category === 'intermediate' || category === 'finish') {
      methods.push(
        { method: 'brush' },
        { method: 'roller' },
        { 
          method: 'airless_spray',
          nozzle_size: '0.017-0.021"',
          pressure: '2000-2500 psi'
        }
      );
    }
    
    return methods;
  }

  // Material Systems Management
  async createMaterialSystem(
    system: Omit<MaterialSystem, 'id' | 'created_at'>,
    userId: string = 'demo-user-123'
  ): Promise<{ data: MaterialSystem | null; error: string | null }> {
    try {
      const systems = this.getStoredSystems();
      
      const newSystem: MaterialSystem = {
        ...system,
        id: `system-${Date.now()}`,
        created_at: new Date().toISOString(),
        created_by: userId
      };
      
      systems.push(newSystem);
      this.saveSystems(systems);
      
      return { data: newSystem, error: null };
    } catch (error) {
      console.error('Error creating system:', error);
      return { data: null, error: 'Failed to create material system' };
    }
  }

  async getMaterialSystems(): Promise<{ data: MaterialSystem[] | null; error: string | null }> {
    try {
      const systems = this.getStoredSystems();
      
      // Populate material details
      const materials = this.getStoredMaterials();
      const materialMap = new Map(materials.map(m => [m.id, m]));
      
      systems.forEach(system => {
        if (system.primer.material_id) {
          system.primer.material = materialMap.get(system.primer.material_id);
        }
        if (system.intermediate?.material_id) {
          system.intermediate.material = materialMap.get(system.intermediate.material_id);
        }
        if (system.finish.material_id) {
          system.finish.material = materialMap.get(system.finish.material_id);
        }
      });
      
      return { data: systems, error: null };
    } catch (error) {
      console.error('Error fetching systems:', error);
      return { data: null, error: 'Failed to fetch material systems' };
    }
  }

  // Helper methods
  private getStoredMaterials(): Material[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : this.getDefaultMaterials();
    } catch {
      return this.getDefaultMaterials();
    }
  }

  private saveMaterials(materials: Material[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(materials));
  }

  private getStoredSystems(): MaterialSystem[] {
    try {
      const stored = localStorage.getItem(this.systemsStorageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveSystems(systems: MaterialSystem[]): void {
    localStorage.setItem(this.systemsStorageKey, JSON.stringify(systems));
  }

  // Generate some default materials for demo
  private getDefaultMaterials(): Material[] {
    const now = new Date().toISOString();
    
    return [
      {
        id: 'material-1',
        product_code: 'EA-9200',
        product_name: 'Epoxy Primer EA-9200',
        manufacturer: 'NIPPON',
        category: 'primer',
        product_type: 'Epoxy',
        volume_solids: 65,
        specific_gravity: 1.4,
        spreading_rates: this.calculateSpreadingRates(65, 75, 15, 30),
        dft_min: 50,
        dft_max: 100,
        dft_recommended: 75,
        packaging_sizes: [
          { size: 4, unit: 'liter' },
          { size: 20, unit: 'liter' }
        ],
        loss_factor_brush: 15,
        loss_factor_spray: 30,
        pot_life: '8 hours at 25°C',
        touch_dry: 120,
        hard_dry: 480,
        recoat_min: 480,
        recoat_max: 7,
        mix_ratio: '4:1 by volume',
        thinner_type: 'Thinner 1260',
        thinner_percentage_brush: 5,
        thinner_percentage_spray: 10,
        application_methods: [
          { method: 'brush' },
          { method: 'roller' },
          { method: 'airless_spray', nozzle_size: '0.017-0.021"', pressure: '2000-2500 psi' }
        ],
        tds_version: '2.1',
        tds_date: '2024-01-15',
        is_active: true,
        is_discontinued: false,
        created_at: now,
        created_by: 'system'
      },
      {
        id: 'material-2',
        product_code: 'PU-5500',
        product_name: 'Polyurethane Topcoat PU-5500',
        manufacturer: 'JOTUN',
        category: 'finish',
        product_type: 'Polyurethane',
        finish_type: 'gloss',
        volume_solids: 55,
        specific_gravity: 1.2,
        spreading_rates: this.calculateSpreadingRates(55, 50, 15, 30),
        dft_min: 40,
        dft_max: 80,
        dft_recommended: 50,
        packaging_sizes: [
          { size: 5, unit: 'liter' },
          { size: 20, unit: 'liter' }
        ],
        loss_factor_brush: 15,
        loss_factor_spray: 30,
        pot_life: '6 hours at 25°C',
        touch_dry: 60,
        hard_dry: 360,
        recoat_min: 360,
        recoat_max: 30,
        mix_ratio: '3:1 by volume',
        thinner_type: 'Thinner 17',
        thinner_percentage_brush: 5,
        thinner_percentage_spray: 15,
        application_methods: [
          { method: 'brush' },
          { method: 'roller' },
          { method: 'airless_spray', nozzle_size: '0.015-0.019"', pressure: '2000-2500 psi' }
        ],
        compatible_primers: ['EA-9200'],
        tds_version: '3.0',
        tds_date: '2024-02-01',
        is_active: true,
        is_discontinued: false,
        created_at: now,
        created_by: 'system'
      }
    ];
  }
}

export const materialsService = new MaterialsService();