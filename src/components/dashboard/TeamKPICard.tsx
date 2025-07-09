'use client';

import { TeamKPI } from '@/types/dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/calculator-utils';
import { TrendingUp, Users, Target, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TeamKPICardProps {
  data: TeamKPI;
}

export function TeamKPICard({ data }: TeamKPICardProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team KPI - {data.team_name}
        </CardTitle>
        <CardDescription>
          {data.team_members_count} members • {data.active_members_today} active today
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Revenue Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Revenue Achievement</span>
            <span className="text-sm text-muted-foreground">
              {data.revenue_achievement_percentage}%
            </span>
          </div>
          <Progress value={data.revenue_achievement_percentage} className="h-2 mb-2" />
          <div className="flex justify-between text-sm">
            <span>{formatCurrency(data.total_revenue)}</span>
            <span className="text-muted-foreground">
              Target: {formatCurrency(data.revenue_target)}
            </span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <p className="text-2xl font-bold">{data.conversion_rate}%</p>
            <p className="text-xs text-muted-foreground">
              {data.qualified_leads}/{data.total_leads} leads
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <p className="text-2xl font-bold">{data.win_rate}%</p>
            <p className="text-xs text-muted-foreground">
              {data.quotes_won}/{data.total_quotes} quotes
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Pipeline Value</p>
            <p className="text-lg font-semibold">{formatCurrency(data.pipeline_value)}</p>
            <p className="text-xs text-muted-foreground">
              Avg: {formatCurrency(data.average_deal_size)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Sales Cycle</p>
            <p className="text-lg font-semibold">{data.average_sales_cycle_days} days</p>
            <p className="text-xs text-muted-foreground">Average duration</p>
          </div>
        </div>

        {/* Top Performers */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Top Performers
          </h4>
          <div className="space-y-2">
            {data.top_performers && data.top_performers.length > 0 ? (
              data.top_performers.slice(0, 3).map((member, index) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground">
                    #{index + 1}
                  </span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.deals_closed} deals closed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(member.revenue)}</p>
                  <p className="text-xs text-green-600">{member.achievement_percentage}%</p>
                </div>
              </div>
            ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No performance data available
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}