'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Project, ProjectTask, ProjectPhase, DEFAULT_PROJECT_PHASES } from '@/types/projects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Maximize2, 
  Minimize2, 
  ZoomIn,
  ZoomOut,
  Calendar,
  Undo,
  AlertTriangle,
  X,
  Link2,
  Eye,
  EyeOff,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays, differenceInDays, isWeekend, startOfDay, endOfDay } from 'date-fns';
import { TaskQuickEdit } from './TaskQuickEdit';
import { TaskDetailPanel } from './TaskDetailPanel';

interface EnhancedGanttChartProps {
  project: Project;
  tasks: ProjectTask[];
  onTaskUpdate?: (taskId: string, updates: Partial<ProjectTask>) => Promise<void>;
  viewMode?: 'internal' | 'customer';
}

interface GanttTask {
  id: string;
  type: 'project' | 'phase' | 'task';
  name: string;
  start_date: Date;
  end_date: Date;
  progress: number;
  status?: string;
  level: number;
  parentId?: string;
  phaseId?: string;
  dependencies?: string[];
  dependents?: string[];
  assigned?: string;
  isEditable: boolean;
  originalData: Project | ProjectPhase | ProjectTask;
}

interface DragState {
  isDragging: boolean;
  taskId: string | null;
  dragType: 'move' | 'resize-start' | 'resize-end' | null;
  startX: number;
  startDate: Date | null;
  endDate: Date | null;
  originalStartDate: Date | null;
  originalEndDate: Date | null;
  isGroupDrag?: boolean;
  groupTasks?: string[]; // IDs of all tasks in the dependency chain
}

interface Conflict {
  taskId: string;
  conflictWith: string[];
  type: 'overlap' | 'dependency' | 'phase-constraint';
}

interface DependencyArrow {
  from: string;
  to: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export function EnhancedGanttChart({ 
  project, 
  tasks, 
  onTaskUpdate,
  viewMode = 'internal' 
}: EnhancedGanttChartProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDependencies, setShowDependencies] = useState(true);
  const [ganttTasks, setGanttTasks] = useState<GanttTask[]>([]);
  const [dependencyArrows, setDependencyArrows] = useState<DependencyArrow[]>([]);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    taskId: null,
    dragType: null,
    startX: 0,
    startDate: null,
    endDate: null,
    originalStartDate: null,
    originalEndDate: null
  });
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [undoStack, setUndoStack] = useState<Array<{ taskId: string; start: Date; end: Date }>>([]);
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const [cellWidth, setCellWidth] = useState(40); // pixels per day
  const [taskPositions, setTaskPositions] = useState<Map<string, { x: number; y: number; width: number; height: number }>>(new Map());
  const [quickEditTask, setQuickEditTask] = useState<string | null>(null);
  const [detailPanelTask, setDetailPanelTask] = useState<ProjectTask | null>(null);
  const [shiftKeyPressed, setShiftKeyPressed] = useState(false);

  // Calculate date range
  const projectStartDate = startOfDay(new Date(project.start_date));
  const projectEndDate = endOfDay(new Date(project.end_date));
  const totalDays = differenceInDays(projectEndDate, projectStartDate) + 1;
  
  // Transform tasks into gantt tasks with hierarchy
  useEffect(() => {
    const transformedTasks: GanttTask[] = [];
    
    // Add project as root
    transformedTasks.push({
      id: project.id,
      type: 'project',
      name: project.name,
      start_date: new Date(project.start_date),
      end_date: new Date(project.end_date),
      progress: project.progress_percentage,
      level: 0,
      isEditable: false,
      originalData: project
    });

    // Add phases
    DEFAULT_PROJECT_PHASES.forEach((phase) => {
      const phaseTasks = tasks.filter(t => t.phase_id === phase.id);
      if (phaseTasks.length === 0) return;

      const phaseStart = new Date(Math.min(...phaseTasks.map(t => new Date(t.start_date).getTime())));
      const phaseEnd = new Date(Math.max(...phaseTasks.map(t => new Date(t.end_date).getTime())));
      const phaseProgress = phaseTasks.reduce((sum, t) => sum + t.progress_percentage, 0) / phaseTasks.length;

      transformedTasks.push({
        id: phase.id,
        type: 'phase',
        name: phase.name,
        start_date: phaseStart,
        end_date: phaseEnd,
        progress: Math.round(phaseProgress),
        level: 1,
        parentId: project.id,
        isEditable: false,
        originalData: phase
      });

      // Add tasks under phase
      phaseTasks.forEach((task) => {
        // Build dependency relationships
        const dependents = tasks
          .filter(t => t.dependencies && t.dependencies.includes(task.id))
          .map(t => t.id);

        transformedTasks.push({
          id: task.id,
          type: 'task',
          name: task.name,
          start_date: new Date(task.start_date),
          end_date: new Date(task.end_date),
          progress: task.progress_percentage,
          status: task.status,
          level: 2,
          parentId: phase.id,
          phaseId: phase.id,
          dependencies: task.dependencies || [],
          dependents: dependents,
          assigned: task.assigned_team || task.assigned_to,
          isEditable: viewMode === 'internal' && !!onTaskUpdate,
          originalData: task
        });
      });
    });

    setGanttTasks(transformedTasks);
  }, [project, tasks, viewMode, onTaskUpdate]);

  // Calculate dependency arrows
  useEffect(() => {
    if (!showDependencies) {
      setDependencyArrows([]);
      return;
    }

    const arrows: DependencyArrow[] = [];
    const positions = taskPositions;

    ganttTasks.forEach(task => {
      if (task.dependencies && task.dependencies.length > 0) {
        task.dependencies.forEach(depId => {
          const fromPos = positions.get(depId);
          const toPos = positions.get(task.id);

          if (fromPos && toPos) {
            arrows.push({
              from: depId,
              to: task.id,
              fromX: fromPos.x + fromPos.width,
              fromY: fromPos.y + fromPos.height / 2,
              toX: toPos.x,
              toY: toPos.y + toPos.height / 2
            });
          }
        });
      }
    });

    setDependencyArrows(arrows);
  }, [ganttTasks, taskPositions, showDependencies]);

  // Check for conflicts
  const checkConflicts = useCallback(() => {
    const newConflicts: Conflict[] = [];
    
    ganttTasks.forEach((task) => {
      if (task.type !== 'task') return;
      
      const conflictWith: string[] = [];
      
      // Check dependency conflicts
      if (task.dependencies) {
        task.dependencies.forEach(depId => {
          const depTask = ganttTasks.find(t => t.id === depId);
          if (depTask && depTask.end_date > task.start_date) {
            conflictWith.push(depId);
          }
        });
      }
      
      // Check resource conflicts (same team on overlapping tasks)
      if (task.assigned) {
        ganttTasks.forEach((otherTask) => {
          if (otherTask.id !== task.id && 
              otherTask.type === 'task' && 
              otherTask.assigned === task.assigned &&
              !(otherTask.end_date < task.start_date || otherTask.start_date > task.end_date)) {
            conflictWith.push(otherTask.id);
          }
        });
      }
      
      if (conflictWith.length > 0) {
        newConflicts.push({
          taskId: task.id,
          conflictWith,
          type: task.dependencies?.some(d => conflictWith.includes(d)) ? 'dependency' : 'overlap'
        });
      }
    });
    
    setConflicts(newConflicts);
  }, [ganttTasks]);

  useEffect(() => {
    checkConflicts();
  }, [ganttTasks, checkConflicts]);

  // Update task positions after render
  useEffect(() => {
    if (!timelineRef.current) return;
    
    const updatePositions = () => {
      const elements = timelineRef.current?.querySelectorAll('[data-task-id]');
      if (!elements) return;
      
      const newPositions = new Map<string, { x: number; y: number; width: number; height: number }>();
      const timelineRect = timelineRef.current?.getBoundingClientRect();
      
      if (timelineRect && timelineRef.current) {
        elements.forEach((element) => {
          const taskId = element.getAttribute('data-task-id');
          if (taskId) {
            const rect = element.getBoundingClientRect();
            newPositions.set(taskId, {
              x: rect.left - timelineRect.left + timelineRef.current.scrollLeft,
              y: rect.top - timelineRect.top + timelineRef.current.scrollTop,
              width: rect.width,
              height: rect.height
            });
          }
        });
        
        setTaskPositions(newPositions);
      }
    };
    
    // Update positions after a short delay to ensure DOM is ready
    const timer = setTimeout(updatePositions, 100);
    
    // Also update on scroll
    const handleScroll = () => updatePositions();
    timelineRef.current?.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      timelineRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [ganttTasks]);

  // Define handleDragEnd first
  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      taskId: null,
      dragType: null,
      startX: 0,
      startDate: null,
      endDate: null,
      originalStartDate: null,
      originalEndDate: null
    });
  }, []);

  // Handle fullscreen with proper cleanup
  const toggleFullscreen = useCallback(() => {
    // Always end any ongoing drag operation first
    if (dragState.isDragging) {
      handleDragEnd();
    }
    
    // Use setTimeout to ensure drag cleanup completes before toggling
    setTimeout(() => {
      setIsFullscreen(prev => !prev);
    }, 0);
  }, [dragState.isDragging, handleDragEnd]);

  // Find all tasks in the dependency chain
  const getDependencyChain = useCallback((taskId: string, includeUpstream = true, includeDownstream = true): string[] => {
    const chain = new Set<string>([taskId]);
    const visited = new Set<string>();
    
    const findDependencies = (id: string, direction: 'up' | 'down') => {
      if (visited.has(id)) return;
      visited.add(id);
      
      const task = ganttTasks.find(t => t.id === id);
      if (!task) return;
      
      if (direction === 'up' && includeUpstream && task.dependencies) {
        task.dependencies.forEach(depId => {
          chain.add(depId);
          findDependencies(depId, 'up');
        });
      }
      
      if (direction === 'down' && includeDownstream && task.dependents) {
        task.dependents.forEach(depId => {
          chain.add(depId);
          findDependencies(depId, 'down');
        });
      }
    };
    
    findDependencies(taskId, 'up');
    findDependencies(taskId, 'down');
    
    return Array.from(chain);
  }, [ganttTasks]);

  // Mouse event handlers with fullscreen protection
  const handleMouseDown = (e: React.MouseEvent, task: GanttTask, dragType: 'move' | 'resize-start' | 'resize-end') => {
    if (!task.isEditable || viewMode === 'customer') return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Close any open editors
    setQuickEditTask(null);
    setDetailPanelTask(null);
    
    // Check if Shift key is held for group drag
    const isGroupDrag = e.shiftKey && dragType === 'move';
    const groupTasks = isGroupDrag ? getDependencyChain(task.id) : [task.id];
    
    setDragState({
      isDragging: true,
      taskId: task.id,
      dragType,
      startX: e.clientX,
      startDate: task.start_date,
      endDate: task.end_date,
      originalStartDate: task.start_date,
      originalEndDate: task.end_date,
      isGroupDrag,
      groupTasks
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.taskId) return;

    const deltaX = e.clientX - dragState.startX;
    const daysDelta = Math.round(deltaX / cellWidth);

    if (daysDelta === 0) return;

    const task = ganttTasks.find(t => t.id === dragState.taskId);
    if (!task) return;

    let newStartDate = dragState.originalStartDate!;
    let newEndDate = dragState.originalEndDate!;

    if (dragState.dragType === 'move') {
      newStartDate = addDays(dragState.originalStartDate!, daysDelta);
      newEndDate = addDays(dragState.originalEndDate!, daysDelta);
      
      // If group drag, update visual feedback for all tasks in the group
      if (dragState.isGroupDrag && dragState.groupTasks) {
        // Visual feedback is handled by the isInDragGroup check in render
      }
    } else if (dragState.dragType === 'resize-start') {
      newStartDate = addDays(dragState.originalStartDate!, daysDelta);
      if (newStartDate >= newEndDate) {
        newStartDate = addDays(newEndDate, -1);
      }
    } else if (dragState.dragType === 'resize-end') {
      newEndDate = addDays(dragState.originalEndDate!, daysDelta);
      if (newEndDate <= newStartDate) {
        newEndDate = addDays(newStartDate, 1);
      }
    }

    setDragState(prev => ({
      ...prev,
      startDate: newStartDate,
      endDate: newEndDate
    }));
  }, [dragState, ganttTasks, cellWidth]);

  const handleMouseUp = useCallback(async (e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.taskId) return;

    const task = ganttTasks.find(t => t.id === dragState.taskId);
    if (!task || task.type !== 'task') {
      handleDragEnd();
      return;
    }

    // Calculate time delta
    const daysDelta = differenceInDays(dragState.startDate!, dragState.originalStartDate!);

    if (dragState.isGroupDrag && dragState.groupTasks && onTaskUpdate) {
      // Update all tasks in the group
      for (const taskId of dragState.groupTasks) {
        const groupTask = ganttTasks.find(t => t.id === taskId);
        if (groupTask && groupTask.type === 'task') {
          // Save to undo stack
          setUndoStack(prev => [...prev, {
            taskId: groupTask.id,
            start: groupTask.start_date,
            end: groupTask.end_date
          }].slice(-10));

          // Update each task with the same time delta
          const newStartDate = addDays(groupTask.start_date, daysDelta);
          const newEndDate = addDays(groupTask.end_date, daysDelta);
          
          await onTaskUpdate(groupTask.id, {
            start_date: newStartDate.toISOString(),
            end_date: newEndDate.toISOString()
          });
        }
      }
    } else {
      // Single task update
      setUndoStack(prev => [...prev, {
        taskId: task.id,
        start: task.start_date,
        end: task.end_date
      }].slice(-10));

      if (onTaskUpdate && dragState.startDate && dragState.endDate) {
        await onTaskUpdate(task.id, {
          start_date: dragState.startDate.toISOString(),
          end_date: dragState.endDate.toISOString()
        });
      }
    }

    handleDragEnd();
  }, [dragState, ganttTasks, onTaskUpdate, handleDragEnd]);

  // Add global mouse event listeners
  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = dragState.dragType === 'move' ? 'grabbing' : 'ew-resize';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  // Track shift key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftKeyPressed(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftKeyPressed(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Render dependency arrow path
  const renderArrowPath = (arrow: DependencyArrow) => {
    const midX = arrow.fromX + (arrow.toX - arrow.fromX) / 2;
    
    return `M ${arrow.fromX} ${arrow.fromY} 
            C ${midX} ${arrow.fromY}, 
              ${midX} ${arrow.toY}, 
              ${arrow.toX - 10} ${arrow.toY}
            L ${arrow.toX} ${arrow.toY}`;
  };

  // Render Gantt chart
  return (
    <div className={cn(
      "transition-all duration-300",
      isFullscreen && "fixed inset-0 z-50 bg-background p-4"
    )}>
      <Card className={cn(
        "overflow-hidden",
        isFullscreen && "h-full flex flex-col"
      )}>
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Project Timeline
              {conflicts.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {conflicts.length} Conflicts
                </Badge>
              )}
              {viewMode === 'internal' && (
                <span className="text-xs font-normal text-muted-foreground ml-auto">
                  Hold Shift while dragging to move entire dependency chains
                </span>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDependencies(!showDependencies)}
                className="gap-2"
              >
                {showDependencies ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                Dependencies
              </Button>
              
              {undoStack.length > 0 && viewMode === 'internal' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const lastAction = undoStack[undoStack.length - 1];
                    if (lastAction && onTaskUpdate) {
                      await onTaskUpdate(lastAction.taskId, {
                        start_date: lastAction.start.toISOString(),
                        end_date: lastAction.end.toISOString()
                      });
                      setUndoStack(prev => prev.slice(0, -1));
                    }
                  }}
                >
                  <Undo className="h-4 w-4" />
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCellWidth(Math.max(20, cellWidth - 10))}
                disabled={cellWidth <= 20}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCellWidth(Math.min(100, cellWidth + 10))}
                disabled={cellWidth >= 100}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="h-4 w-4 mr-2" />
                    Exit Fullscreen
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-4 w-4 mr-2" />
                    Fullscreen
                  </>
                )}
              </Button>
              
              {isFullscreen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className={cn(
          "p-0",
          isFullscreen && "flex-1 overflow-hidden"
        )}>
          <div className="flex h-full">
            {/* Task names column */}
            <div className="flex-shrink-0 w-64 border-r bg-muted/30">
              <div className="h-12 border-b px-4 flex items-center font-semibold">
                Task Name
              </div>
              <div className="overflow-y-auto" style={{ height: isFullscreen ? 'calc(100% - 48px)' : '600px' }}>
                {ganttTasks.map((task) => {
                  const hasConflict = conflicts.some(c => c.taskId === task.id);
                  const isHovered = hoveredTask === task.id || 
                                   (hoveredTask && task.dependencies?.includes(hoveredTask)) ||
                                   (hoveredTask && task.dependents?.includes(hoveredTask));
                  
                  // Check if task is part of the dependency chain when hovering with Shift
                  const isInDependencyChain = shiftKeyPressed && hoveredTask && task.type === 'task' && 
                    getDependencyChain(hoveredTask).includes(task.id);
                  
                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "h-10 px-4 flex items-center border-b text-sm group",
                        task.level === 0 && "font-semibold bg-muted/50",
                        task.level === 1 && "pl-8 font-medium",
                        task.level === 2 && "pl-12",
                        hasConflict && "text-red-600",
                        isHovered && "bg-muted/50",
                        isInDependencyChain && "bg-blue-100 dark:bg-blue-900/30"
                      )}
                      onMouseEnter={() => setHoveredTask(task.id)}
                      onMouseLeave={() => setHoveredTask(null)}
                    >
                      <span className="truncate flex-1">{task.name}</span>
                      {task.dependencies && task.dependencies.length > 0 && (
                        <Link2 className="h-3 w-3 ml-2 text-muted-foreground" />
                      )}
                      {task.type === 'task' && task.isEditable && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const taskData = tasks.find(t => t.id === task.id);
                            if (taskData) setDetailPanelTask(taskData);
                          }}
                          className="opacity-0 group-hover:opacity-100 ml-2 p-1 hover:bg-accent rounded"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline */}
            <div 
              ref={timelineRef}
              className="flex-1 overflow-auto relative"
              style={{ height: isFullscreen ? '100%' : '648px' }}
            >
              {/* Dependency arrows SVG layer */}
              {showDependencies && (
                <svg
                  ref={svgRef}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    width: totalDays * cellWidth,
                    height: ganttTasks.length * 40
                  }}
                >
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3.5, 0 7"
                        fill="#6366f1"
                      />
                    </marker>
                  </defs>
                  {dependencyArrows.map((arrow, index) => {
                    const isHovered = hoveredTask === arrow.from || hoveredTask === arrow.to;
                    return (
                      <path
                        key={`${arrow.from}-${arrow.to}-${index}`}
                        d={renderArrowPath(arrow)}
                        fill="none"
                        stroke={isHovered ? "#6366f1" : "#94a3b8"}
                        strokeWidth={isHovered ? 2 : 1.5}
                        markerEnd="url(#arrowhead)"
                        opacity={isHovered ? 1 : 0.6}
                      />
                    );
                  })}
                </svg>
              )}
              
              {/* Header with dates */}
              <div className="sticky top-0 z-10 bg-background border-b">
                <div className="h-12 flex">
                  {Array.from({ length: totalDays }, (_, i) => {
                    const date = addDays(projectStartDate, i);
                    const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                    const weekend = isWeekend(date);
                    
                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex-shrink-0 border-r text-xs flex flex-col items-center justify-center",
                          weekend && "bg-muted/30",
                          isToday && "bg-primary/10 font-bold"
                        )}
                        style={{ width: cellWidth }}
                      >
                        <div>{format(date, 'd')}</div>
                        {(i === 0 || date.getDate() === 1) && (
                          <div className="text-[10px] text-muted-foreground">
                            {format(date, 'MMM')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Task bars */}
              <div className="relative" style={{ width: totalDays * cellWidth }}>
                {ganttTasks.map((task, index) => {
                  const startDay = Math.max(0, differenceInDays(
                    dragState.isDragging && dragState.taskId === task.id && dragState.startDate
                      ? dragState.startDate
                      : task.start_date,
                    projectStartDate
                  ));
                  const duration = differenceInDays(
                    dragState.isDragging && dragState.taskId === task.id && dragState.endDate
                      ? dragState.endDate
                      : task.end_date,
                    dragState.isDragging && dragState.taskId === task.id && dragState.startDate
                      ? dragState.startDate
                      : task.start_date
                  ) + 1;
                  
                  const hasConflict = conflicts.some(c => c.taskId === task.id);
                  const isBeingDragged = dragState.isDragging && dragState.taskId === task.id;
                  const isHovered = hoveredTask === task.id || 
                                   (hoveredTask && task.dependencies?.includes(hoveredTask)) ||
                                   (hoveredTask && task.dependents?.includes(hoveredTask));
                  
                  // Check if task is part of the dependency chain when hovering with Shift
                  const isInDependencyChain = shiftKeyPressed && hoveredTask && task.type === 'task' && 
                    getDependencyChain(hoveredTask).includes(task.id);
                  
                  // Check if this task is part of a group being dragged
                  const isInDragGroup = dragState.isDragging && dragState.isGroupDrag && 
                    dragState.groupTasks?.includes(task.id);
                  
                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "absolute h-10 flex items-center",
                        isHovered && "z-20",
                        (isInDependencyChain || isInDragGroup) && "z-30"
                      )}
                      style={{
                        top: index * 40,
                        left: 0,
                        right: 0
                      }}
                    >
                      <div
                        data-task-id={task.id}
                        className={cn(
                          "absolute h-6 rounded transition-all",
                          task.type === 'project' && "bg-blue-500 opacity-30",
                          task.type === 'phase' && "bg-gray-400 opacity-50",
                          task.type === 'task' && "bg-blue-500",
                          hasConflict && "ring-2 ring-red-500 ring-offset-1",
                          isBeingDragged && "opacity-80 shadow-lg",
                          isHovered && "ring-2 ring-primary ring-offset-1",
                          isInDependencyChain && "ring-2 ring-blue-400 ring-offset-2 bg-blue-600",
                          isInDragGroup && "ring-2 ring-green-400 ring-offset-2 shadow-lg",
                          task.isEditable && !isBeingDragged && "hover:brightness-110"
                        )}
                        style={{
                          left: startDay * cellWidth,
                          width: duration * cellWidth,
                          cursor: task.isEditable ? (dragState.dragType === 'move' ? 'grab' : 'default') : 'default'
                        }}
                        onMouseDown={(e) => task.isEditable && handleMouseDown(e, task, 'move')}
                        onMouseEnter={() => setHoveredTask(task.id)}
                        onMouseLeave={() => setHoveredTask(null)}
                        onDoubleClick={(e) => {
                          if (task.type === 'task' && task.isEditable) {
                            e.stopPropagation();
                            setQuickEditTask(task.id);
                          }
                        }}
                      >
                        {/* Progress bar */}
                        {task.progress > 0 && (
                          <div
                            className={cn(
                              "absolute inset-0 rounded",
                              task.type === 'task' && "bg-green-500 opacity-30"
                            )}
                            style={{ width: `${task.progress}%` }}
                          />
                        )}
                        
                        {/* Resize handles */}
                        {task.isEditable && task.type === 'task' && (
                          <>
                            <div
                              className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-black/20"
                              onMouseDown={(e) => handleMouseDown(e, task, 'resize-start')}
                            />
                            <div
                              className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-black/20"
                              onMouseDown={(e) => handleMouseDown(e, task, 'resize-end')}
                            />
                          </>
                        )}
                        
                        {/* Task label */}
                        {duration * cellWidth > 60 && (
                          <div className="px-2 text-xs text-white truncate">
                            {task.name}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Edit Popover */}
      {quickEditTask && (
        <TaskQuickEdit
          task={tasks.find(t => t.id === quickEditTask)!}
          open={!!quickEditTask}
          onOpenChange={(open) => !open && setQuickEditTask(null)}
          onSave={onTaskUpdate || (async () => {})}
        >
          <div />
        </TaskQuickEdit>
      )}
      
      {/* Detail Panel */}
      <TaskDetailPanel
        task={detailPanelTask}
        open={!!detailPanelTask}
        onOpenChange={(open) => !open && setDetailPanelTask(null)}
        onSave={onTaskUpdate || (async () => {})}
        allTasks={tasks}
      />
    </div>
  );
}