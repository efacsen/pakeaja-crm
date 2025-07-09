'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, Clock, FileText, Users } from 'lucide-react';
import { format } from 'date-fns';
import { dailyReportsService, type DailyReportWithUser } from '@/lib/services/daily-reports-service';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { useAuth } from '@/contexts/auth-context';

export default function TeamReportsPage() {
  const { user } = useAuth();
  const { handleAsyncError } = useErrorHandler();
  const [reports, setReports] = useState<DailyReportWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    const loadTeamReports = async () => {
      setLoading(true);
      await handleAsyncError(
        async () => {
          const { data, error } = await dailyReportsService.getTeamReports(undefined, selectedDate);
          if (error) throw new Error(error);
          setReports(data || []);
        },
        {
          component: 'TeamReportsPage',
          action: 'loadTeamReports'
        }
      );
      setLoading(false);
    };

    loadTeamReports();
  }, [selectedDate, handleAsyncError]);

  const handleApprove = async (reportId: string) => {
    await handleAsyncError(
      async () => {
        const { data, error } = await dailyReportsService.approveReport(reportId);
        if (error) throw new Error(error);
        
        // Reload reports
        const { data: updatedReports, error: reloadError } = await dailyReportsService.getTeamReports(undefined, selectedDate);
        if (reloadError) throw new Error(reloadError);
        setReports(updatedReports || []);
      },
      {
        component: 'TeamReportsPage',
        action: 'approveReport'
      }
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'submitted':
        return <Badge variant="default">Submitted</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    total: reports.length,
    submitted: reports.filter(r => r.status === 'submitted').length,
    approved: reports.filter(r => r.status === 'approved').length,
    totalVisits: reports.reduce((sum, r) => sum + r.customer_visits, 0),
    totalCalls: reports.reduce((sum, r) => sum + r.calls_made, 0),
    totalDealsWon: reports.reduce((sum, r) => sum + r.deals_won, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          Team Daily Reports
        </h1>
        <p className="text-muted-foreground mt-1">Review and approve your team&apos;s daily reports</p>
      </div>

      {/* Date Selector */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(selectedDate), 'EEEE, dd MMMM yyyy')}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submitted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Customer Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Calls Made</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCalls}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Deals Won</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDealsWon}</div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Loading reports...</p>
            </CardContent>
          </Card>
        ) : reports.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No reports for this date</p>
            </CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{report.user_name}</CardTitle>
                    <CardDescription>{report.user_email}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(report.status)}
                    {report.status === 'submitted' && user?.role === 'manager' && (
                      <Button
                        size="sm"
                        onClick={() => handleApprove(report.id)}
                        className="ml-2"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Activity Metrics */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Visits</p>
                    <p className="font-semibold">{report.customer_visits}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Calls</p>
                    <p className="font-semibold">{report.calls_made}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Proposals</p>
                    <p className="font-semibold">{report.proposals_sent}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Won</p>
                    <p className="font-semibold text-green-600">{report.deals_won}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Lost</p>
                    <p className="font-semibold text-red-600">{report.deals_lost}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Follow-ups</p>
                    <p className="font-semibold">{report.follow_ups}</p>
                  </div>
                </div>

                {/* Summary */}
                {report.summary && (
                  <div>
                    <h4 className="font-semibold mb-1">Summary</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.summary}</p>
                  </div>
                )}

                {/* Challenges */}
                {report.challenges && (
                  <div>
                    <h4 className="font-semibold mb-1">Challenges</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.challenges}</p>
                  </div>
                )}

                {/* Tomorrow's Plan */}
                {report.tomorrow_plan && (
                  <div>
                    <h4 className="font-semibold mb-1">Tomorrow&apos;s Plan</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.tomorrow_plan}</p>
                  </div>
                )}

                {/* Timestamps */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                  {report.submitted_at && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Submitted: {format(new Date(report.submitted_at), 'HH:mm')}
                    </div>
                  )}
                  {report.approved_at && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Approved by {report.approved_by_name} at {format(new Date(report.approved_at), 'HH:mm')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}