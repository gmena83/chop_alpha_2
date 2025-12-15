'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface QuestionOption {
  value: string;
  label: string;
}

interface Question {
  id: string;
  orderIndex: number;
  questionType: 'single_choice' | 'multiple_choice' | 'likert_scale' | 'text_short' | 'text_long' | 'rating';
  questionTextEn: string;
  questionTextEs: string;
  helpTextEn: string | null;
  helpTextEs: string | null;
  optionsEn: QuestionOption[] | null;
  optionsEs: QuestionOption[] | null;
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
}

interface AssessmentFormProps {
  assessment: Assessment;
  questions: Question[];
  onSubmit: (answers: Record<string, { questionId: string; answer: string | string[] | number }>) => Promise<void>;
  isSubmitting: boolean;
}

function getLocalizedText(
  enText: string | null | undefined,
  esText: string | null | undefined,
  locale: string
): string {
  if (locale === 'es' && esText) return esText;
  return enText || '';
}

export function AssessmentForm({ assessment, questions, onSubmit, isSubmitting }: AssessmentFormProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { questionId: string; answer: string | string[] | number }>>({});

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const setAnswer = (questionId: string, answer: string | string[] | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { questionId, answer }
    }));
  };

  const currentAnswer = answers[currentQuestion?.id];

  const canProceed = () => {
    if (!currentQuestion) return false;
    if (!currentQuestion.isRequired) return true;
    if (!currentAnswer) return false;
    if (Array.isArray(currentAnswer.answer) && currentAnswer.answer.length === 0) return false;
    if (currentAnswer.answer === '' || currentAnswer.answer === undefined) return false;
    return true;
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onSubmit(answers);
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    }
  };

  const questionText = getLocalizedText(
    currentQuestion?.questionTextEn,
    currentQuestion?.questionTextEs,
    locale
  );
  const helpText = getLocalizedText(
    currentQuestion?.helpTextEn,
    currentQuestion?.helpTextEs,
    locale
  );
  const options = (locale === 'es' ? currentQuestion?.optionsEs : currentQuestion?.optionsEn) || [];

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.questionType) {
      case 'single_choice':
        return (
          <RadioGroup
            value={currentAnswer?.answer as string || ''}
            onValueChange={(value) => setAnswer(currentQuestion.id, value)}
            className="space-y-3"
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'multiple_choice':
        const selectedValues = (currentAnswer?.answer as string[]) || [];
        return (
          <div className="space-y-3">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <Checkbox
                  id={option.value}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setAnswer(currentQuestion.id, [...selectedValues, option.value]);
                    } else {
                      setAnswer(currentQuestion.id, selectedValues.filter(v => v !== option.value));
                    }
                  }}
                />
                <Label htmlFor={option.value} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'likert_scale':
        const likertValue = currentAnswer?.answer as number;
        const likertLabels = [
          t('assessments.likertLabels.stronglyDisagree'),
          t('assessments.likertLabels.disagree'),
          t('assessments.likertLabels.neutral'),
          t('assessments.likertLabels.agree'),
          t('assessments.likertLabels.stronglyAgree'),
        ];
        return (
          <div className="space-y-4">
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAnswer(currentQuestion.id, value)}
                  className={`flex-1 py-3 px-2 rounded-lg border-2 transition-colors ${
                    likertValue === value
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{likertLabels[0]}</span>
              <span>{likertLabels[4]}</span>
            </div>
          </div>
        );

      case 'rating':
        const ratingValue = currentAnswer?.answer as number;
        return (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAnswer(currentQuestion.id, value)}
                className={`w-12 h-12 rounded-full border-2 font-medium transition-colors ${
                  ratingValue === value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted hover:border-primary/50'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        );

      case 'text_short':
      case 'text_long':
        return (
          <Textarea
            value={currentAnswer?.answer as string || ''}
            onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
            placeholder={t(`assessments.questionTypes.${currentQuestion.questionType === 'text_short' ? 'textShort' : 'textLong'}`)}
            rows={currentQuestion.questionType === 'text_long' ? 6 : 3}
            className="resize-none"
          />
        );

      default:
        return null;
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            {t('assessments.questionOf', {
              current: currentIndex + 1,
              total: questions.length
            })}
          </span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed">
            {questionText}
          </CardTitle>
          {helpText && (
            <p className="text-sm text-muted-foreground mt-2">{helpText}</p>
          )}
          {currentQuestion.isRequired && (
            <p className="text-xs text-destructive mt-1">
              * {t('assessments.requiredQuestion')}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {renderQuestionInput()}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t('common.previous')}
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('assessments.submitting')}
            </>
          ) : isLastQuestion ? (
            t('assessments.submitAssessment')
          ) : (
            <>
              {t('common.next')}
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
