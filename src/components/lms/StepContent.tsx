'use client';

import { useState } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { Button } from '@/components/ui/button';
import { Check, Square, CheckSquare, ChevronRight } from 'lucide-react';

interface StepContentProps {
  step: {
    id: string;
    stepType: string;
    title: string;
    bodyMd?: string;
    videoUrl?: string;
    checklistItems?: string[];
  };
  onComplete: () => void;
  isCompleted: boolean;
}

export function StepContent({ step, onComplete, isCompleted }: StepContentProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1a5276]">{step.title}</h2>

      {step.stepType === 'video' && step.videoUrl && (
        <VideoPlayer 
          videoUrl={step.videoUrl} 
          title={step.title}
          onComplete={onComplete}
        />
      )}

      {step.bodyMd && (
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: step.bodyMd }}
          />
        </div>
      )}

      {step.stepType === 'checklist' && step.checklistItems && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-[#1a5276] mb-4">Complete all items:</h3>
          <ul className="space-y-3">
            {step.checklistItems.map((item, index) => (
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
                  <span className="text-left">{item}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t">
        {isCompleted ? (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="h-5 w-5" />
            <span className="font-medium">Completed</span>
          </div>
        ) : (
          <div />
        )}
        
        <Button
          onClick={onComplete}
          disabled={step.stepType === 'checklist' && !allChecklistComplete}
          className="bg-[#1a5276] hover:bg-[#154360] text-white px-6"
        >
          {isCompleted ? 'Continue' : 'Mark Complete'}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
