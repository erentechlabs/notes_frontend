import { useState, lazy, Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { Share2, Loader2, Search, Clock } from 'lucide-react';
import RichTextEditor from '@/components/editor/RichTextEditor';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import ShareModal from '@/components/ui/ShareModal';
import FindNoteModal from '@/components/ui/FindNoteModal';
import ConfigureDurationModal from '@/components/ui/ConfigureDurationModal';
import SEO from '@/components/ui/SEO';
=======
import { Share2, Loader2 } from 'lucide-react';

const RichTextEditor = lazy(() => import('@/components/editor/RichTextEditor'));
import DurationSelector from '@/components/ui/DurationSelector';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import ShareModal from '@/components/ui/ShareModal';
import SEO from '@/components/seo/SEO';
import StructuredData from '@/components/seo/StructuredData';
>>>>>>> e427749b6667a4cd25c877a5eba5b1df6ca0d931
import { noteApi } from '@/services/api';
import { useToast } from '@/contexts/ToastContext';
import type { EditMode } from '@/types/note';

export default function CreateNotePage() {
  const [content, setContent] = useState('');
  const [duration, setDuration] = useState(24);
  const [editMode, setEditMode] = useState<EditMode>('full');
  const [isLoading, setIsLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState<{ shareUrl: string; expiresAt: string } | null>(null);
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Prefetch editor chunk on mount for instant loading
  useEffect(() => {
    const prefetchEditor = async () => {
      try {
        await import('@/components/editor/RichTextEditor');
      } catch (error) {
        // Ignore prefetch errors
      }
    };
    
    // Start prefetching after a short delay to prioritize initial render
    const timeout = setTimeout(prefetchEditor, 100);
    return () => clearTimeout(timeout);
  }, []);

  const hasContent = content.replace(/<[^>]*>/g, '').trim().length > 0;

  const handleShare = async () => {
    if (!hasContent) return;

    setIsLoading(true);
    try {
      // Map editMode to booleans required by backend
      let isReadOnly = false, isPartialEditingOnly = false;
      if (editMode === 'read-only') isReadOnly = true;
      else if (editMode === 'checkbox-only') isPartialEditingOnly = true;
      const requestPayload = {
        content,
        durationInHours: duration,
        isReadOnly,
        isPartialEditingOnly
      };
      
      const response = await noteApi.createNote(requestPayload);

      // Show share modal
      setShareData({
        shareUrl: `${window.location.origin}/note/${response.urlCode}`,
        expiresAt: response.expiresAt,
      });
      setShowShareModal(true);
    } catch (error: any) {
      console.error('Failed to create note:', error);
      console.error('Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        url: error?.config?.url,
        baseURL: error?.config?.baseURL,
      });

      // Provide more helpful error messages
      let errorMessage = 'Failed to create note. Please try again.';
      
      if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error?.response?.status === 400) {
        errorMessage = error?.response?.data?.message || 'Invalid request. Please check your input.';
      } else if (error?.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error?.response?.status === 403) {
        errorMessage = 'Access denied. Please check your permissions.';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = `Error: ${error.message}`;
      }

      showToast(errorMessage, 'error');
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

  const handleLookupNote = (code: string) => {
    if (code.trim()) {
      navigate(`/note/${code.trim()}`);
    } else {
      showToast('Please enter a note code', 'error');
    }
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'NoteFade',
    applicationCategory: 'ProductivityApplication',
    description: 'Create and share temporary notes with rich text formatting',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    operatingSystem: 'Web Browser',
  };

  return (
<<<<<<< HEAD
    <div className="h-screen flex flex-col bg-background">
      <SEO
        title="Create Note - NoteFade"
        description="Create a new temporary note with rich text formatting. Share securely with automatic expiration."
        structuredData={structuredData}
      />
      {/* Header */}
      <header className="border-b border-border/60 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 shadow-sm animate-fade-in">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold truncate">NoteFade</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden xs:block">Create a temporary note</p>
            </div>
=======
    <>
      <SEO
        title="Create & Share Notes"
        description="Create temporary notes and share them securely. Set expiration times and collaborate effortlessly with NoteFade's modern note-taking platform."
        type="website"
        url="https://www.notefade.com/"
      />
      <StructuredData type="website" />
      
      <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fade-in">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Notes</h1>
            <p className="text-xs text-muted-foreground">Create a temporary note</p>
>>>>>>> e427749b6667a4cd25c877a5eba5b1df6ca0d931
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            <ThemeToggle />
            <Button
              onClick={() => setShowLookupModal(true)}
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs sm:text-sm px-2 sm:px-3 h-9 sm:h-10"
            >
              <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Find Note</span>
            </Button>
            <Button
              onClick={() => setShowDurationModal(true)}
              variant="secondary"
              size="sm"
              className="gap-1.5 text-xs sm:text-sm px-2 sm:px-3 h-9 sm:h-10"
            >
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Duration</span>
            </Button>
            <Button
              onClick={handleShare}
              disabled={!hasContent || isLoading}
              size="sm"
              className="gap-1.5 text-xs sm:text-sm px-2.5 sm:px-4 h-9 sm:h-10 shadow-md hover:shadow-lg transition-shadow"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                  <span className="hidden sm:inline">Creating...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Share Note</span>
                  <span className="sm:hidden">Share</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </header>


      {/* Editor */}
<<<<<<< HEAD
      <main className="flex-1 overflow-hidden bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4 lg:py-6 h-full">
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Start writing your note... Use the toolbar to format your text."
          />
=======
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-4 h-full">
          <Suspense fallback={
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your note... Use the toolbar to format your text."
            />
          </Suspense>
>>>>>>> e427749b6667a4cd25c877a5eba5b1df6ca0d931
        </div>
      </main>

      {/* Modals */}
      <FindNoteModal
        isOpen={showLookupModal}
        onClose={() => setShowLookupModal(false)}
        onFindNote={handleLookupNote}
      />
      <ConfigureDurationModal
        isOpen={showDurationModal}
        onClose={() => setShowDurationModal(false)}
        duration={duration}
        onDurationChange={setDuration}
        editMode={editMode}
        onEditModeChange={(mode) => {
          setEditMode(mode);
          setShareData(null);
        }}
      />
      {shareData && (
        <ShareModal
          isOpen={showShareModal}
          onClose={handleCloseShareModal}
          shareUrl={shareData.shareUrl}
          expiresAt={shareData.expiresAt}
        />
      )}
      </div>
    </>
  );
}
