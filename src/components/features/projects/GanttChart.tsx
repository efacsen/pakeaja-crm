'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { Project, ProjectMilestone } from '@/types/projects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface GanttChartProps {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
  onMilestoneClick?: (milestone: ProjectMilestone, project: Project) => void;
}

type ViewMode = 'day' | 'week' | 'month' | 'quarter';

const statusColors = {
  planning: 'bg-blue-500',
  in_progress: 'bg-yellow-500',
  on_hold: 'bg-gray-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
} as const;

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
} as const;

export function GanttChart({ projects, onProjectClick, onMilestoneClick }: GanttChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calculate date range
  const { startDate, endDate, totalDays } = useMemo(() => {
    if (projects.length === 0) {
      const start = new Date();
      const end = new Date();
      end.setMonth(end.getMonth() + 3);
      return { startDate: start, endDate: end, totalDays: 90 };
    }

    let minDate = new Date(projects[0].start_date);
    let maxDate = new Date(projects[0].end_date);

    projects.forEach(project => {
      const start = new Date(project.start_date);
      const end = new Date(project.end_date);
      if (start < minDate) minDate = start;
      if (end > maxDate) maxDate = end;
    });

    // Add padding
    minDate.setMonth(minDate.getMonth() - 1);
    maxDate.setMonth(maxDate.getMonth() + 1);

    const days = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return { startDate: minDate, endDate: maxDate, totalDays: days };
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (selectedStatus === 'all') return projects;
    return projects.filter(p => p.status === selectedStatus);
  }, [projects, selectedStatus]);

  // Generate timeline headers based on view mode
  const timelineHeaders = useMemo(() => {
    const headers: { label: string; width: number; date: Date }[] = [];
    const current = new Date(startDate);

    switch (viewMode) {
      case 'day':
        while (current <= endDate) {
          headers.push({
            label: current.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
            width: 40,
            date: new Date(current),
          });
          current.setDate(current.getDate() + 1);
        }
        break;
      case 'week':
        while (current <= endDate) {
          const weekStart = new Date(current);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          headers.push({
            label: `W${Math.ceil(current.getDate() / 7)} ${current.toLocaleDateString('id-ID', { month: 'short' })}`,
            width: 120,
            date: new Date(current),
          });
          current.setDate(current.getDate() + 7);
        }
        break;
      case 'month':
        while (current <= endDate) {
          headers.push({
            label: current.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
            width: 200,
            date: new Date(current),
          });
          current.setMonth(current.getMonth() + 1);
        }
        break;
      case 'quarter':
        while (current <= endDate) {
          const quarter = Math.floor(current.getMonth() / 3) + 1;
          headers.push({
            label: `Q${quarter} ${current.getFullYear()}`,
            width: 300,
            date: new Date(current),
          });
          current.setMonth(current.getMonth() + 3);
        }
        break;
    }

    return headers;
  }, [startDate, endDate, viewMode]);

  // Calculate position and width for a date range
  const getPositionForDate = (date: Date) => {
    const daysSinceStart = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const pixelsPerDay = timelineHeaders.reduce((sum, h) => sum + h.width, 0) / totalDays;
    return daysSinceStart * pixelsPerDay;
  };

  const getWidthForDuration = (start: Date, end: Date) => {
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const pixelsPerDay = timelineHeaders.reduce((sum, h) => sum + h.width, 0) / totalDays;
    return Math.max(days * pixelsPerDay, 20); // Minimum width of 20px
  };

  // Scroll to today
  const scrollToToday = () => {
    if (scrollContainerRef.current) {
      const todayPosition = getPositionForDate(new Date());
      scrollContainerRef.current.scrollLeft = todayPosition - 100;
    }
  };

  useEffect(() => {
    scrollToToday();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Project Timeline
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* View Mode Selector */}
            <Select value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Navigation Buttons */}
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setCurrentDate(newDate);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={scrollToToday}
              >
                Today
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setCurrentDate(newDate);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Button size="icon" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex h-[600px] overflow-hidden">
          {/* Project List (Left Side) */}
          <div className="w-[300px] border-r flex flex-col">
            <div className="h-[50px] border-b bg-muted px-4 flex items-center font-medium">
              Projects ({filteredProjects.length})
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={cn(
                    "h-[80px] border-b px-4 py-2 cursor-pointer hover:bg-accent/50 transition-colors",
                    hoveredItem === project.id && "bg-accent/50"
                  )}
                  onClick={() => onProjectClick?.(project)}
                  onMouseEnter={() => setHoveredItem(project.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="font-medium truncate">{project.name}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {project.customer_name}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      <div className={cn("w-2 h-2 rounded-full mr-1", statusColors[project.status])} />
                      {project.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className={cn("text-xs", priorityColors[project.priority])}>
                      {project.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline (Right Side) */}
          <div className="flex-1 flex flex-col">
            {/* Timeline Header */}
            <div className="h-[50px] border-b bg-muted overflow-x-auto" ref={scrollContainerRef}>
              <div className="flex h-full" style={{ width: `${timelineHeaders.reduce((sum, h) => sum + h.width, 0)}px` }}>
                {timelineHeaders.map((header, index) => (
                  <div
                    key={index}
                    className="border-r flex items-center justify-center font-medium text-sm"
                    style={{ width: `${header.width}px`, minWidth: `${header.width}px` }}
                  >
                    {header.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Body */}
            <div className="flex-1 overflow-x-auto overflow-y-auto">
              <div style={{ width: `${timelineHeaders.reduce((sum, h) => sum + h.width, 0)}px` }}>
                {filteredProjects.map((project, projectIndex) => {
                  const projectStart = new Date(project.start_date);
                  const projectEnd = new Date(project.end_date);
                  const projectLeft = getPositionForDate(projectStart);
                  const projectWidth = getWidthForDuration(projectStart, projectEnd);

                  return (
                    <div
                      key={project.id}
                      className="h-[80px] border-b relative"
                      onMouseEnter={() => setHoveredItem(project.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex">
                        {timelineHeaders.map((_, index) => (
                          <div
                            key={index}
                            className="border-r h-full"
                            style={{ width: `${timelineHeaders[index].width}px` }}
                          />
                        ))}
                      </div>

                      {/* Today line */}
                      <div
                        className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-10"
                        style={{ left: `${getPositionForDate(new Date())}px` }}
                      />

                      {/* Project Bar */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "absolute top-[10px] h-[30px] rounded-md cursor-pointer transition-all",
                                statusColors[project.status],
                                hoveredItem === project.id && "ring-2 ring-primary"
                              )}
                              style={{
                                left: `${projectLeft}px`,
                                width: `${projectWidth}px`,
                              }}
                              onClick={() => onProjectClick?.(project)}
                            >
                              <div className="px-2 py-1 text-white text-xs font-medium truncate">
                                {project.name}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <p className="font-medium">{project.name}</p>
                              <p className="text-sm">
                                {projectStart.toLocaleDateString('id-ID')} - {projectEnd.toLocaleDateString('id-ID')}
                              </p>
                              <p className="text-sm">Progress: {project.progress_percentage}%</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Milestones */}
                      {project.milestones?.map((milestone) => {
                        const milestoneDate = new Date(milestone.due_date);
                        const milestoneLeft = getPositionForDate(milestoneDate);

                        return (
                          <TooltipProvider key={milestone.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={cn(
                                    "absolute top-[45px] w-4 h-4 rounded-full cursor-pointer transition-all",
                                    milestone.status === 'completed' ? 'bg-green-500' :
                                    milestone.status === 'in_progress' ? 'bg-yellow-500' :
                                    'bg-gray-400',
                                    hoveredItem === `milestone-${milestone.id}` && "ring-2 ring-primary"
                                  )}
                                  style={{ left: `${milestoneLeft - 8}px` }}
                                  onClick={() => onMilestoneClick?.(milestone, project)}
                                  onMouseEnter={() => setHoveredItem(`milestone-${milestone.id}`)}
                                  onMouseLeave={() => setHoveredItem(project.id)}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1">
                                  <p className="font-medium">{milestone.name}</p>
                                  <p className="text-sm">
                                    Due: {milestoneDate.toLocaleDateString('id-ID')}
                                  </p>
                                  <p className="text-sm capitalize">
                                    Status: {milestone.status.replace('_', ' ')}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="border-t p-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <span>Planning</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-yellow-500 rounded" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-500 rounded" />
              <span>On Hold</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500" />
              <span>Today</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <span>Completed Milestone</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-yellow-500 rounded-full" />
              <span>In Progress Milestone</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-400 rounded-full" />
              <span>Pending Milestone</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}