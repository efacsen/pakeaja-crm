'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Footprints,
  MessageSquare,
  ArrowRight,
  Building2,
  User,
  Clock,
  Thermometer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Lead, LEAD_STAGES } from '@/types/sales';
import { mockPipelineService } from '@/lib/services/sales/mock-pipeline.service';
import { useToast } from '@/hooks/use-toast';

export function CanvassingPipelineTab() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCanvassingLeads();
  }, []);

  const loadCanvassingLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await mockPipelineService.getLeads();
      
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to load pipeline leads',
          variant: 'destructive',
        });
      } else if (data) {
        // Filter only leads from canvassing
        const canvassingLeads = data.filter(lead => lead.is_from_canvassing);
        setLeads(canvassingLeads);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(value).replace('rb', 'M').replace('jt', 'B');
  };

  const getTemperatureEmoji = (status: string) => {
    switch (status) {
      case 'cold': return '🧊';
      case 'warm': return '🔥';
      case 'hot': return '🌋';
      case 'critical': return '⚡';
      default: return '🧊';
    }
  };

  const getDealTypeLabel = (type: string) => {
    switch (type) {
      case 'supply': return '[S]';
      case 'apply': return '[A]';
      case 'supply_apply': return '[S+A]';
      default: return '[?]';
    }
  };

  const getDealTypeColor = (type: string) => {
    switch (type) {
      case 'supply': return 'bg-blue-500 text-white';
      case 'apply': return 'bg-green-500 text-white';
      case 'supply_apply': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Group leads by stage
  const leadsByStage = leads.reduce((acc, lead) => {
    if (!acc[lead.stage]) {
      acc[lead.stage] = [];
    }
    acc[lead.stage].push(lead);
    return acc;
  }, {} as Record<string, Lead[]>);

  // Calculate stats
  const stats = {
    totalLeads: leads.length,
    totalValue: leads.reduce((sum, lead) => sum + (lead.estimated_value || 0), 0),
    avgTemperature: leads.length > 0 
      ? Math.round(leads.reduce((sum, lead) => sum + lead.temperature, 0) / leads.length)
      : 0,
    hotLeads: leads.filter(lead => lead.temperature >= 75).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Leads from Canvassing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.hotLeads} hot leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pipeline Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From field visits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgTemperature}°C</div>
            <div className="text-xs mt-1">
              {stats.avgTemperature <= 25 && '🧊 Cold'}
              {stats.avgTemperature > 25 && stats.avgTemperature <= 50 && '🔥 Warm'}
              {stats.avgTemperature > 50 && stats.avgTemperature <= 75 && '🌋 Hot'}
              {stats.avgTemperature > 75 && '⚡ Critical'}
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Visit to deal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline View */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your Canvassing Pipeline
          </h3>
          <Button variant="outline" size="sm">
            View Full Pipeline
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {LEAD_STAGES.filter(stage => stage.id !== 'lost').map(stage => (
              <div 
                key={stage.id}
                className="flex-shrink-0 w-80"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <h4 className="font-semibold">{stage.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {leadsByStage[stage.id]?.length || 0}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(
                      leadsByStage[stage.id]?.reduce((sum, l) => sum + (l.estimated_value || 0), 0) || 0
                    )}
                  </span>
                </div>

                <div className="space-y-3">
                  {leadsByStage[stage.id]?.map(lead => (
                    <Card 
                      key={lead.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <Badge 
                            className={cn(
                              "text-xs font-bold px-1.5 py-0.5",
                              getDealTypeColor(lead.deal_type)
                            )}
                          >
                            {getDealTypeLabel(lead.deal_type)}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Thermometer className="h-3 w-3 text-gray-400" />
                            <span className="text-sm font-medium">{lead.temperature}°C</span>
                            <span className="text-lg">{getTemperatureEmoji(lead.temperature_status)}</span>
                          </div>
                        </div>

                        <h5 className="font-semibold text-sm mb-1 line-clamp-1">
                          {lead.project_name}
                        </h5>
                        
                        <div className="space-y-1 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {lead.customer?.company_name || 'No customer'}
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {formatCurrency(lead.estimated_value || 0)} • {lead.probability}%
                          </div>
                          <div className="flex items-center gap-1">
                            <Footprints className="h-3 w-3" />
                            Canvassing {lead.canvassing_report_id ? format(new Date(lead.created_at), 'dd MMM') : ''}
                          </div>
                          {lead.comment_count && lead.comment_count > 0 && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {lead.comment_count} comment{lead.comment_count > 1 ? 's' : ''}
                              {lead.unread_comment_count && lead.unread_comment_count > 0 && (
                                <span className="text-blue-600 font-medium"> • {lead.unread_comment_count} new</span>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {(!leadsByStage[stage.id] || leadsByStage[stage.id].length === 0) && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Legend */}
      <div className="text-xs text-muted-foreground flex items-center gap-4">
        <span className="flex items-center gap-1">
          <Footprints className="h-3 w-3" />
          = Canvassing origin
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          = Comments
        </span>
      </div>
    </div>
  );
}