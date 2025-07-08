'use client';

import { use, useState, useEffect } from 'react';

// Force dynamic rendering to avoid static generation issues with auth
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { Project } from '@/types/projects';
import { projectsService } from '@/lib/services/projects-service';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { ProjectHeader } from '@/components/features/projects/detail/ProjectHeader';
import { ProjectTabs } from '@/components/features/projects/detail/ProjectTabs';
import { ActivityFeed } from '@/components/features/projects/detail/ActivityFeed';
import { ProjectContent } from '@/components/features/projects/detail/ProjectContent';
import { ProjectTab, ViewMode, ActivityItem } from '@/types/project-detail';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  // Unwrap params Promise using React.use()
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ProjectTab>('overview');
  // Determine view mode based on user role - customers see customer view
  const viewMode: ViewMode = user?.role === 'client' ? 'client' : 'internal';
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    loadProject();
    loadActivities();
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const { data, error } = await projectsService.getProject(id);
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to load project',
          variant: 'destructive',
        });
        router.push('/dashboard/projects');
      } else if (data) {
        setProject(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    // TODO: Implement activity loading from service
    // For now, use mock data
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
        type: 'progress',
        title: 'Progress Update',
        description: 'Surface preparation completed for Area A',
        visibility: 'all',
        severity: 'success',
        user: { name: 'Budi Santoso', role: 'Site Supervisor' }
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        type: 'cost_alert',
        title: 'Cost Alert',
        description: 'Material costs exceeded budget by 5%',
        visibility: 'internal',
        severity: 'warning',
        metadata: { overageAmount: 12500000, overagePercent: 5 }
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        type: 'weather',
        title: 'Weather Alert',
        description: 'Rain expected tomorrow - reschedule outdoor work',
        visibility: 'internal',
        severity: 'warning'
      }
    ];
    setActivities(mockActivities);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Project not found</p>
        <Button onClick={() => router.push('/dashboard/projects')} className="mt-4">
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/projects')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>
      </div>

      {/* Project Header with metrics */}
      <ProjectHeader project={project} viewMode={viewMode} />

      {/* Tab Navigation */}
      <ProjectTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        viewMode={viewMode}
      />

      {/* Main Content Area with Activity Feed */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <ProjectContent
            project={project}
            activeTab={activeTab}
            viewMode={viewMode}
            onProjectUpdate={loadProject}
          />
        </div>

        {/* Activity Feed Sidebar - Desktop only */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <ActivityFeed
            activities={activities}
            viewMode={viewMode}
            onRefresh={loadActivities}
          />
        </div>
      </div>
    </div>
  );
}