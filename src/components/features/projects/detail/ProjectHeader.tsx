'use client';

import { Project } from '@/types/projects';
import { ViewMode, MetricCard } from '@/types/project-detail';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Edit, 
  FileText, 
  MoreVertical, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  DollarSign,
  Clock
} from 'lucide-react';
import { formatCurrency } from '@/lib/calculator-utils';
import { differenceInDays, format } from 'date-fns';

interface ProjectHeaderProps {
  project: Project;
  viewMode: ViewMode;
}

export function ProjectHeader({ project, viewMode }: ProjectHeaderProps) {
  const endDate = new Date(project.end_date);
  const today = new Date();
  const daysLeft = differenceInDays(endDate, today);
  const isOverdue = daysLeft < 0 && project.status !== 'completed';

  // Calculate metrics based on view mode
  const getMetricCards = (): MetricCard[] => {
    const baseCards: MetricCard[] = [
      {
        id: 'progress',
        label: 'Complete',
        value: `${project.progress_percentage}%`,
        visibility: ['internal', 'customer'],
        color: project.progress_percentage === 100 ? 'success' : 'default'
      },
      {
        id: 'timeline',
        label: isOverdue ? 'Overdue' : 'Days Left',
        value: Math.abs(daysLeft),
        visibility: ['internal', 'customer'],
        color: isOverdue ? 'error' : daysLeft < 7 ? 'warning' : 'default'
      }
    ];

    if (viewMode === 'internal') {
      baseCards.push(
        {
          id: 'budget',
          label: 'Budget',
          value: formatCurrency(project.budget),
          visibility: ['internal'],
          trend: project.actual_cost && project.actual_cost > project.budget ? {
            value: ((project.actual_cost - project.budget) / project.budget) * 100,
            direction: 'up'
          } : undefined,
          color: project.actual_cost && project.actual_cost > project.budget ? 'error' : 'default'
        },
        {
          id: 'workers',
          label: 'Workers',
          value: project.assigned_crew?.length || 0,
          visibility: ['internal']
        }
      );
    } else {
      baseCards.push(
        {
          id: 'start_date',
          label: 'Start Date',
          value: format(new Date(project.start_date), 'MMM d, yyyy'),
          visibility: ['customer']
        },
        {
          id: 'status',
          label: 'Status',
          value: isOverdue ? 'Delayed' : 'On Schedule',
          visibility: ['customer'],
          color: isOverdue ? 'error' : 'success'
        }
      );
    }

    return baseCards.filter(card => card.visibility.includes(viewMode));
  };

  const metricCards = getMetricCards();

  // Show weather alert only for internal view
  const showWeatherAlert = viewMode === 'internal' && project.status === 'in_progress';

  return (
    <div className="space-y-4 mb-6">
      {/* Project Title and Info */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {project.name}
            <Badge variant={project.status === 'in_progress' ? 'default' : 'secondary'}>
              {project.status.replace('_', ' ')}
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1">
            {viewMode === 'internal' ? (
              <>
                Client: {project.customer_name} | PM: {project.project_manager || 'Unassigned'} 
                {project.profit_margin && ` | Margin: ${project.profit_margin}%`}
              </>
            ) : (
              <>
                Your Project Manager: {project.project_manager || 'TBD'} | 
                Contract: {project.project_number}
              </>
            )}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          {viewMode === 'internal' && (
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            {viewMode === 'internal' ? 'Export' : 'Download Report'}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {viewMode === 'internal' ? (
                <>
                  <DropdownMenuItem>View as Customer</DropdownMenuItem>
                  <DropdownMenuItem>Generate Report</DropdownMenuItem>
                  <DropdownMenuItem>Archive Project</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>Contact PM</DropdownMenuItem>
                  <DropdownMenuItem>Request Update</DropdownMenuItem>
                  <DropdownMenuItem>Download Documents</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metricCards.map((metric) => (
          <Card key={metric.id} className={`
            ${metric.color === 'error' ? 'border-red-500' : ''}
            ${metric.color === 'warning' ? 'border-yellow-500' : ''}
            ${metric.color === 'success' ? 'border-green-500' : ''}
          `}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className={`text-2xl font-bold
                      ${metric.color === 'error' ? 'text-red-600' : ''}
                      ${metric.color === 'warning' ? 'text-yellow-600' : ''}
                      ${metric.color === 'success' ? 'text-green-600' : ''}
                    `}>
                      {metric.value}
                    </p>
                    {metric.trend && (
                      <div className={`flex items-center text-sm ${
                        metric.trend.direction === 'up' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {metric.trend.direction === 'up' ? 
                          <TrendingUp className="h-4 w-4" /> : 
                          <TrendingDown className="h-4 w-4" />
                        }
                        {metric.trend.value.toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {metric.id === 'progress' && (
                <Progress value={project.progress_percentage} className="mt-2 h-2" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      {showWeatherAlert && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Weather Alert:</strong> Rain expected tomorrow - reschedule outdoor work
          </AlertDescription>
        </Alert>
      )}

      {viewMode === 'customer' && project.next_milestone && (
        <Alert className="border-green-500 bg-green-50">
          <AlertDescription className="text-green-800">
            <strong>Next Milestone:</strong> {project.next_milestone} (5 days)
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}