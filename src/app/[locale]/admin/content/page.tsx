'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Construction } from 'lucide-react';

export default function ContentPage() {
  const t = useTranslations();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.contentTitle')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('admin.contentDescription')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('admin.content')}
          </CardTitle>
          <CardDescription>
            {t('admin.contentDescription')}
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
