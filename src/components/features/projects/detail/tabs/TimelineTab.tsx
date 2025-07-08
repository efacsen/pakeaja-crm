'use client';

import { useState, useEffect } from 'react';
import { Project, ProjectTask } from '@/types/projects';
import { ViewMode } from '@/types/project-detail';
import { EnhancedGanttChart } from '@/components/features/projects/EnhancedGanttChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, AlertTriangle } from 'lucide-react';
import { projectsService } from '@/lib/services/projects-service';
import { useToast } from '@/hooks/use-toast';

interface TimelineTabProps {
  project: Project;
  viewMode: ViewMode;
}

export function TimelineTab({ project, viewMode }: TimelineTabProps) {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectTasks();
  }, [project.id]);

  const loadProjectTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await projectsService.getProjectTasks(project.id);
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to load project tasks',
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
    try {
      const { data, error } = await projectsService.updateTask(taskId, updates);
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update task',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Task updated successfully',
        });
        loadProjectTasks(); // Reload tasks
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading timeline...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {viewMode === 'internal' && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Timeline Notice:</strong> Weather delays may impact outdoor work scheduled for next week.
          </AlertDescription>
        </Alert>
      )}

      <EnhancedGanttChart 
        project={project}
        tasks={tasks}
        onTaskUpdate={viewMode === 'internal' ? handleTaskUpdate : undefined}
        viewMode={viewMode}
      />

      {viewMode === 'client' && (
        <Card>
          <CardHeader>
            <CardTitle>Key Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Project Start</span>
                <span className="font-medium">
                  {new Date(project.start_date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Expected Completion</span>
                <span className="font-medium">
                  {new Date(project.end_date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Duration</span>
                <span className="font-medium">{project.estimated_duration} days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}