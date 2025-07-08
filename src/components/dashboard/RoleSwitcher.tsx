'use client';

import { useState } from 'react';
import { UserRole } from '@/types/dashboard';
import { 
  Shield, 
  Users, 
  User, 
  Briefcase, 
  Eye,
  ChevronDown 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface RoleSwitcherProps {
  currentRole: UserRole;
  viewingAs?: {
    userId: string;
    userName: string;
    userRole: UserRole;
  };
  onRoleSwitch: (role: UserRole, userId?: string) => void;
}

const roleIcons: Record<UserRole, React.ComponentType<{ className?: string }>> = {
  admin: Shield,
  admin: Shield,
  manager: Users,
  sales: User,
  project_manager: Briefcase,
  viewer: Eye,
};

const roleLabels: Record<UserRole, string> = {
  admin: 'Super Admin',
  admin: 'Admin',
  manager: 'Sales Manager',
  sales: 'Sales Representative',
  project_manager: 'Project Manager',
  viewer: 'Viewer',
};

// Mock users for demonstration
const mockUsers = [
  { id: '1', name: 'Ahmad Wijaya', role: 'sales' as UserRole, team: 'Team Jakarta' },
  { id: '2', name: 'Siti Nurhasanah', role: 'sales' as UserRole, team: 'Team Jakarta' },
  { id: '3', name: 'Budi Santoso', role: 'manager' as UserRole, team: 'Team Jakarta' },
  { id: '4', name: 'Dewi Lestari', role: 'sales' as UserRole, team: 'Team Surabaya' },
  { id: '5', name: 'Rudi Hermawan', role: 'project_manager' as UserRole, team: 'Operations' },
];

export function RoleSwitcher({ currentRole, viewingAs, onRoleSwitch }: RoleSwitcherProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | 'specific'>('specific');

  if (currentRole !== 'admin') {
    return null;
  }

  const handleRoleChange = (value: string) => {
    if (value === 'specific') {
      setSelectedRole('specific');
    } else {
      setSelectedRole(value as UserRole);
      onRoleSwitch(value as UserRole);
    }
  };

  const handleUserSelect = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      onRoleSwitch(user.role, userId);
    }
  };

  const clearViewAs = () => {
    onRoleSwitch('admin');
  };

  const Icon = viewingAs ? roleIcons[viewingAs.userRole] : Shield;

  return (
    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium">Viewing as:</span>
      </div>

      {viewingAs ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {viewingAs.userName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{viewingAs.userName}</p>
              <p className="text-xs text-muted-foreground">{roleLabels[viewingAs.userRole]}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={clearViewAs}
          >
            Exit View
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Select value={selectedRole} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select view type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="specific">Specific User</SelectItem>
              <SelectItem value="manager">Sales Manager View</SelectItem>
              <SelectItem value="sales">Sales Rep View</SelectItem>
              <SelectItem value="project_manager">Project Manager View</SelectItem>
              <SelectItem value="viewer">Viewer View</SelectItem>
            </SelectContent>
          </Select>

          {selectedRole === 'specific' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Select User
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[250px]">
                <DropdownMenuLabel>Select a user to view as</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {mockUsers.map((user) => (
                  <DropdownMenuItem
                    key={user.id}
                    onClick={() => handleUserSelect(user.id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.team}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {roleLabels[user.role]}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      <div className="ml-auto">
        <Badge variant="outline">
          {viewingAs ? `${roleLabels[viewingAs.userRole]} Perspective` : 'Super Admin View'}
        </Badge>
      </div>
    </div>
  );
}