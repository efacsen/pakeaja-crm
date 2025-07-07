'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProjectsTable } from './ProjectsTable';
import { ProjectStats } from './ProjectStats';
import { Project, ProjectFilters } from '@/types/projects';
import { projectsService } from '@/lib/services/projects-service';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  
  const { toast } = useToast();
  const router = useRouter();

  // Load projects
  const loadProjects = async () => {
    setLoading(true);
    try {
      const searchFilters = searchQuery ? { ...filters, search: searchQuery } : filters;
      const { data, error } = await projectsService.listProjects(
        searchFilters,
        pagination.page,
        pagination.limit
      );

      if (error) {
        throw new Error(error);
      }

      if (data) {
        setProjects(data.projects);
        setPagination(prev => ({ ...prev, total: data.total }));
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadProjects();
  }, [pagination.page, pagination.limit]);

  // Search and filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      loadProjects();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters]);

  const handleUpdateProject = async (projectId: string, updates: any) => {
    try {
      const { data, error } = await projectsService.updateProject(projectId, updates);
      
      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Project Updated",
        description: "Project has been updated successfully.",
      });

      loadProjects();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update project",
        variant: "destructive",
      });
    }
  };

  const handleCreateNewProject = () => {
    router.push('/dashboard/quotes');
    toast({
      title: "Create Project",
      description: "Convert an approved quote to create a new project.",
    });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Project Management</h1>
          <p className="text-muted-foreground">
            Track and manage all your coating projects
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard/projects/gantt')}
            className="gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Gantt Chart
          </Button>
          <Button onClick={handleCreateNewProject} className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <ProjectStats />

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    status: value === 'all' ? undefined : value as any 
                  }))
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.priority || 'all'}
                onValueChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    priority: value === 'all' ? undefined : value as any 
                  }))
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>

              {(searchQuery || Object.keys(filters).length > 0) && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProjectsTable
            projects={projects}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
            onUpdate={handleUpdateProject}
          />
        </CardContent>
      </Card>
    </div>
  );
}