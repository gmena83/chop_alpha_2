'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  sparklineData?: number[];
  icon?: React.ReactNode;
  accentColor?: string;
  loading?: boolean;
  subtitle?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  trend = 0,
  trendLabel,
  sparklineData,
  icon,
  accentColor = '#1a5276',
  loading = false,
  subtitle,
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="h-4 w-4" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const chartData = sparklineData?.map((val, i) => ({ value: val, index: i })) || [];

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded mb-2" />
          <div className="h-3 w-20 bg-gray-200 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          {icon && (
            <div className="p-2 rounded-lg bg-gray-100" style={{ color: accentColor }}>
              {icon}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {value}
              {unit && <span className="text-lg font-normal text-gray-500 ml-1">{unit}</span>}
            </div>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
            {trendLabel && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${getTrendColor()}`}>
                {getTrendIcon()}
                <span>{trendLabel}</span>
              </div>
            )}
          </div>
          {sparklineData && sparklineData.length > 0 && (
            <div className="w-24 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={trend >= 0 ? '#22c55e' : '#ef4444'}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
