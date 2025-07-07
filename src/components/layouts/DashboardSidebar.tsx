'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search,
  Activity,
  CheckSquare,
  StickyNote,
  Users,
  Building2,
  ChevronDown,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Menu,
  X,
  Calculator,
  FileText,
  TrendingUp,
  Package,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth-context';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  roles?: string[];
}

interface Collection {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

const getNavigationItems = (role?: string): SidebarItem[] => {
  const items: SidebarItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: Activity },
  ];

  // Sales-specific navigation
  if (role === 'sales_rep' || role === 'sales_manager' || role === 'admin') {
    items.push(
      { name: 'Sales Pipeline', href: '/dashboard/sales', icon: TrendingUp },
      { name: 'Quotes', href: '/dashboard/quotes', icon: FileText },
      { name: 'Customers', href: '/dashboard/customers', icon: Building2 }
    );
  }

  // Calculator for all roles
  items.push(
    { name: 'Calculator', href: '/dashboard/calculator', icon: Calculator }
  );

  // Project management items
  if (role === 'project_manager' || role === 'admin' || role === 'foreman' || role === 'customer') {
    items.push(
      { name: 'Projects', href: '/dashboard/projects', icon: Package }
    );
  }

  // Admin-only items
  if (role === 'admin') {
    items.push(
      { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
      { name: 'Users', href: '/dashboard/users', icon: Users }
    );
  }

  return items;
};

const pinnedViews = [
  { id: '1', name: 'Sales Pipeline', type: 'kanban' },
  { id: '2', name: 'Active Projects', type: 'list' },
];

const collections: Collection[] = [
  { id: '1', name: 'Leads', icon: '🎯', color: 'blue' },
  { id: '2', name: 'Projects', icon: '🏗️', color: 'green' },
  { id: '3', name: 'Canvassing', icon: '📍', color: 'orange' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Get navigation items based on user role
  const navigation = getNavigationItems(user?.role);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-background border border-border"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen w-[240px] border-r border-border bg-sidebar-bg",
        "flex flex-col transition-transform duration-200",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Workspace Selector */}
        <div className="p-3 border-b border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between px-3 h-9 font-medium"
              >
                <span className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded bg-gradient-to-br from-blue-500 to-purple-600" />
                  PakeAja CRM
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[220px]" align="start">
              <DropdownMenuItem>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-gradient-to-br from-blue-500 to-purple-600" />
                  PakeAja CRM
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Plus className="h-4 w-4 mr-2" />
                Create workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 bg-background"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pb-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </span>
                {item.badge && (
                  <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-medium text-primary">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* More Menu */}
          <Collapsible open={isMoreOpen} onOpenChange={setIsMoreOpen}>
            <CollapsibleTrigger asChild>
              <button className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
                <span className="flex items-center gap-3">
                  <MoreHorizontal className="h-4 w-4" />
                  More
                </span>
                <ChevronRight className={cn(
                  "h-4 w-4 transition-transform",
                  isMoreOpen && "rotate-90"
                )} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-7 space-y-1 mt-1">
              <Link
                href="/dashboard/reports"
                className="block px-3 py-2 text-sm text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Reports
              </Link>
              <Link
                href="/dashboard/settings"
                className="block px-3 py-2 text-sm text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Settings
              </Link>
            </CollapsibleContent>
          </Collapsible>

          {/* Pinned Views */}
          <div className="pt-4">
            <div className="px-3 mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Pinned Views
              </h3>
            </div>
            {pinnedViews.map((view) => (
              <Link
                key={view.id}
                href={`/dashboard/views/${view.id}`}
                className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <div className="h-4 w-4 rounded bg-green-500/20 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
                {view.name}
              </Link>
            ))}
          </div>

          {/* Collections */}
          <div className="pt-4">
            <Collapsible open={isCollectionsOpen} onOpenChange={setIsCollectionsOpen}>
              <div className="flex items-center justify-between px-3 mb-2">
                <CollapsibleTrigger asChild>
                  <button className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground">
                    <ChevronRight className={cn(
                      "h-3 w-3 transition-transform",
                      isCollectionsOpen && "rotate-90"
                    )} />
                    Collections
                  </button>
                </CollapsibleTrigger>
                <button className="opacity-0 group-hover:opacity-100 hover:bg-accent p-0.5 rounded transition-all">
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <CollapsibleContent>
                {collections.map((collection) => (
                  <Link
                    key={collection.id}
                    href={`/dashboard/collections/${collection.id}`}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <span className="text-base">{collection.icon}</span>
                    {collection.name}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </nav>

        {/* Trial Indicator */}
        <div className="p-3 border-t border-border">
          <div className="px-3 py-2 bg-primary/10 rounded-lg">
            <p className="text-xs font-medium text-primary">14 days left on trial</p>
            <button className="text-xs text-primary hover:underline mt-1">
              Add billing
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}