import { Quote } from './quotes';
import { Customer } from './customers';

export interface Project {
  id: string;
  project_number: string;
  name: string;
  description?: string;
  
  // Client Information
  customer_id: string;
  customer?: Customer;
  customer_name?: string; // Cached for display
  
  // Quote Reference
  quote_id: string;
  quote?: Quote;
  
  // Project Details
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Timeline
  start_date: string;
  end_date: string;
  estimated_duration: number; // days
  actual_start_date?: string;
  actual_end_date?: string;
  
  // Financial
  budget: number;
  actual_cost?: number;
  profit_margin: number;
  total_value?: number; // Cached from quote
  
  // Location
  site_address: string;
  site_contact?: string;
  site_phone?: string;
  
  // Progress
  progress_percentage: number;
  current_phase: string;
  
  // Team Assignment
  project_manager?: string;
  assigned_crew?: string[];
  
  // Materials & Resources
  materials_ordered: boolean;
  materials_delivered: boolean;
  equipment_scheduled: boolean;
  
  // Quality & Safety
  permits_obtained: boolean;
  safety_briefing_completed: boolean;
  quality_checks_passed: number;
  
  // Communication
  last_client_update?: string;
  next_milestone?: string;
  notes?: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  phase_id?: string; // Link to project phase
  name: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  
  // Timeline
  start_date: string;
  end_date: string;
  estimated_hours: number;
  actual_hours?: number;
  
  // Assignment
  assigned_to?: string;
  assigned_team?: string;
  dependencies?: string[]; // task IDs this task depends on
  
  // Progress
  progress_percentage: number;
  
  // Resources
  materials_required?: string[];
  equipment_required?: string[];
  
  // Hierarchy
  parent_task_id?: string; // For sub-tasks
  order?: number; // Display order within phase
  
  created_at: string;
  updated_at: string;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  status: 'pending' | 'completed' | 'overdue';
  
  // Timeline
  due_date: string;
  completed_date?: string;
  
  // Dependencies
  required_tasks?: string[]; // task IDs that must be completed
  
  // Deliverables
  deliverables?: string[];
  client_approval_required: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface ProjectUpdate {
  id: string;
  project_id: string;
  type: 'progress' | 'issue' | 'milestone' | 'client_communication' | 'material_delivery' | 'quality_check';
  title: string;
  description: string;
  
  // Progress specific
  previous_progress?: number;
  new_progress?: number;
  
  // Issue specific
  severity?: 'low' | 'medium' | 'high' | 'critical';
  resolved?: boolean;
  resolution_notes?: string;
  
  // Attachments
  photos?: string[];
  documents?: string[];
  
  created_by: string;
  created_at: string;
}

export interface CreateProjectRequest {
  quote_id: string;
  name?: string;
  description?: string;
  start_date: string;
  end_date: string;
  project_manager?: string;
  assigned_crew?: string[];
  site_contact?: string;
  site_phone?: string;
  notes?: string;
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  status?: Project['status'];
  priority?: Project['priority'];
  progress_percentage?: number;
  current_phase?: string;
  materials_ordered?: boolean;
  materials_delivered?: boolean;
  equipment_scheduled?: boolean;
  permits_obtained?: boolean;
  safety_briefing_completed?: boolean;
  actual_cost?: number;
}

export interface ProjectFilters {
  status?: Project['status'];
  priority?: Project['priority'];
  project_manager?: string;
  customer_id?: string;
  start_date_from?: string;
  start_date_to?: string;
  search?: string;
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
}

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  overdue: number;
  by_status: Record<Project['status'], number>;
  by_priority: Record<Project['priority'], number>;
  total_revenue: number;
  average_profit_margin: number;
  upcoming_deadlines: Project[];
  recent_completions: Project[];
}

export interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  order: number;
  estimated_duration: number; // days
  tasks: string[]; // task names/descriptions
  required_materials: string[];
  required_equipment: string[];
  safety_requirements: string[];
  quality_checkpoints: string[];
}

export const DEFAULT_PROJECT_PHASES: ProjectPhase[] = [
  {
    id: 'site-preparation',
    name: 'Site Preparation',
    description: 'Initial site assessment and preparation',
    order: 1,
    estimated_duration: 2,
    tasks: [
      'Site inspection and assessment',
      'Surface condition evaluation',
      'Equipment and materials delivery',
      'Safety setup and barriers',
      'Client walkthrough'
    ],
    required_materials: ['Safety barriers', 'Drop cloths', 'Cleaning supplies'],
    required_equipment: ['Safety equipment', 'Inspection tools'],
    safety_requirements: ['PPE for all workers', 'Site safety briefing', 'Emergency procedures'],
    quality_checkpoints: ['Surface condition documentation', 'Site readiness checklist']
  },
  {
    id: 'surface-preparation',
    name: 'Surface Preparation',
    description: 'Cleaning, grinding, and prep work',
    order: 2,
    estimated_duration: 3,
    tasks: [
      'Surface cleaning and degreasing',
      'Grinding and profile creation',
      'Crack repair and patching',
      'Dust removal and final cleaning',
      'Moisture testing'
    ],
    required_materials: ['Cleaning chemicals', 'Grinding discs', 'Patching compound'],
    required_equipment: ['Grinders', 'Vacuum systems', 'Moisture meters'],
    safety_requirements: ['Dust control measures', 'Respiratory protection', 'Noise protection'],
    quality_checkpoints: ['Surface profile verification', 'Cleanliness inspection', 'Moisture levels']
  },
  {
    id: 'primer-application',
    name: 'Primer Application',
    description: 'Apply primer coating',
    order: 3,
    estimated_duration: 1,
    tasks: [
      'Primer mixing and preparation',
      'Environmental condition check',
      'Primer application',
      'Coverage verification',
      'Curing time monitoring'
    ],
    required_materials: ['Primer coating', 'Mixing supplies', 'Application tools'],
    required_equipment: ['Mixing equipment', 'Application tools', 'Environmental monitors'],
    safety_requirements: ['Ventilation requirements', 'Chemical handling protocols'],
    quality_checkpoints: ['Coverage uniformity', 'Film thickness measurement', 'Adhesion test']
  },
  {
    id: 'base-coat-application',
    name: 'Base Coat Application',
    description: 'Apply main coating system',
    order: 4,
    estimated_duration: 2,
    tasks: [
      'Base coat mixing and preparation',
      'Application technique setup',
      'Base coat application',
      'Decorative elements (if applicable)',
      'Curing and recoat timing'
    ],
    required_materials: ['Base coat materials', 'Decorative additives'],
    required_equipment: ['Application equipment', 'Timing devices'],
    safety_requirements: ['Chemical exposure protection', 'Slip prevention'],
    quality_checkpoints: ['Film thickness verification', 'Color consistency', 'Defect inspection']
  },
  {
    id: 'top-coat-application',
    name: 'Top Coat Application',
    description: 'Apply protective top coat',
    order: 5,
    estimated_duration: 1,
    tasks: [
      'Top coat preparation',
      'Final surface inspection',
      'Top coat application',
      'Final coverage check',
      'Initial cure monitoring'
    ],
    required_materials: ['Top coat materials', 'Final application supplies'],
    required_equipment: ['Precision application tools'],
    safety_requirements: ['Final safety protocols', 'Curing environment control'],
    quality_checkpoints: ['Final thickness measurement', 'Gloss level verification', 'Defect final check']
  },
  {
    id: 'final-inspection',
    name: 'Final Inspection & Cleanup',
    description: 'Quality control and project completion',
    order: 6,
    estimated_duration: 1,
    tasks: [
      'Comprehensive quality inspection',
      'Client walkthrough and approval',
      'Touch-up work (if needed)',
      'Site cleanup and restoration',
      'Documentation and handover'
    ],
    required_materials: ['Touch-up materials', 'Cleaning supplies'],
    required_equipment: ['Inspection tools', 'Cleanup equipment'],
    safety_requirements: ['Final safety inspection', 'Site restoration'],
    quality_checkpoints: ['Final quality assessment', 'Client satisfaction', 'Warranty documentation']
  }
];