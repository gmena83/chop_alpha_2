'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Construction } from 'lucide-react';

export default function AnalyticsPage() {
  const t = useTranslations();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.analyticsTitle')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('admin.analyticsDescription')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t('admin.analytics')}
          </CardTitle>
          <CardDescription>
            {t('admin.analyticsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Construction className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">{t('admin.comingSoon')}</h3>
            <p className="text-muted-foreground mt-2">{t('admin.featureInDevelopment')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
