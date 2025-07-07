'use client';

import { useState, useRef, TouchEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  User, 
  Calendar,
  MapPin,
  TrendingUp,
  UserPlus,
  Eye,
  ChevronRight
} from 'lucide-react';
import { CanvassingReport } from '@/types/canvassing';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface SwipeableReportCardProps {
  report: CanvassingReport;
  onConvertToLead?: () => void;
  onViewDetails?: () => void;
  getOutcomeColor: (outcome: string) => string;
  getOutcomeLabel: (outcome: string) => string;
  getSegmentLabel: (segment: string) => string;
}

export function SwipeableReportCard({
  report,
  onConvertToLead,
  onViewDetails,
  getOutcomeColor,
  getOutcomeLabel,
  getSegmentLabel
}: SwipeableReportCardProps) {
  const [swipeX, setSwipeX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startXRef = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

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

  const handleTouchStart = (e: TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isSwiping) return;
    
    const currentX = e.touches[0].clientX;
    const diff = startXRef.current - currentX;
    
    // Only allow left swipe (negative values)
    if (diff > 0 && diff < 120) {
      setSwipeX(-diff);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    
    // If swiped more than 60px, keep it open, otherwise close
    if (Math.abs(swipeX) > 60) {
      setSwipeX(-100);
    } else {
      setSwipeX(0);
    }
  };

  const canConvert = !report.lead_id && 
    (report.visit_outcome === 'interested' || report.visit_outcome === 'follow_up_needed');

  return (
    <div className="relative overflow-hidden">
      {/* Action buttons revealed on swipe */}
      <div className="absolute right-0 top-0 bottom-0 flex items-center pr-2">
        {canConvert ? (
          <Button
            size="sm"
            className="h-full rounded-l-none bg-green-600 hover:bg-green-700"
            onClick={onConvertToLead}
          >
            <UserPlus className="h-5 w-5" />
            <span className="ml-2">Pipeline</span>
          </Button>
        ) : report.lead_id ? (
          <Button
            size="sm"
            variant="secondary"
            className="h-full rounded-l-none"
            onClick={() => window.location.href = '/dashboard/sales'}
          >
            <Eye className="h-5 w-5" />
            <span className="ml-2">View Lead</span>
          </Button>
        ) : null}
      </div>

      {/* Main card content */}
      <div
        ref={cardRef}
        className={cn(
          "relative bg-background transition-transform duration-200",
          isSwiping && "transition-none"
        )}
        style={{ transform: `translateX(${swipeX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Card className="cursor-pointer" onClick={onViewDetails}>
          <CardContent className="p-4">
            {/* Header with outcome badge */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={cn("text-xs", getOutcomeColor(report.visit_outcome))}>
                    {getOutcomeLabel(report.visit_outcome)}
                  </Badge>
                  {report.priority === 'high' || report.priority === 'urgent' ? (
                    <Badge variant="destructive" className="text-xs">
                      {report.priority}
                    </Badge>
                  ) : null}
                </div>
                <h3 className="font-semibold text-lg">{report.company_name}</h3>
              </div>
              {report.lead_id && (
                <Badge variant="outline" className="text-xs text-green-600">
                  In Pipeline
                </Badge>
              )}
            </div>

            {/* Company details */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{report.contact_person} - {report.contact_position}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>{getSegmentLabel(report.project_segment)}</span>
              </div>

              {report.potential_value && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">{formatCurrency(report.potential_value)}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(report.visit_date), 'dd MMM yyyy')}</span>
              </div>

              {report.gps_latitude && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs">Location tracked</span>
                </div>
              )}
            </div>

            {/* Quick action indicators */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {report.photos.length > 0 && (
                  <span>{report.photos.length} photos</span>
                )}
                {report.next_action_date && (
                  <span>Follow-up: {format(new Date(report.next_action_date), 'dd MMM')}</span>
                )}
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}