import { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Instagram,
  Ghost,
  Share as ShareIcon,
} from 'lucide-react';
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

  const handleNativeShare = async () => {
    if ('share' in navigator) {
      try {
        await navigator.share({
          title: 'Check out this note',
          text: 'I shared a note with you',
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed:', err);
      }
    }
  };

  const shareToSocial = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const text = encodeURIComponent('Check out this note!');

    const urls: Record<string, string> = {
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${text}%20${encodedUrl}`,
      instagram: `https://www.instagram.com/?url=${encodedUrl}`,
      snapchat: `https://www.snapchat.com/scan?attachmentUrl=${encodedUrl}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
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
      <div className="bg-background border-2 border-border/80 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border/60 bg-gradient-to-r from-muted/30 to-muted/10">
          <div className="min-w-0 flex-1 pr-2">
            <h2 className="text-xl sm:text-2xl font-bold truncate">Note Created!</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Share this link with others
            </p>
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
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {/* URL Display */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2.5 block">
              Shareable Link
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-muted/80 border-2 border-border/80 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                onClick={handleCopy}
                variant={copied ? 'secondary' : 'primary'}
                className="gap-2 min-w-[100px] sm:min-w-[120px] h-11 sm:h-auto shadow-md hover:shadow-lg transition-shadow"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="hidden sm:inline">Copied!</span>
                    <span className="sm:hidden">Done</span>
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
          <div className="bg-gradient-to-br from-muted/60 to-muted/40 border-2 border-border/60 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground font-medium">Expires:</span>
              <span className="font-semibold text-foreground">{formatDateTime(expiresAt)}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This note will be automatically deleted after the expiration time.
            </p>
          </div>

          {/* Social Media Sharing */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-foreground">Share on Social Media</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg active:scale-95 touch-manipulation"
                >
                  <ShareIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              )}
              <button
                onClick={() => shareToSocial('x')}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-black text-white rounded-xl hover:bg-neutral-900 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg active:scale-95 touch-manipulation"
                title="Share on X (Twitter)"
              >
                <Twitter className="h-4 w-4" />
                <span className="hidden sm:inline">X</span>
              </button>
              <button
                onClick={() => shareToSocial('facebook')}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#1877F2] text-white rounded-xl hover:bg-[#166fe5] transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg active:scale-95 touch-manipulation"
                title="Share on Facebook"
              >
                <Facebook className="h-4 w-4" />
                <span className="hidden sm:inline">Facebook</span>
              </button>
              <button
                onClick={() => shareToSocial('linkedin')}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0A66C2] text-white rounded-xl hover:bg-[#095196] transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg active:scale-95 touch-manipulation"
                title="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
                <span className="hidden sm:inline">LinkedIn</span>
              </button>
              <button
                onClick={() => shareToSocial('whatsapp')}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#25D366] text-white rounded-xl hover:bg-[#20bd5a] transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg active:scale-95 touch-manipulation"
                title="Share on WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
              <button
                onClick={() => shareToSocial('instagram')}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#833ab4] text-white rounded-xl hover:from-[#f06f28] hover:via-[#c62876] hover:to-[#6b2a92] transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg active:scale-95 touch-manipulation"
                title="Share on Instagram"
              >
                <Instagram className="h-4 w-4" />
                <span className="hidden sm:inline">Instagram</span>
              </button>
              <button
                onClick={() => shareToSocial('snapchat')}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#FFFC00] text-black rounded-xl hover:bg-[#f2ef00] transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg active:scale-95 touch-manipulation"
                title="Share on Snapchat"
              >
                <Ghost className="h-4 w-4" />
                <span className="hidden sm:inline">Snapchat</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 p-4 sm:p-6 border-t border-border/60 bg-gradient-to-b from-muted/30 to-muted/10">
          <Button
            onClick={() => window.open(shareUrl, '_blank')}
            variant="secondary"
            className="flex-1 gap-2 h-12 sm:h-14 text-base sm:text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
            Open Note
          </Button>
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
