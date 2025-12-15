'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Lightbulb, ArrowRight } from 'lucide-react';

interface Recommendation {
  id: string;
  titleEn: string;
  titleEs: string;
  bodyEn: string;
  bodyEs: string;
  recommendationType: string;
  resourceUrl: string | null;
}

interface AssessmentResultsProps {
  score: number;
  maxPossibleScore: number;
  percentageScore: number;
  passed: boolean;
  recommendations: Recommendation[];
  onRetake?: () => void;
}

function getLocalizedText(
  enText: string | null | undefined,
  esText: string | null | undefined,
  locale: string
): string {
  if (locale === 'es' && esText) return esText;
  return enText || '';
}

export function AssessmentResults({
  score,
  maxPossibleScore,
  percentageScore,
  passed,
  recommendations,
  onRetake
}: AssessmentResultsProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {passed ? (
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-amber-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {t('assessments.results.title')}
          </CardTitle>
          <CardDescription>
            {passed
              ? t('assessments.results.passed')
              : t('assessments.results.notPassed')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-2">
              {t('assessments.results.score')}
            </p>
            <p className="text-5xl font-bold text-primary">
              {percentageScore}%
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {score} / {maxPossibleScore}
            </p>
          </div>
          <Progress value={percentageScore} className="h-3" />
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              {t('assessments.results.recommendations')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-lg border bg-muted/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-medium">
                      {getLocalizedText(rec.titleEn, rec.titleEs, locale)}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getLocalizedText(rec.bodyEn, rec.bodyEs, locale)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {rec.recommendationType}
                  </Badge>
                </div>
                {rec.resourceUrl && (
                  <a
                    href={rec.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary mt-3 hover:underline"
                  >
                    {t('common.view')}
                    <ArrowRight className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {recommendations.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Lightbulb className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
            {t('assessments.results.noRecommendations')}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center gap-4">
        {onRetake && (
          <Button variant="outline" onClick={onRetake}>
            {t('assessments.results.retake')}
          </Button>
        )}
        <Link href="/modules">
          <Button>
            {t('assessments.results.backToModules')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
