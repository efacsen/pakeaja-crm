'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Project, ProjectTask, ProjectPhase, DEFAULT_PROJECT_PHASES } from '@/types/projects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Maximize2, 
  Minimize2, 
  ZoomIn,
  ZoomOut,
  Calendar,
  Undo,
  Save,
  AlertTriangle,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays, differenceInDays, isWeekend, startOfDay, endOfDay } from 'date-fns';

interface DraggableGanttChartProps {
  project: Project;
  tasks: ProjectTask[];
  onTaskUpdate?: (taskId: string, updates: Partial<ProjectTask>) => Promise<void>;
  viewMode?: 'internal' | 'client';
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
}

interface Conflict {
  taskId: string;
  conflictWith: string[];
  type: 'overlap' | 'dependency' | 'phase-constraint';
}

export function DraggableGanttChart({ 
  project, 
  tasks, 
  onTaskUpdate,
  viewMode = 'internal' 
}: DraggableGanttChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ganttTasks, setGanttTasks] = useState<GanttTask[]>([]);
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

  // Calculate date range
  const projectStartDate = startOfDay(new Date(project.start_date));
  const projectEndDate = endOfDay(new Date(project.end_date));
  const totalDays = differenceInDays(projectEndDate, projectStartDate) + 1;
  
  // Calculate cell width based on available space in fullscreen
  const [availableWidth, setAvailableWidth] = useState(0);
  
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current && isFullscreen) {
        const containerWidth = containerRef.current.clientWidth - 320; // Subtract task column width
        const optimalCellWidth = Math.floor(containerWidth / totalDays);
        setCellWidth(Math.max(20, Math.min(100, optimalCellWidth)));
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [isFullscreen, totalDays]);

  // Build hierarchical task structure with mock data
  useEffect(() => {
    const buildGanttTasks = (): GanttTask[] => {
      const allTasks: GanttTask[] = [];

      // Add project row
      allTasks.push({
        id: project.id,
        type: 'project',
        name: project.name,
        start_date: new Date(project.start_date),
        end_date: new Date(project.end_date),
        progress: project.progress_percentage,
        status: project.status,
        level: 0,
        isEditable: false,
        originalData: project
      });

      // Add phases and tasks
      DEFAULT_PROJECT_PHASES.forEach((phase, phaseIndex) => {
        const phaseStartDate = addDays(projectStartDate, 
          DEFAULT_PROJECT_PHASES.slice(0, phaseIndex).reduce((sum, p) => sum + p.estimated_duration, 0)
        );
        const phaseEndDate = addDays(phaseStartDate, phase.estimated_duration - 1);
        
        // Calculate phase progress
        const phaseTasks = tasks.filter(t => t.phase_id === phase.id);
        const phaseProgress = phaseTasks.length > 0
          ? Math.round(phaseTasks.reduce((sum, t) => sum + t.progress_percentage, 0) / phaseTasks.length)
          : 0;

        // Add phase
        allTasks.push({
          id: phase.id,
          type: 'phase',
          name: phase.name,
          start_date: phaseStartDate,
          end_date: phaseEndDate,
          progress: phaseProgress,
          level: 1,
          parentId: project.id,
          isEditable: viewMode === 'internal',
          originalData: phase
        });

        // Add tasks for this phase
        const sortedTasks = phaseTasks.sort((a, b) => (a.order || 0) - (b.order || 0));
        sortedTasks.forEach(task => {
          allTasks.push({
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
            dependencies: task.dependencies,
            assigned: task.assigned_team,
            isEditable: viewMode === 'internal',
            originalData: task
          });
        });
      });

      return allTasks;
    };

    setGanttTasks(buildGanttTasks());
  }, [project, tasks, viewMode]);

  // Calculate position for a date
  const getPixelPositionForDate = (date: Date): number => {
    const daysSinceStart = differenceInDays(date, projectStartDate);
    return daysSinceStart * cellWidth;
  };

  // Get date from pixel position
  const getDateFromPixelPosition = (x: number): Date => {
    const days = Math.round(x / cellWidth);
    return addDays(projectStartDate, days);
  };

  // Check for conflicts
  const checkConflicts = useCallback((taskId: string, startDate: Date, endDate: Date): Conflict[] => {
    const conflicts: Conflict[] = [];
    const task = ganttTasks.find(t => t.id === taskId);
    if (!task) return conflicts;

    // Check phase constraints for subtasks
    if (task.type === 'task' && task.phaseId) {
      const phase = ganttTasks.find(t => t.id === task.phaseId);
      if (phase) {
        if (startDate < phase.start_date || endDate > phase.end_date) {
          conflicts.push({
            taskId,
            conflictWith: [phase.id],
            type: 'phase-constraint'
          });
        }
      }
    }

    // Check overlaps with sibling tasks
    ganttTasks.forEach(otherTask => {
      if (otherTask.id === taskId || otherTask.level !== task.level) return;
      if (otherTask.parentId !== task.parentId) return;

      const otherStart = otherTask.start_date;
      const otherEnd = otherTask.end_date;

      if (
        (startDate >= otherStart && startDate <= otherEnd) ||
        (endDate >= otherStart && endDate <= otherEnd) ||
        (startDate <= otherStart && endDate >= otherEnd)
      ) {
        const existingConflict = conflicts.find(c => c.type === 'overlap');
        if (existingConflict) {
          existingConflict.conflictWith.push(otherTask.id);
        } else {
          conflicts.push({
            taskId,
            conflictWith: [otherTask.id],
            type: 'overlap'
          });
        }
      }
    });

    return conflicts;
  }, [ganttTasks]);

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent, task: GanttTask, dragType: 'move' | 'resize-start' | 'resize-end') => {
    if (!task.isEditable || !onTaskUpdate) return;

    e.preventDefault();
    const rect = timelineRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragState({
      isDragging: true,
      taskId: task.id,
      dragType,
      startX: e.clientX - rect.left,
      startDate: task.start_date,
      endDate: task.end_date,
      originalStartDate: task.start_date,
      originalEndDate: task.end_date
    });
  };

  // Handle drag move
  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.taskId || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const deltaX = currentX - dragState.startX;
    const deltaDays = Math.round(deltaX / cellWidth);

    if (deltaDays === 0) return;

    const task = ganttTasks.find(t => t.id === dragState.taskId);
    if (!task) return;

    let newStartDate: Date;
    let newEndDate: Date;

    if (dragState.dragType === 'move') {
      // Move entire task
      newStartDate = addDays(dragState.originalStartDate!, deltaDays);
      newEndDate = addDays(dragState.originalEndDate!, deltaDays);
    } else if (dragState.dragType === 'resize-start') {
      // Resize from start
      newStartDate = addDays(dragState.originalStartDate!, deltaDays);
      newEndDate = dragState.originalEndDate!;
      // Ensure minimum 1 day duration
      if (newStartDate >= newEndDate) {
        newStartDate = addDays(newEndDate, -1);
      }
    } else {
      // Resize from end
      newStartDate = dragState.originalStartDate!;
      newEndDate = addDays(dragState.originalEndDate!, deltaDays);
      // Ensure minimum 1 day duration
      if (newEndDate <= newStartDate) {
        newEndDate = addDays(newStartDate, 1);
      }
    }

    // Check conflicts
    const newConflicts = checkConflicts(dragState.taskId, newStartDate, newEndDate);
    setConflicts(newConflicts);

    // Update visual position (ghost)
    setDragState(prev => ({
      ...prev,
      startDate: newStartDate,
      endDate: newEndDate
    }));
  }, [dragState, ganttTasks, cellWidth, checkConflicts]);

  // Handle drag end
  const handleDragEnd = useCallback(async () => {
    if (!dragState.isDragging || !dragState.taskId || !onTaskUpdate) return;

    const task = ganttTasks.find(t => t.id === dragState.taskId);
    if (!task || !dragState.startDate || !dragState.endDate) {
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
      return;
    }

    // Save to undo stack
    setUndoStack(prev => [...prev, {
      taskId: task.id,
      start: task.start_date,
      end: task.end_date
    }]);

    // Update task
    try {
      await onTaskUpdate(task.id, {
        start_date: dragState.startDate.toISOString(),
        end_date: dragState.endDate.toISOString()
      });

      toast({
        title: "Timeline Updated",
        description: (
          <div className="flex items-center gap-2">
            <span>Task dates changed</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleUndo()}
              className="h-6 px-2"
            >
              <Undo className="h-3 w-3 mr-1" />
              Undo
            </Button>
          </div>
        ),
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task timeline",
        variant: "destructive"
      });
    }

    // Reset drag state
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
    setConflicts([]);
  }, [dragState, ganttTasks, onTaskUpdate, toast]);

  // Handle undo
  const handleUndo = async () => {
    const lastAction = undoStack[undoStack.length - 1];
    if (!lastAction || !onTaskUpdate) return;

    try {
      await onTaskUpdate(lastAction.taskId, {
        start_date: lastAction.start.toISOString(),
        end_date: lastAction.end.toISOString()
      });

      setUndoStack(prev => prev.slice(0, -1));
      
      toast({
        title: "Change Reverted",
        description: "Timeline has been restored",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to undo change",
        variant: "destructive"
      });
    }
  };

  // Mouse event listeners
  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      // Set cursor on body for global effect
      if (dragState.dragType === 'move') {
        document.body.style.cursor = 'grabbing';
      } else {
        document.body.style.cursor = 'ew-resize';
      }
      
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.body.style.cursor = '';
      };
    }
  }, [dragState.isDragging, dragState.dragType, handleDragMove, handleDragEnd]);

  // Render timeline header with dates
  const renderTimelineHeader = () => {
    const headers = [];
    const monthHeaders: { month: string; colspan: number; start: number }[] = [];
    let currentMonth = '';
    let monthColspan = 0;
    let monthStart = 0;

    for (let i = 0; i < totalDays; i++) {
      const currentDate = addDays(projectStartDate, i);
      const month = format(currentDate, 'MMM yyyy');
      
      if (month !== currentMonth) {
        if (currentMonth) {
          monthHeaders.push({ month: currentMonth, colspan: monthColspan, start: monthStart });
        }
        currentMonth = month;
        monthColspan = 1;
        monthStart = i;
      } else {
        monthColspan++;
      }

      const isToday = format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
      const isWeekendDay = isWeekend(currentDate);

      headers.push(
        <div
          key={currentDate.toISOString()}
          className={cn(
            "flex-shrink-0 border-r border-gray-200 text-center text-xs",
            isWeekendDay && "bg-gray-50",
            isToday && "bg-blue-50 font-bold"
          )}
          style={{ width: cellWidth }}
        >
          <div className="py-1">{format(currentDate, 'd')}</div>
        </div>
      );
    }

    // Add last month
    if (currentMonth) {
      monthHeaders.push({ month: currentMonth, colspan: monthColspan, start: monthStart });
    }

    return (
      <>
        {/* Month headers */}
        <div className="flex border-b border-gray-300">
          <div className="w-80 border-r border-gray-300"></div>
          <div className="flex">
            {monthHeaders.map((header, idx) => (
              <div
                key={idx}
                className="border-r border-gray-300 px-2 py-2 font-medium text-center bg-gray-50"
                style={{ width: header.colspan * cellWidth }}
              >
                {header.month}
              </div>
            ))}
          </div>
        </div>
        {/* Day headers */}
        <div className="flex border-b border-gray-300">
          <div className="w-80 border-r border-gray-300 px-4 py-2 font-medium bg-gray-50">
            Task / Phase
          </div>
          <div className="flex bg-gray-50">
            {headers}
          </div>
        </div>
      </>
    );
  };

  // Render task bar
  const renderTaskBar = (task: GanttTask) => {
    const isDragging = dragState.isDragging && dragState.taskId === task.id;
    const startDate = isDragging && dragState.startDate ? dragState.startDate : task.start_date;
    const endDate = isDragging && dragState.endDate ? dragState.endDate : task.end_date;
    
    const startPos = getPixelPositionForDate(startDate);
    const endPos = getPixelPositionForDate(endDate);
    const width = endPos - startPos + cellWidth; // +cellWidth to include the end day

    const hasConflict = conflicts.some(c => c.taskId === task.id);
    const isInConflict = conflicts.some(c => c.conflictWith.includes(task.id));

    // Get bar color
    let barColor = 'bg-gray-400';
    if (task.type === 'project') {
      barColor = 'bg-primary';
    } else if (task.type === 'phase') {
      barColor = 'bg-blue-500';
    } else if (task.type === 'task') {
      const taskData = task.originalData as ProjectTask;
      switch (taskData.status) {
        case 'completed': barColor = 'bg-green-500'; break;
        case 'in_progress': barColor = 'bg-yellow-500'; break;
        case 'blocked': barColor = 'bg-red-500'; break;
        default: barColor = 'bg-gray-400';
      }
    }

    return (
      <div
        className={cn(
          "absolute h-8 rounded shadow-sm transition-all group",
          task.isEditable && !isDragging && "hover:shadow-md",
          isDragging && "opacity-50",
          hasConflict && "ring-2 ring-red-500",
          isInConflict && "ring-1 ring-orange-400"
        )}
        style={{
          left: startPos,
          width: width,
          top: '12px'
        }}
        onMouseEnter={() => setHoveredTask(task.id)}
        onMouseLeave={() => setHoveredTask(null)}
      >
        {/* Main bar */}
        <div 
          className={cn(
            "h-full rounded relative overflow-hidden",
            barColor,
            task.isEditable && "cursor-grab active:cursor-grabbing"
          )}
          onMouseDown={(e) => {
            if (task.isEditable) {
              handleDragStart(e, task, 'move');
            }
          }}
        >
          {/* Progress bar */}
          {task.progress > 0 && (
            <div 
              className="absolute inset-0 bg-black bg-opacity-20"
              style={{ width: `${task.progress}%` }}
            />
          )}
          
          {/* Task label (only for larger bars) */}
          {width > 60 && (
            <span className="absolute inset-0 flex items-center px-4 text-xs text-white truncate pointer-events-none">
              {task.name}
            </span>
          )}
        </div>

        {/* Resize handles - outside the main bar */}
        {task.isEditable && task.type === 'task' && (
          <>
            {/* Left resize handle */}
            <div
              className={cn(
                "absolute -left-1 top-0 bottom-0 w-3 z-10",
                "bg-transparent hover:bg-blue-500 hover:bg-opacity-30",
                "after:content-[''] after:absolute after:left-1 after:top-1/2 after:-translate-y-1/2",
                "after:w-0.5 after:h-4 after:bg-white after:opacity-0 group-hover:after:opacity-70",
                "after:shadow-sm"
              )}
              style={{ cursor: 'ew-resize' }}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleDragStart(e, task, 'resize-start');
              }}
              title="Drag to change start date"
            />
            {/* Right resize handle */}
            <div
              className={cn(
                "absolute -right-1 top-0 bottom-0 w-3 z-10",
                "bg-transparent hover:bg-blue-500 hover:bg-opacity-30",
                "after:content-[''] after:absolute after:right-1 after:top-1/2 after:-translate-y-1/2",
                "after:w-0.5 after:h-4 after:bg-white after:opacity-0 group-hover:after:opacity-70",
                "after:shadow-sm"
              )}
              style={{ cursor: 'ew-resize' }}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleDragStart(e, task, 'resize-end');
              }}
              title="Drag to change end date"
            />
          </>
        )}

        {/* Hover tooltip */}
        {hoveredTask === task.id && !isDragging && (
          <div className="absolute bg-gray-900 text-white p-3 rounded shadow-lg z-50 text-xs whitespace-nowrap pointer-events-none"
               style={{ 
                 top: '40px',
                 left: width > 200 ? '50%' : '0',
                 transform: width > 200 ? 'translateX(-50%)' : 'none'
               }}>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-gray-900"></div>
            <div className="font-medium">{task.name}</div>
            <div className="text-gray-300">
              {format(startDate, 'MMM d')} - {format(endDate, 'MMM d')} ({differenceInDays(endDate, startDate) + 1} days)
            </div>
            {task.type === 'task' && (
              <>
                <div className="text-gray-300">Progress: {task.progress}%</div>
                {task.assigned && <div className="text-gray-300">Team: {task.assigned}</div>}
              </>
            )}
            {hasConflict && (
              <div className="text-red-400 mt-1">⚠️ Conflict detected</div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Gantt row
  const renderGanttRow = (task: GanttTask, index: number) => {
    return (
      <div
        key={task.id}
        className={cn(
          "flex border-b border-gray-200 group hover:bg-gray-50",
          dragState.isDragging && dragState.taskId === task.id && "bg-blue-50"
        )}
      >
        {/* Task name column */}
        <div 
          className="w-80 border-r border-gray-200 px-2 py-3 flex items-center"
          style={{ paddingLeft: `${task.level * 24 + 8}px` }}
        >
          <div className="flex-1">
            <div className="font-medium text-sm">{task.name}</div>
            {task.type === 'task' && viewMode === 'internal' && task.assigned && (
              <div className="text-xs text-gray-500">{task.assigned}</div>
            )}
          </div>
          {task.type === 'task' && (
            <Badge variant="outline" className="ml-2 text-xs">
              {task.progress}%
            </Badge>
          )}
        </div>

        {/* Timeline column */}
        <div 
          ref={index === 0 ? timelineRef : undefined}
          className="flex-1 relative overflow-hidden"
          style={{ minWidth: totalDays * cellWidth }}
        >
          {/* Grid lines */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: totalDays }).map((_, i) => {
              const currentDate = addDays(projectStartDate, i);
              const isWeekendDay = isWeekend(currentDate);
              const isToday = format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              
              return (
                <div
                  key={i}
                  className={cn(
                    "border-r border-gray-100 h-full",
                    isWeekendDay && "bg-gray-50",
                    isToday && "bg-red-500 bg-opacity-10"
                  )}
                  style={{ width: cellWidth }}
                />
              );
            })}
          </div>

          {/* Task bar */}
          {renderTaskBar(task)}

          {/* Today line */}
          {(() => {
            const todayPos = getPixelPositionForDate(new Date());
            if (todayPos >= 0 && todayPos <= totalDays * cellWidth) {
              return (
                <div
                  className="absolute top-0 bottom-0 w-px bg-red-500 z-20 pointer-events-none"
                  style={{ left: todayPos }}
                />
              );
            }
          })()}
        </div>
      </div>
    );
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Mouse wheel zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -5 : 5;
        setCellWidth(prev => {
          const newWidth = prev + delta;
          if (isFullscreen) {
            const containerWidth = containerRef.current?.clientWidth || 1200;
            const minWidth = Math.floor((containerWidth - 320) / totalDays);
            return Math.max(minWidth, Math.min(100, newWidth));
          }
          return Math.max(20, Math.min(100, newWidth));
        });
      }
    };

    const chartElement = containerRef.current;
    if (chartElement) {
      chartElement.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (chartElement) {
        chartElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isFullscreen, totalDays]);

  return (
    <div ref={containerRef} className={cn(
      "bg-white rounded-lg",
      isFullscreen && "fixed inset-0 z-50 overflow-auto"
    )}>
      <Card className={cn("h-full", isFullscreen && "rounded-none")}>
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Project Timeline
            {viewMode === 'internal' && (
              <Badge variant="secondary" className="ml-2">
                Drag to edit
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* Zoom controls */}
            <div className="flex items-center gap-1">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 w-8 p-0"
                onClick={() => {
                  if (isFullscreen) {
                    // In fullscreen, don't go below the optimal width
                    const containerWidth = containerRef.current?.clientWidth || 1200;
                    const minWidth = Math.floor((containerWidth - 320) / totalDays);
                    setCellWidth(Math.max(minWidth, cellWidth - 10));
                  } else {
                    setCellWidth(Math.max(20, cellWidth - 10));
                  }
                }}
                disabled={isFullscreen && cellWidth <= Math.floor(((containerRef.current?.clientWidth || 1200) - 320) / totalDays)}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground mx-2">
                {cellWidth}px/day
              </span>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 w-8 p-0"
                onClick={() => setCellWidth(Math.min(100, cellWidth + 10))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              {isFullscreen && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const containerWidth = containerRef.current?.clientWidth || 1200;
                    const optimalCellWidth = Math.floor((containerWidth - 320) / totalDays);
                    setCellWidth(Math.max(20, Math.min(100, optimalCellWidth)));
                  }}
                  className="text-xs px-2 h-8"
                >
                  Fit
                </Button>
              )}
            </div>

            {/* Undo button */}
            {undoStack.length > 0 && viewMode === 'internal' && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleUndo}
                className="h-8 px-2"
              >
                <Undo className="h-4 w-4" />
              </Button>
            )}

            {/* Fullscreen toggle */}
            <Button
              size="sm"
              variant="outline"
              onClick={toggleFullscreen}
              className="h-8 w-8 p-0"
            >
              {isFullscreen ? 
                <Minimize2 className="h-4 w-4" /> : 
                <Maximize2 className="h-4 w-4" />
              }
            </Button>

            {isFullscreen && (
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleFullscreen}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className={cn(
          "p-0 flex flex-col",
          isFullscreen ? "h-[calc(100vh-64px)]" : "h-[600px]"
        )}>
          {/* Scrollable content area */}
          <div className={cn(
            "flex-1 overflow-auto relative",
            "[&::-webkit-scrollbar]:w-2",
            "[&::-webkit-scrollbar]:h-2", 
            "[&::-webkit-scrollbar-track]:bg-gray-100",
            "[&::-webkit-scrollbar-thumb]:bg-gray-300",
            "[&::-webkit-scrollbar-thumb]:rounded-full",
            "[&::-webkit-scrollbar-thumb:hover]:bg-gray-400"
          )}>
            <div className="min-w-fit">
              {/* Headers */}
              <div className="sticky top-0 z-10 bg-white">
                {renderTimelineHeader()}
              </div>

              {/* Gantt rows */}
              <div className="relative">
                {ganttTasks.map((task, index) => renderGanttRow(task, index))}
              </div>
            </div>
          </div>

          {/* Fixed Legend at bottom */}
          {viewMode === 'internal' && (
            <div className="p-4 border-t bg-gray-50 flex items-center gap-4 text-xs flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                <span>Not Started</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Blocked</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span>Drag bars to adjust timeline</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}