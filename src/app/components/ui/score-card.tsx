import { ReactNode } from 'react';

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  confidence?: number;
  icon?: ReactNode;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function ScoreCard({ 
  title, 
  score, 
  maxScore = 100, 
  confidence, 
  icon, 
  description,
  variant = 'default'
}: ScoreCardProps) {
  const percentage = (score / maxScore) * 100;
  
  const colorClasses = {
    default: 'text-gray-900 bg-gray-100',
    success: 'text-emerald-900 bg-emerald-100',
    warning: 'text-amber-900 bg-amber-100',
    danger: 'text-red-900 bg-red-100',
  };

  const barColorClasses = {
    default: 'bg-gray-600',
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    danger: 'bg-red-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[variant]}`}>
              {icon}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">{score}</div>
          <div className="text-sm text-gray-500">/ {maxScore}</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${barColorClasses[variant]} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Confidence Meter */}
      {confidence !== undefined && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Confidence:</span>
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${confidence}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-700">{confidence}%</span>
        </div>
      )}
    </div>
  );
}

interface ConfidenceMeterProps {
  confidence: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ConfidenceMeter({ confidence, label = 'Confidence', size = 'md' }: ConfidenceMeterProps) {
  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const getColor = () => {
    if (confidence >= 80) return 'bg-emerald-500';
    if (confidence >= 60) return 'bg-blue-500';
    if (confidence >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`${textSizes[size]} text-gray-600`}>{label}:</span>
      <div className={`flex-1 ${heights[size]} bg-gray-100 rounded-full overflow-hidden`}>
        <div 
          className={`h-full ${getColor()} transition-all duration-500`}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <span className={`${textSizes[size]} font-medium text-gray-900 min-w-[3rem] text-right`}>
        {confidence}%
      </span>
    </div>
  );
}
