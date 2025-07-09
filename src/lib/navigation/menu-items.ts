import { 
  Activity,
  Users,
  TrendingUp,
  FileText,
  Calculator,
  BarChart3,
  Settings,
  UserCog,
  Building2
} from 'lucide-react';
import { UserRole } from '@/types/dashboard';

export interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  roles: UserRole[]; // Which roles can see this item
}

// Define which roles can access each menu item
export const menuItems: MenuItem[] = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: Activity,
    roles: ['admin', 'manager', 'sales', 'estimator', 'project_manager', 'foreman', 'inspector', 'client']
  },
  { 
    name: 'Leads', 
    href: '/dashboard/leads', 
    icon: TrendingUp,
    badge: 'New',
    roles: ['admin', 'manager', 'sales']
  },
  { 
    name: 'Customers', 
    href: '/dashboard/customers', 
    icon: Users,
    roles: ['admin', 'manager', 'sales', 'estimator']
  },
  { 
    name: 'Daily Report', 
    href: '/dashboard/daily-report', 
    icon: FileText,
    badge: '!',
    roles: ['admin', 'manager', 'sales', 'project_manager', 'foreman']
  },
  { 
    name: 'Calculator', 
    href: '/dashboard/calculator', 
    icon: Calculator,
    roles: ['admin', 'manager', 'sales', 'estimator']
  },
  { 
    name: 'Reports', 
    href: '/dashboard/reports', 
    icon: BarChart3,
    roles: ['admin', 'manager', 'project_manager']
  },
  {
    name: 'User Management',
    href: '/dashboard/users',
    icon: UserCog,
    roles: ['admin'] // Only admin can see this
  },
  {
    name: 'Organization',
    href: '/dashboard/organization',
    icon: Building2,
    roles: ['admin', 'manager']
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['admin']
  }
];

// Function to filter menu items based on user role
export function getMenuItemsForRole(userRole: UserRole): MenuItem[] {
  return menuItems.filter(item => item.roles.includes(userRole));
}

// Get all accessible routes for a role (used in middleware)
export function getAccessibleRoutesForRole(userRole: UserRole): string[] {
  const items = getMenuItemsForRole(userRole);
  const routes = items.map(item => item.href);
  
  // Add common routes that all authenticated users can access
  routes.push('/dashboard/profile');
  routes.push('/logout');
  
  return routes;
}