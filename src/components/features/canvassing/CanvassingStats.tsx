'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Calendar,
  MapPin,
  BarChart3,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/calculator-utils';
import { canvassingService } from '@/lib/services/canvassing-service';
import { CanvassingStats as CanvassingStatsType } from '@/types/canvassing';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export function CanvassingStats() {
  const [stats, setStats] = useState<CanvassingStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await canvassingService.getStats();
        if (data) {
          setStats(data);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const conversionRate = stats.total_visits > 0 
    ? ((stats.by_outcome.interested / stats.total_visits) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kunjungan</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_visits}</div>
            <p className="text-xs text-muted-foreground">
              {stats.visits_today} hari ini, {stats.visits_this_week} minggu ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Konversi</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.by_outcome.interested} dari {stats.total_visits} tertarik
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Potensi</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.total_potential_value)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.total_potential_area.toLocaleString()} m² area
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow Up</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming_follow_ups.length}</div>
            <p className="text-xs text-muted-foreground">
              Jadwal follow up mendatang
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Outcome Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hasil Kunjungan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Tertarik</span>
              <Badge className="bg-green-100 text-green-800">
                {stats.by_outcome.interested}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Perlu Follow Up</span>
              <Badge className="bg-yellow-100 text-yellow-800">
                {stats.by_outcome.follow_up_needed}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Sudah Customer</span>
              <Badge className="bg-blue-100 text-blue-800">
                {stats.by_outcome.already_customer}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Tidak Tertarik</span>
              <Badge className="bg-red-100 text-red-800">
                {stats.by_outcome.not_interested}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Terikat Kompetitor</span>
              <Badge className="bg-gray-100 text-gray-800">
                {stats.by_outcome.competitor_locked}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Segment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Segmen Proyek</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(stats.by_segment)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([segment, count]) => (
                <div key={segment} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{segment}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Top Sales Reps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Top Sales Rep
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.top_sales_reps.map((rep, index) => (
              <div key={rep.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">#{index + 1}</span>
                  <span className="text-sm">{rep.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{rep.visit_count} visit</Badge>
                  {rep.potential_value > 0 && (
                    <Badge variant="outline" className="text-green-600">
                      {formatCurrency(rep.potential_value)}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Follow-ups */}
      {stats.upcoming_follow_ups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Follow Up Mendatang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.upcoming_follow_ups.slice(0, 5).map((followUp) => (
                <div key={followUp.report_id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{followUp.company_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {followUp.sales_rep_name}
                    </div>
                  </div>
                  <Badge variant="outline">
                    {format(new Date(followUp.next_action_date), 'dd MMM', { locale: id })}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}