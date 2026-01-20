'use client';

import { useState } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { VideoQuiz } from './VideoQuiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Square, CheckSquare, ChevronRight, HelpCircle, X, Lightbulb } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface StepContentProps {
  step: {
    id: string;
    stepType: string;
    title: string;
    bodyMd?: string;
    videoUrl?: string;
    checklistItems?: ChecklistItem[] | string[];
    quizQuestions?: QuizQuestion[];
    quizPassingThreshold?: number;
    helperText?: string;
    extraHelpVideoUrl?: string;
    extraHelpText?: string;
  };
  onComplete: (quizScore?: number) => void;
  isCompleted: boolean;
  locale?: 'en' | 'es';
}

export function StepContent({ step, onComplete, isCompleted, locale = 'en' }: StepContentProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [showExtraHelp, setShowExtraHelp] = useState(false);

  const labels = {
    en: {
      completeItems: 'Complete all items:',
      completed: 'Completed',
      markComplete: 'Mark Complete',
      continue: 'Continue',
      takeQuiz: 'Take Quiz',
      quizPassed: 'Quiz Passed',
      needExtraHelp: 'Need Extra Help?',
      extraHelpTitle: 'Extra Help Resources',
      close: 'Close',
      helperTip: 'Tip',
    },
    es: {
      completeItems: 'Complete todos los elementos:',
      completed: 'Completado',
      markComplete: 'Marcar Completo',
      continue: 'Continuar',
      takeQuiz: 'Tomar Cuestionario',
      quizPassed: 'Cuestionario Aprobado',
      needExtraHelp: '¿Necesitas Ayuda Extra?',
      extraHelpTitle: 'Recursos de Ayuda Extra',
      close: 'Cerrar',
      helperTip: 'Consejo',
    },
  };

  const t = labels[locale];

  const toggleChecklistItem = (index: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  const allChecklistComplete = step.checklistItems 
    ? checkedItems.size === step.checklistItems.length 
    : true;

  const hasQuiz = step.quizQuestions && step.quizQuestions.length > 0;
  const hasExtraHelp = step.extraHelpVideoUrl || step.extraHelpText;

  const handleQuizComplete = (passed: boolean, score: number) => {
    setQuizPassed(passed);
    setQuizScore(score);
    if (passed) {
      onComplete(score);
    }
  };

  const handleComplete = () => {
    if (hasQuiz && !quizPassed && !isCompleted) {
      setShowQuiz(true);
    } else {
      onComplete(quizScore || undefined);
    }
  };

  const canComplete = step.stepType === 'checklist' ? allChecklistComplete : true;
  const needsQuiz = hasQuiz && !quizPassed && !isCompleted;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1a5276]">{step.title}</h2>

      {step.helperText && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <Lightbulb className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-amber-800">{t.helperTip}: </span>
            <span className="text-amber-700">{step.helperText}</span>
          </div>
        </div>
      )}

      {step.stepType === 'video' && step.videoUrl && (
        <VideoPlayer 
          videoUrl={step.videoUrl} 
          title={step.title}
        />
      )}

      {step.bodyMd && (
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-700 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: step.bodyMd }}
          />
        </div>
      )}

      {hasExtraHelp && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowExtraHelp(true)}
            className="flex items-center gap-2 text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            <HelpCircle className="h-4 w-4" />
            {t.needExtraHelp}
          </Button>
        </div>
      )}

      {showExtraHelp && hasExtraHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#1a5276] flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  {t.extraHelpTitle}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExtraHelp(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {step.extraHelpVideoUrl && (
                <div className="mb-4">
                  <VideoPlayer
                    videoUrl={step.extraHelpVideoUrl}
                    title={`${t.extraHelpTitle} - Video`}
                  />
                </div>
              )}

              {step.extraHelpText && (
                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {step.extraHelpText}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button onClick={() => setShowExtraHelp(false)}>
                  {t.close}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showQuiz && hasQuiz && (
        <VideoQuiz
          questions={step.quizQuestions!}
          passingThreshold={step.quizPassingThreshold || 70}
          onComplete={handleQuizComplete}
          locale={locale}
        />
      )}

      {quizPassed && quizScore !== null && (
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 flex items-center gap-3">
          <Check className="h-5 w-5 text-green-600" />
          <span className="text-green-800 font-medium">
            {t.quizPassed}: {quizScore}%
          </span>
        </div>
      )}

      {step.stepType === 'checklist' && step.checklistItems && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-[#1a5276] mb-4">{t.completeItems}</h3>
          <ul className="space-y-3">
            {step.checklistItems.map((item, index) => {
              const itemText = typeof item === 'string' ? item : item.text;
              return (
                <li key={index}>
                  <button
                    onClick={() => toggleChecklistItem(index)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      checkedItems.has(index) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {checkedItems.has(index) ? (
                      <CheckSquare className="h-5 w-5 text-green-600" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="text-left">{itemText}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t">
        {isCompleted ? (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="h-5 w-5" />
            <span className="font-medium">{t.completed}</span>
          </div>
        ) : (
          <div />
        )}
        
        {!showQuiz && (
          <Button
            onClick={handleComplete}
            disabled={!canComplete}
            className="bg-[#1a5276] hover:bg-[#154360] text-white px-6"
          >
            {isCompleted ? t.continue : needsQuiz ? t.takeQuiz : t.markComplete}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
