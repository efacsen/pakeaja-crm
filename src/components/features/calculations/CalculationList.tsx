'use client';

import { Calculation } from '@/lib/db/mock-db';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Copy, 
  CheckCircle,
  Send,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/calculator-utils';
import { format } from 'date-fns';

interface CalculationListProps {
  calculations: Calculation[];
  loading?: boolean;
  onEdit: (calculation: Calculation) => void;
  onDelete: (id: string) => void;
  onDuplicate: (calculation: Calculation) => void;
  onUpdateStatus: (id: string, status: 'draft' | 'completed' | 'sent') => void;
}

const statusConfig = {
  draft: {
    label: 'Draft',
    labelId: 'Draft',
    variant: 'secondary' as const,
  },
  completed: {
    label: 'Completed',
    labelId: 'Selesai',
    variant: 'default' as const,
  },
  sent: {
    label: 'Sent',
    labelId: 'Terkirim',
    variant: 'default' as const, // Badge doesn't have 'success' variant
  },
};

export function CalculationList({ 
  calculations, 
  loading, 
  onEdit, 
  onDelete,
  onDuplicate,
  onUpdateStatus,
}: CalculationListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (calculations.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          Belum ada perhitungan. Klik &quot;Buat Perhitungan&quot; untuk memulai.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Proyek</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Lokasi</TableHead>
            <TableHead>Total Area</TableHead>
            <TableHead>Total Biaya</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calculations.map((calculation) => (
            <TableRow key={calculation.id}>
              <TableCell className="font-medium">
                {calculation.project_name}
              </TableCell>
              <TableCell>
                {calculation.project_date ? (
                  <span className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(calculation.project_date), 'dd MMM yyyy')}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {calculation.project_address ? (
                  <span className="flex items-center gap-2 text-sm">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate max-w-[200px]" title={calculation.project_address}>
                      {calculation.project_address}
                    </span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {calculation.total_area ? (
                  <span>{calculation.total_area.toFixed(2)} m²</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {calculation.total_cost ? (
                  <span className="flex items-center gap-1 font-medium">
                    <DollarSign className="h-3 w-3" />
                    {formatCurrency(calculation.total_cost)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={statusConfig[calculation.status].variant}>
                  {statusConfig[calculation.status].labelId}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Buka menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit(calculation)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(calculation)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplikat
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {calculation.status === 'draft' && (
                      <DropdownMenuItem onClick={() => onUpdateStatus(calculation.id, 'completed')}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Tandai Selesai
                      </DropdownMenuItem>
                    )}
                    {calculation.status === 'completed' && (
                      <DropdownMenuItem onClick={() => onUpdateStatus(calculation.id, 'sent')}>
                        <Send className="mr-2 h-4 w-4" />
                        Tandai Terkirim
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDelete(calculation.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}