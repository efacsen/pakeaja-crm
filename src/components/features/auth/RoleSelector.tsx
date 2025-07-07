'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { UserRole } from '@/types/auth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Briefcase, HardHat, Calculator, Users } from 'lucide-react';

const roleConfig: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
  admin: { label: 'Admin', icon: <Shield className="h-4 w-4" />, color: 'bg-red-500' },
  sales_rep: { label: 'Sales Rep', icon: <Briefcase className="h-4 w-4" />, color: 'bg-blue-500' },
  sales_manager: { label: 'Sales Manager', icon: <Briefcase className="h-4 w-4" />, color: 'bg-indigo-500' },
  estimator: { label: 'Estimator', icon: <Calculator className="h-4 w-4" />, color: 'bg-green-500' },
  project_manager: { label: 'Project Manager', icon: <User className="h-4 w-4" />, color: 'bg-purple-500' },
  foreman: { label: 'Foreman', icon: <HardHat className="h-4 w-4" />, color: 'bg-orange-500' },
  customer: { label: 'Customer', icon: <Users className="h-4 w-4" />, color: 'bg-gray-500' },
};

export function RoleSelector() {
  const { user } = useAuth();
  const [isChanging, setIsChanging] = useState(false);

  if (!user) return null;

  const handleRoleChange = (newRole: UserRole) => {
    setIsChanging(true);
    // Update user role in local storage for demo
    const storedUser = { ...user, role: newRole };
    localStorage.setItem('demo_user', JSON.stringify(storedUser));
    
    // Reload page to apply new role
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const currentRoleConfig = roleConfig[user.role];

  return (
    <div className="flex items-center gap-2">
      <Badge className={`${currentRoleConfig.color} text-white`}>
        <span className="flex items-center gap-1">
          {currentRoleConfig.icon}
          {currentRoleConfig.label}
        </span>
      </Badge>
      
      <Select
        value={user.role}
        onValueChange={(value) => handleRoleChange(value as UserRole)}
        disabled={isChanging}
      >
        <SelectTrigger className="w-40 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(roleConfig).map(([role, config]) => (
            <SelectItem key={role} value={role}>
              <div className="flex items-center gap-2">
                {config.icon}
                <span>{config.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}