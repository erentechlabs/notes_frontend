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
    <div className="space-y-3 sm:space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span>Note expires in:</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {DURATION_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium',
              'hover:scale-105 active:scale-95 touch-manipulation shadow-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1',
              value === option.value
                ? 'border-primary bg-primary/10 font-semibold shadow-md scale-105 text-primary'
                : 'border-border/80 bg-background/80 hover:border-primary/50 hover:bg-accent/50 text-foreground'
            )}
            aria-pressed={value === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
