export type UserRole = 'admin' | 'sales_rep' | 'sales_manager' | 'estimator' | 'project_manager' | 'foreman' | 'customer';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  company?: string;
  department?: string;
  permissions?: string[];
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Permission definitions
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

// Role-based permission mappings
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
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

// Helper function to check permissions
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true; // Admin has all permissions
  
  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  return rolePermissions.includes(permission);
}

// Helper function to check multiple permissions (AND)
export function hasAllPermissions(user: User | null, permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(user, permission));
}

// Helper function to check multiple permissions (OR)
export function hasAnyPermission(user: User | null, permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(user, permission));
}