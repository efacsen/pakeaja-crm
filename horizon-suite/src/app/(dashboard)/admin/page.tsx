'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building2, 
  Package, 
  FileText, 
  History,
  Settings,
  Database,
  Shield,
  Activity,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function AdminDashboard() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';

  const adminModules = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-500',
      stats: '12 Active Users'
    },
    {
      title: 'Companies',
      description: 'Manage companies and contacts',
      icon: Building2,
      href: '/admin/companies',
      color: 'bg-green-500',
      stats: '156 Companies'
    },
    {
      title: 'Materials',
      description: 'Manage products, principals, and pricing',
      icon: Package,
      href: '/admin/materials',
      color: 'bg-purple-500',
      stats: '234 Products'
    },
    {
      title: 'Coating Systems',
      description: 'Manage coating system templates',
      icon: FileText,
      href: '/admin/coating-systems',
      color: 'bg-orange-500',
      stats: '45 Templates',
      allowedRoles: ['superadmin', 'manager']
    },
    {
      title: 'Audit Logs',
      description: 'View system activity and rollback changes',
      icon: History,
      href: '/admin/audit',
      color: 'bg-red-500',
      stats: 'Last 24 hours'
    },
    {
      title: 'Settings',
      description: 'System configuration and preferences',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500',
      stats: 'System Config'
    },
    {
      title: 'Database',
      description: 'Direct database table management',
      icon: Database,
      href: '/admin/database',
      color: 'bg-indigo-500',
      stats: 'Advanced',
      superAdminOnly: true
    }
  ];

  const recentActivity = [
    { user: 'John Doe', action: 'Created new company', time: '5 minutes ago' },
    { user: 'Jane Smith', action: 'Updated material pricing', time: '1 hour ago' },
    { user: 'Admin', action: 'Added new user', time: '2 hours ago' },
    { user: 'System', action: 'Automatic backup completed', time: '3 hours ago' },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Manage your CRM system and configurations
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Logged in as</p>
          <p className="font-medium">{user?.name} ({user?.role})</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+23 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">Uptime last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4GB</div>
            <p className="text-xs text-muted-foreground">Database size</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module) => {
          // Check role-based access
          if (module.superAdminOnly && !isSuperAdmin) return null;
          if (module.allowedRoles && !module.allowedRoles.includes(user?.role || '')) {
            if (user?.role !== 'superadmin') return null;
          }

          const Icon = module.icon;
          return (
            <Link key={module.title} href={module.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${module.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm text-muted-foreground">{module.stats}</span>
                  </div>
                  <CardTitle className="mt-4">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system actions and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="text-sm font-medium">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4" asChild>
            <Link href="/admin/audit">View All Activity</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}