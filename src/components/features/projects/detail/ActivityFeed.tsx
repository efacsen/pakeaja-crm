'use client';

import { ActivityItem, ViewMode } from '@/types/project-detail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  RefreshCw, 
  DollarSign, 
  Users, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Cloud,
  TrendingUp,
  Package,
  FileText,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  activities: ActivityItem[];
  viewMode: ViewMode;
  onRefresh: () => void;
}

const ACTIVITY_ICONS: Record<ActivityItem['type'], React.ReactNode> = {
  cost_alert: <DollarSign className="h-4 w-4" />,
  team_update: <Users className="h-4 w-4" />,
  qc_result: <CheckCircle className="h-4 w-4" />,
  payment: <DollarSign className="h-4 w-4" />,
  weather: <Cloud className="h-4 w-4" />,
  progress: <TrendingUp className="h-4 w-4" />,
  material: <Package className="h-4 w-4" />,
  milestone: <Calendar className="h-4 w-4" />,
  document: <FileText className="h-4 w-4" />
};

const SEVERITY_COLORS = {
  info: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800'
};

export function ActivityFeed({ activities, viewMode, onRefresh }: ActivityFeedProps) {
  // Filter activities based on view mode
  const visibleActivities = activities.filter(activity => 
    viewMode === 'internal' || activity.visibility === 'all'
  );

  // Group activities by time
  const groupActivities = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups: { [key: string]: ActivityItem[] } = {
      'Today': [],
      'Yesterday': [],
      'Earlier': []
    };

    visibleActivities.forEach(activity => {
      const activityDate = new Date(activity.timestamp);
      if (activityDate >= today) {
        groups['Today'].push(activity);
      } else if (activityDate >= yesterday) {
        groups['Yesterday'].push(activity);
      } else {
        groups['Earlier'].push(activity);
      }
    });

    return groups;
  };

  const groupedActivities = groupActivities();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">
          {viewMode === 'internal' ? 'Activity Feed' : 'Updates'}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-4">
          <div className="space-y-4 pb-4">
            {Object.entries(groupedActivities).map(([group, items]) => {
              if (items.length === 0) return null;
              
              return (
                <div key={group}>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    {group}
                  </p>
                  <div className="space-y-3">
                    {items.map((activity) => (
                      <div
                        key={activity.id}
                        className="relative border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "p-2 rounded-full",
                            activity.severity ? SEVERITY_COLORS[activity.severity] : 'bg-gray-100'
                          )}>
                            {ACTIVITY_ICONS[activity.type]}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{activity.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {activity.description}
                            </p>
                            {activity.user && (
                              <p className="text-xs text-muted-foreground">
                                by {activity.user.name} • {activity.user.role}
                              </p>
                            )}
                            {activity.metadata && viewMode === 'internal' && (
                              <div className="mt-2">
                                {activity.type === 'cost_alert' && activity.metadata.overagePercent && (
                                  <Badge variant="destructive" className="text-xs">
                                    +{activity.metadata.overagePercent}% over budget
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}