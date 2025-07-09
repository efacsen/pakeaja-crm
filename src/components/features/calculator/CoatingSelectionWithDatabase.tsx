'use client';

import { useState, useEffect } from 'react';
import { Info, Plus, Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard as Card, GlassCardContent as CardContent, GlassCardDescription as CardDescription, GlassCardHeader as CardHeader, GlassCardTitle as CardTitle } from '@/components/ui/glass-card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { GlassInputSolid as Input } from '@/components/ui/glass-input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  GlassSelect as Select,
  GlassSelectContent as SelectContent,
  GlassSelectItem as SelectItem,
  GlassSelectTriggerSolid as SelectTrigger,
  GlassSelectValue as SelectValue,
} from '@/components/ui/glass-select';
import { CoatingSystem, CoatingProduct } from '@/types/calculator';
import { MaterialSystem, Material } from '@/types/materials';
import { formatCurrency } from '@/lib/calculator-utils';
import { materialsService } from '@/lib/services/materials-service';
import { useToast } from '@/hooks/use-toast';

interface CoatingSelectionWithDatabaseProps {
  data: CoatingSystem | null;
  onNext: (data: CoatingSystem) => void;
  onBack: () => void;
}

export function CoatingSelectionWithDatabase({ data, onNext, onBack }: CoatingSelectionWithDatabaseProps) {
  const { toast } = useToast();
  const [selectedSystemId, setSelectedSystemId] = useState<string>(data?.id || '');
  const [materialSystems, setMaterialSystems] = useState<MaterialSystem[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'systems' | 'custom'>('systems');
  
  // Custom system state
  const [customSystem, setCustomSystem] = useState<{
    name: string;
    primer?: string;
    primerCoats: number;
    intermediate?: string;
    intermediateCoats: number;
    finish?: string;
    finishCoats: number;
  }>({
    name: '',
    primerCoats: 1,
    intermediateCoats: 1,
    finishCoats: 1,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load material systems
      const { data: systemsData, error: systemsError } = await materialsService.getMaterialSystems();
      if (systemsError) {
        toast({
          title: 'Error',
          description: 'Failed to load material systems',
          variant: 'destructive',
        });
      } else if (systemsData) {
        setMaterialSystems(systemsData);
        if (systemsData.length > 0 && !selectedSystemId) {
          setSelectedSystemId(systemsData[0].id);
        }
      }

      // Load all materials
      const { data: materialsData, error: materialsError } = await materialsService.getAllMaterials();
      if (materialsError) {
        toast({
          title: 'Error',
          description: 'Failed to load materials',
          variant: 'destructive',
        });
      } else if (materialsData) {
        setMaterials(materialsData);
      }
    } finally {
      setLoading(false);
    }
  };

  const convertMaterialToProduct = (material: Material): CoatingProduct => {
    // Calculate average coverage from spreading rates
    const avgSpreadingRate = material.spreading_rates.find(
      rate => rate.dft === material.dft_recommended
    );
    const coverage = avgSpreadingRate?.practical_coverage_spray || 10;

    return {
      id: material.id,
      name: material.product_name,
      nameId: material.product_name,
      type: material.product_type.toLowerCase() as any,
      category: material.category === 'primer' ? 'primer' : 
               material.category === 'finish' || material.category === 'intermediate' ? 'topcoat' : 
               'basecoat',
      coverage,
      pricePerLiter: material.price_per_liter || 200000,
      dryTime: material.touch_dry ? material.touch_dry / 60 : 4, // Convert minutes to hours
      recoatTime: material.recoat_min ? material.recoat_min / 60 : 8, // Convert minutes to hours
      description: `${material.manufacturer} ${material.product_type}`,
      descriptionId: `${material.manufacturer} ${material.product_type}`,
      features: [],
      featuresId: [],
    };
  };

  const convertSystemToCoatingSystem = (system: MaterialSystem): CoatingSystem => {
    const products: { product: CoatingProduct; coats: number; thickness: number }[] = [];
    let totalThickness = 0;

    // Add primer
    if (system.primer.material) {
      const product = convertMaterialToProduct(system.primer.material);
      const thickness = system.primer.total_dft || (system.primer.dft_per_coat * system.primer.coats);
      products.push({
        product,
        coats: system.primer.coats,
        thickness: system.primer.dft_per_coat,
      });
      totalThickness += thickness;
    }

    // Add intermediate
    if (system.intermediate?.material) {
      const product = convertMaterialToProduct(system.intermediate.material);
      const thickness = system.intermediate.total_dft || (system.intermediate.dft_per_coat * system.intermediate.coats);
      products.push({
        product,
        coats: system.intermediate.coats,
        thickness: system.intermediate.dft_per_coat,
      });
      totalThickness += thickness;
    }

    // Add finish
    if (system.finish.material) {
      const product = convertMaterialToProduct(system.finish.material);
      const thickness = system.finish.total_dft || (system.finish.dft_per_coat * system.finish.coats);
      products.push({
        product,
        coats: system.finish.coats,
        thickness: system.finish.dft_per_coat,
      });
      totalThickness += thickness;
    }

    return {
      id: system.id,
      name: system.name,
      nameId: system.name,
      description: system.description || '',
      descriptionId: system.description || '',
      products,
      totalThickness,
      systemType: 'standard' as any, // MaterialSystem doesn't have system_type, default to standard
      warranty: system.warranty_years || 5,
    };
  };

  const createCustomCoatingSystem = (): CoatingSystem | null => {
    if (!customSystem.name || !customSystem.finish) {
      toast({
        title: 'Error',
        description: 'Please provide a name and at least a finish coat',
        variant: 'destructive',
      });
      return null;
    }

    const products: { product: CoatingProduct; coats: number; thickness: number }[] = [];
    let totalThickness = 0;

    // Add primer if selected
    if (customSystem.primer && customSystem.primer !== 'none') {
      const primerMaterial = materials.find(m => m.id === customSystem.primer);
      if (primerMaterial) {
        const product = convertMaterialToProduct(primerMaterial);
        const thickness = primerMaterial.dft_recommended;
        products.push({
          product,
          coats: customSystem.primerCoats,
          thickness,
        });
        totalThickness += thickness * customSystem.primerCoats;
      }
    }

    // Add intermediate if selected
    if (customSystem.intermediate && customSystem.intermediate !== 'none') {
      const intermediateMaterial = materials.find(m => m.id === customSystem.intermediate);
      if (intermediateMaterial) {
        const product = convertMaterialToProduct(intermediateMaterial);
        const thickness = intermediateMaterial.dft_recommended;
        products.push({
          product,
          coats: customSystem.intermediateCoats,
          thickness,
        });
        totalThickness += thickness * customSystem.intermediateCoats;
      }
    }

    // Add finish
    const finishMaterial = materials.find(m => m.id === customSystem.finish);
    if (finishMaterial) {
      const product = convertMaterialToProduct(finishMaterial);
      const thickness = finishMaterial.dft_recommended;
      products.push({
        product,
        coats: customSystem.finishCoats,
        thickness,
      });
      totalThickness += thickness * customSystem.finishCoats;
    }

    return {
      id: 'custom-' + Date.now(),
      name: customSystem.name,
      nameId: customSystem.name,
      description: 'Custom coating system',
      descriptionId: 'Sistem coating kustom',
      products,
      totalThickness,
      systemType: 'standard' as any, // Use 'standard' instead of 'custom' which doesn't exist in type
      warranty: 3,
    };
  };

  const handleNext = () => {
    if (activeTab === 'systems') {
      const system = materialSystems.find(s => s.id === selectedSystemId);
      if (system) {
        const coatingSystem = convertSystemToCoatingSystem(system);
        onNext(coatingSystem);
      }
    } else {
      const customCoatingSystem = createCustomCoatingSystem();
      if (customCoatingSystem) {
        onNext(customCoatingSystem);
      }
    }
  };

  const getSystemPrice = (system: CoatingSystem): number => {
    return system.products.reduce((total, { product, coats }) => {
      return total + (product.pricePerLiter * coats);
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading coating systems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pilih Sistem Coating / Select Coating System</CardTitle>
          <CardDescription>
            Pilih dari sistem yang tersedia atau buat sistem kustom
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="systems">
                <Package className="h-4 w-4 mr-2" />
                Sistem Tersedia ({materialSystems.length})
              </TabsTrigger>
              <TabsTrigger value="custom">
                <Plus className="h-4 w-4 mr-2" />
                Buat Sistem Kustom
              </TabsTrigger>
            </TabsList>

            <TabsContent value="systems" className="mt-4">
              {materialSystems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Belum ada sistem coating yang tersedia
                  </p>
                  <Button variant="outline" onClick={() => setActiveTab('custom')}>
                    Buat Sistem Kustom
                  </Button>
                </div>
              ) : (
                <RadioGroup value={selectedSystemId} onValueChange={setSelectedSystemId}>
                  <div className="space-y-4">
                    {materialSystems.map((system) => {
                      const coatingSystem = convertSystemToCoatingSystem(system);
                      return (
                        <div key={system.id} className="relative">
                          <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-accent cursor-pointer">
                            <RadioGroupItem value={system.id} id={system.id} className="mt-1" />
                            <Label htmlFor={system.id} className="flex-1 cursor-pointer">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-lg font-semibold">{system.name}</h4>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary">
                                      {coatingSystem.totalThickness} μm
                                    </Badge>
                                    <Badge variant="outline">
                                      Garansi {system.warranty_years || 5} tahun
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {system.description}
                                </p>
                                
                                <Accordion type="single" collapsible className="pt-2">
                                  <AccordionItem value="details" className="border-none">
                                    <AccordionTrigger className="text-sm py-2">
                                      Lihat Komponen Sistem
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <div className="space-y-3">
                                        {coatingSystem.products.map(({ product, coats, thickness }, idx) => (
                                          <div key={idx} className="flex items-center justify-between text-sm">
                                            <div className="space-y-1">
                                              <div className="font-medium">{product.name}</div>
                                              <div className="text-xs text-muted-foreground">
                                                {product.category} • {coats} lapisan • {thickness} μm
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <div className="font-medium">
                                                {formatCurrency(product.pricePerLiter)}/liter
                                              </div>
                                              <div className="text-xs text-muted-foreground">
                                                {product.coverage} m²/liter
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>

                                <div className="flex items-center gap-4 pt-2">
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Info className="h-4 w-4" />
                                    <span>Perkiraan biaya material: ~{formatCurrency(getSystemPrice(coatingSystem))}/liter</span>
                                  </div>
                                </div>
                              </div>
                            </Label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              )}
            </TabsContent>

            <TabsContent value="custom" className="mt-4 space-y-4">
              <div>
                <Label htmlFor="system-name">Nama Sistem</Label>
                <Input
                  id="system-name"
                  value={customSystem.name}
                  onChange={(e) => setCustomSystem({ ...customSystem, name: e.target.value })}
                  placeholder="Contoh: Sistem Epoxy Heavy Duty"
                />
              </div>

              <div className="space-y-4">
                {/* Primer */}
                <div className="space-y-2">
                  <Label>Primer (Opsional)</Label>
                  <div className="flex gap-2">
                    <Select
                      value={customSystem.primer}
                      onValueChange={(value) => setCustomSystem({ ...customSystem, primer: value })}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Pilih primer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Tidak ada</SelectItem>
                        {materials
                          .filter(m => m.category === 'primer')
                          .map(material => (
                            <SelectItem key={material.id} value={material.id}>
                              {material.product_name} ({material.manufacturer})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={customSystem.primerCoats.toString()}
                      onValueChange={(value) => setCustomSystem({ ...customSystem, primerCoats: parseInt(value) })}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 lapis</SelectItem>
                        <SelectItem value="2">2 lapis</SelectItem>
                        <SelectItem value="3">3 lapis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Intermediate */}
                <div className="space-y-2">
                  <Label>Intermediate (Opsional)</Label>
                  <div className="flex gap-2">
                    <Select
                      value={customSystem.intermediate}
                      onValueChange={(value) => setCustomSystem({ ...customSystem, intermediate: value })}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Pilih intermediate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Tidak ada</SelectItem>
                        {materials
                          .filter(m => m.category === 'intermediate')
                          .map(material => (
                            <SelectItem key={material.id} value={material.id}>
                              {material.product_name} ({material.manufacturer})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={customSystem.intermediateCoats.toString()}
                      onValueChange={(value) => setCustomSystem({ ...customSystem, intermediateCoats: parseInt(value) })}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 lapis</SelectItem>
                        <SelectItem value="2">2 lapis</SelectItem>
                        <SelectItem value="3">3 lapis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Finish */}
                <div className="space-y-2">
                  <Label>Finish <span className="text-red-500">*</span></Label>
                  <div className="flex gap-2">
                    <Select
                      value={customSystem.finish}
                      onValueChange={(value) => setCustomSystem({ ...customSystem, finish: value })}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Pilih finish coat" />
                      </SelectTrigger>
                      <SelectContent>
                        {materials
                          .filter(m => m.category === 'finish')
                          .map(material => (
                            <SelectItem key={material.id} value={material.id}>
                              {material.product_name} ({material.manufacturer})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={customSystem.finishCoats.toString()}
                      onValueChange={(value) => setCustomSystem({ ...customSystem, finishCoats: parseInt(value) })}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 lapis</SelectItem>
                        <SelectItem value="2">2 lapis</SelectItem>
                        <SelectItem value="3">3 lapis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Preview */}
              {(customSystem.primer || customSystem.intermediate || customSystem.finish) && (
                <Card className="mt-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Preview Sistem</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {customSystem.primer && (
                      <div className="text-sm">
                        <span className="font-medium">Primer:</span>{' '}
                        {materials.find(m => m.id === customSystem.primer)?.product_name} ({customSystem.primerCoats} lapis)
                      </div>
                    )}
                    {customSystem.intermediate && (
                      <div className="text-sm">
                        <span className="font-medium">Intermediate:</span>{' '}
                        {materials.find(m => m.id === customSystem.intermediate)?.product_name} ({customSystem.intermediateCoats} lapis)
                      </div>
                    )}
                    {customSystem.finish && (
                      <div className="text-sm">
                        <span className="font-medium">Finish:</span>{' '}
                        {materials.find(m => m.id === customSystem.finish)?.product_name} ({customSystem.finishCoats} lapis)
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Kembali
        </Button>
        <Button onClick={handleNext} size="lg">
          Langkah Berikutnya
        </Button>
      </div>
    </div>
  );
}