'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Beaker,
  Package,
  BarChart3,
  FileSpreadsheet,
  FileText,
  Edit,
  Copy,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { MaterialImport } from './MaterialImport';
import { MaterialsTable } from './MaterialsTable';
import { MaterialForm } from './MaterialForm';
import { MaterialSystemBuilder } from './MaterialSystemBuilder';
import { Material, MaterialFilter } from '@/types/materials';
import { materialsService } from '@/lib/services/materials-service';

export function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MaterialFilter>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSystemBuilderOpen, setIsSystemBuilderOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  const { toast } = useToast();

  // Load materials
  const loadMaterials = async () => {
    setLoading(true);
    try {
      const searchFilters = searchQuery ? { ...filters, search: searchQuery } : filters;
      const { data, error } = await materialsService.searchMaterials(
        searchFilters,
        pagination.page,
        pagination.limit
      );

      if (error) {
        throw new Error(error);
      }

      if (data) {
        setMaterials(data.materials);
        setPagination(prev => ({ ...prev, total: data.total }));
      }
    } catch (error) {
      console.error('Error loading materials:', error);
      toast({
        title: "Error",
        description: "Failed to load materials database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadMaterials();
  }, [pagination.page]);

  // Search and filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      loadMaterials();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters]);

  const handleCreateMaterial = () => {
    setSelectedMaterial(null);
    setIsFormOpen(true);
  };

  const handleEditMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedMaterial(null);
    loadMaterials();
  };

  const handleImportSuccess = () => {
    setIsImportOpen(false);
    loadMaterials();
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  // Material stats
  const materialStats = {
    total: materials.length,
    byManufacturer: materials.reduce((acc, m) => {
      acc[m.manufacturer] = (acc[m.manufacturer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byCategory: materials.reduce((acc, m) => {
      acc[m.category] = (acc[m.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    active: materials.filter(m => m.is_active).length,
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Material Database</h1>
          <p className="text-muted-foreground">
            Manage coating materials from all principals
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsSystemBuilderOpen(true)}>
            <Beaker className="h-4 w-4 mr-2" />
            System Builder
          </Button>
          
          <Button variant="outline" onClick={() => setIsImportOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          
          <Button onClick={handleCreateMaterial}>
            <Plus className="h-4 w-4 mr-2" />
            Add Material
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
            <p className="text-xs text-muted-foreground">
              {materialStats.active} active products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manufacturers</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(materialStats.byManufacturer).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Principal brands
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Primers</span>
                <span className="font-medium">{materialStats.byCategory.primer || 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Intermediates</span>
                <span className="font-medium">{materialStats.byCategory.intermediate || 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Finishes</span>
                <span className="font-medium">{materialStats.byCategory.finish || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Database
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              TDS Library
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="materials" className="space-y-4">
        <TabsList>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="systems">Coating Systems</TabsTrigger>
          <TabsTrigger value="import">Import/Export</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by product name or code..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Select
                    value={filters.manufacturer || 'all'}
                    onValueChange={(value) => 
                      setFilters(prev => ({ 
                        ...prev, 
                        manufacturer: value === 'all' ? undefined : value as any 
                      }))
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Manufacturer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      <SelectItem value="NIPPON">NIPPON</SelectItem>
                      <SelectItem value="JOTUN">JOTUN</SelectItem>
                      <SelectItem value="KANSAI">KANSAI</SelectItem>
                      <SelectItem value="DULUX">DULUX</SelectItem>
                      <SelectItem value="SKK">SKK</SelectItem>
                      <SelectItem value="PROPAN">PROPAN</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.category || 'all'}
                    onValueChange={(value) => 
                      setFilters(prev => ({ 
                        ...prev, 
                        category: value === 'all' ? undefined : value as any 
                      }))
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="primer">Primer</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="finish">Finish</SelectItem>
                      <SelectItem value="thinner">Thinner</SelectItem>
                      <SelectItem value="additive">Additive</SelectItem>
                      <SelectItem value="specialty">Specialty</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.is_active === undefined ? 'all' : filters.is_active.toString()}
                    onValueChange={(value) => 
                      setFilters(prev => ({ 
                        ...prev, 
                        is_active: value === 'all' ? undefined : value === 'true'
                      }))
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  {(searchQuery || Object.keys(filters).length > 0) && (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <MaterialsTable
                materials={materials}
                loading={loading}
                pagination={pagination}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                onEdit={handleEditMaterial}
                onRefresh={loadMaterials}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="systems" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Coating Systems</CardTitle>
              <CardDescription>
                Pre-approved coating systems for different environments and substrates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Beaker className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">System Builder</h3>
                <p className="text-muted-foreground mb-4">
                  Create and manage coating systems with approved material combinations
                </p>
                <Button onClick={() => setIsSystemBuilderOpen(true)}>
                  Open System Builder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <MaterialImport onSuccess={handleImportSuccess} />
          
          <Card>
            <CardHeader>
              <CardTitle>Export Materials</CardTitle>
              <CardDescription>
                Export your material database for backup or external use
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button variant="outline">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export as Excel
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Material Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedMaterial ? 'Edit Material' : 'Add New Material'}
            </DialogTitle>
            <DialogDescription>
              {selectedMaterial 
                ? 'Update material information and specifications'
                : 'Add a new material to your database'
              }
            </DialogDescription>
          </DialogHeader>
          <MaterialForm
            material={selectedMaterial}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Import Materials</DialogTitle>
            <DialogDescription>
              Import materials from Excel, CSV, or PDF technical data sheets
            </DialogDescription>
          </DialogHeader>
          <MaterialImport onSuccess={handleImportSuccess} />
        </DialogContent>
      </Dialog>

      {/* System Builder Dialog */}
      <Dialog open={isSystemBuilderOpen} onOpenChange={setIsSystemBuilderOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Coating System Builder</DialogTitle>
            <DialogDescription>
              Create approved coating systems for different environments
            </DialogDescription>
          </DialogHeader>
          <MaterialSystemBuilder
            onSuccess={() => {
              setIsSystemBuilderOpen(false);
              toast({
                title: "System Created",
                description: "Coating system has been saved successfully",
              });
            }}
            onCancel={() => setIsSystemBuilderOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}