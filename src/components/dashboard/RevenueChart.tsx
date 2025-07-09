'use client';

import { GlassCard as Card, GlassCardContent as CardContent, GlassCardDescription as CardDescription, GlassCardHeader as CardHeader, GlassCardTitle as CardTitle } from '@/components/ui/glass-card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '@/lib/calculator-utils';

interface RevenueData {
  month: string;
  monthId: string;
  revenue: number;
  projects: number;
}

const mockData: RevenueData[] = [
  { month: 'Jan', monthId: 'Jan', revenue: 45000000, projects: 3 },
  { month: 'Feb', monthId: 'Feb', revenue: 52000000, projects: 4 },
  { month: 'Mar', monthId: 'Mar', revenue: 48000000, projects: 3 },
  { month: 'Apr', monthId: 'Apr', revenue: 61000000, projects: 5 },
  { month: 'May', monthId: 'Mei', revenue: 55000000, projects: 4 },
  { month: 'Jun', monthId: 'Jun', revenue: 67000000, projects: 6 },
  { month: 'Jul', monthId: 'Jul', revenue: 72000000, projects: 7 },
];

interface RevenueChartProps {
  data?: RevenueData[];
}

export function RevenueChart({ data = mockData }: RevenueChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{payload[0].payload.monthId}</p>
          <p className="text-sm text-muted-foreground">
            Pendapatan: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-muted-foreground">
            Proyek: {payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Pendapatan Bulanan / Monthly Revenue</CardTitle>
        <CardDescription>
          Tren pendapatan dan jumlah proyek
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="monthId" 
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis 
              yAxisId="left"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Pendapatan (Rp)"
              dot={{ fill: 'hsl(var(--primary))' }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="projects"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              name="Jumlah Proyek"
              dot={{ fill: 'hsl(var(--chart-2))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}