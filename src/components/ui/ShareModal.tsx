import { useState } from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import Button from './Button';
import { formatDateTime } from '@/utils/date';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  expiresAt: string;
}

export default function ShareModal({ isOpen, onClose, shareUrl, expiresAt }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-background border border-border rounded-lg shadow-2xl max-w-lg w-full mx-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold">Note Created!</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Share this link with others
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-accent transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* URL Display */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Shareable Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-3 bg-muted border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                onClick={handleCopy}
                variant={copied ? 'secondary' : 'primary'}
                className="gap-2 min-w-[100px]"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Expiration Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Expires:</span>
              <span className="font-medium">{formatDateTime(expiresAt)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This note will be automatically deleted after the expiration time.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border">
          <Button
            onClick={() => window.open(shareUrl, '_blank')}
            variant="secondary"
            className="flex-1 gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open Note
          </Button>
          <Button onClick={onClose} className="flex-1">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
