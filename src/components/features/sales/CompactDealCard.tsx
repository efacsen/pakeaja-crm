'use client';

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
  Clock,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Phone,
  Mail,
  FileText,
  MapPin,
  Activity,
  Calendar,
  User,
  Building2,
  TrendingUp,
  MapPinned,
  Package,
  Percent,
  MessageSquare,
  Footprints,
  Edit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';
import { LogActivityDialog } from './LogActivityDialog';
import { CommentsSection } from './comments/CommentsSection';
import { mockPipelineService } from '@/lib/services/sales/mock-pipeline.service';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface CompactDealCardProps {
  lead: Lead;
  onUpdate: () => void;
  canEdit?: boolean;
  showPrice?: boolean;
}

export function CompactDealCard({ lead, onUpdate, canEdit = true, showPrice = true }: CompactDealCardProps) {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const commentSectionRef = useRef<HTMLDivElement>(null);

  const getDealTypeLabel = (type: string) => {
    switch (type) {
      case 'supply': return 'S';
      case 'apply': return 'A';
      case 'supply_apply': return 'S+A';
      default: return '?';
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

  const formatCurrency = (value: number) => {
    if (!showPrice) return '***';
    const formatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(value);
    return formatted.replace('rb', 'M').replace('jt', 'B');
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
        { icon: Edit, label: 'Revise Quote', action: 'quote_revised' },
        { icon: User, label: 'Escalate', action: 'escalate_manager' }
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
    if (!isExpanded) {
      setIsExpanded(true);
      // Wait for expansion animation then scroll to comments
      setTimeout(() => {
        commentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } else {
      // If already expanded, just scroll to comments
      commentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <Card 
        className={cn(
          "bg-white dark:bg-gray-800 hover:shadow-md transition-all group",
          !canEdit && "opacity-75",
          isExpanded && "shadow-lg"
        )}
      >
        <CardContent className="p-0">
          {/* Compact View */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              {/* Left side - Main info */}
              <div className="flex-1 min-w-0">
                {/* Project name with deal type badge */}
                <div className="flex items-center gap-2 mb-1">
                  <Badge 
                    className={cn(
                      "text-xs font-bold px-1.5 py-0.5 rounded",
                      getDealTypeColor(lead.deal_type)
                    )}
                  >
                    {getDealTypeLabel(lead.deal_type)}
                  </Badge>
                  {lead.is_from_canvassing && (
                    <Badge 
                      variant="outline" 
                      className="text-xs px-1.5 py-0.5"
                      title="From canvassing visit"
                    >
                      <Footprints className="h-3 w-3" />
                    </Badge>
                  )}
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate flex-1">
                    {lead.project_name}
                  </h3>
                </div>

                {/* Customer name */}
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {lead.customer?.company_name || 'No customer'}
                </p>

                {/* Sales rep */}
                <p className="text-sm text-gray-500 dark:text-gray-500 truncate flex items-center gap-1 mt-1">
                  <User className="h-3 w-3" />
                  {lead.assigned_to}
                </p>
              </div>

              {/* Right side - Value, probability and days */}
              <div className="flex flex-col items-end gap-1">
                {/* Value and probability */}
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(lead.estimated_value || 0)}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                    <TrendingUp className="h-3 w-3" />
                    {lead.probability}%
                  </p>
                </div>

                {/* Days in stage and comment button */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{lead.days_in_stage}</span>
                  </div>
                  
                  {/* Comment Icon Button */}
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
                </div>
              </div>
            </div>

            {/* Comment indicator at bottom */}
            {lead.comment_count && lead.comment_count > 0 && (
              <div className="mt-2 pt-2 border-t dark:border-gray-700">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MessageSquare className="h-3 w-3" />
                  <span>{lead.comment_count} comment{lead.comment_count > 1 ? 's' : ''}</span>
                  {lead.unread_comment_count && lead.unread_comment_count > 0 && (
                    <Badge variant="secondary" className="ml-auto text-xs px-1 py-0">
                      {lead.unread_comment_count} new
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Expand/Collapse button */}
            <div className="flex justify-center mt-2 -mb-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          {/* Expanded View - Full Details */}
          {isExpanded && (
            <div className="px-4 pb-4 border-t dark:border-gray-700 animate-in slide-in-from-top-2">
              <div className="pt-4 space-y-4">
                {/* Deal Information */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Deal Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Stage</p>
                      <p className="font-medium capitalize">{lead.stage}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Temperature</p>
                      <p className="font-medium">{lead.temperature}°C ({lead.temperature_status})</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Expected Close</p>
                      <p className="font-medium">
                        {lead.expected_close_date 
                          ? format(new Date(lead.expected_close_date), 'dd MMM yyyy')
                          : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Lead Source</p>
                      <p className="font-medium capitalize">{lead.source || 'Unknown'}</p>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                {lead.customer && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Customer Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      {lead.customer.contact_person && (
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-gray-400" />
                          <span>{lead.customer.contact_person}</span>
                        </div>
                      )}
                      {lead.customer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{lead.customer.phone}</span>
                        </div>
                      )}
                      {lead.customer.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span>{lead.customer.email}</span>
                        </div>
                      )}
                      {lead.customer.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-3 w-3 text-gray-400 mt-0.5" />
                          <span>{lead.customer.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Activities */}
                {lead.activities && lead.activities.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Recent Activities
                    </h4>
                    <div className="space-y-2">
                      {lead.activities.slice(0, 3).map((activity, idx) => (
                        <div key={idx} className="text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{activity.title}</span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(activity.created_at), 'dd MMM')}
                            </span>
                          </div>
                          {activity.description && (
                            <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                          )}
                        </div>
                      ))}
                      {lead.activities.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{lead.activities.length - 3} more activities
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Communication & Next Actions */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Communication & Follow-up
                  </h4>
                  <div className="space-y-3 text-sm">
                    {/* Last Communication */}
                    {lastActivity && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-500">Last Communication</span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(lastActivity.created_at), 'dd MMM yyyy, HH:mm')}
                          </span>
                        </div>
                        <p className="font-medium">{lastActivity.title}</p>
                        {lastActivity.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {lastActivity.description}
                          </p>
                        )}
                        {lastActivity.outcome && (
                          <div className="mt-2 text-xs">
                            <span className="text-gray-500">Outcome: </span>
                            <span className="font-medium">{lastActivity.outcome}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Next Action */}
                    {lastActivity?.next_action && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-500">Next Action Required</span>
                          {lastActivity.next_action_date && (
                            <span className="text-xs text-gray-500">
                              Due: {format(new Date(lastActivity.next_action_date), 'dd MMM yyyy')}
                            </span>
                          )}
                        </div>
                        <p className="font-medium flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {lastActivity.next_action}
                        </p>
                      </div>
                    )}

                    {/* Communication Summary */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500">Total Communications</span>
                        <p className="font-medium">{lead.activities?.length || 0} interactions</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Response Time</span>
                        <p className="font-medium">Avg: 2.5 days</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div ref={commentSectionRef}>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Comments
                  </h4>
                  <CommentsSection
                    leadId={lead.id}
                    currentUserId="demo-user"
                    currentUserName="Current User"
                    currentUserRole="sales_rep"
                    onCommentAdded={(comment) => {
                      lead.comment_count = (lead.comment_count || 0) + 1;
                      lead.last_comment_at = comment.created_at;
                      lead.last_comment_by = comment.author_name;
                    }}
                  />
                </div>

                {/* Actions */}
                {canEdit && (
                  <div className="border-t dark:border-gray-700 pt-4">
                    <div className="flex gap-2">
                      {getQuickActions().map((action, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAction(action.action);
                          }}
                        >
                          <action.icon className="h-4 w-4 mr-1" />
                          <span className="text-xs">{action.label}</span>
                        </Button>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowActivity(true);
                        }}
                      >
                        <Activity className="h-4 w-4 mr-1" />
                        Log Activity
                      </Button>
                      {lead.stage !== 'won' && lead.stage !== 'lost' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-green-600"
                            onClick={async (e) => {
                              e.stopPropagation();
                              // Handle win
                            }}
                          >
                            Mark Won
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-red-600"
                            onClick={async (e) => {
                              e.stopPropagation();
                              // Handle loss
                            }}
                          >
                            Mark Lost
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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