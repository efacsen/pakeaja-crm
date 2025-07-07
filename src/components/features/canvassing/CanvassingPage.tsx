'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MapPin,
  Calendar,
  TrendingUp,
  Users,
  Building,
  RefreshCw,
  WifiOff,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  TrendingDown,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CanvassingForm } from './CanvassingForm';
import { CanvassingTable } from './CanvassingTable';
import { CanvassingStats } from './CanvassingStats';
import { CanvassingPipelineTab } from './CanvassingPipelineTab';
import { PipelineStatusBadge } from './PipelineStatusBadge';
import { CanvassingReportFilters } from '@/types/canvassing';
import { canvassingService } from '@/lib/services/canvassing-service';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';

export function CanvassingPage() {
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState<CanvassingReportFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [offlineCount, setOfflineCount] = useState(0);
  const [showConversionSuccess, setShowConversionSuccess] = useState(false);
  const [lastConvertedLead, setLastConvertedLead] = useState<any>(null);

  const { toast } = useToast();

  // Load reports
  const loadReports = async () => {
    setLoading(true);
    try {
      const searchFilters = searchQuery ? { ...filters, search: searchQuery } : filters;
      const { data, error } = await canvassingService.listReports(
        searchFilters,
        pagination.page,
        pagination.limit
      );

      if (error) {
        throw new Error(error);
      }

      if (data) {
        setReports(data.reports);
        setPagination(prev => ({ ...prev, total: data.total }));
        
        // Count offline reports
        const offline = data.reports.filter(r => !r.is_synced).length;
        setOfflineCount(offline);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      toast({
        title: "Error",
        description: "Gagal memuat laporan canvassing",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadReports();
  }, [pagination.page, pagination.limit]);

  // Search and filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      loadReports();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters]);

  // Sync offline reports
  const handleSyncOffline = async () => {
    setIsSyncing(true);
    try {
      const result = await canvassingService.syncOfflineReports();
      
      toast({
        title: "Sinkronisasi Selesai",
        description: `${result.synced} laporan berhasil dikirim, ${result.failed} gagal`,
      });

      loadReports();
    } catch (error) {
      toast({
        title: "Sinkronisasi Gagal",
        description: "Terjadi kesalahan saat sinkronisasi",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    loadReports();
  };

  // Handle convert to lead
  const handleConvertToLead = async (report: any) => {
    try {
      const result = await canvassingService.convertToLead(report.id);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      if (result.data) {
        setLastConvertedLead(result.data);
        setShowConversionSuccess(true);
        await loadReports();
        
        toast({
          title: "Lead Created Successfully!",
          description: `${report.company_name} has been added to your sales pipeline`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert to lead",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const getOutcomeColor = (outcome: string) => {
    const colors: Record<string, string> = {
      interested: 'bg-green-100 text-green-800',
      not_interested: 'bg-red-100 text-red-800',
      follow_up_needed: 'bg-yellow-100 text-yellow-800',
      already_customer: 'bg-blue-100 text-blue-800',
      competitor_locked: 'bg-gray-100 text-gray-800',
    };
    return colors[outcome] || 'bg-gray-100 text-gray-800';
  };

  const getOutcomeLabel = (outcome: string) => {
    const labels: Record<string, string> = {
      interested: 'Tertarik',
      not_interested: 'Tidak Tertarik',
      follow_up_needed: 'Perlu Follow Up',
      already_customer: 'Sudah Customer',
      competitor_locked: 'Terikat Kompetitor',
    };
    return labels[outcome] || outcome;
  };

  const getSegmentLabel = (segment: string) => {
    const labels: Record<string, string> = {
      decorative: 'Decorative',
      floor: 'Floor Coatings',
      marine: 'Marine',
      protective: 'Protective',
      steel: 'Steel',
      waterproofing: 'Waterproofing',
      others: 'Lainnya',
    };
    return labels[segment] || segment;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Laporan Canvassing</h1>
          <p className="text-muted-foreground">
            Kelola laporan kunjungan tim sales
          </p>
        </div>
        
        <div className="flex gap-2">
          {offlineCount > 0 && (
            <Button 
              variant="outline" 
              onClick={handleSyncOffline}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sinkronisasi...
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 mr-2" />
                  Sync {offlineCount} Offline
                </>
              )}
            </Button>
          )}
          
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Laporan Baru
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            All Reports
            {reports.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {reports.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* All Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          {/* Stats Cards */}
          <CanvassingStats />

          {/* Search and Filters */}
          <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari perusahaan atau kontak..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Select
                value={filters.visit_outcome || 'all'}
                onValueChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    visit_outcome: value === 'all' ? undefined : value as any 
                  }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Hasil Kunjungan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Hasil</SelectItem>
                  <SelectItem value="interested">Tertarik</SelectItem>
                  <SelectItem value="not_interested">Tidak Tertarik</SelectItem>
                  <SelectItem value="follow_up_needed">Perlu Follow Up</SelectItem>
                  <SelectItem value="already_customer">Sudah Customer</SelectItem>
                  <SelectItem value="competitor_locked">Terikat Kompetitor</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.project_segment || 'all'}
                onValueChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    project_segment: value === 'all' ? undefined : value as any 
                  }))
                }
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Segmen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Segmen</SelectItem>
                  <SelectItem value="decorative">Decorative</SelectItem>
                  <SelectItem value="floor">Floor Coatings</SelectItem>
                  <SelectItem value="marine">Marine</SelectItem>
                  <SelectItem value="protective">Protective</SelectItem>
                  <SelectItem value="steel">Steel</SelectItem>
                  <SelectItem value="waterproofing">Waterproofing</SelectItem>
                  <SelectItem value="others">Lainnya</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                placeholder="Dari tanggal"
                value={filters.date_from || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))}
                className="w-[140px]"
              />

              <Input
                type="date"
                placeholder="Sampai tanggal"
                value={filters.date_to || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, date_to: e.target.value }))}
                className="w-[140px]"
              />

              {(searchQuery || Object.keys(filters).length > 0) && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CanvassingTable
            reports={reports}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
            onConvertToLead={handleConvertToLead}
            getOutcomeColor={getOutcomeColor}
            getOutcomeLabel={getOutcomeLabel}
            getSegmentLabel={getSegmentLabel}
          />
        </CardContent>
      </Card>
        </TabsContent>

        {/* Pipeline Tab */}
        <TabsContent value="pipeline" className="space-y-6">
          <CanvassingPipelineTab />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-12 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">Analytics Coming Soon</p>
            <p className="text-sm mt-2">Track conversion rates, performance metrics, and more</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* New Report Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Laporan Canvassing Baru</DialogTitle>
            <DialogDescription>
              Isi form berikut untuk membuat laporan kunjungan baru
            </DialogDescription>
          </DialogHeader>
          <CanvassingForm 
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Conversion Success Dialog */}
      <Dialog open={showConversionSuccess} onOpenChange={setShowConversionSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center">Lead Created Successfully!</DialogTitle>
            <DialogDescription className="text-center">
              {lastConvertedLead && (
                <span>{lastConvertedLead.project_name} has been added to your sales pipeline</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {lastConvertedLead && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Stage:</span>
                  <span className="font-medium">Lead</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Temperature:</span>
                  <span className="font-medium">{lastConvertedLead.temperature}°C ({lastConvertedLead.temperature_status})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Assigned to:</span>
                  <span className="font-medium">You</span>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <Button
                className="flex-1"
                onClick={() => {
                  setShowConversionSuccess(false);
                  // Navigate to pipeline
                  window.location.href = '/dashboard/sales';
                }}
              >
                <Target className="h-4 w-4 mr-2" />
                View in Pipeline
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConversionSuccess(false)}
              >
                Stay Here
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}