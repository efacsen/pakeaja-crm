// Types for project detail page with Command Center layout

export type UserRole = 'client' | 'internal' | 'admin';
export type ViewMode = 'internal' | 'client';

// Tab types with role-based visibility
export type ProjectTab = 
  | 'overview' 
  | 'timeline' 
  | 'tasks' 
  | 'team' 
  | 'documents' 
  | 'reports' 
  | 'quality'
  | 'budget' 
  | 'materials' 
  | 'safety' 
  | 'permits' 
  | 'notes'
  | 'photos'     // Customer-specific
  | 'warranty';  // Customer-specific

// Activity feed types
export interface ActivityItem {
  id: string;
  timestamp: Date;
  type: 'cost_alert' | 'team_update' | 'qc_result' | 'payment' | 'weather' | 'progress' | 'material' | 'milestone' | 'document';
  title: string;
  description: string;
  visibility: 'internal' | 'all';
  severity?: 'info' | 'warning' | 'error' | 'success';
  metadata?: Record<string, any>;
  user?: {
    name: string;
    role: string;
  };
}

// Tab visibility configuration
export const TAB_VISIBILITY: Record<ProjectTab, ViewMode[]> = {
  overview: ['internal', 'client'],
  timeline: ['internal', 'client'],
  tasks: ['internal'],
  team: ['internal'],
  documents: ['internal', 'client'],
  reports: ['internal'],
  quality: ['internal'],
  budget: ['internal'],
  materials: ['internal'],
  safety: ['internal'],
  permits: ['internal'],
  notes: ['internal'],
  photos: ['client'],
  warranty: ['client']
};

// Tab configuration
export interface TabConfig {
  id: ProjectTab;
  label: string;
  icon?: string;
  order: number;
}

export const PROJECT_TABS: TabConfig[] = [
  { id: 'overview', label: 'Overview', order: 1 },
  { id: 'timeline', label: 'Timeline', order: 2 },
  { id: 'tasks', label: 'Tasks', order: 3 },
  { id: 'team', label: 'Team', order: 4 },
  { id: 'documents', label: 'Documents', order: 5 },
  { id: 'reports', label: 'Reports', order: 6 },
  { id: 'quality', label: 'Quality', order: 7 },
  { id: 'budget', label: 'Budget', order: 8 },
  { id: 'materials', label: 'Materials', order: 9 },
  { id: 'safety', label: 'Safety', order: 10 },
  { id: 'permits', label: 'Permits', order: 11 },
  { id: 'notes', label: 'Internal Notes', order: 12 },
  { id: 'photos', label: 'Photos', order: 5 },
  { id: 'warranty', label: 'Warranty Info', order: 6 }
];

// Metric card configuration for project header
export interface MetricCard {
  id: string;
  label: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  visibility: ViewMode[];
  color?: 'default' | 'success' | 'warning' | 'error';
}

// Quick action configuration
export interface QuickAction {
  id: string;
  label: string;
  icon?: string;
  action: () => void;
  visibility: ViewMode[];
}

// Project view context
export interface ProjectViewContext {
  viewMode: ViewMode;
  userRole: UserRole;
  canEdit: boolean;
  projectId: string;
}