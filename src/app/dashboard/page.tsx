'use client';

import { useState, useEffect } from 'react';

// Force dynamic rendering to avoid static generation issues with auth
export const dynamic = 'force-dynamic';
import { 
  Calculator, 
  Users, 
  FileText, 
  TrendingUp,
  DollarSign,
  Building,
  Package,
  Activity,
  MapPin
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ProjectStatusChart } from '@/components/dashboard/ProjectStatusChart';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { TopCustomers } from '@/components/dashboard/TopCustomers';
import { formatCurrency } from '@/lib/calculator-utils';
import { dashboardService } from '@/lib/services/dashboard-service';
import { RoleSwitcher } from '@/components/dashboard/RoleSwitcher';
import { TeamKPICard } from '@/components/dashboard/TeamKPICard';
import { PersonalKPICard } from '@/components/dashboard/PersonalKPICard';
import { ProjectStatusCard } from '@/components/dashboard/ProjectStatusCard';
import { DashboardData, UserRole } from '@/types/dashboard';
import { useAuth } from '@/contexts/auth-context';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalCalculations: 0,
    activeProjects: 0,
    monthlyRevenue: 0,
    canvassingToday: 0,
    canvassingMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('sales_rep');
  const [viewingAs, setViewingAs] = useState<{
    userId: string;
    userName: string;
    userRole: UserRole;
  } | undefined>();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // Set user role based on actual user
    if (user) {
      setCurrentRole(user.role as UserRole);
    }
    loadDashboardData();
  }, [user]);

  useEffect(() => {
    loadDashboardData(viewingAs?.userId);
  }, [viewingAs]);

  const loadDashboardData = async (userId?: string) => {
    try {
      setLoading(true);
      
      // Load dashboard data from Supabase
      const data = await dashboardService.getDashboardData(userId, viewingAs?.userRole);
      setDashboardData(data);

      // Load stats
      const statsData = await dashboardService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSwitch = (role: UserRole, userId?: string) => {
    if (userId) {
      // Viewing as specific user
      const userName = userId === '1' ? 'Ahmad Wijaya' : 
                      userId === '2' ? 'Siti Nurhasanah' :
                      userId === '3' ? 'Budi Santoso' :
                      userId === '4' ? 'Dewi Lestari' :
                      'Rudi Hermawan';
      setViewingAs({ userId, userName, userRole: role });
    } else {
      // Viewing as role type
      setViewingAs(undefined);
      setCurrentRole(role);
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Switcher for Superadmin only */}
      {user?.role === 'superadmin' && (
        <RoleSwitcher
          currentRole={currentRole}
          viewingAs={viewingAs}
          onRoleSwitch={handleRoleSwitch}
        />
      )}

      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang di PakeAja CRM - Platform CRM coating & painting Anda
        </p>
      </div>

      {/* KPI Dashboard */}
      {dashboardData && (
        <div className="grid gap-6 lg:grid-cols-6">
          {/* Team KPI - visible to managers and above */}
          {dashboardData.team_kpi && (currentRole === 'superadmin' || currentRole === 'admin' || currentRole === 'sales_manager' || 
            (viewingAs && viewingAs.userRole === 'sales_manager')) && (
            <TeamKPICard data={dashboardData.team_kpi} />
          )}
          
          {/* Personal KPI - visible to sales roles */}
          {(currentRole !== 'viewer' && (!viewingAs || viewingAs.userRole !== 'viewer')) && (
            <PersonalKPICard data={dashboardData.personal_kpi} />
          )}
          
          {/* Project Status - visible to all */}
          <ProjectStatusCard projects={dashboardData.active_projects} />
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Customers"
          titleId="Total Pelanggan"
          value={stats.totalCustomers}
          description="Active customers"
          descriptionId="Pelanggan aktif"
          icon={Users}
          trend={{
            value: '+12%',
            isPositive: true,
          }}
        />
        <StatsCard
          title="Total Calculations"
          titleId="Total Perhitungan"
          value={stats.totalCalculations}
          description="Quotes created"
          descriptionId="Penawaran dibuat"
          icon={Calculator}
          trend={{
            value: '+24%',
            isPositive: true,
          }}
        />
        <StatsCard
          title="Active Projects"
          titleId="Proyek Aktif"
          value={stats.activeProjects}
          description="In progress"
          descriptionId="Sedang berjalan"
          icon={Package}
          trend={{
            value: '3 baru',
            isPositive: true,
          }}
        />
        <StatsCard
          title="Monthly Revenue"
          titleId="Pendapatan Bulanan"
          value={formatCurrency(stats.monthlyRevenue)}
          description="This month"
          descriptionId="Bulan ini"
          icon={DollarSign}
          trend={{
            value: '+18%',
            isPositive: true,
          }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-7">
        <RevenueChart />
        <ProjectStatusChart />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 md:grid-cols-7">
        <RecentActivities />
        <TopCustomers />
      </div>

      {/* Canvassing Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Canvassing Today"
          titleId="Canvassing Hari Ini"
          value={stats.canvassingToday}
          description="Visits today"
          descriptionId="Kunjungan hari ini"
          icon={MapPin}
          trend={{
            value: `${stats.canvassingMonth} bulan ini`,
            isPositive: true,
          }}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <a
          href="/dashboard/calculator"
          className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Buat Perhitungan</h3>
              <p className="text-sm text-muted-foreground">
                Hitung kebutuhan coating
              </p>
            </div>
          </div>
        </a>

        <a
          href="/dashboard/customers"
          className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Tambah Pelanggan</h3>
              <p className="text-sm text-muted-foreground">
                Daftarkan pelanggan baru
              </p>
            </div>
          </div>
        </a>

        <a
          href="/dashboard/canvassing"
          className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Laporan Canvassing</h3>
              <p className="text-sm text-muted-foreground">
                Buat laporan kunjungan
              </p>
            </div>
          </div>
        </a>

        <a
          href="/dashboard/reports"
          className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Lihat Laporan</h3>
              <p className="text-sm text-muted-foreground">
                Analisis bisnis Anda
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}