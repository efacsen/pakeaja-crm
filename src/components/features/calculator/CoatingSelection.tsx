'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CoatingSystem, DEFAULT_COATING_SYSTEMS } from '@/types/calculator';
import { formatCurrency } from '@/lib/calculator-utils';

interface CoatingSelectionProps {
  data: CoatingSystem | null;
  onNext: (data: CoatingSystem) => void;
  onBack: () => void;
}

export function CoatingSelection({ data, onNext, onBack }: CoatingSelectionProps) {
  const [selectedSystem, setSelectedSystem] = useState<string>(
    data?.id || DEFAULT_COATING_SYSTEMS[0].id
  );

  const handleNext = () => {
    const system = DEFAULT_COATING_SYSTEMS.find(s => s.id === selectedSystem);
    if (system) {
      onNext(system);
    }
  };

  const getSystemPrice = (system: CoatingSystem): number => {
    return system.products.reduce((total, { product, coats }) => {
      return total + (product.pricePerLiter * coats);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pilih Sistem Coating / Select Coating System</CardTitle>
          <CardDescription>
            Pilih sistem coating yang sesuai dengan kebutuhan proyek Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedSystem} onValueChange={setSelectedSystem}>
            <div className="space-y-4">
              {DEFAULT_COATING_SYSTEMS.map((system) => (
                <div key={system.id} className="relative">
                  <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-accent cursor-pointer">
                    <RadioGroupItem value={system.id} id={system.id} className="mt-1" />
                    <Label htmlFor={system.id} className="flex-1 cursor-pointer">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold">{system.name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {system.totalThickness} μm
                            </Badge>
                            <Badge variant="outline">
                              Garansi {system.warranty} tahun
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
                                {system.products.map(({ product, coats, thickness }, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-sm">
                                    <div className="space-y-1">
                                      <div className="font-medium">{product.name}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {product.type} • {coats} lapisan • {thickness} μm
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
                            <span>Perkiraan biaya material: ~{formatCurrency(getSystemPrice(system))}/liter</span>
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
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