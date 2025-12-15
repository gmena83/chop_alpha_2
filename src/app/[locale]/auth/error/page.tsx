'use client';

import { useSearchParams, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function AuthErrorPage() {
  const t = useTranslations('auth');
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: t('errorConfiguration'),
    AccessDenied: t('errorAccessDenied'),
    Verification: t('errorVerification'),
    Default: t('errorDefault'),
  };

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 text-red-500">
            <AlertCircle className="h-full w-full" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {t('errorTitle')}
          </CardTitle>
          <CardDescription className="text-red-600">
            {errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild className="bg-chop-blue hover:bg-chop-blue/90">
            <Link href={`/${locale}/auth/login`}>{t('backToLogin')}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
