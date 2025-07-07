import { 
  Project, 
  CreateProjectRequest, 
  UpdateProjectRequest, 
  ProjectFilters, 
  ProjectListResponse,
  ProjectStats,
  ProjectTask,
  ProjectMilestone,
  ProjectUpdate,
  DEFAULT_PROJECT_PHASES
} from '@/types/projects';
import { Quote } from '@/types/quotes';
import { quotesService } from './quotes-service';

export class ProjectsService {
  private storageKey = 'horizon-projects';
  private tasksStorageKey = 'horizon-project-tasks';
  private milestonesStorageKey = 'horizon-project-milestones';
  private updatesStorageKey = 'horizon-project-updates';

  // Generate unique project number
  private generateProjectNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const time = String(Date.now()).slice(-4);
    return `P${year}${month}${day}-${time}`;
  }

  // Create project from quote
  async createProjectFromQuote(data: CreateProjectRequest, userId: string = 'demo-user-123'): Promise<{ data: Project | null; error: string | null }> {
    try {
      // Get the quote
      const { data: quote, error: quoteError } = await quotesService.getQuote(data.quote_id);
      if (quoteError || !quote) {
        return { data: null, error: quoteError || 'Quote not found' };
      }

      // Calculate estimated duration based on total area
      const estimatedDuration = Math.max(7, Math.ceil(quote.total_area / 200)); // Min 7 days, +1 day per 200 sq ft

      const project: Project = {
        id: `project-${Date.now()}`,
        project_number: this.generateProjectNumber(),
        name: data.name || quote.project_name,
        description: data.description,
        
        // Client Information
        customer_id: `customer-${quote.client_name.replace(/\s+/g, '-').toLowerCase()}`,
        customer_name: quote.client_name,
        
        // Quote Reference
        quote_id: quote.id,
        quote,
        
        // Project Details
        status: 'planning',
        priority: 'medium',
        
        // Timeline
        start_date: data.start_date,
        end_date: data.end_date,
        estimated_duration: estimatedDuration,
        
        // Financial
        budget: quote.total_cost,
        total_value: quote.total_cost,
        profit_margin: 20, // Default 20% margin
        
        // Location
        site_address: quote.project_address,
        site_contact: data.site_contact,
        site_phone: data.site_phone,
        
        // Progress
        progress_percentage: 0,
        current_phase: 'Site Preparation',
        
        // Team Assignment
        project_manager: data.project_manager,
        assigned_crew: data.assigned_crew || [],
        
        // Materials & Resources
        materials_ordered: false,
        materials_delivered: false,
        equipment_scheduled: false,
        
        // Quality & Safety
        permits_obtained: false,
        safety_briefing_completed: false,
        quality_checks_passed: 0,
        
        // Communication
        notes: data.notes,
        
        // Metadata
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: userId,
      };

      const existingProjects = this.getStoredProjects();
      existingProjects.push(project);
      this.saveProjects(existingProjects);

      // Create default tasks based on phases
      await this.createDefaultTasks(project.id);

      // Update quote status to approved
      await quotesService.updateQuote(quote.id, { status: 'approved' });

      return { data: project, error: null };
    } catch (error) {
      console.error('Error creating project:', error);
      return { data: null, error: 'Failed to create project' };
    }
  }

  // Create default tasks for project phases
  private async createDefaultTasks(projectId: string): Promise<void> {
    const tasks: ProjectTask[] = [];
    const startDate = new Date();

    DEFAULT_PROJECT_PHASES.forEach((phase, phaseIndex) => {
      const phaseStartDate = new Date(startDate);
      phaseStartDate.setDate(startDate.getDate() + (phaseIndex * phase.estimated_duration));
      
      const phaseEndDate = new Date(phaseStartDate);
      phaseEndDate.setDate(phaseStartDate.getDate() + phase.estimated_duration - 1);

      phase.tasks.forEach((taskName, taskIndex) => {
        const taskStartDate = new Date(phaseStartDate);
        taskStartDate.setDate(phaseStartDate.getDate() + Math.floor(taskIndex * (phase.estimated_duration / phase.tasks.length)));
        
        const taskEndDate = new Date(taskStartDate);
        taskEndDate.setDate(taskStartDate.getDate() + Math.ceil(phase.estimated_duration / phase.tasks.length));

        const task: ProjectTask = {
          id: `task-${projectId}-${phaseIndex}-${taskIndex}`,
          project_id: projectId,
          phase_id: phase.id,
          name: taskName,
          description: `${phase.name}: ${taskName}`,
          status: 'pending',
          priority: 'medium',
          start_date: taskStartDate.toISOString(),
          end_date: taskEndDate.toISOString(),
          estimated_hours: 8 * Math.ceil(phase.estimated_duration / phase.tasks.length),
          progress_percentage: 0,
          materials_required: phase.required_materials,
          equipment_required: phase.required_equipment,
          order: taskIndex,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        tasks.push(task);
      });
    });

    const existingTasks = this.getStoredTasks();
    existingTasks.push(...tasks);
    this.saveTasks(existingTasks);
  }

  // Update existing project
  async updateProject(id: string, data: UpdateProjectRequest): Promise<{ data: Project | null; error: string | null }> {
    try {
      const existingProjects = this.getStoredProjects();
      const projectIndex = existingProjects.findIndex(p => p.id === id);
      
      if (projectIndex === -1) {
        return { data: null, error: 'Project not found' };
      }

      const updatedProject: Project = {
        ...existingProjects[projectIndex],
        ...data,
        updated_at: new Date().toISOString(),
      };

      existingProjects[projectIndex] = updatedProject;
      this.saveProjects(existingProjects);

      return { data: updatedProject, error: null };
    } catch (error) {
      console.error('Error updating project:', error);
      return { data: null, error: 'Failed to update project' };
    }
  }

  // Get project by ID
  async getProject(id: string): Promise<{ data: Project | null; error: string | null }> {
    try {
      const projects = this.getStoredProjects();
      const project = projects.find(p => p.id === id);
      
      return { data: project || null, error: project ? null : 'Project not found' };
    } catch (error) {
      console.error('Error fetching project:', error);
      return { data: null, error: 'Failed to fetch project' };
    }
  }

  // Get all projects (no pagination)
  async getAllProjects(): Promise<{ data: Project[] | null; error: string | null }> {
    try {
      const projects = this.getStoredProjects();
      
      // Get milestones for each project
      const milestones = this.getStoredMilestones();
      const milestonesByProject = milestones.reduce((acc, milestone) => {
        if (!acc[milestone.project_id]) {
          acc[milestone.project_id] = [];
        }
        acc[milestone.project_id].push(milestone);
        return acc;
      }, {} as Record<string, ProjectMilestone[]>);
      
      // Add milestones to projects
      const projectsWithMilestones = projects.map(project => ({
        ...project,
        milestones: milestonesByProject[project.id] || []
      }));
      
      return { data: projectsWithMilestones, error: null };
    } catch (error) {
      console.error('Error fetching all projects:', error);
      return { data: null, error: 'Failed to fetch projects' };
    }
  }

  // List projects with filters and pagination
  async listProjects(
    filters: ProjectFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: ProjectListResponse | null; error: string | null }> {
    try {
      let projects = this.getStoredProjects();

      // Apply filters
      if (filters.status) {
        projects = projects.filter(p => p.status === filters.status);
      }
      if (filters.priority) {
        projects = projects.filter(p => p.priority === filters.priority);
      }
      if (filters.project_manager) {
        projects = projects.filter(p => p.project_manager === filters.project_manager);
      }
      if (filters.customer_id) {
        projects = projects.filter(p => p.customer_id === filters.customer_id);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        projects = projects.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.project_number.toLowerCase().includes(searchLower) ||
          (p.quote?.client_name && p.quote.client_name.toLowerCase().includes(searchLower))
        );
      }
      if (filters.start_date_from) {
        projects = projects.filter(p => p.start_date >= filters.start_date_from!);
      }
      if (filters.start_date_to) {
        projects = projects.filter(p => p.start_date <= filters.start_date_to!);
      }

      // Sort by updated_at desc
      projects.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      // Pagination
      const total = projects.length;
      const startIndex = (page - 1) * limit;
      const paginatedProjects = projects.slice(startIndex, startIndex + limit);

      return {
        data: {
          projects: paginatedProjects,
          total,
          page,
          limit,
        },
        error: null,
      };
    } catch (error) {
      console.error('Error listing projects:', error);
      return { data: null, error: 'Failed to list projects' };
    }
  }

  // Get project statistics
  async getProjectStats(): Promise<{ data: ProjectStats | null; error: string | null }> {
    try {
      const projects = this.getStoredProjects();
      const now = new Date();
      
      const stats: ProjectStats = {
        total: projects.length,
        active: projects.filter(p => p.status === 'in_progress').length,
        completed: projects.filter(p => p.status === 'completed').length,
        overdue: projects.filter(p => 
          p.status !== 'completed' && 
          p.status !== 'cancelled' && 
          new Date(p.end_date) < now
        ).length,
        by_status: {
          planning: projects.filter(p => p.status === 'planning').length,
          in_progress: projects.filter(p => p.status === 'in_progress').length,
          on_hold: projects.filter(p => p.status === 'on_hold').length,
          completed: projects.filter(p => p.status === 'completed').length,
          cancelled: projects.filter(p => p.status === 'cancelled').length,
        },
        by_priority: {
          low: projects.filter(p => p.priority === 'low').length,
          medium: projects.filter(p => p.priority === 'medium').length,
          high: projects.filter(p => p.priority === 'high').length,
          urgent: projects.filter(p => p.priority === 'urgent').length,
        },
        total_revenue: projects
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + p.budget, 0),
        average_profit_margin: projects.length > 0 
          ? projects.reduce((sum, p) => sum + p.profit_margin, 0) / projects.length 
          : 0,
        upcoming_deadlines: projects
          .filter(p => 
            p.status !== 'completed' && 
            p.status !== 'cancelled' &&
            new Date(p.end_date) > now &&
            new Date(p.end_date) <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
          )
          .sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime())
          .slice(0, 5),
        recent_completions: projects
          .filter(p => p.status === 'completed')
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, 5),
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting project stats:', error);
      return { data: null, error: 'Failed to get project statistics' };
    }
  }

  // Get project tasks
  async getProjectTasks(projectId: string): Promise<{ data: ProjectTask[] | null; error: string | null }> {
    try {
      const tasks = this.getStoredTasks();
      const projectTasks = tasks.filter(t => t.project_id === projectId);
      
      return { data: projectTasks, error: null };
    } catch (error) {
      console.error('Error fetching project tasks:', error);
      return { data: null, error: 'Failed to fetch project tasks' };
    }
  }

  // Update task
  async updateTask(taskId: string, updates: Partial<ProjectTask>): Promise<{ data: ProjectTask | null; error: string | null }> {
    try {
      const tasks = this.getStoredTasks();
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) {
        return { data: null, error: 'Task not found' };
      }

      const updatedTask: ProjectTask = {
        ...tasks[taskIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      tasks[taskIndex] = updatedTask;
      this.saveTasks(tasks);

      // Update project progress based on task completion
      await this.updateProjectProgress(updatedTask.project_id);

      return { data: updatedTask, error: null };
    } catch (error) {
      console.error('Error updating task:', error);
      return { data: null, error: 'Failed to update task' };
    }
  }

  // Update project progress based on task completion
  private async updateProjectProgress(projectId: string): Promise<void> {
    const { data: tasks } = await this.getProjectTasks(projectId);
    if (!tasks || tasks.length === 0) return;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

    // Determine current phase based on active tasks
    const activeTasks = tasks.filter(t => t.status === 'in_progress');
    const currentPhase = activeTasks.length > 0 
      ? activeTasks[0].name.split(':')[0] 
      : completedTasks === totalTasks 
        ? 'Completed' 
        : 'Not Started';

    await this.updateProject(projectId, {
      progress_percentage: progressPercentage,
      current_phase: currentPhase,
      status: progressPercentage === 100 ? 'completed' : 'in_progress'
    });
  }

  // Helper methods
  private getStoredProjects(): Project[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : this.getSampleProjects();
    } catch {
      return this.getSampleProjects();
    }
  }

  private saveProjects(projects: Project[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
  }

  private getStoredTasks(): ProjectTask[] {
    try {
      const stored = localStorage.getItem(this.tasksStorageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveTasks(tasks: ProjectTask[]): void {
    localStorage.setItem(this.tasksStorageKey, JSON.stringify(tasks));
  }

  private getStoredMilestones(): ProjectMilestone[] {
    try {
      const stored = localStorage.getItem(this.milestonesStorageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveMilestones(milestones: ProjectMilestone[]): void {
    localStorage.setItem(this.milestonesStorageKey, JSON.stringify(milestones));
  }

  // Generate sample projects for development
  private getSampleProjects(): Project[] {
    const sampleProjects: Project[] = [
      {
        id: 'project-1',
        project_number: 'P20241201-0001',
        name: 'Proyek Coating Lantai Gudang',
        description: 'Coating epoxy lengkap untuk area gudang utama',
        customer_id: 'customer-1',
        customer_name: 'PT. Bangun Abadi',
        quote_id: 'quote-1',
        status: 'in_progress',
        priority: 'medium',
        start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_duration: 15,
        actual_start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        budget: 450000000,
        total_value: 450000000,
        profit_margin: 25,
        site_address: 'Jl. Industri No. 123, Kawasan Industri Cikarang',
        site_contact: 'Budi Santoso',
        site_phone: '021-8765-4321',
        progress_percentage: 35,
        current_phase: 'Persiapan Permukaan',
        project_manager: 'Ahmad Hidayat',
        assigned_crew: ['Tim A', 'Tim B'],
        materials_ordered: true,
        materials_delivered: true,
        equipment_scheduled: true,
        permits_obtained: true,
        safety_briefing_completed: true,
        quality_checks_passed: 2,
        notes: 'Klien meminta percepatan timeline untuk kebutuhan operasional',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: 'demo-user-123',
      }
    ];

    this.saveProjects(sampleProjects);
    
    // Create sample milestones
    const sampleMilestones: ProjectMilestone[] = [
      {
        id: 'milestone-1',
        project_id: 'project-1',
        name: 'Persiapan Area Selesai',
        description: 'Semua persiapan area dan bongkar material lama selesai',
        due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        deliverables: ['Area bersih', 'Material lama dibongkar', 'Safety briefing selesai'],
        client_approval_required: false,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'milestone-2',
        project_id: 'project-1',
        name: 'Aplikasi Primer Selesai',
        description: 'Aplikasi primer pada seluruh area',
        due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'in_progress',
        deliverables: ['Primer coat aplikasi', 'Quality check primer', 'Dokumentasi foto'],
        client_approval_required: true,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'milestone-3',
        project_id: 'project-1',
        name: 'Final Coating & Handover',
        description: 'Aplikasi final coat dan serah terima',
        due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        deliverables: ['Final coat aplikasi', 'Final inspection', 'Dokumentasi lengkap', 'Serah terima'],
        client_approval_required: true,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    
    this.saveMilestones(sampleMilestones);
    
    // Create sample tasks
    const sampleTasks: ProjectTask[] = [
      // Site Preparation Phase - Completed
      {
        id: 'task-project-1-0-0',
        project_id: 'project-1',
        phase_id: 'site-preparation',
        name: 'Site inspection and assessment',
        description: 'Site Preparation: Site inspection and assessment',
        status: 'completed',
        priority: 'high',
        start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_hours: 8,
        progress_percentage: 100,
        assigned_team: 'Team A',
        order: 0,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'task-project-1-0-1',
        project_id: 'project-1',
        phase_id: 'site-preparation',
        name: 'Surface condition evaluation',
        description: 'Site Preparation: Surface condition evaluation',
        status: 'completed',
        priority: 'high',
        start_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_hours: 8,
        progress_percentage: 100,
        assigned_team: 'Team A',
        order: 1,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      // Surface Preparation Phase - In Progress
      {
        id: 'task-project-1-1-0',
        project_id: 'project-1',
        phase_id: 'surface-preparation',
        name: 'Surface cleaning and degreasing',
        description: 'Surface Preparation: Surface cleaning and degreasing',
        status: 'completed',
        priority: 'medium',
        start_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_hours: 16,
        progress_percentage: 100,
        assigned_team: 'Team B',
        order: 0,
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'task-project-1-1-1',
        project_id: 'project-1',
        phase_id: 'surface-preparation',
        name: 'Grinding and profile creation',
        description: 'Surface Preparation: Grinding and profile creation',
        status: 'in_progress',
        priority: 'medium',
        start_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_hours: 24,
        progress_percentage: 70,
        assigned_team: 'Team B',
        dependencies: ['task-project-1-1-0'], // Depends on surface cleaning
        order: 1,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'task-project-1-1-2',
        project_id: 'project-1',
        phase_id: 'surface-preparation',
        name: 'Crack repair and patching',
        description: 'Surface Preparation: Crack repair and patching',
        status: 'pending',
        priority: 'medium',
        start_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_hours: 8,
        progress_percentage: 0,
        assigned_team: 'Team B',
        dependencies: ['task-project-1-1-1'], // Depends on grinding
        order: 2,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'task-project-1-1-3',
        project_id: 'project-1',
        phase_id: 'surface-preparation',
        name: 'Dust removal and final cleaning',
        description: 'Surface Preparation: Dust removal and final cleaning',
        status: 'pending',
        priority: 'medium',
        start_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_hours: 4,
        progress_percentage: 0,
        assigned_team: 'Team A',
        dependencies: ['task-project-1-1-2'], // Depends on crack repair
        order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'task-project-1-1-4',
        project_id: 'project-1',
        phase_id: 'surface-preparation',
        name: 'Moisture testing',
        description: 'Surface Preparation: Moisture testing',
        status: 'pending',
        priority: 'high',
        start_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_hours: 2,
        progress_percentage: 0,
        assigned_team: 'QC Team',
        dependencies: ['task-project-1-1-3'], // Depends on final cleaning
        order: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      // Primer Application - Upcoming
      {
        id: 'task-project-1-2-0',
        project_id: 'project-1',
        phase_id: 'primer-application',
        name: 'Primer mixing and preparation',
        description: 'Primer Application: Primer mixing and preparation',
        status: 'pending',
        priority: 'high',
        start_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_hours: 4,
        progress_percentage: 0,
        assigned_team: 'Team C',
        dependencies: ['task-project-1-1-4'], // Depends on moisture testing
        order: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'task-project-1-2-1',
        project_id: 'project-1',
        phase_id: 'primer-application',
        name: 'Environmental condition check',
        description: 'Primer Application: Environmental condition check',
        status: 'pending',
        priority: 'high',
        start_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_hours: 1,
        progress_percentage: 0,
        assigned_team: 'QC Team',
        order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'task-project-1-2-2',
        project_id: 'project-1',
        phase_id: 'primer-application',
        name: 'Primer application',
        description: 'Primer Application: Primer application',
        status: 'pending',
        priority: 'high',
        start_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_hours: 16,
        progress_percentage: 0,
        assigned_team: 'Team C',
        dependencies: ['task-project-1-2-0', 'task-project-1-2-1'], // Depends on mixing and environment check
        order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'task-project-1-2-3',
        project_id: 'project-1',
        phase_id: 'primer-application',
        name: 'Coverage verification',
        description: 'Primer Application: Coverage verification',
        status: 'pending',
        priority: 'medium',
        start_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_hours: 2,
        progress_percentage: 0,
        assigned_team: 'QC Team',
        dependencies: ['task-project-1-2-2'], // Depends on primer application
        order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    
    this.saveTasks(sampleTasks);
    
    return sampleProjects;
  }
}

// Export singleton instance
export const projectsService = new ProjectsService();