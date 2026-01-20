'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { StepNavigation } from '@/components/lms/StepNavigation';
import { StepContent } from '@/components/lms/StepContent';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, ChevronLeft, ChevronRight, Trophy, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface Step {
  id: string;
  slug: string;
  stepType: string;
  orderIndex: number;
  titleEn: string;
  titleEs: string;
  bodyMdEn?: string;
  bodyMdEs?: string;
  videoUrlEn?: string;
  videoUrlEs?: string;
  checklistItemsEn?: string[];
  checklistItemsEs?: string[];
  quizQuestionsEn?: QuizQuestion[];
  quizQuestionsEs?: QuizQuestion[];
  quizPassingThreshold?: number;
  helperTextEn?: string;
  helperTextEs?: string;
  extraHelpVideoUrlEn?: string;
  extraHelpVideoUrlEs?: string;
  extraHelpTextEn?: string;
  extraHelpTextEs?: string;
  isRequired: boolean;
}

interface Module {
  id: string;
  slug: string;
  titleEn: string;
  titleEs: string;
  descriptionEn?: string;
  descriptionEs?: string;
  estimatedMinutes?: number;
  phase: string;
}

interface StepProgress {
  stepId: string;
  status: string;
  completedAt?: string;
}

export default function ModuleViewerPage({ 
  params 
}: { 
  params: Promise<{ moduleId: string; locale: string }> 
}) {
  const { moduleId, locale } = use(params);
  const router = useRouter();
  const [module, setModule] = useState<Module | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepProgress, setStepProgress] = useState<StepProgress[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [showModuleComplete, setShowModuleComplete] = useState(false);

  const isSpanish = locale === 'es';

  useEffect(() => {
    fetchModuleData();
  }, [moduleId]);

  const fetchModuleData = async () => {
    try {
      const [moduleRes, progressRes] = await Promise.all([
        fetch(`/api/modules/${moduleId}`),
        fetch(`/api/modules/${moduleId}/progress`)
      ]);

      if (!moduleRes.ok) {
        if (moduleRes.status === 401) {
          router.push(`/${locale}/auth/login`);
          return;
        }
        throw new Error('Failed to fetch module');
      }

      const moduleData = await moduleRes.json();
      setModule(moduleData.module);
      setSteps(moduleData.steps || []);

      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setStepProgress(progressData.stepProgress || []);
        
        const lastCompletedIndex = (progressData.stepProgress || [])
          .filter((p: StepProgress) => p.status === 'completed')
          .reduce((maxIndex: number, p: StepProgress) => {
            const stepIndex = moduleData.steps?.findIndex((s: Step) => s.id === p.stepId) ?? -1;
            return Math.max(maxIndex, stepIndex);
          }, -1);
        
        setCurrentStepIndex(Math.min(lastCompletedIndex + 1, (moduleData.steps?.length || 1) - 1));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const markStepComplete = async (quizScore?: number) => {
    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    if (quizScore !== undefined) {
      setQuizScores(prev => ({ ...prev, [currentStep.id]: quizScore }));
    }

    try {
      const response = await fetch(`/api/modules/${moduleId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepId: currentStep.id,
          status: 'completed',
          quizScore
        })
      });

      if (response.ok) {
        setStepProgress(prev => [
          ...prev.filter(p => p.stepId !== currentStep.id),
          { stepId: currentStep.id, status: 'completed', completedAt: new Date().toISOString() }
        ]);

        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(currentStepIndex + 1);
        }
      }
    } catch (err) {
      console.error('Failed to mark step complete:', err);
    }
  };

  const isStepCompleted = (stepId: string) => {
    return stepProgress.some(p => p.stepId === stepId && p.status === 'completed');
  };

  const calculateProgress = () => {
    if (steps.length === 0) return 0;
    const completed = stepProgress.filter(p => p.status === 'completed').length;
    return (completed / steps.length) * 100;
  };

  const currentStep = steps[currentStepIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a5276]"></div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Module not found'}</p>
          <Button onClick={() => router.push(`/${locale}/dashboard`)}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#5b2c6f] text-white py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push(`/${locale}/dashboard`)}
              className="flex items-center gap-2 text-sm hover:text-[#f4d03f]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            <span className="text-white/40">|</span>
            <span className="font-medium">{isSpanish ? module.titleEs : module.titleEn}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-white/70">
              {Math.round(calculateProgress())}% complete
            </div>
            <div className="w-32">
              <Progress value={calculateProgress()} className="h-2" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto hidden lg:block">
          <div className="mb-4">
            <h2 className="font-semibold text-[#1a5276] mb-1">
              {isSpanish ? module.titleEs : module.titleEn}
            </h2>
            {module.estimatedMinutes && (
              <p className="text-sm text-gray-500">~{module.estimatedMinutes} minutes</p>
            )}
          </div>
          
          <StepNavigation
            steps={steps.map((step, index) => ({
              id: step.id,
              title: isSpanish ? step.titleEs : step.titleEn,
              stepType: step.stepType,
              completed: isStepCompleted(step.id),
              current: index === currentStepIndex
            }))}
            onStepClick={(stepId) => {
              const index = steps.findIndex(s => s.id === stepId);
              if (index >= 0) setCurrentStepIndex(index);
            }}
          />
        </aside>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {currentStep && (
              <StepContent
                step={{
                  id: currentStep.id,
                  stepType: currentStep.stepType,
                  title: isSpanish ? currentStep.titleEs : currentStep.titleEn,
                  bodyMd: isSpanish ? currentStep.bodyMdEs : currentStep.bodyMdEn,
                  videoUrl: isSpanish ? currentStep.videoUrlEs : currentStep.videoUrlEn,
                  checklistItems: isSpanish ? currentStep.checklistItemsEs : currentStep.checklistItemsEn,
                  quizQuestions: isSpanish ? currentStep.quizQuestionsEs : currentStep.quizQuestionsEn,
                  quizPassingThreshold: currentStep.quizPassingThreshold,
                  helperText: isSpanish ? currentStep.helperTextEs : currentStep.helperTextEn,
                  extraHelpVideoUrl: isSpanish ? currentStep.extraHelpVideoUrlEs : currentStep.extraHelpVideoUrlEn,
                  extraHelpText: isSpanish ? currentStep.extraHelpTextEs : currentStep.extraHelpTextEn
                }}
                onComplete={markStepComplete}
                isCompleted={isStepCompleted(currentStep.id)}
                locale={isSpanish ? 'es' : 'en'}
              />
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <span className="text-sm text-gray-500">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              
              <Button
                onClick={() => {
                  if (currentStepIndex === steps.length - 1) {
                    setShowModuleComplete(true);
                  } else {
                    setCurrentStepIndex(currentStepIndex + 1);
                  }
                }}
                className="flex items-center gap-2 bg-[#1a5276] hover:bg-[#154360]"
              >
                {currentStepIndex === steps.length - 1 ? (
                  <>
                    <Home className="h-4 w-4" />
                    {isSpanish ? 'Finalizar' : 'Finish'}
                  </>
                ) : (
                  <>
                    {isSpanish ? 'Siguiente' : 'Next'}
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>

      {showModuleComplete && (
        <ModuleCompletionModal
          module={module}
          steps={steps}
          quizScores={quizScores}
          locale={isSpanish ? 'es' : 'en'}
          onClose={() => router.push(`/${locale}/dashboard`)}
        />
      )}
    </div>
  );
}

function ModuleCompletionModal({
  module,
  steps,
  quizScores,
  locale,
  onClose
}: {
  module: Module | null;
  steps: Step[];
  quizScores: Record<string, number>;
  locale: 'en' | 'es';
  onClose: () => void;
}) {
  const labels = {
    en: {
      congratulations: 'Congratulations!',
      completed: 'You have completed',
      yourScore: 'Your Quiz Scores',
      overallScore: 'Overall Score',
      noQuizzes: 'No quizzes in this module',
      backToDashboard: 'Back to Dashboard',
    },
    es: {
      congratulations: '¡Felicidades!',
      completed: 'Has completado',
      yourScore: 'Tus Puntuaciones de Quiz',
      overallScore: 'Puntuación General',
      noQuizzes: 'No hay cuestionarios en este módulo',
      backToDashboard: 'Volver al Panel',
    },
  };

  const t = labels[locale];
  const isSpanish = locale === 'es';

  const quizSteps = steps.filter(s => 
    (isSpanish ? s.quizQuestionsEs : s.quizQuestionsEn) && 
    (isSpanish ? s.quizQuestionsEs : s.quizQuestionsEn)!.length > 0
  );

  const scores = Object.values(quizScores);
  const overallScore = scores.length > 0 
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <div className="mb-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#1a5276] mb-2">{t.congratulations}</h2>
          <p className="text-gray-600 mb-6">
            {t.completed} <span className="font-semibold">{isSpanish ? module?.titleEs : module?.titleEn}</span>
          </p>

          {quizSteps.length > 0 ? (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">{t.yourScore}</h3>
              <div className="space-y-2">
                {quizSteps.map(step => {
                  const score = quizScores[step.id];
                  return (
                    <div key={step.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{isSpanish ? step.titleEs : step.titleEn}</span>
                      <span className={`font-medium ${score !== undefined ? (score >= 70 ? 'text-green-600' : 'text-red-600') : 'text-gray-400'}`}>
                        {score !== undefined ? `${score}%` : '-'}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {overallScore !== null && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">{t.overallScore}</span>
                    <span className={`text-xl font-bold ${overallScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                      {overallScore}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center gap-3 justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-gray-600">{t.noQuizzes}</span>
            </div>
          )}

          <Button 
            onClick={onClose}
            className="w-full bg-[#1a5276] hover:bg-[#154360]"
          >
            <Home className="h-4 w-4 mr-2" />
            {t.backToDashboard}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
