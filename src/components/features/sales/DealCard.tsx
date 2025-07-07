'use client';

import { useState, useRef } from 'react';
import { Lead } from '@/types/sales';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Calendar,
  Activity,
  User,
  TrendingUp,
  Phone,
  Mail,
  FileText,
  MapPin,
  Package,
  Percent,
  FileEdit,
  UserPlus,
  Clock,
  MoreVertical,
  Thermometer,
  MessageSquare,
  Footprints
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DealDetailDialog } from './DealDetailDialog';
import { LogActivityDialog } from './LogActivityDialog';
import { mockPipelineService } from '@/lib/services/sales/mock-pipeline.service';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface DealCardProps {
  lead: Lead;
  onUpdate: () => void;
  canEdit?: boolean;
  showPrice?: boolean;
}

export function DealCard({ lead, onUpdate, canEdit = true, showPrice = true }: DealCardProps) {
  const { toast } = useToast();
  const [showDetail, setShowDetail] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [initialTab, setInitialTab] = useState('overview');

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
      case 'supply': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'apply': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'supply_apply': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatCurrency = (value: number) => {
    if (!showPrice) return '***';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getQuickActions = () => {
    const actions = {
      lead: [
        { icon: Phone, label: 'Call', action: 'phone_call' },
        { icon: Calendar, label: 'Schedule Meeting', action: 'meeting_scheduled' },
        { icon: Mail, label: 'Send Info', action: 'email_sent' }
      ],
      qualified: [
        { icon: FileText, label: 'Send Quote', action: 'quote_sent' },
        { icon: MapPin, label: 'Site Visit', action: 'site_visit' },
        { icon: Package, label: 'Check Stock', action: 'check_availability' }
      ],
      negotiation: [
        { icon: Percent, label: 'Offer Discount', action: 'apply_discount' },
        { icon: FileEdit, label: 'Revise Quote', action: 'quote_revised' },
        { icon: UserPlus, label: 'Escalate', action: 'escalate_manager' }
      ],
      closing: [
        { icon: FileText, label: 'Get PO', action: 'request_po' },
        { icon: Clock, label: 'Extend', action: 'extend_timeline' }
      ]
    };

    return actions[lead.stage as keyof typeof actions] || [];
  };

  const handleQuickAction = async (action: string) => {
    await mockPipelineService.logActivity(
      lead.id,
      action,
      `${action.replace('_', ' ').charAt(0).toUpperCase() + action.slice(1).replace('_', ' ')}`,
      0
    );

    await mockPipelineService.updateLeadTemperature(lead.id, action);

    toast({
      title: 'Activity Logged',
      description: 'Temperature updated based on activity',
    });

    onUpdate();
  };

  const lastActivity = lead.activities?.[0];
  
  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInitialTab('comments');
    setShowDetail(true);
  };

  return (
    <>
      <Card 
        className={cn(
          "bg-white dark:bg-gray-800 hover:shadow-md transition-all cursor-pointer group",
          !canEdit && "opacity-75"
        )}
        onClick={() => setShowDetail(true)}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary"
                className={cn("text-xs font-medium", getDealTypeColor(lead.deal_type))}
              >
                {getDealTypeLabel(lead.deal_type)}
              </Badge>
              {lead.is_from_canvassing && (
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  title="From canvassing visit"
                >
                  <Footprints className="h-3 w-3 mr-1" />
                  Field
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 relative"
                onClick={handleCommentClick}
              >
                <MessageSquare className="h-4 w-4" />
                {lead.unread_comment_count && lead.unread_comment_count > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    {lead.unread_comment_count}
                  </span>
                )}
              </Button>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Thermometer className="h-3 w-3" />
                <span>{lead.temperature}°</span>
              </div>
              <span className="text-lg">{getTemperatureEmoji(lead.temperature_status)}</span>
            </div>
          </div>

          {/* Company and Project */}
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
            {lead.customer?.company_name || lead.project_name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {lead.project_description || lead.project_name}
          </p>

          {/* Value */}
          <p className="text-lg font-bold mt-2">
            {formatCurrency(lead.estimated_value || 0)}
          </p>

          {/* Divider */}
          <hr className="my-3 border-gray-200 dark:border-gray-700" />

          {/* Metadata */}
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>In stage: {lead.days_in_stage} days</span>
            </div>
            {lastActivity && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Activity className="w-4 h-4" />
                <span className="truncate">Last: {lastActivity.title}</span>
              </div>
            )}
            {lead.customer?.contact_person && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span>{lead.customer.contact_person}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span>Probability: {lead.probability}%</span>
            </div>
            {lead.comment_count && lead.comment_count > 0 && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MessageSquare className="w-4 h-4" />
                <span>{lead.comment_count} comment{lead.comment_count > 1 ? 's' : ''}</span>
                {lead.unread_comment_count && lead.unread_comment_count > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs px-1 py-0">
                    {lead.unread_comment_count} new
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {canEdit && (
            <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-1">
                {getQuickActions().slice(0, 3).map((action, idx) => (
                  <Button
                    key={idx}
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickAction(action.action);
                    }}
                  >
                    <action.icon className="h-4 w-4" />
                  </Button>
                ))}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" variant="ghost" className="h-8 px-2">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      setShowActivity(true);
                    }}>
                      <Activity className="h-4 w-4 mr-2" />
                      Log Activity
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {lead.stage !== 'won' && lead.stage !== 'lost' && (
                      <>
                        <DropdownMenuItem 
                          className="text-green-600"
                          onClick={async (e) => {
                            e.stopPropagation();
                            // Handle win
                          }}
                        >
                          Mark as Won
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={async (e) => {
                            e.stopPropagation();
                            // Handle loss
                          }}
                        >
                          Mark as Lost
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <DealDetailDialog
        lead={lead}
        open={showDetail}
        onOpenChange={(open) => {
          setShowDetail(open);
          if (!open) {
            setInitialTab('overview'); // Reset tab when closing
          }
        }}
        onUpdate={onUpdate}
        canEdit={canEdit}
        initialTab={initialTab}
      />

      {/* Activity Dialog */}
      <LogActivityDialog
        lead={lead}
        open={showActivity}
        onOpenChange={setShowActivity}
        onSuccess={onUpdate}
      />
    </>
  );
}