'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Package 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleSelector } from '@/components/features/auth/RoleSelector';
import { PERMISSIONS } from '@/types/auth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, permission: null },
  { name: 'Pipeline Sales', href: '/dashboard/sales', icon: TrendingUp, permission: PERMISSIONS.VIEW_ALL_LEADS },
  { name: 'Canvassing', href: '/dashboard/canvassing', icon: MapPin, permission: PERMISSIONS.CREATE_QUOTE },
  { name: 'Materials', href: '/dashboard/materials', icon: Package, permission: PERMISSIONS.VIEW_COSTS },
  { name: 'Kalkulator Coating', href: '/dashboard/calculator', icon: Calculator, permission: PERMISSIONS.CREATE_QUOTE },
  { name: 'Pelanggan', href: '/dashboard/customers', icon: Users, permission: null },
  { name: 'Penawaran', href: '/dashboard/quotes', icon: FileText, permission: PERMISSIONS.CREATE_QUOTE },
  { name: 'Proyek', href: '/dashboard/projects', icon: Briefcase, permission: PERMISSIONS.VIEW_ALL_PROJECTS },
  { name: 'Laporan', href: '/dashboard/reports', icon: TrendingUp, permission: PERMISSIONS.VIEW_REPORTS },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, permission: null },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, signOut, hasPermission } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b">
            <h2 className="text-xl font-bold">PakeAja CRM</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const hasAccess = !item.permission || hasPermission(item.permission);
              
              if (!hasAccess) return null;
              
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
          </nav>

          {/* User menu */}
          <div className="border-t p-4 space-y-3">
            {user && (
              <>
                <div className="px-3 text-sm">
                  <div className="font-medium">{user.name || user.email}</div>
                  <div className="text-muted-foreground text-xs">{user.email}</div>
                </div>
                {/* Role Selector for Demo - only for superadmin */}
                {user.role === 'superadmin' && (
                  <div className="px-3">
                    <RoleSelector />
                  </div>
                )}
              </>
            )}
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>
          </div>
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