'use client';

import { useState, useEffect, useRef } from 'react';
import { Lead, LeadStage, LEAD_STAGES, DealType } from '@/types/sales';
import { mockPipelineService } from '@/lib/services/sales/mock-pipeline.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DealCard } from './DealCard';
import { CompactDealCard } from './CompactDealCard';
import { CreateLeadDialog } from './CreateLeadDialog';
import { AfterSalesCard } from './AfterSalesCard';
import { LostDealCard } from './LostDealCard';
import { PipelineStats } from './PipelineStats';
import { 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  DollarSign,
  Target,
  BarChart3,
  Kanban,
  List,
  LayoutGrid,
  Minimize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PipelineKanbanProps {
  viewMode?: 'full' | 'compact';
  userRole?: 'sales' | 'manager' | 'admin';
  userId?: string;
}

export function PipelineKanban({ 
  viewMode = 'full',
  userRole = 'sales',
  userId = 'demo-user'
}: PipelineKanbanProps) {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'pipeline' | 'outcomes'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<LeadStage | 'all'>('all');
  const [filterDealType, setFilterDealType] = useState<DealType | 'all'>('all');
  const [filterTemperature, setFilterTemperature] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadStage | null>(null);
  const [cardView, setCardView] = useState<'standard' | 'compact'>('compact');

  // Load leads
  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await mockPipelineService.getLeads();
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to load leads',
          variant: 'destructive',
        });
      } else if (data) {
        setLeads(data);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    if (searchQuery && !lead.project_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !lead.customer?.company_name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterStage !== 'all' && lead.stage !== filterStage) {
      return false;
    }
    if (filterDealType !== 'all' && lead.deal_type !== filterDealType) {
      return false;
    }
    if (filterTemperature !== 'all' && lead.temperature_status !== filterTemperature) {
      return false;
    }
    // For sales reps, they can see all leads but only edit their own
    if (userRole === 'sales' && viewMode === 'compact') {
      return lead.assigned_to === userId;
    }
    return true;
  });

  // Group leads by stage
  const leadsByStage = LEAD_STAGES.reduce((acc, stage) => {
    if (stage.id === 'won' || stage.id === 'lost') return acc;
    acc[stage.id] = filteredLeads.filter(lead => lead.stage === stage.id);
    return acc;
  }, {} as Record<LeadStage, Lead[]>);

  const wonLeads = filteredLeads.filter(lead => lead.stage === 'won');
  const lostLeads = filteredLeads.filter(lead => lead.stage === 'lost');

  // Calculate stats
  const stats = {
    totalLeads: leads.filter(l => !['won', 'lost'].includes(l.stage)).length,
    totalValue: leads
      .filter(l => !['won', 'lost'].includes(l.stage))
      .reduce((sum, l) => sum + (l.estimated_value || 0), 0),
    wonDeals: wonLeads.length,
    wonValue: wonLeads.reduce((sum, l) => sum + (l.final_value || 0), 0),
    avgTemperature: leads
      .filter(l => !['won', 'lost'].includes(l.stage))
      .reduce((sum, l, _, arr) => sum + l.temperature / arr.length, 0)
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, stage: LeadStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = async (e: React.DragEvent, stage: LeadStage) => {
    e.preventDefault();
    setDragOverStage(null);

    if (!draggedLead || draggedLead.stage === stage) return;

    // Check permissions
    if (userRole === 'sales' && draggedLead.assigned_to !== userId) {
      toast({
        title: 'Permission Denied',
        description: 'You can only move your own leads',
        variant: 'destructive',
      });
      return;
    }

    // Move lead to new stage
    const { error } = await mockPipelineService.moveLeadStage(draggedLead.id, stage);
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to move lead',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `Lead moved to ${stage}`,
      });
      loadLeads();
    }

    setDraggedLead(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderPipelineView = () => (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {LEAD_STAGES.filter(stage => !['won', 'lost'].includes(stage.id)).map(stage => (
        <div
          key={stage.id}
          className={cn(
            "flex-shrink-0 w-80 bg-muted/30 rounded-lg p-4",
            dragOverStage === stage.id && "ring-2 ring-primary"
          )}
          onDragOver={(e) => handleDragOver(e, stage.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, stage.id)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: stage.color }}
              />
              <h3 className="font-semibold">{stage.name}</h3>
              <Badge variant="secondary" className="ml-2">
                {leadsByStage[stage.id]?.length || 0}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              {formatCurrency(
                leadsByStage[stage.id]?.reduce((sum, l) => sum + (l.estimated_value || 0), 0) || 0
              )}
            </span>
          </div>

          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-3">
              {leadsByStage[stage.id]?.map(lead => (
                <div
                  key={lead.id}
                  draggable={userRole === 'manager' || lead.assigned_to === userId}
                  onDragStart={(e) => handleDragStart(e, lead)}
                  className={cn(
                    "cursor-move",
                    (userRole === 'sales' && lead.assigned_to !== userId) && "cursor-not-allowed opacity-75"
                  )}
                >
                  {cardView === 'compact' ? (
                    <CompactDealCard
                      lead={lead}
                      onUpdate={loadLeads}
                      canEdit={userRole === 'manager' || lead.assigned_to === userId}
                      showPrice={userRole === 'manager' || lead.assigned_to === userId}
                    />
                  ) : (
                    <DealCard
                      lead={lead}
                      onUpdate={loadLeads}
                      canEdit={userRole === 'manager' || lead.assigned_to === userId}
                      showPrice={userRole === 'manager' || lead.assigned_to === userId}
                    />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      ))}
    </div>
  );

  const renderOutcomesView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Won Deals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            Won Deals
            <Badge variant="secondary">{wonLeads.length}</Badge>
          </h3>
          <span className="text-sm text-muted-foreground">
            {formatCurrency(wonLeads.reduce((sum, l) => sum + (l.final_value || 0), 0))}
          </span>
        </div>
        <ScrollArea className="h-[calc(100vh-350px)]">
          <div className="space-y-3">
            {wonLeads.map(lead => (
              <AfterSalesCard
                key={lead.id}
                lead={lead}
                onUpdate={loadLeads}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Lost Deals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            Lost Deals
            <Badge variant="secondary">{lostLeads.length}</Badge>
          </h3>
        </div>
        <ScrollArea className="h-[calc(100vh-350px)]">
          <div className="space-y-3">
            {lostLeads.map(lead => (
              <LostDealCard
                key={lead.id}
                lead={lead}
                onReactivate={loadLeads}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

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
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(stats.totalValue)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Won This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.wonDeals}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(stats.wonValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.avgTemperature)}°C</div>
            <div className="text-xs mt-1">
              {stats.avgTemperature <= 25 && '🧊 Cold'}
              {stats.avgTemperature > 25 && stats.avgTemperature <= 50 && '🔥 Warm'}
              {stats.avgTemperature > 50 && stats.avgTemperature <= 75 && '🌋 Hot'}
              {stats.avgTemperature > 75 && '⚡ Critical'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalLeads > 0 
                ? Math.round((stats.wonDeals / (stats.totalLeads + stats.wonDeals)) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Lead
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={filterStage} onValueChange={(value) => setFilterStage(value as LeadStage | 'all')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {LEAD_STAGES.map(stage => (
              <SelectItem key={stage.id} value={stage.id}>
                {stage.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterDealType} onValueChange={(value) => setFilterDealType(value as DealType | 'all')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="supply">[S] Supply Only</SelectItem>
            <SelectItem value="apply">[A] Apply Only</SelectItem>
            <SelectItem value="supply_apply">[S+A] Supply + Apply</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterTemperature} onValueChange={setFilterTemperature}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Temperatures" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Temperatures</SelectItem>
            <SelectItem value="cold">🧊 Cold (0-25°C)</SelectItem>
            <SelectItem value="warm">🔥 Warm (26-50°C)</SelectItem>
            <SelectItem value="hot">🌋 Hot (51-75°C)</SelectItem>
            <SelectItem value="critical">⚡ Critical (76-100°C)</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-1 border rounded-md p-1">
          <Button
            size="sm"
            variant={cardView === 'compact' ? 'default' : 'ghost'}
            className="px-2"
            onClick={() => setCardView('compact')}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={cardView === 'standard' ? 'default' : 'ghost'}
            className="px-2"
            onClick={() => setCardView('standard')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={view} onValueChange={(v) => setView(v as 'pipeline' | 'outcomes')}>
        <TabsList>
          <TabsTrigger value="pipeline" className="gap-2">
            <Kanban className="h-4 w-4" />
            Active Pipeline
          </TabsTrigger>
          <TabsTrigger value="outcomes" className="gap-2">
            <Target className="h-4 w-4" />
            Outcomes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="mt-6">
          {renderPipelineView()}
        </TabsContent>

        <TabsContent value="outcomes" className="mt-6">
          {renderOutcomesView()}
        </TabsContent>
      </Tabs>

      {/* Create Lead Dialog */}
      <CreateLeadDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={loadLeads}
      />
    </div>
  );
}