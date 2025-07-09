'use client';

import { GlassCard as Card, GlassCardContent as CardContent, GlassCardDescription as CardDescription, GlassCardHeader as CardHeader, GlassCardTitle as CardTitle } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, Users, TrendingUp, BarChart3, Calendar, Download } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function ReportsPage() {
  const { user } = useAuth();
  const isManager = user?.role === 'manager';

  const reportTypes = [
    {
      title: 'Team Daily Reports',
      description: 'Review and approve daily reports from your team members',
      icon: Users,
      href: '/dashboard/reports/team',
      enabled: isManager,
      badge: 'Manager Only'
    },
    {
      title: 'My Reports History',
      description: 'View your submitted daily reports and track your progress',
      icon: FileText,
      href: '/dashboard/reports/history',
      enabled: true
    },
    {
      title: 'Sales Performance',
      description: 'Analyze sales metrics, trends, and team performance',
      icon: TrendingUp,
      href: '/dashboard/reports/sales',
      enabled: false,
      badge: 'Coming Soon'
    },
    {
      title: 'Monthly Summary',
      description: 'Comprehensive monthly reports with insights and analytics',
      icon: Calendar,
      href: '/dashboard/reports/monthly',
      enabled: false,
      badge: 'Coming Soon'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Reports Center
        </h1>
        <p className="text-muted-foreground mt-1">Access various reports and analytics</p>
      </div>

      {/* Report Types Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {reportTypes.map((report) => (
          <Card key={report.href} className={!report.enabled ? 'opacity-60' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <report.icon className="h-8 w-8 text-primary" />
                {report.badge && (
                  <span className="text-xs bg-secondary px-2 py-1 rounded">
                    {report.badge}
                  </span>
                )}
              </div>
              <CardTitle>{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {report.enabled ? (
                <Link href={report.href}>
                  <Button className="w-full">
                    View Reports
                  </Button>
                </Link>
              ) : (
                <Button className="w-full" disabled>
                  {report.badge || 'Not Available'}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common reporting tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link href="/dashboard/daily-report">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Submit Today&apos;s Report
            </Button>
          </Link>
          <Button variant="outline" className="w-full justify-start" disabled>
            <Download className="h-4 w-4 mr-2" />
            Export Reports (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}