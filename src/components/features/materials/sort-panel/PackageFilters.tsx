'use client';

import { useState } from 'react';
import { Package, Beaker, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export interface PackageFilterValues {
  units: ('liter' | 'kg')[];
  containers: ('can' | 'gallon' | 'pail' | 'drum')[];
  sizeRange: {
    min: number;
    max: number;
  };
  sortMode: 'numeric' | 'normalized';
  groupByUnit: boolean;
}

interface PackageFiltersProps {
  values: PackageFilterValues;
  onChange: (values: PackageFilterValues) => void;
  onReset: () => void;
  className?: string;
}

const CONTAINER_INFO = {
  can: { label: 'Can', sizes: [0.25, 0.5, 1, 4, 5] },
  gallon: { label: 'Gallon', sizes: [3.785, 18.925] }, // US gallon, 5 US gallons
  pail: { label: 'Pail', sizes: [20, 25] },
  drum: { label: 'Drum', sizes: [200, 209] },
};

export function PackageFilters({
  values,
  onChange,
  onReset,
  className,
}: PackageFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleUnitToggle = (unit: 'liter' | 'kg') => {
    const newUnits = values.units.includes(unit)
      ? values.units.filter(u => u !== unit)
      : [...values.units, unit];
    onChange({ ...values, units: newUnits });
  };

  const handleContainerToggle = (container: 'can' | 'gallon' | 'pail' | 'drum') => {
    const newContainers = values.containers.includes(container)
      ? values.containers.filter(c => c !== container)
      : [...values.containers, container];
    onChange({ ...values, containers: newContainers });
  };

  const activeFilterCount = 
    (values.units.length < 2 ? 1 : 0) +
    (values.containers.length < 4 ? 1 : 0) +
    (values.sizeRange.min > 0 || values.sizeRange.max < 1000 ? 1 : 0) +
    (values.sortMode !== 'numeric' ? 1 : 0) +
    (values.groupByUnit ? 1 : 0);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-2", className)}
        >
          <Package className="h-4 w-4" />
          Package Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Package Filters</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 px-2 text-xs"
            >
              Reset
            </Button>
          </div>

          <Separator />

          {/* Unit Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Beaker className="h-4 w-4" />
              Measurement Unit
            </Label>
            <div className="flex gap-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={values.units.includes('liter')}
                  onCheckedChange={() => handleUnitToggle('liter')}
                />
                <span className="text-sm">Liter (L)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={values.units.includes('kg')}
                  onCheckedChange={() => handleUnitToggle('kg')}
                />
                <span className="text-sm">Kilogram (Kg)</span>
              </label>
            </div>
          </div>

          <Separator />

          {/* Container Type Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Container Type
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(CONTAINER_INFO).map(([key, info]) => (
                <label key={key} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={values.containers.includes(key as any)}
                    onCheckedChange={() => handleContainerToggle(key as any)}
                  />
                  <span className="text-sm">{info.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Size Range Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Size Range
            </Label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={values.sizeRange.min}
                  onChange={(e) => onChange({
                    ...values,
                    sizeRange: { ...values.sizeRange, min: Number(e.target.value) }
                  })}
                  className="w-20 h-8"
                  min={0}
                  max={values.sizeRange.max}
                />
                <span className="text-sm text-muted-foreground">to</span>
                <Input
                  type="number"
                  value={values.sizeRange.max}
                  onChange={(e) => onChange({
                    ...values,
                    sizeRange: { ...values.sizeRange, max: Number(e.target.value) }
                  })}
                  className="w-20 h-8"
                  min={values.sizeRange.min}
                  max={1000}
                />
                <span className="text-sm text-muted-foreground">units</span>
              </div>
              <Slider
                value={[values.sizeRange.min, values.sizeRange.max]}
                onValueChange={([min, max]) => onChange({
                  ...values,
                  sizeRange: { min, max }
                })}
                min={0}
                max={1000}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>250</span>
                <span>500</span>
                <span>750</span>
                <span>1000</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Sort Options */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sort Mode</Label>
            <RadioGroup
              value={values.sortMode}
              onValueChange={(value: 'numeric' | 'normalized') => 
                onChange({ ...values, sortMode: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="numeric" id="numeric" />
                <Label htmlFor="numeric" className="text-sm font-normal cursor-pointer">
                  Numeric (sort by number only)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normalized" id="normalized" />
                <Label htmlFor="normalized" className="text-sm font-normal cursor-pointer">
                  Normalized (convert Kg to L for comparison)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="groupByUnit"
              checked={values.groupByUnit}
              onCheckedChange={(checked) => 
                onChange({ ...values, groupByUnit: checked as boolean })
              }
            />
            <Label htmlFor="groupByUnit" className="text-sm font-normal cursor-pointer">
              Group by unit type
            </Label>
          </div>

          {/* Common Container Sizes Reference */}
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Common sizes:</p>
            <div className="text-xs space-y-1">
              <div>• Can: 0.25L, 0.5L, 1L, 4L, 5L</div>
              <div>• Gallon: 3.785L (US), 18.925L (5 US gal)</div>
              <div>• Pail: 20L, 25L</div>
              <div>• Drum: 200L, 209L</div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}