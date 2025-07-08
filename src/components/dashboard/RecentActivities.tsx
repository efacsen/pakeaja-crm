import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  UserPlus, 
  FileText, 
  CheckCircle, 
  Clock,
  Send
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface Activity {
  id: string;
  type: 'calculation' | 'client' | 'quote' | 'project';
  action: string;
  actionId: string;
  description: string;
  timestamp: Date;
  icon: React.ReactNode;
  status?: 'success' | 'pending' | 'info';
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'calculation',
    action: 'New Calculation',
    actionId: 'Perhitungan Baru',
    description: 'PT ABC - Warehouse Coating Project',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    icon: <Calculator className="h-4 w-4" />,
    status: 'success',
  },
  {
    id: '2',
    type: 'client',
    action: 'Customer Added',
    actionId: 'Pelanggan Ditambahkan',
    description: 'PT XYZ Indonesia',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    icon: <UserPlus className="h-4 w-4" />,
    status: 'info',
  },
  {
    id: '3',
    type: 'quote',
    action: 'Quote Sent',
    actionId: 'Penawaran Dikirim',
    description: 'Office Building Project - Rp 125.000.000',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    icon: <Send className="h-4 w-4" />,
    status: 'success',
  },
  {
    id: '4',
    type: 'project',
    action: 'Project Completed',
    actionId: 'Proyek Selesai',
    description: 'Mall Renovation - Floor Coating',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    icon: <CheckCircle className="h-4 w-4" />,
    status: 'success',
  },
  {
    id: '5',
    type: 'calculation',
    action: 'Draft Saved',
    actionId: 'Draft Disimpan',
    description: 'Factory Floor Coating Estimate',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    icon: <FileText className="h-4 w-4" />,
    status: 'pending',
  },
];

interface RecentActivitiesProps {
  activities?: Activity[];
  limit?: number;
}

export function RecentActivities({ 
  activities = mockActivities, 
  limit = 5 
}: RecentActivitiesProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Aktivitas Terbaru / Recent Activities</CardTitle>
        <CardDescription>
          Aktivitas terbaru dalam sistem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, limit).map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className={`rounded-full p-2 ${getStatusColor(activity.status)}`}>
                {activity.icon}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {activity.actionId}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { 
                      addSuffix: true,
                      locale: id 
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}