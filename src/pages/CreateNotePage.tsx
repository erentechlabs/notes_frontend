import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, Loader2 } from 'lucide-react';
import RichTextEditor from '@/components/editor/RichTextEditor';
import DurationSelector from '@/components/ui/DurationSelector';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import ShareModal from '@/components/ui/ShareModal';
import { noteApi } from '@/services/api';

export default function CreateNotePage() {
  const [content, setContent] = useState('');
  const [duration, setDuration] = useState(24);
  const [isLoading, setIsLoading] = useState(false);
  const [showDuration, setShowDuration] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState<{ shareUrl: string; expiresAt: string } | null>(null);
  const navigate = useNavigate();

  const hasContent = content.replace(/<[^>]*>/g, '').trim().length > 0;

  const handleShare = async () => {
    if (!hasContent) return;

    setIsLoading(true);
    try {
      const response = await noteApi.createNote({
        content,
        durationInHours: duration,
      });

      // Show share modal
      setShareData({
        shareUrl: `${window.location.origin}/note/${response.urlCode}`,
        expiresAt: response.expiresAt,
      });
      setShowShareModal(true);
    } catch (error) {
      console.error('Failed to create note:', error);
      alert('Failed to create note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    if (shareData) {
      // Navigate to the created note
      const urlCode = shareData.shareUrl.split('/').pop();
      if (urlCode) {
        navigate(`/note/${urlCode}`);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fade-in">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Notes</h1>
              <p className="text-xs text-muted-foreground">Create a temporary note</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              onClick={() => setShowDuration(!showDuration)}
              variant="secondary"
              size="md"
              className="hidden sm:flex"
            >
              Configure Duration
            </Button>
            <Button
              onClick={handleShare}
              disabled={!hasContent || isLoading}
              size="md"
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  Share Note
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Duration Selector (Collapsible) */}
      {showDuration && (
        <div className="border-b border-border bg-muted/50 animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            <DurationSelector value={duration} onChange={setDuration} />
          </div>
        </div>
      )}

      {/* Editor */}
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-4 h-full">
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Start writing your note... Use the toolbar to format your text."
          />
        </div>
      </main>

      {/* Mobile Duration Button */}
      <div className="sm:hidden border-t border-border bg-background p-4">
        <Button
          onClick={() => setShowDuration(!showDuration)}
          variant="secondary"
          className="w-full"
        >
          Configure Duration
        </Button>
      </div>

      {/* Share Modal */}
      {shareData && (
        <ShareModal
          isOpen={showShareModal}
          onClose={handleCloseShareModal}
          shareUrl={shareData.shareUrl}
          expiresAt={shareData.expiresAt}
        />
      )}
    </div>
  );
}
