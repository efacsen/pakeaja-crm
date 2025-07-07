'use client';

import { useState, useEffect } from 'react';
import { Plus, Package, Edit, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MaterialSystem, Material } from '@/types/materials';
import { materialsService } from '@/lib/services/materials-service';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function MaterialSystemsPage() {
  const { toast } = useToast();
  const [systems, setSystems] = useState<MaterialSystem[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [systemForm, setSystemForm] = useState<{
    name: string;
    description: string;
    systemType: string;
    warrantyYears: number;
    primer: { materialId: string; coats: number; dft: number };
    intermediate?: { materialId: string; coats: number; dft: number };
    finish: { materialId: string; coats: number; dft: number };
  }>({
    name: '',
    description: '',
    systemType: 'standard',
    warrantyYears: 5,
    primer: { materialId: '', coats: 1, dft: 75 },
    finish: { materialId: '', coats: 1, dft: 50 },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load systems
      const { data: systemsData, error: systemsError } = await materialsService.getMaterialSystems();
      if (systemsError) {
        toast({
          title: 'Error',
          description: 'Failed to load material systems',
          variant: 'destructive',
        });
      } else if (systemsData) {
        setSystems(systemsData);
      }

      // Load materials
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

  const handleCreateSystem = async () => {
    try {
      if (!systemForm.name || !systemForm.primer.materialId || !systemForm.finish.materialId) {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields',
          variant: 'destructive',
        });
        return;
      }

      const newSystem: Omit<MaterialSystem, 'id' | 'created_at'> = {
        name: systemForm.name,
        description: systemForm.description,
        environment_type: 'C3' as const, // Default to C3
        substrate: 'steel' as const, // Default to steel
        surface_preparation: 'Sa 2.5', // Default preparation
        total_dft: 0, // Will be calculated
        expected_lifetime: '10-15 years',
        created_by: 'current-user',
        is_approved: false,
        warranty_years: systemForm.warrantyYears,
        primer: {
          material_id: systemForm.primer.materialId,
          coats: systemForm.primer.coats,
          dft_per_coat: systemForm.primer.dft,
          total_dft: systemForm.primer.dft * systemForm.primer.coats,
        },
        finish: {
          material_id: systemForm.finish.materialId,
          coats: systemForm.finish.coats,
          dft_per_coat: systemForm.finish.dft,
          total_dft: systemForm.finish.dft * systemForm.finish.coats,
        },
      };

      if (systemForm.intermediate?.materialId) {
        newSystem.intermediate = {
          material_id: systemForm.intermediate.materialId,
          coats: systemForm.intermediate.coats,
          dft_per_coat: systemForm.intermediate.dft,
          total_dft: systemForm.intermediate.dft * systemForm.intermediate.coats,
        };
      }

      // Calculate total DFT
      newSystem.total_dft = newSystem.primer.total_dft + newSystem.finish.total_dft;
      if (newSystem.intermediate) {
        newSystem.total_dft += newSystem.intermediate.total_dft;
      }

      const { data, error } = await materialsService.createMaterialSystem(newSystem);
      if (error) {
        toast({
          title: 'Error',
          description: error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Material system created successfully',
        });
        setIsCreateDialogOpen(false);
        resetForm();
        loadData();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create material system',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setSystemForm({
      name: '',
      description: '',
      systemType: 'standard',
      warrantyYears: 5,
      primer: { materialId: '', coats: 1, dft: 75 },
      finish: { materialId: '', coats: 1, dft: 50 },
    });
  };

  const getTotalThickness = (system: MaterialSystem): number => {
    let total = 0;
    if (system.primer) {
      total += system.primer.total_dft || (system.primer.dft_per_coat * system.primer.coats);
    }
    if (system.intermediate) {
      total += system.intermediate.total_dft || (system.intermediate.dft_per_coat * system.intermediate.coats);
    }
    if (system.finish) {
      total += system.finish.total_dft || (system.finish.dft_per_coat * system.finish.coats);
    }
    return total;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sistem Coating</h1>
          <p className="text-muted-foreground">
            Kelola sistem coating yang tersedia untuk kalkulator
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Sistem
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Sistem Coating</CardTitle>
          <CardDescription>
            {systems.length} sistem tersedia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Sistem</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Komponen</TableHead>
                <TableHead>Total DFT</TableHead>
                <TableHead>Garansi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {systems.map((system) => (
                <TableRow key={system.id}>
                  <TableCell className="font-medium">{system.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {system.description || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {system.primer.material && (
                        <div className="text-xs">
                          <Badge variant="outline" className="mr-1">Primer</Badge>
                          {system.primer.material.product_name} ({system.primer.coats} lapis)
                        </div>
                      )}
                      {system.intermediate?.material && (
                        <div className="text-xs">
                          <Badge variant="outline" className="mr-1">Intermediate</Badge>
                          {system.intermediate.material.product_name} ({system.intermediate.coats} lapis)
                        </div>
                      )}
                      {system.finish.material && (
                        <div className="text-xs">
                          <Badge variant="outline" className="mr-1">Finish</Badge>
                          {system.finish.material.product_name} ({system.finish.coats} lapis)
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge>{getTotalThickness(system)} μm</Badge>
                  </TableCell>
                  <TableCell>{system.warranty_years} tahun</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="icon" variant="ghost">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {systems.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Belum ada sistem coating yang dibuat
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Buat Sistem Pertama
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Sistem Coating</DialogTitle>
            <DialogDescription>
              Buat sistem coating baru dengan kombinasi material
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Sistem</Label>
                <Input
                  id="name"
                  value={systemForm.name}
                  onChange={(e) => setSystemForm({ ...systemForm, name: e.target.value })}
                  placeholder="Contoh: Sistem Epoxy Standar"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warranty">Garansi (tahun)</Label>
                <Input
                  id="warranty"
                  type="number"
                  value={systemForm.warrantyYears}
                  onChange={(e) => setSystemForm({ ...systemForm, warrantyYears: parseInt(e.target.value) || 5 })}
                  min="1"
                  max="20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={systemForm.description}
                onChange={(e) => setSystemForm({ ...systemForm, description: e.target.value })}
                placeholder="Deskripsi sistem coating..."
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Komponen Sistem</h4>
              
              {/* Primer */}
              <div className="space-y-2">
                <Label>Primer *</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={systemForm.primer.materialId}
                    onValueChange={(value) => setSystemForm({
                      ...systemForm,
                      primer: { ...systemForm.primer, materialId: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih material primer" />
                    </SelectTrigger>
                    <SelectContent>
                      {materials
                        .filter(m => m.category === 'primer')
                        .map(material => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.product_name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Jumlah lapis"
                    value={systemForm.primer.coats}
                    onChange={(e) => setSystemForm({
                      ...systemForm,
                      primer: { ...systemForm.primer, coats: parseInt(e.target.value) || 1 }
                    })}
                    min="1"
                    max="5"
                  />
                  <Input
                    type="number"
                    placeholder="DFT (μm)"
                    value={systemForm.primer.dft}
                    onChange={(e) => setSystemForm({
                      ...systemForm,
                      primer: { ...systemForm.primer, dft: parseInt(e.target.value) || 75 }
                    })}
                    min="10"
                    max="500"
                  />
                </div>
              </div>

              {/* Intermediate */}
              <div className="space-y-2">
                <Label>Intermediate (Opsional)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={systemForm.intermediate?.materialId}
                    onValueChange={(value) => setSystemForm({
                      ...systemForm,
                      intermediate: {
                        materialId: value,
                        coats: systemForm.intermediate?.coats || 1,
                        dft: systemForm.intermediate?.dft || 100
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih material intermediate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tidak ada</SelectItem>
                      {materials
                        .filter(m => m.category === 'intermediate')
                        .map(material => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.product_name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Jumlah lapis"
                    value={systemForm.intermediate?.coats || 1}
                    onChange={(e) => setSystemForm({
                      ...systemForm,
                      intermediate: systemForm.intermediate ? {
                        ...systemForm.intermediate,
                        coats: parseInt(e.target.value) || 1
                      } : undefined
                    })}
                    min="1"
                    max="5"
                    disabled={!systemForm.intermediate?.materialId}
                  />
                  <Input
                    type="number"
                    placeholder="DFT (μm)"
                    value={systemForm.intermediate?.dft || 100}
                    onChange={(e) => setSystemForm({
                      ...systemForm,
                      intermediate: systemForm.intermediate ? {
                        ...systemForm.intermediate,
                        dft: parseInt(e.target.value) || 100
                      } : undefined
                    })}
                    min="10"
                    max="500"
                    disabled={!systemForm.intermediate?.materialId}
                  />
                </div>
              </div>

              {/* Finish */}
              <div className="space-y-2">
                <Label>Finish *</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={systemForm.finish.materialId}
                    onValueChange={(value) => setSystemForm({
                      ...systemForm,
                      finish: { ...systemForm.finish, materialId: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih material finish" />
                    </SelectTrigger>
                    <SelectContent>
                      {materials
                        .filter(m => m.category === 'finish')
                        .map(material => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.product_name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Jumlah lapis"
                    value={systemForm.finish.coats}
                    onChange={(e) => setSystemForm({
                      ...systemForm,
                      finish: { ...systemForm.finish, coats: parseInt(e.target.value) || 1 }
                    })}
                    min="1"
                    max="5"
                  />
                  <Input
                    type="number"
                    placeholder="DFT (μm)"
                    value={systemForm.finish.dft}
                    onChange={(e) => setSystemForm({
                      ...systemForm,
                      finish: { ...systemForm.finish, dft: parseInt(e.target.value) || 50 }
                    })}
                    min="10"
                    max="500"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleCreateSystem}>
              Simpan Sistem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}