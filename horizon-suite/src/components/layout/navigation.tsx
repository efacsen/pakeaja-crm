'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Target, 
  MapPin, 
  Users, 
  Building2,
  Settings,
  Shield,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
  children?: NavItem[];
}

export function Navigation() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Sales Pipeline',
      href: '/dashboard/sales',
      icon: Target,
    },
    {
      title: 'Canvassing',
      href: '/dashboard/canvassing',
      icon: MapPin,
    },
    {
      title: 'Customers',
      href: '/dashboard/customers',
      icon: Building2,
    },
    {
      title: 'Admin',
      href: '/admin',
      icon: Shield,
      roles: ['superadmin', 'admin', 'manager'],
      children: [
        {
          title: 'Dashboard',
          href: '/admin',
          icon: LayoutDashboard,
        },
        {
          title: 'Users',
          href: '/admin/users',
          icon: Users,
          roles: ['superadmin', 'admin'],
        },
        {
          title: 'Companies',
          href: '/admin/companies',
          icon: Building2,
        },
        {
          title: 'Materials',
          href: '/admin/materials',
          icon: Building2,
        },
        {
          title: 'Audit Logs',
          href: '/admin/audit',
          icon: Shield,
        },
      ],
    },
  ];

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const hasAccess = (item: NavItem) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role || '');
  };

  const renderNavItem = (item: NavItem, isChild = false) => {
    if (!hasAccess(item)) return null;

    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
    const isExpanded = expandedItems.includes(item.title);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.href} className={cn(isChild && "ml-4")}>
        {hasChildren ? (
          <div>
            <button
              onClick={() => toggleExpanded(item.title)}
              className={cn(
                "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <div className="flex items-center">
                <item.icon className="mr-3 h-4 w-4" />
                {item.title}
              </div>
              <ChevronDown 
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded && "rotate-180"
                )}
              />
            </button>
            {isExpanded && (
              <div className="mt-1 space-y-1">
                {item.children.map(child => renderNavItem(child, true))}
              </div>
            )}
          </div>
        ) : (
          <Link
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.title}
          </Link>
        )}
      </div>
    );
  };

  return (
    <nav className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">PakeAja CRM</h1>
      </div>
      
      <div className="flex-1 px-4 py-6 space-y-2">
        {navItems.map(item => renderNavItem(item))}
      </div>

      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-3">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.role}</p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings/profile">
                <Settings className="mr-2 h-4 w-4" />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}