'use client';

import { useState, useEffect } from 'react';
import { Lead, LeadActivity } from '@/types/sales';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Thermometer,
  Activity as ActivityIcon,
  User,
  Clock,
  FileText,
  Edit,
  CheckCircle,
  XCircle,
  TrendingUp,
  Package,
  Target,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { mockPipelineService } from '@/lib/services/sales/mock-pipeline.service';
import { useToast } from '@/hooks/use-toast';
import { CommentsSection } from './comments/CommentsSection';

interface DealDetailDialogProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
  canEdit?: boolean;
  initialTab?: string;
}

export function DealDetailDialog({
  lead,
  open,
  onOpenChange,
  onUpdate,
  canEdit = true,
  initialTab = 'overview',
}: DealDetailDialogProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const getTemperatureColor = (status: string) => {
    switch (status) {
      case 'cold': return 'text-blue-600';
      case 'warm': return 'text-orange-600';
      case 'hot': return 'text-red-600';
      case 'critical': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getDealTypeLabel = (type: string) => {
    switch (type) {
      case 'supply': return 'Supply Only [S]';
      case 'apply': return 'Apply Only [A]';
      case 'supply_apply': return 'Supply + Apply [S+A]';
      default: return 'Unknown';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleMarkWon = async () => {
    const { error } = await mockPipelineService.markLeadWon(lead.id, lead.estimated_value || 0);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark deal as won',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Deal marked as won!',
      });
      onUpdate();
      onOpenChange(false);
    }
  };

  const handleMarkLost = async () => {
    const { error } = await mockPipelineService.markLeadLost(lead.id, 'price');
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark deal as lost',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Deal marked as lost',
      });
      onUpdate();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">
                {lead.customer?.company_name || lead.project_name}
              </DialogTitle>
              <DialogDescription>
                {lead.project_name} • {getDealTypeLabel(lead.deal_type)}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Thermometer className={cn("h-5 w-5", getTemperatureColor(lead.temperature_status))} />
                <span className="text-2xl font-bold">{lead.temperature}°C</span>
                <span className="text-2xl">
                  {lead.temperature_status === 'cold' && '🧊'}
                  {lead.temperature_status === 'warm' && '🔥'}
                  {lead.temperature_status === 'hot' && '🌋'}
                  {lead.temperature_status === 'critical' && '⚡'}
                </span>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {lead.stage.charAt(0).toUpperCase() + lead.stage.slice(1)}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1 overflow-auto">
            <div className="space-y-6 p-4">
              {/* Deal Information */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Deal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Value</p>
                    <p className="font-semibold">{formatCurrency(lead.estimated_value || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Probability</p>
                    <p className="font-semibold">{lead.probability}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Close Date</p>
                    <p className="font-semibold">
                      {lead.expected_close_date ? format(new Date(lead.expected_close_date), 'dd MMM yyyy') : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Days in Stage</p>
                    <p className="font-semibold">{lead.days_in_stage} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lead Source</p>
                    <p className="font-semibold capitalize">{lead.source || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned To</p>
                    <p className="font-semibold">{lead.assigned_to}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Customer Information */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Customer Information
                </h3>
                {lead.customer && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Person</p>
                      <p className="font-semibold">{lead.customer.contact_person || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-semibold flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {lead.customer.phone || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-semibold flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {lead.customer.email || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Territory</p>
                      <p className="font-semibold">{lead.customer.territory || 'Not specified'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-semibold flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        {lead.customer.address || 'Not specified'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Project Details */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Project Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Project Description</p>
                    <p className="font-semibold">{lead.project_description || 'No description provided'}</p>
                  </div>
                  {lead.project_address && (
                    <div>
                      <p className="text-sm text-muted-foreground">Project Location</p>
                      <p className="font-semibold flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        {lead.project_address}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {canEdit && lead.stage !== 'won' && lead.stage !== 'lost' && (
                <>
                  <Separator />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      className="text-red-600"
                      onClick={handleMarkLost}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Mark as Lost
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleMarkWon}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Won
                    </Button>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="activities" className="flex-1 overflow-auto">
            <ScrollArea className="h-full">
              <div className="p-4">
                <div className="space-y-4">
                  {lead.activities?.map((activity, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <ActivityIcon className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{activity.title}</h4>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(activity.created_at), 'dd MMM yyyy HH:mm')}
                          </span>
                        </div>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {activity.created_by}
                          </span>
                          {activity.temperature_impact !== 0 && (
                            <span className={cn(
                              "flex items-center gap-1",
                              activity.temperature_impact > 0 ? "text-green-600" : "text-red-600"
                            )}>
                              <Thermometer className="h-3 w-3" />
                              {activity.temperature_impact > 0 ? '+' : ''}{activity.temperature_impact}°C
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!lead.activities || lead.activities.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      No activities recorded yet
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="comments" className="flex-1 overflow-auto">
            <div className="p-4">
              <CommentsSection
                leadId={lead.id}
                currentUserId="demo-user" // In real app, get from auth context
                currentUserName="Current User" // In real app, get from auth context
                currentUserRole="sales" // In real app, get from auth context
                onCommentAdded={(comment) => {
                  // Update lead comment count
                  lead.comment_count = (lead.comment_count || 0) + 1;
                  lead.last_comment_at = comment.created_at;
                  lead.last_comment_by = comment.author_name;
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="quotes" className="flex-1 overflow-auto">
            <div className="p-4 text-center py-8 text-muted-foreground">
              Quote management coming soon...
            </div>
          </TabsContent>

          <TabsContent value="notes" className="flex-1 overflow-auto">
            <div className="p-4 text-center py-8 text-muted-foreground">
              Notes feature coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}