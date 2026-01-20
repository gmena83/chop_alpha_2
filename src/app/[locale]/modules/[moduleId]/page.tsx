'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { StepNavigation } from '@/components/lms/StepNavigation';
import { StepContent } from '@/components/lms/StepContent';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, ChevronLeft, ChevronRight } from 'lucide-react';

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

  const markStepComplete = async () => {
    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    try {
      const response = await fetch(`/api/modules/${moduleId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepId: currentStep.id,
          status: 'completed'
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
                    router.push(`/${locale}/dashboard`);
                  } else {
                    setCurrentStepIndex(currentStepIndex + 1);
                  }
                }}
                className="flex items-center gap-2 bg-[#1a5276] hover:bg-[#154360]"
              >
                {currentStepIndex === steps.length - 1 ? (
                  <>
                    <Home className="h-4 w-4" />
                    Finish
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
