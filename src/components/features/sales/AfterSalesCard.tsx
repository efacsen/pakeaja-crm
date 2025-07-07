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
  Calendar,
  Package,
  FileText,
  Truck,
  CheckCircle,
  MoreVertical,
  Phone,
  Mail,
  Shield,
  AlertCircle,
  DollarSign,
  User,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';
import { DealDetailDialog } from './DealDetailDialog';

interface AfterSalesCardProps {
  lead: Lead;
  onUpdate: () => void;
}

export function AfterSalesCard({ lead, onUpdate }: AfterSalesCardProps) {
  const [showDetail, setShowDetail] = useState(false);

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

  // Mock after-sales status - in real app would come from database
  const afterSalesStatus = {
    po_received: true,
    invoice_sent: true,
    payment_received: false,
    delivery_status: 'in_progress',
    warranty_months: lead.deal_type === 'apply' || lead.deal_type === 'supply_apply' ? 12 : 0,
    commission_paid: false,
  };

  const getDeliveryStatusIcon = () => {
    switch (afterSalesStatus.delivery_status) {
      case 'pending': return <Package className="h-4 w-4 text-gray-500" />;
      case 'in_progress': return <Truck className="h-4 w-4 text-blue-500" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDeliveryStatusLabel = () => {
    switch (afterSalesStatus.delivery_status) {
      case 'pending': return 'Pending Delivery';
      case 'in_progress': return 'In Transit';
      case 'delivered': return 'Delivered';
      default: return 'Unknown';
    }
  };

  return (
    <>
      <Card 
        className="bg-green-50 dark:bg-green-900/10 hover:shadow-md transition-all cursor-pointer group"
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
            <Badge className="bg-green-600 text-white">
              Won
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
          <p className="text-lg font-bold mt-2 text-green-700 dark:text-green-400">
            {formatCurrency(lead.final_value || lead.estimated_value || 0)}
          </p>

          {/* Status Indicators */}
          <div className="flex items-center gap-3 mt-3 text-xs">
            {afterSalesStatus.po_received && (
              <div className="flex items-center gap-1 text-green-600">
                <FileText className="h-3 w-3" />
                <span>PO</span>
              </div>
            )}
            {afterSalesStatus.invoice_sent && (
              <div className="flex items-center gap-1 text-blue-600">
                <DollarSign className="h-3 w-3" />
                <span>Invoice</span>
              </div>
            )}
            {afterSalesStatus.payment_received && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-3 w-3" />
                <span>Paid</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              {getDeliveryStatusIcon()}
              <span>{getDeliveryStatusLabel()}</span>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-3 border-gray-200 dark:border-gray-700" />

          {/* Metadata */}
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Won: {format(new Date(lead.closed_at || ''), 'dd MMM yyyy')}</span>
            </div>
            {lead.customer?.contact_person && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span>{lead.customer.contact_person}</span>
              </div>
            )}
            {afterSalesStatus.warranty_months > 0 && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Shield className="w-4 h-4" />
                <span>{afterSalesStatus.warranty_months} months warranty</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle phone call
                }}
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle email
                }}
              >
                <Mail className="h-4 w-4" />
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
                    View PO
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <DollarSign className="h-4 w-4 mr-2" />
                    View Invoice
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Truck className="h-4 w-4 mr-2" />
                    Track Delivery
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Shield className="h-4 w-4 mr-2" />
                    Warranty Details
                  </DropdownMenuItem>
                  {!afterSalesStatus.payment_received && (
                    <DropdownMenuItem className="text-orange-600">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Follow up Payment
                    </DropdownMenuItem>
                  )}
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
        onUpdate={onUpdate}
        canEdit={false}
      />
    </>
  );
}