import { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  TableState, 
  SortColumn, 
  ColumnVisibility, 
  TablePreset,
  ColumnDefinition,
  TablePerformanceConfig 
} from '@/types/table-state';

interface UseTableStateProps<T> {
  storageKey: string; // For persistence
  columns: ColumnDefinition<T>[];
  defaultState?: Partial<TableState<T>>;
  performanceConfig?: TablePerformanceConfig;
  onStateChange?: (state: TableState<T>) => void;
}

interface UseTableStateReturn<T> {
  state: TableState<T>;
  
  // Sorting
  setSorting: (sorting: SortColumn<T>[]) => void;
  toggleSort: (columnId: string, multiSort?: boolean) => void;
  clearSorting: () => void;
  
  // Column visibility
  setColumnVisibility: (visibility: ColumnVisibility) => void;
  toggleColumnVisibility: (columnId: string) => void;
  setColumnOrder: (order: string[]) => void;
  resetColumns: () => void;
  
  // Filtering
  setGlobalFilter: (filter: string) => void;
  setColumnFilter: (columnId: string, value: any) => void;
  clearFilters: () => void;
  
  // Pagination
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  
  // Presets
  savePreset: (name: string, description?: string) => void;
  loadPreset: (presetId: string) => void;
  deletePreset: (presetId: string) => void;
  getPresets: () => TablePreset<T>[];
  
  // Performance
  isVirtualScrollEnabled: boolean;
  
  // Mobile helpers
  isMobile: boolean;
  getMobileColumns: () => string[];
}

export function useTableState<T>({
  storageKey,
  columns,
  defaultState,
  onStateChange,
  performanceConfig = {
    virtualScroll: {
      enabled: true,
      itemHeight: 50,
      overscan: 5,
      threshold: 100
    },
    lazyLoad: {
      enabled: true,
      pageSize: 50,
      prefetchDistance: 10
    },
    debounce: {
      search: 300,
      sort: 100,
      filter: 200
    },
    cache: {
      enabled: true,
      ttl: 300, // 5 minutes
      maxSize: 10
    }
  }
}: UseTableStateProps<T>): UseTableStateReturn<T> {
  // Check if mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize default column visibility
  const defaultColumnVisibility = useMemo(() => {
    const visibility: ColumnVisibility = {};
    columns.forEach(col => {
      if (isMobile) {
        visibility[col.id] = col.mobileVisible ?? false;
      } else {
        visibility[col.id] = col.defaultVisible ?? true;
      }
    });
    return visibility;
  }, [columns, isMobile]);

  // Persistence functions - define before use
  const loadPersistedState = (): Partial<TableState<T>> => {
    try {
      const stored = localStorage.getItem(`table-state-${storageKey}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load table state:', error);
    }
    return {};
  };

  // Initialize state with defaults and persisted values
  const initializeState = (): TableState<T> => {
    const persistedState = loadPersistedState();
    const defaults: TableState<T> = {
      sorting: [],
      columnVisibility: defaultColumnVisibility,
      columnOrder: columns.map(c => c.id),
      globalFilter: '',
      columnFilters: [],
      pagination: {
        pageIndex: 0,
        pageSize: isMobile ? 20 : 50
      },
      rowSelection: {},
      grouping: [],
      expanded: {},
      ...defaultState
    };
    
    return {
      ...defaults,
      ...persistedState
    };
  };

  const [state, setState] = useState<TableState<T>>(initializeState);

  const persistState = useCallback((newState: TableState<T>) => {
    try {
      // Only persist certain parts of state
      const toPersist = {
        sorting: newState.sorting,
        columnVisibility: newState.columnVisibility,
        columnOrder: newState.columnOrder,
        pagination: {
          pageSize: newState.pagination.pageSize
        }
      };
      localStorage.setItem(`table-state-${storageKey}`, JSON.stringify(toPersist));
    } catch (error) {
      console.error('Failed to persist table state:', error);
    }
  }, [storageKey]);

  // Update state and persist
  const updateState = useCallback((updates: Partial<TableState<T>>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      persistState(newState);
      onStateChange?.(newState);
      return newState;
    });
  }, [persistState, onStateChange]);

  // Sorting functions
  const setSorting = useCallback((sorting: SortColumn<T>[]) => {
    updateState({ sorting });
  }, [updateState]);

  const toggleSort = useCallback((columnId: string, multiSort = false) => {
    setState(prev => {
      const existingSort = prev.sorting.find(s => s.id === columnId);
      let newSorting: SortColumn<T>[];

      if (!multiSort) {
        // Single column sort
        if (!existingSort) {
          newSorting = [{ id: columnId, desc: false, priority: 0 }];
        } else if (!existingSort.desc) {
          newSorting = [{ id: columnId, desc: true, priority: 0 }];
        } else {
          newSorting = [];
        }
      } else {
        // Multi-column sort
        if (!existingSort) {
          const maxPriority = Math.max(...prev.sorting.map(s => s.priority), -1);
          newSorting = [...prev.sorting, { id: columnId, desc: false, priority: maxPriority + 1 }];
        } else {
          if (!existingSort.desc) {
            newSorting = prev.sorting.map(s => 
              s.id === columnId ? { ...s, desc: true } : s
            );
          } else {
            newSorting = prev.sorting.filter(s => s.id !== columnId);
            // Reorder priorities
            newSorting = newSorting.map((s, i) => ({ ...s, priority: i }));
          }
        }
      }

      const newState = { ...prev, sorting: newSorting };
      persistState(newState);
      onStateChange?.(newState);
      return newState;
    });
  }, [persistState, onStateChange]);

  const clearSorting = useCallback(() => {
    updateState({ sorting: [] });
  }, [updateState]);

  // Column visibility functions
  const setColumnVisibility = useCallback((visibility: ColumnVisibility) => {
    updateState({ columnVisibility: visibility });
  }, [updateState]);

  const toggleColumnVisibility = useCallback((columnId: string) => {
    setState(prev => {
      const newVisibility = {
        ...prev.columnVisibility,
        [columnId]: !prev.columnVisibility[columnId]
      };
      const newState = { ...prev, columnVisibility: newVisibility };
      persistState(newState);
      onStateChange?.(newState);
      return newState;
    });
  }, [persistState, onStateChange]);

  const setColumnOrder = useCallback((order: string[]) => {
    updateState({ columnOrder: order });
  }, [updateState]);

  const resetColumns = useCallback(() => {
    updateState({
      columnVisibility: defaultColumnVisibility,
      columnOrder: columns.map(c => c.id)
    });
  }, [updateState, defaultColumnVisibility, columns]);

  // Filter functions
  const setGlobalFilter = useCallback((filter: string) => {
    updateState({ globalFilter: filter });
  }, [updateState]);

  const setColumnFilter = useCallback((columnId: string, value: any) => {
    setState(prev => {
      const newFilters = prev.columnFilters.filter(f => f.id !== columnId);
      if (value !== null && value !== undefined && value !== '') {
        newFilters.push({ id: columnId, value });
      }
      const newState = { ...prev, columnFilters: newFilters };
      onStateChange?.(newState);
      return newState;
    });
  }, [onStateChange]);

  const clearFilters = useCallback(() => {
    updateState({ globalFilter: '', columnFilters: [] });
  }, [updateState]);

  // Pagination functions
  const setPageIndex = useCallback((index: number) => {
    updateState({ pagination: { ...state.pagination, pageIndex: index } });
  }, [updateState, state.pagination]);

  const setPageSize = useCallback((size: number) => {
    updateState({ 
      pagination: { 
        pageIndex: 0, // Reset to first page when changing size
        pageSize: size 
      } 
    });
  }, [updateState]);

  // Preset management
  const getPresets = useCallback((): TablePreset<T>[] => {
    try {
      const stored = localStorage.getItem(`table-presets-${storageKey}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, [storageKey]);

  const savePreset = useCallback((name: string, description?: string) => {
    const presets = getPresets();
    const newPreset: TablePreset<T> = {
      id: `preset-${Date.now()}`,
      name,
      description,
      state: {
        sorting: state.sorting,
        columnVisibility: state.columnVisibility,
        columnOrder: state.columnOrder,
        columnFilters: state.columnFilters
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedPresets = [...presets, newPreset];
    localStorage.setItem(`table-presets-${storageKey}`, JSON.stringify(updatedPresets));
  }, [storageKey, state, getPresets]);

  const loadPreset = useCallback((presetId: string) => {
    const presets = getPresets();
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      updateState(preset.state);
    }
  }, [getPresets, updateState]);

  const deletePreset = useCallback((presetId: string) => {
    const presets = getPresets();
    const updatedPresets = presets.filter(p => p.id !== presetId);
    localStorage.setItem(`table-presets-${storageKey}`, JSON.stringify(updatedPresets));
  }, [storageKey, getPresets]);

  // Performance checks
  const isVirtualScrollEnabled = useMemo(() => {
    return performanceConfig.virtualScroll.enabled && 
           state.pagination.pageSize > performanceConfig.virtualScroll.threshold;
  }, [performanceConfig, state.pagination.pageSize]);

  // Mobile helpers
  const getMobileColumns = useCallback(() => {
    return columns
      .filter(col => col.mobileVisible)
      .map(col => col.id);
  }, [columns]);

  return {
    state,
    setSorting,
    toggleSort,
    clearSorting,
    setColumnVisibility,
    toggleColumnVisibility,
    setColumnOrder,
    resetColumns,
    setGlobalFilter,
    setColumnFilter,
    clearFilters,
    setPageIndex,
    setPageSize,
    savePreset,
    loadPreset,
    deletePreset,
    getPresets,
    isVirtualScrollEnabled,
    isMobile,
    getMobileColumns
  };
}