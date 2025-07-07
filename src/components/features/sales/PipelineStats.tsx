'use client';

import { Lead } from '@/types/sales';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  DollarSign,
  Target,
  Users,
  Thermometer,
  Activity,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PipelineStatsProps {
  leads: Lead[];
  className?: string;
}

export function PipelineStats({ leads, className }: PipelineStatsProps) {
  // Calculate statistics
  const activeLeads = leads.filter(l => !['won', 'lost'].includes(l.stage));
  const wonLeads = leads.filter(l => l.stage === 'won');
  const lostLeads = leads.filter(l => l.stage === 'lost');
  
  const totalPipelineValue = activeLeads.reduce((sum, l) => sum + (l.estimated_value || 0), 0);
  const wonValue = wonLeads.reduce((sum, l) => sum + (l.final_value || l.estimated_value || 0), 0);
  const avgDealSize = activeLeads.length > 0 ? totalPipelineValue / activeLeads.length : 0;
  
  const conversionRate = (wonLeads.length + activeLeads.length + lostLeads.length) > 0
    ? (wonLeads.length / (wonLeads.length + lostLeads.length)) * 100
    : 0;
    
  const avgTemperature = activeLeads.length > 0
    ? activeLeads.reduce((sum, l) => sum + l.temperature, 0) / activeLeads.length
    : 0;
    
  const hotLeads = activeLeads.filter(l => l.temperature_status === 'hot' || l.temperature_status === 'critical');
  const coldLeads = activeLeads.filter(l => l.temperature_status === 'cold');

  // Deal type breakdown
  const dealTypeBreakdown = {
    supply: activeLeads.filter(l => l.deal_type === 'supply').length,
    apply: activeLeads.filter(l => l.deal_type === 'apply').length,
    supply_apply: activeLeads.filter(l => l.deal_type === 'supply_apply').length,
  };

  // Stage breakdown
  const stageBreakdown = {
    lead: activeLeads.filter(l => l.stage === 'lead').length,
    qualified: activeLeads.filter(l => l.stage === 'qualified').length,
    negotiation: activeLeads.filter(l => l.stage === 'negotiation').length,
    closing: activeLeads.filter(l => l.stage === 'closing').length,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact',
    }).format(value);
  };

  const getTemperatureColor = (temp: number) => {
    if (temp <= 25) return 'text-blue-600';
    if (temp <= 50) return 'text-orange-600';
    if (temp <= 75) return 'text-red-600';
    return 'text-purple-600';
  };

  const getTemperatureEmoji = (temp: number) => {
    if (temp <= 25) return '🧊';
    if (temp <= 50) return '🔥';
    if (temp <= 75) return '🌋';
    return '⚡';
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {/* Total Pipeline Value */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Pipeline Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalPipelineValue)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {activeLeads.length} active deals
          </p>
          <div className="mt-2">
            <Progress value={33} className="h-1" />
          </div>
        </CardContent>
      </Card>

      {/* Average Temperature */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            Avg Temperature
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className={cn("text-2xl font-bold", getTemperatureColor(avgTemperature))}>
              {Math.round(avgTemperature)}°C
            </span>
            <span className="text-2xl">{getTemperatureEmoji(avgTemperature)}</span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs">
            <span className="text-red-600">🌋 Hot: {hotLeads.length}</span>
            <span className="text-blue-600">🧊 Cold: {coldLeads.length}</span>
          </div>
          <div className="mt-2">
            <Progress value={avgTemperature} className="h-1" />
          </div>
        </CardContent>
      </Card>

      {/* Conversion Rate */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Target className="h-4 w-4" />
            Conversion Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{conversionRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            {wonLeads.length} won / {lostLeads.length} lost
          </p>
          <div className="mt-2">
            <Progress value={conversionRate} className="h-1" />
          </div>
        </CardContent>
      </Card>

      {/* Won This Month */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Won This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(wonValue)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {wonLeads.length} deals closed
          </p>
          <div className="mt-2 text-xs text-green-600">
            Avg: {formatCurrency(wonLeads.length > 0 ? wonValue / wonLeads.length : 0)}
          </div>
        </CardContent>
      </Card>

      {/* Deal Type Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Deal Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-600">[S] Supply</span>
              <span className="font-medium">{dealTypeBreakdown.supply}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-600">[A] Apply</span>
              <span className="font-medium">{dealTypeBreakdown.apply}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-600">[S+A] Both</span>
              <span className="font-medium">{dealTypeBreakdown.supply_apply}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stage Funnel */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Pipeline Stages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Lead</span>
              <span className="font-medium">{stageBreakdown.lead}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Qualified</span>
              <span className="font-medium">{stageBreakdown.qualified}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Negotiation</span>
              <span className="font-medium">{stageBreakdown.negotiation}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Closing</span>
              <span className="font-medium">{stageBreakdown.closing}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Deal Size */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Avg Deal Size
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(avgDealSize)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Per active deal
          </p>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {activeLeads.reduce((sum, l) => sum + (l.activities?.length || 0), 0)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Activities this week
          </p>
        </CardContent>
      </Card>
    </div>
  );
}