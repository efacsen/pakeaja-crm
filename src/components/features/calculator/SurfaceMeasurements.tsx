'use client';

import { useState } from 'react';
import { Plus, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SurfaceMeasurement } from '@/types/calculator';
import { calculateSurfaceArea, formatArea } from '@/lib/calculator-utils';
import { WORK_ITEMS } from '@/types/work-items';

interface SurfaceMeasurementsProps {
  data: SurfaceMeasurement[];
  onNext: (data: SurfaceMeasurement[]) => void;
  onBack: () => void;
}

export function SurfaceMeasurements({ data, onNext, onBack }: SurfaceMeasurementsProps) {
  const [surfaces, setSurfaces] = useState<SurfaceMeasurement[]>(
    data.length > 0 ? data : [{
      id: '1',
      name: 'Area 1',
      length: 0,
      width: 0,
      quantity: 1,
      unit: 'sqm',
      surfaceType: 'floor',
      condition: 'good',
      preparation: 'light',
    }]
  );

  const addSurface = () => {
    const newSurface: SurfaceMeasurement = {
      id: Date.now().toString(),
      name: `Area ${surfaces.length + 1}`,
      length: 0,
      width: 0,
      quantity: 1,
      unit: 'sqm',
      surfaceType: 'floor',
      condition: 'good',
      preparation: 'light',
    };
    setSurfaces([...surfaces, newSurface]);
  };

  const duplicateSurface = (index: number) => {
    const surfaceToDuplicate = surfaces[index];
    const newSurface: SurfaceMeasurement = {
      ...surfaceToDuplicate,
      id: Date.now().toString(),
      name: `${surfaceToDuplicate.name} (Copy)`,
    };
    setSurfaces([...surfaces, newSurface]);
  };

  const removeSurface = (index: number) => {
    setSurfaces(surfaces.filter((_, i) => i !== index));
  };

  const updateSurface = (index: number, field: keyof SurfaceMeasurement, value: string | number) => {
    const updated = [...surfaces];
    updated[index] = { ...updated[index], [field]: value };
    setSurfaces(updated);
  };

  const getTotalArea = () => {
    return surfaces.reduce((total, surface) => total + calculateSurfaceArea(surface), 0);
  };

  const handleNext = () => {
    const validSurfaces = surfaces.filter(s => s.length > 0 && s.width > 0);
    if (validSurfaces.length === 0) {
      alert('Please add at least one surface with valid measurements');
      return;
    }
    onNext(validSurfaces);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pengukuran Permukaan / Surface Measurements</CardTitle>
          <CardDescription>
            Tentukan area yang akan dilapisi dan karakteristiknya / Define the areas to be coated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Panjang (m)</TableHead>
                    <TableHead>Lebar (m)</TableHead>
                    <TableHead>Jml</TableHead>
                    <TableHead>Item Pengerjaan</TableHead>
                    <TableHead>Kondisi</TableHead>
                    <TableHead>Persiapan</TableHead>
                    <TableHead>Luas</TableHead>
                    <TableHead className="w-[100px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {surfaces.map((surface, index) => (
                    <TableRow key={surface.id}>
                      <TableCell>
                        <Input
                          value={surface.name}
                          onChange={(e) => updateSurface(index, 'name', e.target.value)}
                          className="w-[120px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={surface.length || ''}
                          onChange={(e) => updateSurface(index, 'length', parseFloat(e.target.value) || 0)}
                          className="w-[80px]"
                          placeholder="0"
                          step="0.1"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={surface.width || ''}
                          onChange={(e) => updateSurface(index, 'width', parseFloat(e.target.value) || 0)}
                          className="w-[80px]"
                          placeholder="0"
                          step="0.1"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={surface.quantity}
                          onChange={(e) => updateSurface(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-[60px]"
                          min="1"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={surface.surfaceType}
                          onValueChange={(value) => updateSurface(index, 'surfaceType', value)}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {WORK_ITEMS.filter(item => item.category === 'coating' && item.requiresArea).map(item => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={surface.condition}
                          onValueChange={(value) => updateSurface(index, 'condition', value)}
                        >
                          <SelectTrigger className="w-[90px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">Baru</SelectItem>
                            <SelectItem value="good">Baik</SelectItem>
                            <SelectItem value="fair">Sedang</SelectItem>
                            <SelectItem value="poor">Buruk</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={surface.preparation}
                          onValueChange={(value) => updateSurface(index, 'preparation', value)}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Tidak ada</SelectItem>
                            <SelectItem value="light">Ringan</SelectItem>
                            <SelectItem value="moderate">Sedang</SelectItem>
                            <SelectItem value="heavy">Berat</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatArea(calculateSurfaceArea(surface))}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => duplicateSurface(index)}
                            className="h-8 w-8"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeSurface(index)}
                            disabled={surfaces.length === 1}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={addSurface}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Tambah Area
              </Button>

              <div className="text-lg font-semibold">
                Total Luas: {formatArea(getTotalArea())}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext} size="lg">
          Next Step
        </Button>
      </div>
    </div>
  );
}