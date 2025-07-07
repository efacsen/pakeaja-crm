'use client';

import { useState } from 'react';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  X, 
  GripVertical,
  Eye,
  EyeOff,
  ChevronDown,
  Filter,
  Settings2
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SortColumn, ColumnDefinition } from '@/types/table-state';
import { cn } from '@/lib/utils';

interface SortPanelProps<T> {
  columns: ColumnDefinition<T>[];
  sorting: SortColumn<T>[];
  columnVisibility: Record<string, boolean>;
  onSortingChange: (sorting: SortColumn<T>[]) => void;
  onColumnVisibilityChange: (visibility: Record<string, boolean>) => void;
  onReset: () => void;
  isMobile?: boolean;
}

// Sortable item component
function SortableItem<T>({ 
  column, 
  sorting,
  onToggle, 
  onRemove 
}: { 
  column: SortColumn<T>;
  sorting: SortColumn<T>[];
  onToggle: () => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id as string });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 p-2 bg-muted rounded-lg",
        isDragging && "opacity-50"
      )}
    >
      <button
        className="cursor-grab hover:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      
      <Badge variant="secondary" className="text-xs">
        {sorting.findIndex(s => s.id === column.id) + 1}
      </Badge>
      
      <span className="flex-1 text-sm font-medium">{column.id}</span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="h-8 px-2"
      >
        {column.desc ? (
          <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUp className="h-4 w-4" />
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-8 px-2"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function SortPanel<T>({
  columns,
  sorting,
  columnVisibility,
  onSortingChange,
  onColumnVisibilityChange,
  onReset,
  isMobile = false,
}: SortPanelProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group columns by their group property
  const columnGroups = columns.reduce((acc, col) => {
    const group = col.group || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(col);
    return acc;
  }, {} as Record<string, ColumnDefinition<T>[]>);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sorting.findIndex((s) => s.id === active.id);
      const newIndex = sorting.findIndex((s) => s.id === over.id);
      
      const newSorting = arrayMove(sorting, oldIndex, newIndex).map((s, i) => ({
        ...s,
        priority: i,
      }));
      
      onSortingChange(newSorting);
    }
  };

  const handleAddSort = (columnId: string) => {
    const exists = sorting.find(s => s.id === columnId);
    if (!exists) {
      const newSort: SortColumn<T> = {
        id: columnId,
        desc: false,
        priority: sorting.length,
      };
      onSortingChange([...sorting, newSort]);
    }
  };

  const handleToggleSort = (columnId: string) => {
    const newSorting = sorting.map(s =>
      s.id === columnId ? { ...s, desc: !s.desc } : s
    );
    onSortingChange(newSorting);
  };

  const handleRemoveSort = (columnId: string) => {
    const newSorting = sorting
      .filter(s => s.id !== columnId)
      .map((s, i) => ({ ...s, priority: i }));
    onSortingChange(newSorting);
  };

  const handleToggleColumn = (columnId: string) => {
    onColumnVisibilityChange({
      ...columnVisibility,
      [columnId]: !columnVisibility[columnId],
    });
  };

  const handleToggleGroup = (group: string, visible: boolean) => {
    const groupColumns = columnGroups[group] || [];
    const updates = groupColumns.reduce((acc, col) => {
      acc[col.id] = visible;
      return acc;
    }, {} as Record<string, boolean>);
    
    onColumnVisibilityChange({
      ...columnVisibility,
      ...updates,
    });
  };

  const content = (
    <div className="space-y-6">
      {/* Active Sorts */}
      <div>
        <h4 className="font-medium mb-3 flex items-center justify-between">
          Sort Order
          {sorting.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSortingChange([])}
            >
              Clear all
            </Button>
          )}
        </h4>
        
        {sorting.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No columns sorted. Click on columns below to add sorting.
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sorting.map(s => s.id as string)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sorting.map((sort) => (
                  <SortableItem
                    key={sort.id as string}
                    column={sort}
                    sorting={sorting}
                    onToggle={() => handleToggleSort(sort.id as string)}
                    onRemove={() => handleRemoveSort(sort.id as string)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <Separator />

      {/* Available Columns */}
      <div>
        <h4 className="font-medium mb-3">Available Columns</h4>
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {columns
              .filter(col => col.sortable !== false)
              .filter(col => !sorting.find(s => s.id === col.id))
              .map((col) => (
                <Button
                  key={col.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleAddSort(col.id)}
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  {col.header}
                </Button>
              ))}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      {/* Column Visibility */}
      <div>
        <h4 className="font-medium mb-3">Column Visibility</h4>
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(columnGroups).map(([group, cols]) => {
            const visibleCount = cols.filter(col => columnVisibility[col.id]).length;
            const isAllVisible = visibleCount === cols.length;
            const isPartialVisible = visibleCount > 0 && visibleCount < cols.length;
            
            return (
              <AccordionItem key={group} value={group}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-2">
                    <span>{group}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {visibleCount}/{cols.length}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleGroup(group, !isAllVisible);
                        }}
                      >
                        {isAllVisible ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pl-2">
                    {cols.map((col) => (
                      <div key={col.id} className="flex items-center space-x-2">
                        <Switch
                          id={col.id}
                          checked={columnVisibility[col.id] ?? true}
                          onCheckedChange={() => handleToggleColumn(col.id)}
                        />
                        <Label
                          htmlFor={col.id}
                          className="text-sm font-normal cursor-pointer flex-1"
                        >
                          {col.header}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <Separator />

      {/* Reset Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={onReset}
      >
        Reset to Defaults
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings2 className="h-4 w-4 mr-2" />
            Sort & Filter
            {sorting.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {sorting.length}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Sort & Filter Options</SheetTitle>
            <SheetDescription>
              Customize how your data is displayed
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-full mt-4 pb-20">
            {content}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="w-80 border rounded-lg p-4">
      {content}
    </div>
  );
}