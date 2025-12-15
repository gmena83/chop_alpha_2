'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Clock, PlayCircle } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { AssessmentForm } from '@/components/assessments/assessment-form';
import { AssessmentResults } from '@/components/assessments/assessment-results';

interface Question {
  id: string;
  orderIndex: number;
  questionType: 'single_choice' | 'multiple_choice' | 'likert_scale' | 'text_short' | 'text_long' | 'rating';
  questionTextEn: string;
  questionTextEs: string;
  helpTextEn: string | null;
  helpTextEs: string | null;
  optionsEn: { value: string; label: string }[] | null;
  optionsEs: { value: string; label: string }[] | null;
  isRequired: boolean;
}

interface Assessment {
  id: string;
  titleEn: string;
  titleEs: string;
  descriptionEn: string | null;
  descriptionEs: string | null;
  instructionsEn: string | null;
  instructionsEs: string | null;
  estimatedMinutes: number | null;
}

interface AssessmentResponse {
  assessment: Assessment;
  questions: Question[];
}

interface SubmitResult {
  response: {
    id: string;
    score: number;
    maxPossibleScore: number;
    percentageScore: number;
    passed: boolean;
  };
  recommendations: Array<{
    id: string;
    titleEn: string;
    titleEs: string;
    bodyEn: string;
    bodyEs: string;
    recommendationType: string;
    resourceUrl: string | null;
  }>;
}

function getLocalizedText(
  enText: string | null | undefined,
  esText: string | null | undefined,
  locale: string
): string {
  if (locale === 'es' && esText) return esText;
  return enText || '';
}

export default function AssessmentPage() {
  const t = useTranslations();
  const locale = useLocale();
  const params = useParams();
  const assessmentId = params.assessmentId as string;

  const [hasStarted, setHasStarted] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [startTime] = useState(Date.now());

  const { data, isLoading, error } = useQuery<AssessmentResponse>({
    queryKey: ['assessment', assessmentId, locale],
    queryFn: async () => {
      const response = await fetch(`/api/assessments/${assessmentId}`);
      if (!response.ok) throw new Error('Failed to fetch assessment');
      return response.json();
    },
    enabled: !!assessmentId,
  });

  const submitMutation = useMutation({
    mutationFn: async (answers: Record<string, { questionId: string; answer: string | string[] | number }>) => {
      const timeTakenSeconds = Math.floor((Date.now() - startTime) / 1000);
      const response = await fetch(`/api/assessments/${assessmentId}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, timeTakenSeconds }),
      });
      if (!response.ok) throw new Error('Failed to submit assessment');
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const assessment = data?.assessment;
  const questions = data?.questions || [];

  const handleSubmit = async (answers: Record<string, { questionId: string; answer: string | string[] | number }>) => {
    await submitMutation.mutateAsync(answers);
  };

  const handleRetake = () => {
    setResult(null);
    setHasStarted(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">ETA</span>
            </div>
            <span className="font-semibold text-lg">{t('common.appName')}</span>
          </Link>
          <nav className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/auth/login">
              <Button>{t('nav.signIn')}</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <Link href="/modules" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          {t('modules.backToModules')}
        </Link>

        {isLoading && (
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-48" />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">{t('common.error')}</p>
            <Link href="/modules">
              <Button variant="outline" className="mt-4">
                {t('modules.backToModules')}
              </Button>
            </Link>
          </div>
        )}

        {assessment && !hasStarted && !result && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {getLocalizedText(assessment.titleEn, assessment.titleEs, locale)}
              </CardTitle>
              <CardDescription>
                {getLocalizedText(assessment.descriptionEn, assessment.descriptionEs, locale)}
              </CardDescription>
              {assessment.estimatedMinutes && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                  <Clock className="h-4 w-4" />
                  <span>{assessment.estimatedMinutes} {t('modules.minutes')}</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="text-center">
              {assessment.instructionsEn && (
                <p className="text-muted-foreground mb-6">
                  {getLocalizedText(assessment.instructionsEn, assessment.instructionsEs, locale)}
                </p>
              )}
              <Button size="lg" onClick={() => setHasStarted(true)} className="gap-2">
                <PlayCircle className="h-5 w-5" />
                {t('assessments.startAssessment')}
              </Button>
            </CardContent>
          </Card>
        )}

        {assessment && hasStarted && !result && (
          <AssessmentForm
            assessment={assessment}
            questions={questions}
            onSubmit={handleSubmit}
            isSubmitting={submitMutation.isPending}
          />
        )}

        {result && (
          <AssessmentResults
            score={result.response.score}
            maxPossibleScore={result.response.maxPossibleScore}
            percentageScore={result.response.percentageScore}
            passed={result.response.passed}
            recommendations={result.recommendations}
            onRetake={handleRetake}
          />
        )}
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Children&apos;s Hospital of Philadelphia. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
