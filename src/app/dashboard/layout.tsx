'use client';

// Force dynamic rendering for all dashboard pages
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Calculator, 
  Users, 
  FileText,
  Briefcase,
  TrendingUp,
  Settings,
  LogOut,
  MapPin,
  Package,
  Shield,
  UserCog,
  UserCircle,
  ChevronRight,
  Building,
  ClipboardCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ResourceType, PermissionAction, ROLE_LABELS } from '@/types/rbac';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  resource?: ResourceType;
  action?: PermissionAction;
  roles?: string[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { 
    name: 'Leads', 
    href: '/dashboard/leads', 
    icon: TrendingUp, 
    resource: 'leads', 
    action: 'read' 
  },
  { 
    name: 'Contacts', 
    href: '/dashboard/contacts', 
    icon: Users, 
    resource: 'contacts', 
    action: 'read' 
  },
  { 
    name: 'Opportunities', 
    href: '/dashboard/opportunities', 
    icon: MapPin, 
    resource: 'opportunities', 
    action: 'read' 
  },
  { 
    name: 'Quotes', 
    href: '/dashboard/quotes', 
    icon: FileText, 
    resource: 'quotes', 
    action: 'read' 
  },
  { 
    name: 'Calculator', 
    href: '/dashboard/calculator', 
    icon: Calculator, 
    resource: 'calculations', 
    action: 'create' 
  },
  { 
    name: 'Materials', 
    href: '/dashboard/materials', 
    icon: Package, 
    resource: 'materials', 
    action: 'read' 
  },
  { 
    name: 'Projects', 
    href: '/dashboard/projects', 
    icon: Briefcase, 
    resource: 'projects', 
    action: 'read' 
  },
  { 
    name: 'Reports', 
    href: '/dashboard/reports', 
    icon: ClipboardCheck, 
    resource: 'reports', 
    action: 'read' 
  },
];

const adminNavigation: NavItem[] = [
  { 
    name: 'User Management', 
    href: '/dashboard/users', 
    icon: UserCog, 
    roles: ['admin', 'manager'] 
  },
  { 
    name: 'Organization', 
    href: '/dashboard/organization', 
    icon: Building, 
    roles: ['admin'] 
  },
  { 
    name: 'Settings', 
    href: '/dashboard/settings', 
    icon: Settings, 
    resource: 'settings', 
    action: 'read' 
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, signOut, checkPermission, hasRole } = useAuth();
  const [visibleNavItems, setVisibleNavItems] = useState<NavItem[]>([]);
  const [visibleAdminItems, setVisibleAdminItems] = useState<NavItem[]>([]);

  useEffect(() => {
    const filterNavItems = async () => {
      if (!user) return;

      // Filter main navigation items
      const mainItems = await Promise.all(
        navigation.map(async (item) => {
          if (item.resource && item.action) {
            const permission = await checkPermission(item.resource, item.action);
            return permission.hasPermission ? item : null;
          }
          return item;
        })
      );
      setVisibleNavItems(mainItems.filter(Boolean) as NavItem[]);

      // Filter admin navigation items
      const adminItems = await Promise.all(
        adminNavigation.map(async (item) => {
          if (item.roles) {
            return hasRole(item.roles as any) ? item : null;
          }
          if (item.resource && item.action) {
            const permission = await checkPermission(item.resource, item.action);
            return permission.hasPermission ? item : null;
          }
          return item;
        })
      );
      setVisibleAdminItems(adminItems.filter(Boolean) as NavItem[]);
    };

    filterNavItems();
  }, [user, checkPermission, hasRole]);

  if (!user) return null;

  const initials = user.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || user.email[0].toUpperCase();

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r flex flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b">
            <h2 className="text-xl font-bold">PakeAja CRM</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {/* Main Navigation */}
            <div className="space-y-1">
              {visibleNavItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            
            {/* Admin Section */}
            {visibleAdminItems.length > 0 && (
              <>
                <div className="pt-4">
                  <div className="px-3 pb-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Shield className="h-3 w-3" />
                      Administration
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {visibleAdminItems.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                      
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </nav>

          {/* User menu */}
          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 h-auto p-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url} alt={user.full_name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium">{user.full_name || 'User'}</span>
                    <span className="text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto bg-background">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}