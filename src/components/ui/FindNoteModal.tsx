import { useState } from 'react';
import { X, Search } from 'lucide-react';
import Button from './Button';

interface FindNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFindNote: (code: string) => void;
}

export default function FindNoteModal({ isOpen, onClose, onFindNote }: FindNoteModalProps) {
  const [noteCode, setNoteCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (noteCode.trim()) {
      onFindNote(noteCode.trim());
      setNoteCode('');
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

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
      <div className="bg-background border-2 border-border/80 rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border/60 bg-gradient-to-r from-muted/30 to-muted/10">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            <h2 className="text-xl sm:text-2xl font-bold">Find Note</h2>
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
        <div className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2.5">
              Enter Note Code
            </label>
            <input
              type="text"
              value={noteCode}
              onChange={(e) => setNoteCode(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., abc123xyz"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-muted/80 border-2 border-border/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm sm:text-base"
              autoFocus
            />
            <p className="text-xs text-muted-foreground mt-2 px-1">
              Enter a note code to view an existing note
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 sm:gap-3 p-4 sm:p-6 border-t border-border/60 bg-muted/20">
          <Button
            onClick={handleSubmit}
            disabled={!noteCode.trim()}
            className="flex-1 gap-2 h-11 sm:h-auto shadow-md hover:shadow-lg transition-shadow"
          >
            <Search className="h-4 w-4" />
            Find Note
          </Button>
          <Button onClick={onClose} variant="secondary" className="flex-1 h-11 sm:h-auto">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

