import { Clock } from 'lucide-react';
import { cn } from '@/utils/cn';

interface DurationSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const DURATION_OPTIONS = [
  { label: '1 hour', value: 1 },
  { label: '3 hours', value: 3 },
  { label: '6 hours', value: 6 },
  { label: '12 hours', value: 12 },
  { label: '1 day', value: 24 },
  { label: '3 days', value: 72 },
  { label: '7 days', value: 168 },
  { label: '30 days', value: 720 },
];

export default function DurationSelector({ value, onChange }: DurationSelectorProps) {
  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Clock className="h-4 w-4" />
        <span>Note expires in:</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {DURATION_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'px-4 py-2 rounded-lg border transition-all duration-200',
              'hover:border-primary hover:bg-accent',
              value === option.value
                ? 'border-primary bg-primary/10 font-medium'
                : 'border-border'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
