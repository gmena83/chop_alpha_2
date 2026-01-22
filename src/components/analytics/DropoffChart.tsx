'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { AlertTriangle } from 'lucide-react';

interface DropoffData {
  moduleName: string;
  dropoffCount: number;
  dropoffPercentage: number;
}

interface DropoffChartProps {
  data: DropoffData[];
  loading?: boolean;
}

export function DropoffChart({ data, loading = false }: DropoffChartProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="h-4 w-40 bg-gray-200 animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-gray-200 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    name: item.moduleName.length > 15 
      ? item.moduleName.substring(0, 15) + '...' 
      : item.moduleName,
    fullName: item.moduleName,
    count: item.dropoffCount,
    percentage: item.dropoffPercentage,
  }));

  const getBarColor = (index: number) => {
    const colors = ['#dc2626', '#ea580c', '#f59e0b', '#eab308', '#84cc16', '#22c55e'];
    return colors[index] || '#6b7280';
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border text-sm">
          <p className="font-medium text-gray-900">{data.fullName}</p>
          <p className="text-gray-600">{data.count} users ({data.percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">
            Module Drop-off Points
          </CardTitle>
          <div className="p-2 rounded-lg bg-red-100 text-red-600">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Where users exit the curriculum most frequently
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded bg-red-600" />
            <span className="text-gray-600">
              <span className="font-medium text-gray-900">Unprotected Left Turns</span> has highest drop-off
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
