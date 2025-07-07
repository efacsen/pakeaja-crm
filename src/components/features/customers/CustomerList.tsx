'use client';

import { Customer, calculationDb } from '@/lib/db/mock-db';
import { useState, useEffect } from 'react';
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
import { MoreHorizontal, Edit, Trash, Mail, Phone, Building, Calculator, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

interface CustomerListProps {
  customers: Customer[];
  loading?: boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export function CustomerList({ 
  customers, 
  loading, 
  onEdit, 
  onDelete 
}: CustomerListProps) {
  const router = useRouter();
  const [calculationCounts, setCalculationCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load calculation counts for each customer
    const loadCalculationCounts = async () => {
      const counts: Record<string, number> = {};
      for (const customer of customers) {
        const calculations = await calculationDb.getByCustomer(customer.id);
        counts[customer.id] = calculations.length;
      }
      setCalculationCounts(counts);
    };
    
    if (customers.length > 0) {
      loadCalculationCounts();
    }
  }, [customers]);

  const handleNewCalculation = (customerId: string) => {
    router.push(`/dashboard/calculator?customerId=${customerId}`);
  };

  const handleViewCalculations = (customerId: string) => {
    router.push(`/dashboard/calculations?customerId=${customerId}`);
  };
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          Belum ada pelanggan. Klik &quot;Tambah Pelanggan&quot; untuk memulai.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama / Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telepon / Phone</TableHead>
            <TableHead>Perusahaan / Company</TableHead>
            <TableHead>Kota / City</TableHead>
            <TableHead>Perhitungan</TableHead>
            <TableHead className="text-right">Aksi / Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>
                <a 
                  href={`mailto:${customer.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-3 w-3" />
                  {customer.email}
                </a>
              </TableCell>
              <TableCell>
                {customer.phone ? (
                  <a 
                    href={`tel:${customer.phone}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone className="h-3 w-3" />
                    {customer.phone}
                  </a>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {customer.company ? (
                  <span className="flex items-center gap-2">
                    <Building className="h-3 w-3 text-muted-foreground" />
                    {customer.company}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {customer.city || <span className="text-muted-foreground">-</span>}
              </TableCell>
              <TableCell>
                {calculationCounts[customer.id] > 0 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewCalculations(customer.id)}
                    className="text-xs"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    {calculationCounts[customer.id]} perhitungan
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-sm">0 perhitungan</span>
                )}
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
                    <DropdownMenuItem onClick={() => handleNewCalculation(customer.id)}>
                      <Calculator className="mr-2 h-4 w-4" />
                      Buat Perhitungan
                    </DropdownMenuItem>
                    {calculationCounts[customer.id] > 0 && (
                      <DropdownMenuItem onClick={() => handleViewCalculations(customer.id)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Lihat Perhitungan
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit(customer)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(customer.id)}
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