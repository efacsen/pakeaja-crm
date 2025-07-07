'use client';

import { useState } from 'react';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Copy, 
  Trash2,
  Package,
  Beaker,
  FileText,
  DollarSign
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Material } from '@/types/materials';
import { formatCurrency } from '@/lib/calculator-utils';

interface MaterialsTableProps {
  materials: Material[];
  loading?: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange: (page: number) => void;
  onEdit: (material: Material) => void;
  onRefresh: () => void;
}

export function MaterialsTable({
  materials,
  loading = false,
  pagination,
  onPageChange,
  onEdit,
  onRefresh,
}: MaterialsTableProps) {
  const getManufacturerColor = (manufacturer: string) => {
    const colors: Record<string, string> = {
      NIPPON: 'bg-red-100 text-red-800',
      JOTUN: 'bg-blue-100 text-blue-800',
      KANSAI: 'bg-purple-100 text-purple-800',
      DULUX: 'bg-green-100 text-green-800',
      SKK: 'bg-yellow-100 text-yellow-800',
      PROPAN: 'bg-orange-100 text-orange-800',
      OTHER: 'bg-gray-100 text-gray-800',
    };
    return colors[manufacturer] || colors.OTHER;
  };

  const getCategoryIcon = (category: Material['category']) => {
    switch (category) {
      case 'primer':
        return '🔴';
      case 'intermediate':
        return '🟡';
      case 'finish':
        return '🟢';
      case 'thinner':
        return '💧';
      case 'additive':
        return '⚗️';
      default:
        return '🔵';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No materials found</h3>
        <p className="text-muted-foreground mb-4">
          Import materials or add them manually
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Product Code</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Coverage</TableHead>
                <TableHead>Packaging</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material) => {
                const coverage = material.spreading_rates.find(r => r.dft === material.dft_recommended);
                
                return (
                  <TableRow key={material.id}>
                    <TableCell className="font-mono text-sm">
                      {material.product_code}
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <div className="font-medium">{material.product_name}</div>
                        <div className="text-xs text-muted-foreground">
                          VS: {material.volume_solids}% | DFT: {material.dft_recommended}μm
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getManufacturerColor(material.manufacturer)}>
                        {material.manufacturer}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{getCategoryIcon(material.category)}</span>
                        <span className="capitalize">{material.category}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline">
                        {material.product_type}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      {coverage && (
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="text-sm">
                              <div>{coverage.practical_coverage_spray.toFixed(1)} m²/L</div>
                              <div className="text-xs text-muted-foreground">
                                @ {material.dft_recommended}μm
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <div className="font-medium">Coverage Rates</div>
                              <div className="text-xs">Theoretical: {coverage.theoretical_coverage} m²/L</div>
                              <div className="text-xs">Brush: {coverage.practical_coverage_brush} m²/L</div>
                              <div className="text-xs">Spray: {coverage.practical_coverage_spray} m²/L</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        {material.packaging_sizes.map((pkg, idx) => (
                          <span key={idx}>
                            {idx > 0 && ', '}
                            {pkg.size}{pkg.unit === 'liter' ? 'L' : 'kg'}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={material.is_active ? "default" : "secondary"}>
                        {material.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {material.is_discontinued && (
                        <Badge variant="destructive" className="ml-1">
                          Discontinued
                        </Badge>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onEdit(material)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Material
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            View TDS
                          </DropdownMenuItem>
                          {material.price_per_liter && (
                            <DropdownMenuItem>
                              <DollarSign className="h-4 w-4 mr-2" />
                              Update Price
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} materials
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => onPageChange(pagination.page - 1)}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, i) => {
                  const page = i + 1;
                  const isCurrentPage = page === pagination.page;
                  const showPage = page === 1 || 
                                  page === Math.ceil(pagination.total / pagination.limit) ||
                                  Math.abs(page - pagination.page) <= 2;
                  
                  if (!showPage) {
                    if (page === pagination.page - 3 || page === pagination.page + 3) {
                      return <span key={page} className="px-2">...</span>;
                    }
                    return null;
                  }
                  
                  return (
                    <Button
                      key={page}
                      variant={isCurrentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
                onClick={() => onPageChange(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}