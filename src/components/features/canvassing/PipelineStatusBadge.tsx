'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  ArrowRight, 
  Activity,
  MessageSquare,
  Eye,
  UserPlus
} from 'lucide-react';
import { CanvassingReport } from '@/types/canvassing';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface PipelineStatusBadgeProps {
  report: CanvassingReport;
  leadData?: any; // In real app, this would be the lead data
  onConvertToLead?: () => void;
  onViewInPipeline?: () => void;
}

export function PipelineStatusBadge({ 
  report, 
  leadData,
  onConvertToLead,
  onViewInPipeline 
}: PipelineStatusBadgeProps) {
  // If report has a lead_id, it's in the pipeline
  if (report.lead_id) {
    return (
      <div className="rounded-lg border p-3 space-y-2 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="font-medium text-sm">In Pipeline</span>
            <ArrowRight className="h-3 w-3 text-gray-400" />
            <Badge variant="secondary" className="text-xs">
              Lead Stage
            </Badge>
            <span className="text-sm">• 🔥 Warm (50°C)</span>
          </div>
        </div>
        
        {leadData && (
          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
            <span>Last Activity: Quote sent (2 days ago)</span>
            {leadData.comment_count > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {leadData.comment_count} comments
              </span>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={onViewInPipeline}
          >
            <Eye className="h-3 w-3 mr-1" />
            View in Pipeline
          </Button>
          <Button size="sm" variant="outline">
            <Activity className="h-3 w-3 mr-1" />
            Add Activity
          </Button>
          <Button size="sm" variant="outline">
            <MessageSquare className="h-3 w-3 mr-1" />
            Comments (3)
          </Button>
        </div>
      </div>
    );
  }

  // If outcome is positive but no lead yet
  if (report.visit_outcome === 'interested' || report.visit_outcome === 'follow_up_needed') {
    return (
      <div className="rounded-lg border p-3 space-y-2 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="font-medium text-sm">Ready to Convert</span>
            <span className="text-xs text-gray-500">
              • Outcome: {report.visit_outcome === 'interested' ? 'Interested' : 'Follow-up Needed'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
          <span>Priority: {report.priority}</span>
          {report.next_action_date && (
            <span>Follow-up: {format(new Date(report.next_action_date), 'dd MMM')}</span>
          )}
        </div>
        
        <Button 
          size="sm" 
          className="w-full"
          onClick={onConvertToLead}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Move to Pipeline
        </Button>
      </div>
    );
  }

  // Otherwise, just show basic status
  return null;
}