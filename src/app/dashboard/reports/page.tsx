'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, DollarSign, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReportsPage() {
  const reportTypes = [
    {
      title: 'Sales Performance',
      description: 'Monthly sales targets and achievements',
      icon: TrendingUp,
      available: false,
    },
    {
      title: 'Team Analytics',
      description: 'Individual and team performance metrics',
      icon: Users,
      available: false,
    },
    {
      title: 'Revenue Report',
      description: 'Revenue breakdown by product and region',
      icon: DollarSign,
      available: false,
    },
    {
      title: 'Activity Summary',
      description: 'Daily and weekly activity reports',
      icon: FileText,
      available: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Sales Reports
        </h1>
        <p className="text-muted-foreground mt-1">Analytics and performance insights</p>
      </div>

      {/* Report Types Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {reportTypes.map((report) => (
          <Card key={report.title} className={!report.available ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <report.icon className="h-5 w-5" />
                {report.title}
              </CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                disabled={!report.available}
              >
                <Download className="h-4 w-4 mr-2" />
                {report.available ? 'Generate Report' : 'Coming Soon'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats - This Month</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Total Leads</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">0%</p>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">$0</p>
              <p className="text-sm text-muted-foreground">Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Active Deals</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}