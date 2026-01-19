'use client';

import { Progress } from "@/components/ui/progress";

interface ProgressCardProps {
  title: string;
  description?: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  estimatedMinutes?: number;
  onClick?: () => void;
}

export function ProgressCard({
  title,
  description,
  progress,
  status,
  estimatedMinutes,
  onClick
}: ProgressCardProps) {
  const statusColors = {
    not_started: 'bg-gray-100 text-gray-600',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700'
  };

  const statusLabels = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    completed: 'Completed'
  };

  return (
    <div 
      className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer ${onClick ? 'hover:border-[#1a5276]' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1a5276] line-clamp-2">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
      </div>
      
      {description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
      )}
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium text-[#1a5276]">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {estimatedMinutes && (
        <p className="text-xs text-gray-400 mt-3">
          ~{estimatedMinutes} min
        </p>
      )}
    </div>
  );
}
