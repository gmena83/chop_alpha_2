'use client';

import { Check, Circle, Play, FileText, ClipboardCheck, HelpCircle } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  stepType: string;
  completed: boolean;
  current: boolean;
}

interface StepNavigationProps {
  steps: Step[];
  onStepClick: (stepId: string) => void;
}

export function StepNavigation({ steps, onStepClick }: StepNavigationProps) {
  const getStepIcon = (stepType: string) => {
    switch (stepType) {
      case 'video': return Play;
      case 'content': return FileText;
      case 'checklist': return ClipboardCheck;
      case 'assessment': return HelpCircle;
      default: return Circle;
    }
  };

  return (
    <nav className="space-y-1">
      {steps.map((step, index) => {
        const Icon = getStepIcon(step.stepType);
        
        return (
          <button
            key={step.id}
            onClick={() => onStepClick(step.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
              step.current
                ? 'bg-[#1a5276] text-white'
                : step.completed
                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              step.current
                ? 'bg-white/20'
                : step.completed
                ? 'bg-green-200'
                : 'bg-gray-200'
            }`}>
              {step.completed ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${step.current ? 'text-white' : ''}`}>
                {step.title}
              </p>
              <p className={`text-xs capitalize ${step.current ? 'text-white/70' : 'text-gray-500'}`}>
                {step.stepType}
              </p>
            </div>
            
            <Icon className={`h-4 w-4 flex-shrink-0 ${step.current ? 'text-white/70' : 'text-gray-400'}`} />
          </button>
        );
      })}
    </nav>
  );
}
