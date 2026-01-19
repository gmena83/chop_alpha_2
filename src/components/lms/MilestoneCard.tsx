'use client';

import { Trophy, Star, Award, CheckCircle } from 'lucide-react';

interface MilestoneCardProps {
  title: string;
  description?: string;
  points: number;
  earned: boolean;
  earnedAt?: string;
  iconName?: string;
  badgeColor?: string;
}

export function MilestoneCard({
  title,
  description,
  points,
  earned,
  earnedAt,
  iconName,
  badgeColor = '#f4d03f'
}: MilestoneCardProps) {
  const IconComponent = iconName === 'star' ? Star : iconName === 'award' ? Award : Trophy;

  return (
    <div className={`relative rounded-xl border p-4 transition-all ${
      earned 
        ? 'bg-white border-[#17a589] shadow-sm' 
        : 'bg-gray-50 border-gray-200 opacity-60'
    }`}>
      {earned && (
        <div className="absolute -top-2 -right-2">
          <CheckCircle className="h-5 w-5 text-[#17a589] fill-white" />
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-2">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: earned ? badgeColor : '#e5e7eb' }}
        >
          <IconComponent className={`h-5 w-5 ${earned ? 'text-white' : 'text-gray-400'}`} />
        </div>
        <div>
          <h4 className="font-semibold text-sm text-[#1a5276]">{title}</h4>
          <p className="text-xs text-gray-500">+{points} points</p>
        </div>
      </div>
      
      {description && (
        <p className="text-xs text-gray-600 mt-2">{description}</p>
      )}
      
      {earnedAt && (
        <p className="text-xs text-[#17a589] mt-2">
          Earned {new Date(earnedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
