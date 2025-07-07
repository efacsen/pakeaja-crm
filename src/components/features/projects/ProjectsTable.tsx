'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  Users, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  PlayCircle,
  PauseCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Project } from '@/types/projects';
import { formatCurrency } from '@/lib/calculator-utils';
import { format } from 'date-fns';

interface ProjectsTableProps {
  projects: Project[];
  loading?: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange: (page: number) => void;
  onUpdate: (projectId: string, updates: any) => void;
}

export function ProjectsTable({
  projects,
  loading = false,
  pagination,
  onPageChange,
  onUpdate,
}: ProjectsTableProps) {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const getStatusColor = (status: Project['status']) => {
    const colors = {
      planning: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      on_hold: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Project['priority']) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority];
  };

  const getStatusIcon = (status: Project['status']) => {
    const icons = {
      planning: Calendar,
      in_progress: PlayCircle,
      on_hold: PauseCircle,
      completed: CheckCircle,
      cancelled: AlertTriangle,
    };
    const Icon = icons[status];
    return <Icon className="h-4 w-4" />;
  };

  const handleStatusChange = (project: Project, newStatus: Project['status']) => {
    onUpdate(project.id, { 
      status: newStatus,
      updated_at: new Date().toISOString()
    });
  };

  const handlePriorityChange = (project: Project, newPriority: Project['priority']) => {
    onUpdate(project.id, { 
      priority: newPriority,
      updated_at: new Date().toISOString()
    });
  };

  const calculateProgress = (project: Project) => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const isOverdue = (project: Project) => {
    if (!project.end_date || project.status === 'completed') return false;
    return new Date(project.end_date) < new Date();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Calendar className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No projects found</h3>
        <p className="text-muted-foreground mb-4">
          Convert approved quotes to create new projects
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => {
              const progress = calculateProgress(project);
              const overdue = isOverdue(project);
              
              return (
                <TableRow key={project.id}>
                  <TableCell>
                    <div 
                      className="cursor-pointer hover:opacity-70"
                      onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                    >
                      <div className="font-medium">{project.project_number}</div>
                      <div className="text-sm text-muted-foreground underline">
                        {project.name}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <div className="font-medium">{project.customer_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {project.site_address}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Badge 
                          className={`${getStatusColor(project.status)} cursor-pointer hover:opacity-80`}
                        >
                          <span className="flex items-center gap-1">
                            {getStatusIcon(project.status)}
                            {project.status.replace('_', ' ')}
                          </span>
                        </Badge>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusChange(project, 'planning')}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Planning
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(project, 'in_progress')}>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(project, 'on_hold')}>
                          <PauseCircle className="h-4 w-4 mr-2" />
                          On Hold
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(project, 'completed')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(project, 'cancelled')}>
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Cancelled
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Badge 
                          className={`${getPriorityColor(project.priority)} cursor-pointer hover:opacity-80`}
                        >
                          {project.priority}
                        </Badge>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Change Priority</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handlePriorityChange(project, 'low')}>
                          Low
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePriorityChange(project, 'medium')}>
                          Medium
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePriorityChange(project, 'high')}>
                          High
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePriorityChange(project, 'urgent')}>
                          Urgent
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium min-w-[3rem]">
                        {progress}%
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <div className={overdue ? 'text-red-600 font-medium' : ''}>
                        {project.start_date && format(new Date(project.start_date), 'MMM d')}
                        {project.start_date && project.end_date && ' - '}
                        {project.end_date && format(new Date(project.end_date), 'MMM d, yyyy')}
                        {overdue && ' (Overdue)'}
                      </div>
                      {project.estimated_duration && (
                        <div className="text-muted-foreground">
                          {project.estimated_duration} days
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">
                        {formatCurrency(project.total_value)}
                      </div>
                      {project.budget && (
                        <div className="text-muted-foreground">
                          Budget: {formatCurrency(project.budget)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/projects/${project.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="h-4 w-4 mr-2" />
                          View Timeline
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="h-4 w-4 mr-2" />
                          Manage Team
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Project
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Project</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this project? This action cannot be undone.
                                All project data, tasks, and timeline will be permanently removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => {
                                  // Handle delete project
                                  console.log('Delete project:', project.id);
                                }}
                              >
                                Delete Project
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} projects
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => onPageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, i) => {
                const page = i + 1;
                const isCurrentPage = page === pagination.page;
                const showPage = page === 1 || 
                                page === Math.ceil(pagination.total / pagination.limit) ||
                                Math.abs(page - pagination.page) <= 2;
                
                if (!showPage) {
                  if (page === pagination.page - 3 || page === pagination.page + 3) {
                    return <span key={page} className="px-2">...</span>;
                  }
                  return null;
                }
                
                return (
                  <Button
                    key={page}
                    variant={isCurrentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
              onClick={() => onPageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}