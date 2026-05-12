import { Zap, Wheat, Users, Palmtree } from 'lucide-react';

type SectorType = 'energy' | 'agriculture' | 'community' | 'tourism';

interface SectorBadgeProps {
  sector: SectorType;
  size?: 'sm' | 'md' | 'lg';
  withIcon?: boolean;
}

const sectorConfig = {
  energy: {
    label: 'Energy',
    icon: Zap,
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
  },
  agriculture: {
    label: 'Agriculture',
    icon: Wheat,
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
  },
  community: {
    label: 'Community',
    icon: Users,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
  },
  tourism: {
    label: 'Tourism',
    icon: Palmtree,
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200',
  },
};

export function SectorBadge({ sector, size = 'md', withIcon = false }: SectorBadgeProps) {
  const config = sectorConfig[sector];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'size-3',
    md: 'size-4',
    lg: 'size-5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${config.bgColor} ${config.textColor} ${sizeClasses[size]} font-medium rounded-full border ${config.borderColor}`}
    >
      {withIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </span>
  );
}

export { sectorConfig };
export type { SectorType };
