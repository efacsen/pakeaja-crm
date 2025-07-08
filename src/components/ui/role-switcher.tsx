'use client';

import { useAuth } from '@/contexts/auth-context';
import { UserRole } from '@/types/auth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield } from 'lucide-react';

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  sales: 'Sales Representative',
  manager: 'Sales Manager',
  estimator: 'Estimator',
  project_manager: 'Project Manager',
  foreman: 'Foreman',
  client: 'Customer',
};

export function RoleSwitcher() {
  const { user } = useAuth();
  
  if (!user || process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleRoleChange = (role: UserRole) => {
    // Update the demo user role in localStorage
    const updatedUser = { ...user, role };
    localStorage.setItem('demo_user', JSON.stringify(updatedUser));
    // Reload the page to apply the new role
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800">
      <Shield className="h-4 w-4 text-yellow-600" />
      <span className="text-sm text-yellow-700 dark:text-yellow-400">Demo Mode:</span>
      <Select value={user.role} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-[200px] h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(ROLE_LABELS).map(([role, label]) => (
            <SelectItem key={role} value={role}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}