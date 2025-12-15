'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Users, 
  Activity, 
  ClipboardCheck, 
  Calendar,
  FileSpreadsheet,
  Check,
  Loader2
} from 'lucide-react';

interface ExportOption {
  id: string;
  type: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ElementType;
  fields: string[];
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    id: 'users',
    type: 'users',
    titleKey: 'admin.exportUserData',
    descriptionKey: 'admin.exportUserDataDescription',
    icon: Users,
    fields: ['ID', 'Email', 'Name', 'Role', 'Language', 'Email Verified', 'Created At', 'Updated At']
  },
  {
    id: 'progress',
    type: 'progress',
    titleKey: 'admin.exportProgress',
    descriptionKey: 'admin.exportProgressDescription',
    icon: Activity,
    fields: ['Progress ID', 'User ID', 'Family ID', 'Module ID', 'Step ID', 'Status', 'Started At', 'Completed At', 'Last Accessed']
  },
  {
    id: 'assessments',
    type: 'assessments',
    titleKey: 'admin.exportAssessments',
    descriptionKey: 'admin.exportAssessmentsDescription',
    icon: ClipboardCheck,
    fields: ['Response ID', 'User ID', 'Assessment ID', 'Status', 'Score', 'Max Score', 'Percentage', 'Passed', 'Time Taken', 'Completed At']
  },
  {
    id: 'events',
    type: 'events',
    titleKey: 'admin.exportEvents',
    descriptionKey: 'admin.exportEventsDescription',
    icon: Calendar,
    fields: ['Event ID', 'User ID', 'Family ID', 'Event Type', 'Module ID', 'Step ID', 'Assessment ID', 'Milestone ID', 'Created At']
  },
  {
    id: 'families',
    type: 'families',
    titleKey: 'admin.exportFamilies',
    descriptionKey: 'admin.exportFamiliesDescription',
    icon: Users,
    fields: ['Family ID', 'Parent ID', 'Teen ID', 'Professional ID', 'Phase', 'Status', 'Created At', 'Updated At']
  }
];

export default function ExportsPage() {
  const t = useTranslations();
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());

  const handleExport = async (exportType: string) => {
    setDownloading(exportType);
    
    try {
      const response = await fetch(`/api/admin/exports?type=${exportType}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportType}_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setDownloaded(prev => new Set(prev).add(exportType));
      setTimeout(() => {
        setDownloaded(prev => {
          const newSet = new Set(prev);
          newSet.delete(exportType);
          return newSet;
        });
      }, 3000);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.exportsTitle')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('admin.exportsDescription')}
        </p>
      </div>

      <div className="grid gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              {t('admin.csvExports')}
            </CardTitle>
            <CardDescription>
              {t('admin.csvExportsDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>{t('admin.note')}:</strong> {t('admin.piiWarning')}
              </p>
            </div>

            <div className="space-y-4">
              {EXPORT_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isDownloading = downloading === option.type;
                const isDownloaded = downloaded.has(option.type);
                
                return (
                  <div 
                    key={option.id}
                    className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{t(option.titleKey as any)}</h3>
                        <Badge variant="outline" className="text-xs">{t('admin.csv')}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {t(option.descriptionKey as any)}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {option.fields.map(field => (
                          <Badge key={field} variant="secondary" className="text-xs font-normal">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleExport(option.type)}
                      disabled={isDownloading}
                      variant={isDownloaded ? 'outline' : 'default'}
                      className="shrink-0"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t('admin.exporting')}
                        </>
                      ) : isDownloaded ? (
                        <>
                          <Check className="h-4 w-4 mr-2 text-green-600" />
                          {t('admin.downloaded')}
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          {t('common.export')}
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.exportHistory')}</CardTitle>
          <CardDescription>
            {t('admin.exportHistoryDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            {t('admin.exportHistoryNote')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
