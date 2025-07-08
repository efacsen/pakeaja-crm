// Compatibility layer for transitioning from old auth types to new RBAC system
import { UserProfile, UserRole as NewUserRole } from './rbac';

// Map old roles to new roles
export const roleMapping: Record<string, NewUserRole> = {
  'superadmin': 'admin',
  'admin': 'admin',
  'sales_rep': 'sales',
  'sales_manager': 'manager',
  'estimator': 'estimator',
  'project_manager': 'project_manager',
  'foreman': 'foreman',
  'customer': 'client',
};

// Legacy User interface for backward compatibility
export interface User {
  id: string;
  email: string;
  name?: string;
  role: string; // Keep as string for now
  company?: string;
  department?: string;
  permissions?: string[];
}

// Convert UserProfile to legacy User format
export function profileToLegacyUser(profile: UserProfile): User {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.full_name,
    role: profile.role,
    company: 'PT Pake Aja Teknologi',
    department: profile.department,
    permissions: [], // Will be populated from new permission system
  };
}

// Legacy permission mappings to new resource/action pairs
export const legacyPermissionMapping: Record<string, { resource: string; action: string }> = {
  // Projects
  'view_all_projects': { resource: 'projects', action: 'read' },
  'view_own_projects': { resource: 'projects', action: 'read' },
  'create_project': { resource: 'projects', action: 'create' },
  'edit_project': { resource: 'projects', action: 'update' },
  'delete_project': { resource: 'projects', action: 'delete' },
  
  // Financial
  'view_costs': { resource: 'materials', action: 'read' },
  'view_budgets': { resource: 'projects', action: 'read' },
  'edit_budgets': { resource: 'projects', action: 'update' },
  
  // Sales
  'view_all_leads': { resource: 'leads', action: 'read' },
  'view_own_leads': { resource: 'leads', action: 'read' },
  'create_lead': { resource: 'leads', action: 'create' },
  'edit_lead': { resource: 'leads', action: 'update' },
  
  // Quotes
  'create_quote': { resource: 'quotes', action: 'create' },
  'approve_quote': { resource: 'quotes', action: 'approve' },
  
  // Reports
  'view_reports': { resource: 'reports', action: 'read' },
  'create_reports': { resource: 'reports', action: 'create' },
  
  // Team
  'view_team': { resource: 'users', action: 'read' },
  'manage_team': { resource: 'users', action: 'update' },
};

// Re-export legacy types
export type UserRole = 'superadmin' | 'admin' | 'sales_rep' | 'sales_manager' | 'estimator' | 'project_manager' | 'foreman' | 'customer';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Legacy PERMISSIONS object
export const PERMISSIONS = {
  // Projects
  VIEW_ALL_PROJECTS: 'view_all_projects',
  VIEW_OWN_PROJECTS: 'view_own_projects',
  CREATE_PROJECT: 'create_project',
  EDIT_PROJECT: 'edit_project',
  DELETE_PROJECT: 'delete_project',
  
  // Financial
  VIEW_COSTS: 'view_costs',
  VIEW_BUDGETS: 'view_budgets',
  EDIT_BUDGETS: 'edit_budgets',
  
  // Sales
  VIEW_ALL_LEADS: 'view_all_leads',
  VIEW_OWN_LEADS: 'view_own_leads',
  CREATE_LEAD: 'create_lead',
  EDIT_LEAD: 'edit_lead',
  
  // Quotes
  CREATE_QUOTE: 'create_quote',
  APPROVE_QUOTE: 'approve_quote',
  
  // Reports
  VIEW_REPORTS: 'view_reports',
  CREATE_REPORTS: 'create_reports',
  
  // Team
  VIEW_TEAM: 'view_team',
  MANAGE_TEAM: 'manage_team',
} as const;

// Legacy role permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  superadmin: Object.values(PERMISSIONS),
  admin: Object.values(PERMISSIONS),
  
  sales_rep: [
    PERMISSIONS.VIEW_OWN_PROJECTS,
    PERMISSIONS.VIEW_OWN_LEADS,
    PERMISSIONS.CREATE_LEAD,
    PERMISSIONS.EDIT_LEAD,
    PERMISSIONS.CREATE_QUOTE,
    PERMISSIONS.VIEW_REPORTS,
  ],
  
  sales_manager: [
    PERMISSIONS.VIEW_ALL_PROJECTS,
    PERMISSIONS.VIEW_ALL_LEADS,
    PERMISSIONS.CREATE_LEAD,
    PERMISSIONS.EDIT_LEAD,
    PERMISSIONS.CREATE_QUOTE,
    PERMISSIONS.APPROVE_QUOTE,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.CREATE_REPORTS,
    PERMISSIONS.VIEW_TEAM,
  ],
  
  estimator: [
    PERMISSIONS.VIEW_ALL_PROJECTS,
    PERMISSIONS.CREATE_QUOTE,
    PERMISSIONS.VIEW_COSTS,
    PERMISSIONS.VIEW_BUDGETS,
    PERMISSIONS.VIEW_REPORTS,
  ],
  
  project_manager: [
    PERMISSIONS.VIEW_ALL_PROJECTS,
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.VIEW_COSTS,
    PERMISSIONS.VIEW_BUDGETS,
    PERMISSIONS.EDIT_BUDGETS,
    PERMISSIONS.VIEW_TEAM,
    PERMISSIONS.MANAGE_TEAM,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.CREATE_REPORTS,
  ],
  
  foreman: [
    PERMISSIONS.VIEW_OWN_PROJECTS,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.VIEW_TEAM,
    PERMISSIONS.CREATE_REPORTS,
  ],
  
  customer: [
    PERMISSIONS.VIEW_OWN_PROJECTS,
  ],
};

// Legacy helper functions
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false;
  if (user.role === 'superadmin' || user.role === 'admin') return true;
  
  const rolePermissions = ROLE_PERMISSIONS[user.role as UserRole] || [];
  return rolePermissions.includes(permission);
}

export function hasAllPermissions(user: User | null, permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(user, permission));
}

export function hasAnyPermission(user: User | null, permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(user, permission));
}