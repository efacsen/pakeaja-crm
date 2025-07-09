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
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalCalculations: 0,
    activeProjects: 0,
    monthlyRevenue: 0,
    canvassingToday: 0,
    canvassingMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('sales');
  const [viewingAs, setViewingAs] = useState<{
    userId: string;
    userName: string;
    userRole: UserRole;
  } | undefined>();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set user role based on actual user
    if (user && user.role) {
      setCurrentRole(user.role as UserRole);
    }
    // Only load dashboard data if user is available
    if (user && !authLoading) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user && !authLoading) {
      loadDashboardData(viewingAs?.userId);
    }
  }, [viewingAs, user, authLoading]);

  const loadDashboardData = async (userId?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Load dashboard data from Supabase
      const data = await dashboardService.getDashboardData(userId, viewingAs?.userRole);
      setDashboardData(data);

      // Load stats
      const statsData = await dashboardService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
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

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent mx-auto" />
          <p className="mt-2 text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error if no user
  if (!user) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-500">No user data available</p>
          <p className="mt-2 text-sm text-muted-foreground">Please try refreshing the page</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Show debug link if error occurs
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Dashboard Error</h3>
          <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
          <div className="mt-4 space-x-4">
            <a
              href="/dashboard/debug"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Open Debug Page
            </a>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Role Switcher for Superadmin only */}
      {user.role === 'admin' && (
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
          {dashboardData.team_kpi && (currentRole === 'admin' || currentRole === 'manager' || 
            (viewingAs && viewingAs.userRole === 'manager')) && (
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