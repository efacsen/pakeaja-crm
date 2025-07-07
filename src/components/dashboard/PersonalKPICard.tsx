'use client';

import { PersonalKPI } from '@/types/dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/calculator-utils';
import { 
  TrendingUp, 
  Target, 
  MapPin, 
  FileText,
  Phone,
  Mail,
  Calendar,
  Flame,
  Users
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PersonalKPICardProps {
  data: PersonalKPI;
}

export function PersonalKPICard({ data }: PersonalKPICardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Personal KPI
            </CardTitle>
            <CardDescription>
              {data.user_name} • Rank #{data.rank_in_team} in team
            </CardDescription>
          </div>
          <Badge variant={data.achievement_percentage >= 100 ? 'default' : 'secondary'}>
            {data.achievement_percentage}% of target
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Revenue Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Revenue Achievement</span>
            <span className="text-sm text-muted-foreground">
              {formatCurrency(data.personal_revenue)}
            </span>
          </div>
          <Progress value={data.achievement_percentage} className="h-2 mb-2" />
          <div className="text-xs text-muted-foreground text-right">
            Target: {formatCurrency(data.personal_target)}
          </div>
        </div>

        {/* Activity Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <MapPin className="h-4 w-4" />
                Visits
              </div>
              <p className="text-xl font-semibold">
                {data.visits_completed}/{data.visits_target}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <FileText className="h-4 w-4" />
                Quotes
              </div>
              <p className="text-xl font-semibold">
                {data.quotes_won}/{data.quotes_created}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Users className="h-4 w-4" />
                Leads
              </div>
              <p className="text-xl font-semibold">
                {data.leads_qualified}/{data.leads_assigned}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                Follow-ups
              </div>
              <p className="text-xl font-semibold text-orange-600">
                {data.follow_ups_pending}
              </p>
            </div>
          </div>
        </div>

        {/* Today's Activities */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Today's Activities</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center mb-1">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold">{data.calls_made}</p>
              <p className="text-xs text-muted-foreground">Calls</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold">{data.emails_sent}</p>
              <p className="text-xs text-muted-foreground">Emails</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold">{data.meetings_scheduled}</p>
              <p className="text-xs text-muted-foreground">Meetings</p>
            </div>
          </div>
        </div>

        {/* Streaks */}
        <div className="flex items-center justify-around border-t pt-4">
          <div className="text-center">
            <div className="flex items-center gap-1 mb-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-lg font-bold">{data.daily_visit_streak}</span>
            </div>
            <p className="text-xs text-muted-foreground">Day streak</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 mb-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-lg font-bold">{data.weekly_target_streak}</span>
            </div>
            <p className="text-xs text-muted-foreground">Week streak</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}