'use client';

import { useState, useEffect } from 'react';
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
import { customerDb, calculationDb } from '@/lib/db/mock-db';
import { formatCurrency } from '@/lib/calculator-utils';
import { canvassingService } from '@/lib/services/canvassing-service';
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
    // Set user role - in a real app, this would come from the user's profile
    // For demo purposes, we'll assume superadmin to show role switching
    setCurrentRole('superadmin');
    loadDashboardData();
  }, []);

  useEffect(() => {
    loadDashboardData(viewingAs?.userId);
  }, [viewingAs]);

  const loadDashboardData = async (userId?: string) => {
    try {
      setLoading(true);
      
      // Load customers
      const customers = await customerDb.getAll();
      
      // Load calculations
      const calculations = await calculationDb.getAll();
      
      // Calculate stats
      const activeProjects = calculations.filter(c => c.status === 'draft').length;
      const completedThisMonth = calculations.filter(c => {
        if (c.status !== 'completed') return false;
        const date = new Date(c.created_at);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      });
      
      const monthlyRevenue = completedThisMonth.reduce((sum, c) => sum + (c.total_cost || 0), 0);

      // Load canvassing stats
      const { data: canvassingStats } = await canvassingService.getStats();

      setStats({
        totalCustomers: customers.length,
        totalCalculations: calculations.length,
        activeProjects,
        monthlyRevenue,
        canvassingToday: canvassingStats?.visits_today || 0,
        canvassingMonth: canvassingStats?.visits_this_month || 0,
      });

      // Generate mock KPI data based on role/user
      const mockDashboardData: DashboardData = {
        team_kpi: {
          id: '1',
          team_id: 'team-jakarta',
          team_name: 'Team Jakarta',
          period: 'monthly',
          total_revenue: 2850000000,
          revenue_target: 3000000000,
          revenue_achievement_percentage: 95,
          total_leads: 48,
          qualified_leads: 32,
          conversion_rate: 67,
          total_visits: 156,
          total_quotes: 28,
          quotes_won: 18,
          win_rate: 64,
          pipeline_value: 4500000000,
          average_deal_size: 250000000,
          average_sales_cycle_days: 21,
          top_performers: [
            { id: '1', name: 'Ahmad Wijaya', revenue: 950000000, deals_closed: 6, achievement_percentage: 118 },
            { id: '2', name: 'Siti Nurhasanah', revenue: 780000000, deals_closed: 5, achievement_percentage: 97 },
            { id: '3', name: 'Budi Santoso', revenue: 620000000, deals_closed: 4, achievement_percentage: 78 },
          ],
          team_members_count: 8,
          active_members_today: 6,
        },
        personal_kpi: {
          id: '1',
          user_id: userId || 'user-1',
          user_name: viewingAs?.userName || 'Ahmad Wijaya',
          period: 'monthly',
          personal_revenue: 950000000,
          personal_target: 800000000,
          achievement_percentage: 118,
          rank_in_team: 1,
          visits_completed: 28,
          visits_target: 30,
          quotes_created: 12,
          quotes_won: 6,
          leads_assigned: 15,
          leads_contacted: 12,
          leads_qualified: 8,
          follow_ups_pending: 4,
          activities_today: 8,
          calls_made: 12,
          emails_sent: 8,
          meetings_scheduled: 3,
          daily_visit_streak: 5,
          weekly_target_streak: 3,
        },
        active_projects: [
          {
            id: '1',
            project_name: 'Coating Pabrik PT Sinar Jaya',
            client_name: 'PT Sinar Jaya Konstruksi',
            status: 'in_progress',
            progress_percentage: 65,
            start_date: '2024-01-15',
            end_date: '2024-03-30',
            days_remaining: 45,
            is_overdue: false,
            contract_value: 850000000,
            invoiced_amount: 550000000,
            paid_amount: 400000000,
            outstanding_amount: 150000000,
            total_milestones: 5,
            completed_milestones: 3,
            current_milestone: 'Aplikasi Cat Eksterior',
            next_milestone_date: '2024-02-28',
            project_manager: 'Rudi Hermawan',
            team_members: ['Ahmad', 'Budi', 'Citra'],
            risk_level: 'low',
            issues_count: 1,
          },
          {
            id: '2',
            project_name: 'Waterproofing Mall Central',
            client_name: 'CV Mitra Abadi',
            status: 'planning',
            progress_percentage: 15,
            start_date: '2024-03-01',
            end_date: '2024-05-15',
            days_remaining: 75,
            is_overdue: false,
            contract_value: 425000000,
            invoiced_amount: 0,
            paid_amount: 0,
            outstanding_amount: 0,
            total_milestones: 4,
            completed_milestones: 0,
            current_milestone: 'Persiapan dan Survey',
            next_milestone_date: '2024-03-10',
            project_manager: 'Dewi Lestari',
            team_members: ['Eko', 'Fitri'],
            risk_level: 'medium',
            issues_count: 2,
          },
        ],
        recent_activities: [],
        notifications: [],
      };

      // Adjust data based on viewing role
      if (viewingAs?.userRole === 'sales_rep') {
        // Sales reps only see their personal data, not full team
        mockDashboardData.team_kpi.top_performers = mockDashboardData.team_kpi.top_performers.slice(0, 1);
      } else if (viewingAs?.userRole === 'project_manager') {
        // Project managers focus on projects
        mockDashboardData.personal_kpi.visits_completed = 0;
        mockDashboardData.personal_kpi.quotes_created = 0;
      }

      setDashboardData(mockDashboardData);
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
      {/* Role Switcher for Superadmin */}
      {currentRole === 'superadmin' && (
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
          {(currentRole === 'superadmin' || currentRole === 'admin' || currentRole === 'sales_manager' || 
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