'use client';

import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard as Card, GlassCardContent as CardContent, GlassCardDescription as CardDescription, GlassCardHeader as CardHeader, GlassCardTitle as CardTitle } from '@/components/ui/glass-card';
import { GlassInputSolid as Input } from '@/components/ui/glass-input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  SurfaceMeasurement, 
  CoatingSystem, 
  CostBreakdown,
  DEFAULT_LABOR_RATES 
} from '@/types/calculator';
import { 
  calculateTotalCost, 
  formatCurrency, 
  formatArea,
  calculateTotalArea 
} from '@/lib/calculator-utils';

interface CostCalculationProps {
  surfaces: SurfaceMeasurement[];
  system: CoatingSystem;
  data: CostBreakdown | null;
  onNext: (data: CostBreakdown) => void;
  onBack: () => void;
}

export function CostCalculation({ surfaces, system, data, onNext, onBack }: CostCalculationProps) {
  const [overhead, setOverhead] = useState(data?.overhead || 10);
  const [profit, setProfit] = useState(data?.profit || 15);
  const [ppn, setPpn] = useState(data?.ppn || 11);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown | null>(null);

  useEffect(() => {
    const breakdown = calculateTotalCost(
      surfaces,
      system,
      DEFAULT_LABOR_RATES,
      overhead,
      profit,
      ppn
    );
    setCostBreakdown(breakdown);
  }, [surfaces, system, overhead, profit, ppn]);

  const handleNext = () => {
    if (costBreakdown) {
      onNext(costBreakdown);
    }
  };

  if (!costBreakdown) return null;

  const totalArea = calculateTotalArea(surfaces);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kalkulasi Biaya / Cost Calculation</CardTitle>
          <CardDescription>
            Tinjau dan sesuaikan rincian biaya untuk proyek coating Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Summary */}
          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-semibold mb-2">Ringkasan Proyek</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Total Luas:</div>
              <div className="font-medium">{formatArea(totalArea)}</div>
              <div>Sistem Coating:</div>
              <div className="font-medium">{system.nameId || system.name}</div>
              <div>Jumlah Area:</div>
              <div className="font-medium">{surfaces.length}</div>
            </div>
          </div>

          {/* Materials Cost */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Biaya Material
            </h4>
            <div className="space-y-2">
              {costBreakdown.materials.products.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <div>
                    <span className="font-medium">{item.product.name}</span>
                    <span className="text-muted-foreground ml-2">
                      ({item.quantity} liter)
                    </span>
                  </div>
                  <div className="font-medium">{formatCurrency(item.totalCost)}</div>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total Material</span>
                <span>{formatCurrency(costBreakdown.materials.totalMaterialCost)}</span>
              </div>
            </div>
          </div>

          {/* Labor Cost */}
          <div>
            <h4 className="font-semibold mb-3">Biaya Tenaga Kerja</h4>
            <div className="space-y-2">
              {costBreakdown.labor.tasks.map((task, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <div>
                    <span className="font-medium">{task.description}</span>
                    <span className="text-muted-foreground ml-2">
                      ({task.hours.toFixed(1)} jam @ {formatCurrency(task.rate)}/m²)
                    </span>
                  </div>
                  <div className="font-medium">{formatCurrency(task.totalCost)}</div>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total Tenaga Kerja</span>
                <span>{formatCurrency(costBreakdown.labor.totalLaborCost)}</span>
              </div>
            </div>
          </div>

          {/* Equipment Cost */}
          <div>
            <h4 className="font-semibold mb-3">Biaya Peralatan</h4>
            <div className="space-y-2">
              {costBreakdown.equipment.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground ml-2">
                      ({item.days} hari @ {formatCurrency(item.dailyRate)}/hari)
                    </span>
                  </div>
                  <div className="font-medium">{formatCurrency(item.totalCost)}</div>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total Peralatan</span>
                <span>{formatCurrency(costBreakdown.equipment.totalEquipmentCost)}</span>
              </div>
            </div>
          </div>

          {/* Additional Costs */}
          <div>
            <h4 className="font-semibold mb-3">Biaya Tambahan</h4>
            <div className="space-y-2">
              {costBreakdown.additionalCosts.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="font-medium">{formatCurrency(item.cost)}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Markup Controls */}
          <div className="space-y-4">
            <h4 className="font-semibold">Markup & PPN</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="overhead">Overhead (%)</Label>
                <Input
                  id="overhead"
                  type="number"
                  value={overhead}
                  onChange={(e) => setOverhead(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.5"
                />
              </div>
              <div>
                <Label htmlFor="profit">Profit (%)</Label>
                <Input
                  id="profit"
                  type="number"
                  value={profit}
                  onChange={(e) => setProfit(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.5"
                />
              </div>
              <div>
                <Label htmlFor="ppn">PPN (%)</Label>
                <Input
                  id="ppn"
                  type="number"
                  value={ppn}
                  onChange={(e) => setPpn(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="20"
                  step="0.25"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Mobilization Cost */}
          <div>
            <h4 className="font-semibold mb-3">Biaya Mobilisasi</h4>
            <div className="flex justify-between">
              <span>Mobilisasi & Demobilisasi (5%)</span>
              <span className="font-medium">{formatCurrency(costBreakdown.mobilizationCost)}</span>
            </div>
          </div>

          <Separator />

          {/* Final Cost Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(costBreakdown.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Overhead ({overhead}%)</span>
              <span>{formatCurrency(costBreakdown.subtotal * (overhead / 100))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Keuntungan ({profit}%)</span>
              <span>{formatCurrency(costBreakdown.subtotal * (profit / 100))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>PPN ({ppn}%)</span>
              <span>{formatCurrency((costBreakdown.subtotal + costBreakdown.subtotal * (overhead / 100) + costBreakdown.subtotal * (profit / 100)) * (ppn / 100))}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Biaya Proyek</span>
              <span className="text-primary">{formatCurrency(costBreakdown.totalCost)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Biaya per m²</span>
              <span>{formatCurrency(costBreakdown.totalCost / totalArea)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Kembali
        </Button>
        <Button onClick={handleNext} size="lg">
          Tinjau Penawaran
        </Button>
      </div>
    </div>
  );
}