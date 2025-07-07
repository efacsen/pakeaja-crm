'use client';

import { useState } from 'react';
import { 
  Settings,
  Download,
  Upload,
  Filter,
  ArrowUpDown,
  Plus,
  LayoutGrid,
  List,
  Columns
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  title: string;
  viewType?: 'kanban' | 'list' | 'split';
  onViewChange?: (view: 'kanban' | 'list' | 'split') => void;
  onFilter?: () => void;
  onSort?: () => void;
  sortCount?: number;
}

const users = [
  { id: '1', name: 'John Doe', avatar: null },
  { id: '2', name: 'Jane Smith', avatar: null },
  { id: '3', name: 'Mike Johnson', avatar: null },
  { id: '4', name: 'Sarah Williams', avatar: null },
  { id: '5', name: 'Tom Brown', avatar: null },
];

export function DashboardHeader({
  title,
  viewType = 'kanban',
  onViewChange,
  onFilter,
  onSort,
  sortCount = 0,
}: DashboardHeaderProps) {
  const [selectedView, setSelectedView] = useState(viewType);

  const handleViewChange = (view: 'kanban' | 'list' | 'split') => {
    setSelectedView(view);
    onViewChange?.(view);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        
        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => handleViewChange('kanban')}
            className={cn(
              "p-2 rounded transition-colors",
              selectedView === 'kanban'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleViewChange('list')}
            className={cn(
              "p-2 rounded transition-colors",
              selectedView === 'list'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleViewChange('split')}
            className={cn(
              "p-2 rounded transition-colors",
              selectedView === 'split'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Columns className="h-4 w-4" />
          </button>
        </div>

        {/* Filter Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onFilter}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>

        {/* Sort Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onSort}
          className="gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          Sort
          {sortCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded">
              {sortCount}
            </span>
          )}
        </Button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* View Settings */}
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          View settings
        </Button>

        {/* Import/Export */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              Import export
              <Plus className="h-4 w-4 rotate-45" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Upload className="h-4 w-4 mr-2" />
              Import data
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Export to Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatars */}
        <div className="flex -space-x-2 ml-4">
          {users.slice(0, 4).map((user, index) => (
            <Avatar
              key={user.id}
              className={cn(
                "h-8 w-8 border-2 border-background",
                "hover:z-10 transition-transform hover:scale-110"
              )}
              style={{ zIndex: users.length - index }}
            >
              <AvatarImage src={user.avatar || undefined} alt={user.name} />
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          ))}
          {users.length > 4 && (
            <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
              <span className="text-xs text-muted-foreground font-medium">
                {users.length - 4}
              </span>
            </div>
          )}
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full ml-2"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}