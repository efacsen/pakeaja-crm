'use client';

import { Lead, LOST_REASONS } from '@/types/sales';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Calendar,
  RefreshCw,
  FileText,
  AlertCircle,
  User,
  Building2,
  MoreVertical,
  TrendingDown,
  Clock,
  Ban,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';
import { DealDetailDialog } from './DealDetailDialog';
import { mockPipelineService } from '@/lib/services/sales/mock-pipeline.service';
import { useToast } from '@/hooks/use-toast';

interface LostDealCardProps {
  lead: Lead;
  onReactivate: () => void;
}

export function LostDealCard({ lead, onReactivate }: LostDealCardProps) {
  const { toast } = useToast();
  const [showDetail, setShowDetail] = useState(false);
  const [reactivating, setReactivating] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
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
      case 'supply': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'apply': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'supply_apply': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getLostReasonLabel = (reason: string) => {
    const reasonData = LOST_REASONS.find(r => r.id === reason);
    return reasonData?.name || 'Unknown reason';
  };

  const getLostReasonIcon = (reason: string) => {
    switch (reason) {
      case 'price': return <TrendingDown className="h-4 w-4" />;
      case 'timing': return <Clock className="h-4 w-4" />;
      case 'no_response': return <Ban className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleReactivate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setReactivating(true);
    
    try {
      // In real app, this would reactivate the lead
      const { error } = await mockPipelineService.reactivateLead(lead.id);
      
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to reactivate lead',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Lead reactivated successfully',
        });
        onReactivate();
      }
    } finally {
      setReactivating(false);
    }
  };

  // Calculate days since lost
  const daysSinceLost = lead.closed_at 
    ? Math.floor((Date.now() - new Date(lead.closed_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <>
      <Card 
        className="bg-gray-50 dark:bg-gray-900/10 hover:shadow-md transition-all cursor-pointer group opacity-75"
        onClick={() => setShowDetail(true)}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <Badge 
              variant="secondary"
              className={cn("text-xs font-medium", getDealTypeColor(lead.deal_type))}
            >
              {getDealTypeLabel(lead.deal_type)}
            </Badge>
            <Badge variant="secondary" className="bg-gray-600 text-white">
              Lost
            </Badge>
          </div>

          {/* Company and Project */}
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
            {lead.customer?.company_name || lead.project_name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
            {lead.project_name}
          </p>

          {/* Value */}
          <p className="text-lg font-bold mt-2 text-gray-500 line-through">
            {formatCurrency(lead.estimated_value || 0)}
          </p>

          {/* Lost Reason */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 text-red-600">
              {getLostReasonIcon(lead.lost_reason || '')}
              <span className="text-sm font-medium">{getLostReasonLabel(lead.lost_reason || '')}</span>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-3 border-gray-200 dark:border-gray-700" />

          {/* Metadata */}
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Lost: {lead.closed_at ? format(new Date(lead.closed_at), 'dd MMM yyyy') : 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{daysSinceLost} days ago</span>
            </div>
            {lead.customer?.contact_person && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span>{lead.customer.contact_person}</span>
              </div>
            )}
          </div>

          {/* Lost Analysis */}
          {lead.lost_notes && (
            <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm">
              <p className="text-red-700 dark:text-red-400 line-clamp-2">
                {lead.lost_notes}
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-green-600"
                onClick={handleReactivate}
                disabled={reactivating}
              >
                <RefreshCw className={cn("h-4 w-4", reactivating && "animate-spin")} />
                <span className="ml-1">Reactivate</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" variant="ghost" className="h-8 px-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    View Analysis
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="h-4 w-4 mr-2" />
                    Set Reminder
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Building2 className="h-4 w-4 mr-2" />
                    View Similar Won Deals
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <DealDetailDialog
        lead={lead}
        open={showDetail}
        onOpenChange={setShowDetail}
        onUpdate={onReactivate}
        canEdit={false}
      />
    </>
  );
}