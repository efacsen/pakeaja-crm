'use client';

import { useMemo, useState, useCallback } from 'react';
import { useTableState } from '@/hooks/use-table-state';
import { MaterialsTable } from './MaterialsTable';
import { SortPanel } from './sort-panel/SortPanel';
import { PackageFilters, PackageFilterValues } from './sort-panel/PackageFilters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, Plus, Package } from 'lucide-react';
import { Material } from '@/types/materials';
import { ColumnDefinition } from '@/types/table-state';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface MaterialsWithAdvancedSortProps {
  materials: Material[];
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onExport: () => void;
}

// Define columns with groups
const materialColumns: ColumnDefinition<Material>[] = [
  // Basic Information
  {
    id: 'product_name',
    header: 'Product Name',
    accessor: 'product_name',
    group: 'Basic Information',
    mobileVisible: true,
    sortable: true,
    filterable: true,
  },
  {
    id: 'manufacturer',
    header: 'Manufacturer',
    accessor: 'manufacturer',
    group: 'Basic Information',
    mobileVisible: true,
    sortable: true,
    filterable: true,
  },
  {
    id: 'category',
    header: 'Category',
    accessor: 'category',
    group: 'Basic Information',
    sortable: true,
    filterable: true,
  },
  {
    id: 'sub_category',
    header: 'Sub Category',
    accessor: (row: Material) => row.sub_category || '-',
    group: 'Basic Information',
    sortable: true,
    filterable: true,
  },
  
  // Technical Specifications
  {
    id: 'volume_solids',
    header: 'Volume Solids %',
    accessor: 'volume_solids',
    group: 'Technical Specifications',
    sortable: true,
    cell: (value) => `${value}%`,
  },
  {
    id: 'dft_recommended',
    header: 'Recommended DFT',
    accessor: 'dft_recommended',
    group: 'Technical Specifications',
    sortable: true,
    cell: (value) => `${value} μm`,
  },
  {
    id: 'loss_factor_brush',
    header: 'Loss Factor (Brush)',
    accessor: 'loss_factor_brush',
    group: 'Technical Specifications',
    sortable: true,
    cell: (value) => `${value}%`,
  },
  {
    id: 'loss_factor_spray',
    header: 'Loss Factor (Spray)',
    accessor: 'loss_factor_spray',
    group: 'Technical Specifications',
    sortable: true,
    cell: (value) => `${value}%`,
  },
  
  // Commercial Information
  {
    id: 'unit_price',
    header: 'Unit Price',
    accessor: (row: Material) => row.unit_price || 0,
    group: 'Commercial Information',
    mobileVisible: true,
    sortable: true,
    cell: (value) => formatCurrency(value),
  },
  {
    id: 'minimum_order',
    header: 'Min Order',
    accessor: (row: Material) => row.minimum_order || 0,
    group: 'Commercial Information',
    sortable: true,
  },
  {
    id: 'lead_time_days',
    header: 'Lead Time',
    accessor: (row: Material) => row.lead_time_days || 0,
    group: 'Commercial Information',
    sortable: true,
    cell: (value) => value ? `${value} days` : '-',
  },
  
  // Packaging - Special handling
  {
    id: 'packaging_sizes',
    header: 'Package Sizes',
    accessor: 'packaging_sizes',
    group: 'Packaging',
    mobileVisible: true,
    sortable: true,
    cell: (value: Material['packaging_sizes']) => {
      if (!value || value.length === 0) return '-';
      return value.map(p => 
        `${p.size}${p.unit === 'liter' ? 'L' : 'Kg'} ${p.container ? `(${p.container})` : ''}`
      ).join(', ');
    },
  },
  
  // Status
  {
    id: 'active',
    header: 'Status',
    accessor: (row: Material) => row.active ?? row.is_active,
    group: 'Status',
    sortable: true,
    filterable: true,
    cell: (value) => value ? 'Active' : 'Inactive',
  },
];

export function MaterialsWithAdvancedSort({
  materials,
  onEdit,
  onDelete,
  onAdd,
  onExport,
}: MaterialsWithAdvancedSortProps) {
  const router = useRouter();
  const tableState = useTableState<Material>({
    storageKey: 'materials-table',
    columns: materialColumns,
    defaultState: {
      sorting: [],
      pagination: {
        pageIndex: 0,
        pageSize: 50,
      },
    },
  });

  // Package filter state
  const [packageFilters, setPackageFilters] = useState<PackageFilterValues>({
    units: ['liter', 'kg'],
    containers: ['can', 'gallon', 'pail', 'drum'],
    sizeRange: { min: 0, max: 1000 },
    sortMode: 'numeric',
    groupByUnit: false,
  });

  // Apply sorting with package-specific logic
  const sortedMaterials = useMemo(() => {
    let sorted = [...materials];

    // Apply filters first
    if (tableState.state.globalFilter) {
      const search = tableState.state.globalFilter.toLowerCase();
      sorted = sorted.filter(m => 
        m.product_name.toLowerCase().includes(search) ||
        m.manufacturer.toLowerCase().includes(search) ||
        m.category.toLowerCase().includes(search)
      );
    }

    // Apply package filters
    sorted = sorted.filter(m => {
      // Unit filter
      if (packageFilters.units.length < 2) {
        const hasUnit = m.packaging_sizes?.some(p => 
          packageFilters.units.includes(p.unit)
        );
        if (!hasUnit) return false;
      }

      // Container filter
      if (packageFilters.containers.length < 4) {
        const hasContainer = m.packaging_sizes?.some(p => 
          p.container && packageFilters.containers.includes(p.container)
        );
        if (!hasContainer) return false;
      }

      // Size range filter
      if (packageFilters.sizeRange.min > 0 || packageFilters.sizeRange.max < 1000) {
        const inRange = m.packaging_sizes?.some(p => 
          p.size >= packageFilters.sizeRange.min && 
          p.size <= packageFilters.sizeRange.max
        );
        if (!inRange) return false;
      }

      return true;
    });

    // Apply sorting
    if (tableState.state.sorting.length > 0) {
      sorted.sort((a, b) => {
        for (const sort of tableState.state.sorting) {
          let aValue: any;
          let bValue: any;

          // Special handling for packaging sizes
          if (sort.id === 'packaging_sizes') {
            const aPackages = a.packaging_sizes || [];
            const bPackages = b.packaging_sizes || [];
            
            if (packageFilters.sortMode === 'normalized') {
              // Convert all to liters for comparison (assuming 1kg = 1L for paint density)
              aValue = Math.min(...aPackages.map(p => 
                p.unit === 'kg' ? p.size : p.size
              )) || 0;
              bValue = Math.min(...bPackages.map(p => 
                p.unit === 'kg' ? p.size : p.size
              )) || 0;
            } else {
              // Simple numeric comparison
              aValue = Math.min(...aPackages.map(p => p.size)) || 0;
              bValue = Math.min(...bPackages.map(p => p.size)) || 0;
            }
          } else {
            // Standard column access
            const column = materialColumns.find(c => c.id === sort.id);
            if (column) {
              if (typeof column.accessor === 'function') {
                aValue = column.accessor(a);
                bValue = column.accessor(b);
              } else {
                aValue = a[column.accessor as keyof Material];
                bValue = b[column.accessor as keyof Material];
              }
            }
          }

          // Compare values
          if (aValue < bValue) return sort.desc ? 1 : -1;
          if (aValue > bValue) return sort.desc ? -1 : 1;
        }
        return 0;
      });
    }

    return sorted;
  }, [materials, tableState.state.sorting, tableState.state.globalFilter, packageFilters]);

  // Paginated materials
  const paginatedMaterials = useMemo(() => {
    const start = tableState.state.pagination.pageIndex * tableState.state.pagination.pageSize;
    const end = start + tableState.state.pagination.pageSize;
    return sortedMaterials.slice(start, end);
  }, [sortedMaterials, tableState.state.pagination]);

  const handleResetPackageFilters = useCallback(() => {
    setPackageFilters({
      units: ['liter', 'kg'],
      containers: ['can', 'gallon', 'pail', 'drum'],
      sizeRange: { min: 0, max: 1000 },
      sortMode: 'numeric',
      groupByUnit: false,
    });
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Materials Database</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/dashboard/materials/systems')}>
            <Package className="h-4 w-4 mr-2" />
            Coating Systems
          </Button>
          <Button onClick={onAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Material
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search materials..."
            value={tableState.state.globalFilter}
            onChange={(e) => tableState.setGlobalFilter(e.target.value)}
            className="pl-10"
          />
        </div>
        <PackageFilters
          values={packageFilters}
          onChange={setPackageFilters}
          onReset={handleResetPackageFilters}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex gap-4">
        {/* Table */}
        <div className="flex-1">
          <MaterialsTable
            materials={paginatedMaterials}
            onEdit={onEdit}
            onDelete={onDelete}
          />
          
          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {tableState.state.pagination.pageIndex * tableState.state.pagination.pageSize + 1} to{' '}
              {Math.min(
                (tableState.state.pagination.pageIndex + 1) * tableState.state.pagination.pageSize,
                sortedMaterials.length
              )}{' '}
              of {sortedMaterials.length} materials
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => tableState.setPageIndex(tableState.state.pagination.pageIndex - 1)}
                disabled={tableState.state.pagination.pageIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => tableState.setPageIndex(tableState.state.pagination.pageIndex + 1)}
                disabled={
                  (tableState.state.pagination.pageIndex + 1) * tableState.state.pagination.pageSize >=
                  sortedMaterials.length
                }
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Sort Panel - Hidden on mobile */}
        {!tableState.isMobile && (
          <SortPanel
            columns={materialColumns}
            sorting={tableState.state.sorting}
            columnVisibility={tableState.state.columnVisibility}
            onSortingChange={tableState.setSorting}
            onColumnVisibilityChange={tableState.setColumnVisibility}
            onReset={tableState.resetColumns}
          />
        )}
      </div>

      {/* Mobile Sort Panel */}
      {tableState.isMobile && (
        <div className="fixed bottom-4 right-4 z-50">
          <SortPanel
            columns={materialColumns}
            sorting={tableState.state.sorting}
            columnVisibility={tableState.state.columnVisibility}
            onSortingChange={tableState.setSorting}
            onColumnVisibilityChange={tableState.setColumnVisibility}
            onReset={tableState.resetColumns}
            isMobile
          />
        </div>
      )}
    </div>
  );
}