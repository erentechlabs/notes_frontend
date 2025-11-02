import { X, Clock } from 'lucide-react';
import Button from './Button';
import DurationSelector from './DurationSelector';
import type { EditMode } from '@/types/note';
import { Edit, CheckSquare, Lock } from 'lucide-react';

interface ConfigureDurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  duration: number;
  onDurationChange: (duration: number) => void;
  editMode: EditMode;
  onEditModeChange: (mode: EditMode) => void;
}

export default function ConfigureDurationModal({
  isOpen,
  onClose,
  duration,
  onDurationChange,
  editMode,
  onEditModeChange,
}: ConfigureDurationModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-3 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-background border-2 border-border/80 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border/60 bg-gradient-to-r from-muted/30 to-muted/10 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-xl sm:text-2xl font-bold">Configure Duration</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-accent transition-all active:scale-95 flex-shrink-0 touch-manipulation"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          <DurationSelector value={duration} onChange={onDurationChange} />
          
          {/* Edit Mode Selector */}
          <div>
            <label className="block text-sm font-semibold mb-3 sm:mb-4 text-foreground">Editing Permissions</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => onEditModeChange('full')}
                className={`flex flex-col items-center gap-2.5 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                  editMode === 'full'
                    ? 'border-primary bg-primary/10 shadow-md scale-[1.02]'
                    : 'border-border/80 bg-background/80 hover:border-primary/50 hover:bg-accent/50 hover:scale-[1.01]'
                }`}
              >
                <div className={`p-2 rounded-lg ${editMode === 'full' ? 'bg-primary/20' : 'bg-muted'}`}>
                  <Edit className={`h-5 w-5 ${editMode === 'full' ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm sm:text-base">Full Edit</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Anyone can edit everything
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onEditModeChange('checkbox-only')}
                className={`flex flex-col items-center gap-2.5 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                  editMode === 'checkbox-only'
                    ? 'border-primary bg-primary/10 shadow-md scale-[1.02]'
                    : 'border-border/80 bg-background/80 hover:border-primary/50 hover:bg-accent/50 hover:scale-[1.01]'
                }`}
              >
                <div className={`p-2 rounded-lg ${editMode === 'checkbox-only' ? 'bg-primary/20' : 'bg-muted'}`}>
                  <CheckSquare className={`h-5 w-5 ${editMode === 'checkbox-only' ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm sm:text-base">Checkbox Only</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Only checkboxes can be toggled
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onEditModeChange('read-only')}
                className={`flex flex-col items-center gap-2.5 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                  editMode === 'read-only'
                    ? 'border-primary bg-primary/10 shadow-md scale-[1.02]'
                    : 'border-border/80 bg-background/80 hover:border-primary/50 hover:bg-accent/50 hover:scale-[1.01]'
                }`}
              >
                <div className={`p-2 rounded-lg ${editMode === 'read-only' ? 'bg-primary/20' : 'bg-muted'}`}>
                  <Lock className={`h-5 w-5 ${editMode === 'read-only' ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm sm:text-base">Read Only</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    No one can edit anything
                  </div>
                </div>
              </button>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs sm:text-sm text-foreground/80 font-medium">
                {editMode === 'full' && '✓ Viewers can make any changes to the note'}
                {editMode === 'checkbox-only' && '✓ Viewers can toggle checkboxes but cannot edit text'}
                {editMode === 'read-only' && '✓ Note is completely locked for viewing only'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 sm:gap-3 p-4 sm:p-6 border-t border-border/60 bg-gradient-to-b from-muted/30 to-muted/10">
          <Button 
            onClick={onClose} 
            className="flex-1 h-12 sm:h-14 text-base sm:text-lg font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center justify-center gap-2">
              <span>Done</span>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

