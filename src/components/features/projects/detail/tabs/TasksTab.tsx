'use client';

import { useState, useEffect, useMemo } from 'react';
import { Project, ProjectTask, DEFAULT_PROJECT_PHASES } from '@/types/projects';
import { ViewMode } from '@/types/project-detail';
import { projectsService } from '@/lib/services/projects-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Users,
  ArrowUp,
  ArrowDown,
  Kanban,
  List,
  BarChart3,
  FileText,
  Edit,
  Trash2,
  Copy,
  ChevronRight
} from 'lucide-react';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { TaskDetailPanel } from '@/components/features/projects/TaskDetailPanel';
import { CreateTaskDialog } from '@/components/features/projects/CreateTaskDialog';

interface TasksTabProps {
  project: Project;
  viewMode: ViewMode;
  onUpdate: () => void;
}

type TaskView = 'list' | 'kanban' | 'stats';
type TaskFilter = 'all' | 'my-tasks' | 'overdue' | 'upcoming' | 'completed';

export function TasksTab({ project, viewMode, onUpdate }: TasksTabProps) {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<TaskView>('list');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [project.id]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await projectsService.getProjectTasks(project.id);
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to load tasks',
          variant: 'destructive',
        });
      } else if (data) {
        setTasks(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = async (taskId: string, updates: Partial<ProjectTask>) => {
    const { error } = await projectsService.updateProjectTask(project.id, taskId, updates);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    } else {
      await loadTasks();
      onUpdate();
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    const { error } = await projectsService.deleteProjectTask(project.id, taskId);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
    } else {
      await loadTasks();
      onUpdate();
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
    }
  };

  const handleTaskCreate = async (taskData: Partial<ProjectTask>) => {
    const { error } = await projectsService.createProjectTask(project.id, taskData);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      });
    } else {
      await loadTasks();
      onUpdate();
      toast({
        title: 'Success',
        description: 'Task created successfully',
      });
    }
  };

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply phase filter
    if (selectedPhase !== 'all') {
      filtered = filtered.filter(task => task.phase_id === selectedPhase);
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(task => task.status === selectedStatus);
    }

    // Apply priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === selectedPriority);
    }

    // Apply special filters
    switch (filter) {
      case 'my-tasks':
        // In a real app, filter by current user
        filtered = filtered.filter(task => task.assigned_to || task.assigned_team);
        break;
      case 'overdue':
        filtered = filtered.filter(task => 
          task.status !== 'completed' && isBefore(new Date(task.end_date), startOfDay(new Date()))
        );
        break;
      case 'upcoming':
        const nextWeek = addDays(new Date(), 7);
        filtered = filtered.filter(task => 
          task.status !== 'completed' && 
          new Date(task.start_date) <= nextWeek &&
          new Date(task.start_date) >= new Date()
        );
        break;
      case 'completed':
        filtered = filtered.filter(task => task.status === 'completed');
        break;
    }

    return filtered;
  }, [tasks, searchQuery, selectedPhase, selectedStatus, selectedPriority, filter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const overdue = tasks.filter(t => 
      t.status !== 'completed' && isBefore(new Date(t.end_date), startOfDay(new Date()))
    ).length;
    const avgProgress = tasks.reduce((sum, t) => sum + t.progress_percentage, 0) / (total || 1);

    return { total, completed, inProgress, overdue, avgProgress };
  }, [tasks]);

  const getStatusIcon = (status: ProjectTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'blocked':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityIcon = (priority: ProjectTask['priority']) => {
    switch (priority) {
      case 'high':
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case 'low':
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const renderListView = () => (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Task Name</TableHead>
              <TableHead>Phase</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => {
              const phase = DEFAULT_PROJECT_PHASES.find(p => p.id === task.phase_id);
              const isTaskOverdue = task.status !== 'completed' && isBefore(new Date(task.end_date), startOfDay(new Date()));
              
              return (
                <TableRow 
                  key={task.id}
                  className={cn(
                    "cursor-pointer hover:bg-muted/50",
                    isTaskOverdue && "bg-red-50 dark:bg-red-900/10"
                  )}
                  onClick={() => setSelectedTask(task)}
                >
                  <TableCell>{getStatusIcon(task.status)}</TableCell>
                  <TableCell className="font-medium">
                    <div>
                      <div className="flex items-center gap-2">
                        {task.name}
                        {task.dependencies && task.dependencies.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {task.dependencies.length} deps
                          </Badge>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" style={{ backgroundColor: phase?.color + '20' }}>
                      {phase?.name}
                    </Badge>
                  </TableCell>
                  <TableCell>{task.assigned_to || task.assigned_team || '-'}</TableCell>
                  <TableCell>
                    <div className={cn(isTaskOverdue && "text-red-600 font-medium")}>
                      {format(new Date(task.end_date), 'MMM d, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={task.progress_percentage} className="w-20" />
                      <span className="text-sm text-muted-foreground">
                        {task.progress_percentage}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getPriorityIcon(task.priority)}
                      <span className="text-sm capitalize">{task.priority}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {viewMode === 'internal' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(task);
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement duplicate
                          }}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Are you sure you want to delete this task?')) {
                                handleTaskDelete(task.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderKanbanView = () => {
    const tasksByStatus = {
      pending: filteredTasks.filter(t => t.status === 'pending'),
      in_progress: filteredTasks.filter(t => t.status === 'in_progress'),
      blocked: filteredTasks.filter(t => t.status === 'blocked'),
      completed: filteredTasks.filter(t => t.status === 'completed'),
    };

    const statusColumns = [
      { key: 'pending', label: 'To Do', color: 'bg-gray-100 dark:bg-gray-800' },
      { key: 'in_progress', label: 'In Progress', color: 'bg-blue-50 dark:bg-blue-900/20' },
      { key: 'blocked', label: 'Blocked', color: 'bg-red-50 dark:bg-red-900/20' },
      { key: 'completed', label: 'Done', color: 'bg-green-50 dark:bg-green-900/20' },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusColumns.map(({ key, label, color }) => (
          <div key={key} className={cn("rounded-lg p-4", color)}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{label}</h3>
              <Badge variant="secondary">
                {tasksByStatus[key as keyof typeof tasksByStatus].length}
              </Badge>
            </div>
            <div className="space-y-2">
              {tasksByStatus[key as keyof typeof tasksByStatus].map((task) => {
                const phase = DEFAULT_PROJECT_PHASES.find(p => p.id === task.phase_id);
                const isTaskOverdue = task.status !== 'completed' && isBefore(new Date(task.end_date), startOfDay(new Date()));
                
                return (
                  <Card 
                    key={task.id}
                    className={cn(
                      "cursor-pointer hover:shadow-md transition-shadow",
                      isTaskOverdue && "border-red-500"
                    )}
                    onClick={() => setSelectedTask(task)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm line-clamp-2">{task.name}</h4>
                        {getPriorityIcon(task.priority)}
                      </div>
                      <div className="space-y-2">
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{ backgroundColor: phase?.color + '20' }}
                        >
                          {phase?.name}
                        </Badge>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{task.assigned_to || task.assigned_team || 'Unassigned'}</span>
                          <span className={cn(isTaskOverdue && "text-red-600 font-medium")}>
                            {format(new Date(task.end_date), 'MMM d')}
                          </span>
                        </div>
                        <Progress value={task.progress_percentage} className="h-1" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStatsView = () => (
    <div className="grid gap-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <Progress value={(stats.completed / stats.total) * 100} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.avgProgress)}%</div>
            <Progress value={stats.avgProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Phase Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks by Phase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DEFAULT_PROJECT_PHASES.map((phase) => {
              const phaseTasks = tasks.filter(t => t.phase_id === phase.id);
              const phaseProgress = phaseTasks.reduce((sum, t) => sum + t.progress_percentage, 0) / (phaseTasks.length || 1);
              
              return (
                <div key={phase.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline"
                        style={{ backgroundColor: phase.color + '20' }}
                      >
                        {phase.name}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {phaseTasks.length} tasks
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round(phaseProgress)}%
                    </span>
                  </div>
                  <Progress value={phaseProgress} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tasks</h2>
          <p className="text-muted-foreground">
            Manage and track all project tasks
          </p>
        </div>
        {viewMode === 'internal' && (
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        )}
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={filter} onValueChange={(value) => setFilter(value as TaskFilter)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="my-tasks">My Tasks</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPhase} onValueChange={setSelectedPhase}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Phases" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Phases</SelectItem>
              {DEFAULT_PROJECT_PHASES.map((phase) => (
                <SelectItem key={phase.id} value={phase.id}>
                  {phase.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as TaskView)}>
          <TabsList>
            <TabsTrigger value="list">
              <List className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="kanban">
              <Kanban className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      {view === 'list' && renderListView()}
      {view === 'kanban' && renderKanbanView()}
      {view === 'stats' && renderStatsView()}

      {/* Task Detail Panel */}
      <TaskDetailPanel
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        onSave={handleTaskUpdate}
        onDelete={viewMode === 'internal' ? handleTaskDelete : undefined}
        allTasks={tasks}
      />

      {/* Create Task Dialog */}
      {viewMode === 'internal' && (
        <CreateTaskDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSave={handleTaskCreate}
          projectId={project.id}
          phases={DEFAULT_PROJECT_PHASES}
        />
      )}
    </div>
  );
}