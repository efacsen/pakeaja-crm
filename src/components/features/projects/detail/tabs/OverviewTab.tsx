'use client';

import { Project } from '@/types/projects';
import { ViewMode } from '@/types/project-detail';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Package,
  FileText,
  Camera
} from 'lucide-react';
import { formatCurrency } from '@/lib/calculator-utils';
import { format } from 'date-fns';

interface OverviewTabProps {
  project: Project;
  viewMode: ViewMode;
}

export function OverviewTab({ project, viewMode }: OverviewTabProps) {
  if (viewMode === 'internal') {
    return <InternalOverview project={project} />;
  }
  return <CustomerOverview project={project} />;
}

function InternalOverview({ project }: { project: Project }) {
  // Calculate financial metrics
  const actualCost = project.actual_cost || project.budget * 0.72; // Mock 72% cost
  const profitAmount = project.budget - actualCost;
  const profitMargin = (profitAmount / project.budget) * 100;
  const marginStatus = profitMargin >= project.profit_margin ? 'healthy' : 'at-risk';

  // Mock team performance data
  const teamPerformance = [
    { team: 'Team A', efficiency: 95, status: 'excellent' },
    { team: 'Team B', efficiency: 78, status: 'needs-improvement' }
  ];

  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Contract Value</p>
              <p className="text-xl font-bold">{formatCurrency(project.budget)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Actual Cost</p>
              <p className="text-xl font-bold">{formatCurrency(actualCost)}</p>
              <p className="text-xs text-muted-foreground">{((actualCost / project.budget) * 100).toFixed(0)}% of budget</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profit Margin</p>
              <p className={`text-xl font-bold ${marginStatus === 'healthy' ? 'text-green-600' : 'text-yellow-600'}`}>
                {formatCurrency(profitAmount)}
              </p>
              <p className="text-xs text-muted-foreground">{profitMargin.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Margin Status</p>
              <Badge variant={marginStatus === 'healthy' ? 'default' : 'secondary'} className="mt-1">
                {marginStatus === 'healthy' ? '✓ On Target' : '⚠ Below Target'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Path Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Critical Path Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert>
              <AlertDescription>
                • Surface prep must finish by Friday - Currently at 70%
              </AlertDescription>
            </Alert>
            <Alert className="border-yellow-500">
              <AlertDescription className="text-yellow-800">
                • Primer delivery delayed - Follow up with supplier
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertDescription>
                • Inspector visit scheduled Monday - Ensure Area A & B ready
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamPerformance.map((team) => (
              <div key={team.team} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{team.team}</span>
                  <span className={`text-sm ${
                    team.status === 'excellent' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {team.efficiency}% efficiency
                  </span>
                </div>
                <Progress 
                  value={team.efficiency} 
                  className={team.status === 'excellent' ? '' : 'bg-yellow-100'}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <Button variant="outline" size="sm">View Detailed Analytics</Button>
              <Button variant="outline" size="sm">Export Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CustomerOverview({ project }: { project: Project }) {
  // Mock milestone data
  const milestones = [
    { name: 'Site Preparation', status: 'completed', date: '2024-01-15' },
    { name: 'Old Coating Removal', status: 'completed', date: '2024-01-18' },
    { name: 'Surface Assessment', status: 'completed', date: '2024-01-20' },
    { name: 'Surface Grinding', status: 'in-progress', progress: 70 },
    { name: 'Primer Application', status: 'upcoming', date: '2024-01-28' },
    { name: 'Final Coating', status: 'upcoming', date: '2024-02-05' }
  ];

  return (
    <div className="space-y-6">
      {/* Project Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
          <CardDescription>
            Current Phase: {project.current_phase}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Overall Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Completion</span>
                <span className="text-sm text-muted-foreground">{project.progress_percentage}%</span>
              </div>
              <Progress value={project.progress_percentage} className="h-3" />
            </div>

            {/* Phase Progress */}
            <div className="space-y-4">
              <p className="font-medium">Completed Phases:</p>
              {milestones.filter(m => m.status === 'completed').map((milestone, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="flex-1">{milestone.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(milestone.date), 'MMM d, yyyy')}
                  </span>
                </div>
              ))}
            </div>

            {/* Current Phase */}
            {milestones.find(m => m.status === 'in-progress') && (
              <div className="border-l-4 border-primary pl-4">
                <p className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  In Progress:
                </p>
                <div className="mt-2">
                  <p>{milestones.find(m => m.status === 'in-progress')?.name}</p>
                  <Progress 
                    value={milestones.find(m => m.status === 'in-progress')?.progress || 0} 
                    className="mt-2 h-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {milestones.find(m => m.status === 'in-progress')?.progress}% complete
                  </p>
                </div>
              </div>
            )}

            {/* Upcoming */}
            <div>
              <p className="font-medium mb-2">Upcoming:</p>
              {milestones.filter(m => m.status === 'upcoming').map((milestone, index) => (
                <div key={index} className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="flex-1">{milestone.name}</span>
                  <span className="text-sm">
                    {format(new Date(milestone.date), 'MMM d')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <Camera className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">View Photos</p>
              <p className="text-sm text-muted-foreground">12 new photos added</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Download Certificate</p>
              <p className="text-sm text-muted-foreground">Quality certificates</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Material Info</p>
              <p className="text-sm text-muted-foreground">Products used</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Section */}
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="font-medium">Questions about your project?</p>
            <p className="text-sm text-muted-foreground">
              Your project manager is available to help
            </p>
          </div>
          <div className="flex gap-2">
            <Button>Contact PM</Button>
            <Button variant="outline">Request Update</Button>
            <Button variant="outline">Schedule Visit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}