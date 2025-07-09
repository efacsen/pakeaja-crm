'use client';

import { ProjectStatus } from '@/types/dashboard';
import { GlassCard as Card, GlassCardContent as CardContent, GlassCardDescription as CardDescription, GlassCardHeader as CardHeader, GlassCardTitle as CardTitle } from '@/components/ui/glass-card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/calculator-utils';
import { 
  Briefcase,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectStatusCardProps {
  projects: ProjectStatus[];
}

const statusColors = {
  planning: 'bg-blue-500',
  in_progress: 'bg-yellow-500',
  on_hold: 'bg-gray-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const statusLabels = {
  planning: 'Planning',
  in_progress: 'In Progress',
  on_hold: 'On Hold',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function ProjectStatusCard({ projects }: ProjectStatusCardProps) {
  const safeProjects = projects || [];
  const activeProjects = safeProjects.filter(p => p.status === 'in_progress' || p.status === 'planning');
  const totalValue = safeProjects.reduce((sum, p) => sum + (p.contract_value || 0), 0);
  const totalOutstanding = safeProjects.reduce((sum, p) => sum + (p.outstanding_amount || 0), 0);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Project Status
            </CardTitle>
            <CardDescription>
              {activeProjects.length} active projects • {formatCurrency(totalValue)} total value
            </CardDescription>
          </div>
          {totalOutstanding > 0 && (
            <Badge variant="outline" className="gap-1">
              <DollarSign className="h-3 w-3" />
              {formatCurrency(totalOutstanding)} outstanding
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {safeProjects.length > 0 ? (
            safeProjects.slice(0, 5).map((project) => (
            <div key={project.id} className="space-y-3 p-4 border rounded-lg">
              {/* Project Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{project.project_name}</h4>
                  <p className="text-sm text-muted-foreground">{project.client_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={project.risk_level === 'high' ? 'destructive' : 'secondary'}
                    className="gap-1"
                  >
                    {project.risk_level === 'high' && <AlertTriangle className="h-3 w-3" />}
                    {project.risk_level} risk
                  </Badge>
                  <Badge variant="outline">
                    <div className={cn("w-2 h-2 rounded-full mr-1", statusColors[project.status])} />
                    {statusLabels[project.status]}
                  </Badge>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-medium">{project.progress_percentage}%</span>
                </div>
                <Progress value={project.progress_percentage} className="h-2" />
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Calendar className="h-3 w-3" />
                    Timeline
                  </div>
                  <p className="font-medium">
                    {project.is_overdue ? (
                      <span className="text-red-600">Overdue by {Math.abs(project.days_remaining)} days</span>
                    ) : (
                      <span>{project.days_remaining} days left</span>
                    )}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <CheckCircle className="h-3 w-3" />
                    Milestones
                  </div>
                  <p className="font-medium">
                    {project.completed_milestones}/{project.total_milestones}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <DollarSign className="h-3 w-3" />
                    Invoiced
                  </div>
                  <p className="font-medium">
                    {Math.round((project.invoiced_amount / project.contract_value) * 100)}%
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Users className="h-3 w-3" />
                    Team
                  </div>
                  <p className="font-medium">
                    {project.team_members?.length || 0} members
                  </p>
                </div>
              </div>

              {/* Current Milestone */}
              {project.current_milestone && (
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Current: <span className="font-medium">{project.current_milestone}</span>
                  </span>
                  {project.next_milestone_date && (
                    <span className="text-sm text-muted-foreground">
                      • Next due: {new Date(project.next_milestone_date).toLocaleDateString('id-ID')}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
          ) : (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No active projects</p>
            </div>
          )}
        </div>

        {safeProjects.length > 5 && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View all {safeProjects.length} projects
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}