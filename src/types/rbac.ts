export type UserRole = 'admin' | 'manager' | 'sales' | 'estimator' | 'project_manager' | 'foreman' | 'inspector' | 'client';

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'export';

export type ResourceType = 
  | 'users' 
  | 'contacts' 
  | 'leads' 
  | 'opportunities' 
  | 'quotes' 
  | 'projects'
  | 'materials' 
  | 'calculations' 
  | 'reports' 
  | 'documents' 
  | 'settings';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Territory {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  description?: string;
  boundaries?: any; // GeoJSON or structured location data
  parent_territory_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  team_lead_id?: string;
  parent_team_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  organization_id: string;
  role: UserRole;
  resource: ResourceType;
  action: PermissionAction;
  conditions?: Record<string, any>;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  organization_id?: string;
  role: UserRole;
  is_active: boolean;
  phone?: string;
  department?: string;
  position?: string;
  employee_id?: string;
  joined_at: string;
  reports_to?: string;
  permissions?: Record<string, any>;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserTerritory {
  user_id: string;
  territory_id: string;
  assigned_at: string;
  assigned_by?: string;
  is_primary: boolean;
}

export interface TeamMember {
  team_id: string;
  user_id: string;
  joined_at: string;
  role?: string;
}

export interface AuditLog {
  id: string;
  organization_id: string;
  user_id: string;
  action: string;
  resource_type?: ResourceType;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface PermissionCheck {
  hasPermission: boolean;
  conditions?: Record<string, any>;
  reason?: string;
}

export interface RoleHierarchy {
  [key: string]: UserRole[];
}

export const ROLE_HIERARCHY: RoleHierarchy = {
  admin: ['manager', 'sales', 'estimator', 'project_manager', 'foreman', 'inspector', 'client'],
  manager: ['sales', 'estimator', 'project_manager'],
  project_manager: ['foreman', 'inspector'],
  sales: [],
  estimator: [],
  foreman: [],
  inspector: [],
  client: []
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  manager: 'Manager',
  sales: 'Sales Representative',
  estimator: 'Estimator',
  project_manager: 'Project Manager',
  foreman: 'Foreman',
  inspector: 'Quality Inspector',
  client: 'Client'
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin: 'Full system access and configuration',
  manager: 'Team management and oversight',
  sales: 'Lead and opportunity management',
  estimator: 'Coating calculations and quotes',
  project_manager: 'Project execution and monitoring',
  foreman: 'Field operations and reporting',
  inspector: 'Quality control and certification',
  client: 'View own projects and documents'
};

export const RESOURCE_LABELS: Record<ResourceType, string> = {
  users: 'Users',
  contacts: 'Contacts',
  leads: 'Leads',
  opportunities: 'Opportunities',
  quotes: 'Quotes',
  projects: 'Projects',
  materials: 'Materials',
  calculations: 'Calculations',
  reports: 'Reports',
  documents: 'Documents',
  settings: 'Settings'
};

export const ACTION_LABELS: Record<PermissionAction, string> = {
  create: 'Create',
  read: 'View',
  update: 'Edit',
  delete: 'Delete',
  approve: 'Approve',
  export: 'Export'
};