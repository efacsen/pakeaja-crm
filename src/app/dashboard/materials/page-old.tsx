'use client';

import { useState, useEffect } from 'react';
import { MaterialsWithAdvancedSort } from '@/components/features/materials/MaterialsWithAdvancedSort';
import { MaterialForm } from '@/components/features/materials/MaterialForm';
import { MaterialImport } from '@/components/features/materials/MaterialImport';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MaterialsService } from '@/lib/services/materials-service';
import { Material } from '@/types/materials';
import { useToast } from '@/hooks/use-toast';

export default function Materials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const { toast } = useToast();
  const service = new MaterialsService();

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await service.getAllMaterials();
      if (error) throw new Error(error);
      setMaterials(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load materials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMaterial = () => {
    setEditingMaterial(null);
    setIsFormOpen(true);
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setIsFormOpen(true);
  };

  const handleDeleteMaterial = async (id: string) => {
    try {
      const { error } = await service.deleteMaterial(id);
      if (error) throw new Error(error);
      
      toast({
        title: 'Success',
        description: 'Material deleted successfully',
      });
      
      loadMaterials();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete material',
        variant: 'destructive',
      });
    }
  };

  const handleFormSubmit = async (data: Partial<Material>) => {
    try {
      if (editingMaterial) {
        const { error } = await service.updateMaterial(editingMaterial.id, data);
        if (error) throw new Error(error);
        
        toast({
          title: 'Success',
          description: 'Material updated successfully',
        });
      } else {
        const { error } = await service.createMaterial(data as Omit<Material, 'id' | 'created_at' | 'updated_at'>);
        if (error) throw new Error(error);
        
        toast({
          title: 'Success',
          description: 'Material created successfully',
        });
      }
      
      setIsFormOpen(false);
      loadMaterials();
    } catch (error) {
      toast({
        title: 'Error',
        description: editingMaterial ? 'Failed to update material' : 'Failed to create material',
        variant: 'destructive',
      });
    }
  };

  const handleImportComplete = () => {
    setIsImportOpen(false);
    loadMaterials();
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    toast({
      title: 'Export',
      description: 'Export functionality coming soon',
    });
  };

  const handleOpenImport = () => {
    setIsImportOpen(true);
  };

  if (isLoading) {
    return <div className="p-6">Loading materials...</div>;
  }

  return (
    <div className="p-6">
      <MaterialsWithAdvancedSort
        materials={materials}
        onEdit={handleEditMaterial}
        onDelete={handleDeleteMaterial}
        onAdd={handleAddMaterial}
        onExport={handleExport}
      />

      {/* Add/Edit Material Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMaterial ? 'Edit Material' : 'Add New Material'}
            </DialogTitle>
            <DialogDescription>
              {editingMaterial 
                ? 'Update the material information below.' 
                : 'Enter the details for the new material.'}
            </DialogDescription>
          </DialogHeader>
          <MaterialForm
            material={editingMaterial}
            onSuccess={() => {
              setIsFormOpen(false);
              loadMaterials();
            }}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Materials</DialogTitle>
            <DialogDescription>
              Upload a CSV or Excel file to import multiple materials at once.
            </DialogDescription>
          </DialogHeader>
          <MaterialImport
            onSuccess={handleImportComplete}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}