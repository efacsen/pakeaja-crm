'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ProjectStatus {
  name: string;
  nameId: string;
  value: number;
  color: string;
}

const mockData: ProjectStatus[] = [
  { name: 'In Progress', nameId: 'Dalam Proses', value: 7, color: 'hsl(var(--chart-1))' },
  { name: 'Completed', nameId: 'Selesai', value: 12, color: 'hsl(var(--chart-2))' },
  { name: 'Pending', nameId: 'Menunggu', value: 4, color: 'hsl(var(--chart-3))' },
  { name: 'Cancelled', nameId: 'Dibatalkan', value: 2, color: 'hsl(var(--chart-4))' },
];

interface ProjectStatusChartProps {
  data?: ProjectStatus[];
}

export function ProjectStatusChart({ data = mockData }: ProjectStatusChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{payload[0].payload.nameId}</p>
          <p className="text-sm text-muted-foreground">
            Jumlah: {payload[0].value} proyek
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Status Proyek / Project Status</CardTitle>
        <CardDescription>
          Distribusi status proyek saat ini
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry: any) => entry?.payload?.nameId || value}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}