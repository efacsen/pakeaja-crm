'use client';

import { Lead, LeadStage } from '@/types/sales';
import { Button } from '@/components/ui/button';
import {
  Phone,
  Mail,
  Calendar,
  FileText,
  MapPin,
  Package,
  Percent,
  FileEdit,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  lead: Lead;
  onAction: (action: string) => void;
  className?: string;
}

interface ActionConfig {
  icon: any;
  label: string;
  action: string;
  color?: string;
}

export function QuickActions({ lead, onAction, className }: QuickActionsProps) {
  const quickActionsByStage: Record<LeadStage, ActionConfig[]> = {
    lead: [
      { icon: Phone, label: 'Call', action: 'log_call' },
      { icon: Calendar, label: 'Schedule Meeting', action: 'schedule_meeting' },
      { icon: Mail, label: 'Send Info', action: 'send_email' }
    ],
    qualified: [
      { icon: FileText, label: 'Send Quote', action: 'send_quote' },
      { icon: MapPin, label: 'Site Visit', action: 'schedule_visit' },
      { icon: Package, label: 'Check Stock', action: 'check_availability' }
    ],
    negotiation: [
      { icon: Percent, label: 'Offer Discount', action: 'apply_discount' },
      { icon: FileEdit, label: 'Revise Quote', action: 'revise_quote' },
      { icon: UserPlus, label: 'Escalate', action: 'escalate_manager' }
    ],
    closing: [
      { icon: CheckCircle, label: 'Mark Won', action: 'mark_won', color: 'text-green-600' },
      { icon: XCircle, label: 'Mark Lost', action: 'mark_lost', color: 'text-red-600' },
      { icon: Clock, label: 'Extend', action: 'extend_timeline' }
    ],
    won: [
      { icon: FileText, label: 'View PO', action: 'view_po' },
      { icon: Package, label: 'Track Delivery', action: 'track_delivery' },
      { icon: Phone, label: 'Follow Up', action: 'follow_up' }
    ],
    lost: [
      { icon: Phone, label: 'Re-engage', action: 'reactivate' },
      { icon: FileText, label: 'Analysis', action: 'view_analysis' },
      { icon: Calendar, label: 'Set Reminder', action: 'set_reminder' }
    ]
  };

  const actions = quickActionsByStage[lead.stage] || [];

  return (
    <div className={cn("flex gap-1", className)}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.action}
            size="sm"
            variant="ghost"
            className={cn("h-8 px-2", action.color)}
            onClick={(e) => {
              e.stopPropagation();
              onAction(action.action);
            }}
            title={action.label}
          >
            <Icon className="h-4 w-4" />
            <span className="ml-1 hidden lg:inline">{action.label}</span>
          </Button>
        );
      })}
    </div>
  );
}