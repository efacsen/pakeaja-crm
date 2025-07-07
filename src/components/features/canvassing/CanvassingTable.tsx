'use client';

import React, { useState } from 'react';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  MapPin,
  Phone,
  Mail,
  Calendar,
  Building,
  User,
  Camera,
  WifiOff,
  CheckCircle,
  UserPlus
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CanvassingReport } from '@/types/canvassing';
import { formatCurrency } from '@/lib/calculator-utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { PipelineStatusBadge } from './PipelineStatusBadge';
import { SwipeableReportCard } from './SwipeableReportCard';

interface CanvassingTableProps {
  reports: CanvassingReport[];
  loading?: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange: (page: number) => void;
  onConvertToLead?: (report: CanvassingReport) => void;
  getOutcomeColor: (outcome: string) => string;
  getOutcomeLabel: (outcome: string) => string;
  getSegmentLabel: (segment: string) => string;
}

export function CanvassingTable({
  reports,
  loading = false,
  pagination,
  onPageChange,
  onConvertToLead,
  getOutcomeColor,
  getOutcomeLabel,
  getSegmentLabel,
}: CanvassingTableProps) {
  const [selectedReport, setSelectedReport] = useState<CanvassingReport | null>(null);

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd MMM yyyy', { locale: id });
  };

  const getPotentialDisplay = (report: CanvassingReport) => {
    switch (report.potential_type) {
      case 'area':
        return report.potential_area ? `${report.potential_area.toLocaleString()} m²` : '-';
      case 'materials':
        return report.potential_materials || '-';
      case 'value':
        return report.potential_value ? formatCurrency(report.potential_value) : '-';
      default:
        return '-';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Building className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Belum ada laporan canvassing</h3>
        <p className="text-muted-foreground mb-4">
          Mulai buat laporan kunjungan pertama Anda
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {reports.map((report) => (
          <SwipeableReportCard
            key={report.id}
            report={report}
            onConvertToLead={() => onConvertToLead?.(report)}
            onViewDetails={() => {
              // Handle view details
            }}
            getOutcomeColor={getOutcomeColor}
            getOutcomeLabel={getOutcomeLabel}
            getSegmentLabel={getSegmentLabel}
          />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Perusahaan</TableHead>
              <TableHead>Kontak</TableHead>
              <TableHead>Hasil</TableHead>
              <TableHead>Segmen</TableHead>
              <TableHead>Potensi</TableHead>
              <TableHead>Follow Up</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <React.Fragment key={report.id}>
              <TableRow>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">{formatDate(report.visit_date)}</div>
                    <div className="text-muted-foreground">
                      {report.sales_rep_name}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div>
                    <div className="font-medium flex items-center gap-1">
                      {report.company_name}
                      {report.gps_latitude && (
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    {report.company_address && (
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {report.company_address}
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div>
                    <div className="font-medium">{report.contact_person}</div>
                    <div className="text-sm text-muted-foreground">
                      {report.contact_position}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {report.contact_phone && (
                        <Phone className="h-3 w-3 text-muted-foreground" />
                      )}
                      {report.contact_email && (
                        <Mail className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge className={getOutcomeColor(report.visit_outcome)}>
                    {getOutcomeLabel(report.visit_outcome)}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <Badge variant="outline">
                    {getSegmentLabel(report.project_segment)}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">
                      {getPotentialDisplay(report)}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  {report.next_action && report.next_action_date ? (
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(report.next_action_date)}
                      </div>
                      <div className="text-muted-foreground">
                        {report.next_action}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    {!report.is_synced && (
                      <Badge variant="outline" className="gap-1">
                        <WifiOff className="h-3 w-3" />
                        Offline
                      </Badge>
                    )}
                    {report.photos.length > 0 && (
                      <Badge variant="outline" className="gap-1">
                        <Camera className="h-3 w-3" />
                        {report.photos.length}
                      </Badge>
                    )}
                    {report.auto_created_lead && (
                      <Badge variant="outline" className="gap-1 text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Lead
                      </Badge>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Laporan
                      </DropdownMenuItem>
                      {!report.lead_id && (report.visit_outcome === 'interested' || report.visit_outcome === 'follow_up_needed') && (
                        <DropdownMenuItem onClick={() => onConvertToLead?.(report)}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Convert to Lead
                        </DropdownMenuItem>
                      )}
                      {report.lead_id && (
                        <DropdownMenuItem>
                          <User className="h-4 w-4 mr-2" />
                          Lihat Lead
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              {/* Pipeline Status Row */}
              {(report.lead_id || report.visit_outcome === 'interested' || report.visit_outcome === 'follow_up_needed') && (
                <TableRow>
                  <TableCell colSpan={9} className="p-2 bg-gray-50 dark:bg-gray-800/50">
                    <PipelineStatusBadge
                      report={report}
                      onConvertToLead={() => onConvertToLead?.(report)}
                      onViewInPipeline={() => {
                        window.location.href = '/dashboard/sales';
                      }}
                    />
                  </TableCell>
                </TableRow>
              )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Menampilkan {((pagination.page - 1) * pagination.limit) + 1} hingga{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} dari{' '}
            {pagination.total} laporan
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => onPageChange(pagination.page - 1)}
            >
              Sebelumnya
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, i) => {
                const page = i + 1;
                const isCurrentPage = page === pagination.page;
                const showPage = page === 1 || 
                                page === Math.ceil(pagination.total / pagination.limit) ||
                                Math.abs(page - pagination.page) <= 2;
                
                if (!showPage) {
                  if (page === pagination.page - 3 || page === pagination.page + 3) {
                    return <span key={page} className="px-2">...</span>;
                  }
                  return null;
                }
                
                return (
                  <Button
                    key={page}
                    variant={isCurrentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
              onClick={() => onPageChange(pagination.page + 1)}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}