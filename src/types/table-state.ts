// Generic table state management types that can be reused across different tables

export interface SortColumn<T = any> {
  id: keyof T | string; // Column identifier
  desc: boolean; // Sort direction: true = descending, false = ascending
  priority: number; // Sort priority (0 = primary, 1 = secondary, etc.)
}

export interface ColumnVisibility {
  [columnId: string]: boolean;
}

export interface ColumnDefinition<T = any> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => any);
  cell?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  defaultVisible?: boolean;
  group?: string; // Column group (e.g., "Basic Info", "Technical Specs")
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  sticky?: 'left' | 'right'; // Pin column
  mobileVisible?: boolean; // Show on mobile by default
}

export interface TableState<T = any> {
  // Sorting
  sorting: SortColumn<T>[];
  
  // Column visibility
  columnVisibility: ColumnVisibility;
  columnOrder: string[];
  
  // Filtering
  globalFilter: string;
  columnFilters: Array<{
    id: string;
    value: any;
  }>;
  
  // Pagination
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  
  // Selection
  rowSelection: Record<string, boolean>;
  
  // Grouping
  grouping: string[];
  expanded: Record<string, boolean>;
}

export interface TablePreset<T = any> {
  id: string;
  name: string;
  description?: string;
  state: Partial<TableState<T>>;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VirtualScrollState {
  scrollTop: number;
  viewportHeight: number;
  itemHeight: number;
  overscan: number; // Number of items to render outside viewport
  visibleStartIndex: number;
  visibleEndIndex: number;
}

// Material-specific extensions
export interface MaterialTableState extends TableState {
  // Material-specific filters
  materialFilters: {
    manufacturers?: string[];
    categories?: string[];
    packagingUnits?: ('liter' | 'kg')[];
    packagingTypes?: ('can' | 'gallon' | 'pail' | 'drum')[];
    sizeRange?: {
      min: number;
      max: number;
    };
    activeOnly?: boolean;
  };
}

// Sort configuration for specific columns
export interface MaterialSortConfig {
  // Package size sorting configuration
  packageSizeSort: {
    mode: 'numeric' | 'normalized'; // numeric: sort by number, normalized: convert to liters
    groupByUnit: boolean; // Group L and Kg separately
  };
  
  // Price sorting configuration
  priceSort: {
    mode: 'absolute' | 'per-liter' | 'per-coverage';
  };
}

// Performance optimization settings
export interface TablePerformanceConfig {
  virtualScroll: {
    enabled: boolean;
    itemHeight: number;
    overscan: number;
    threshold: number; // Number of items before enabling virtual scroll
  };
  
  lazyLoad: {
    enabled: boolean;
    pageSize: number;
    prefetchDistance: number; // Items from bottom to trigger next load
  };
  
  debounce: {
    search: number; // ms
    sort: number; // ms
    filter: number; // ms
  };
  
  cache: {
    enabled: boolean;
    ttl: number; // Cache time-to-live in seconds
    maxSize: number; // Max cached result sets
  };
}