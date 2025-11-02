import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Edit3, PlusCircle, Save, Loader2, AlertCircle, Copy, Check, Lock, CheckSquare } from 'lucide-react';
import RichTextEditor from '@/components/editor/RichTextEditor';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import SEO from '@/components/seo/SEO';
import { noteApi } from '@/services/api';
import { formatRelativeTime } from '@/utils/date';
import { useToast } from '@/contexts/ToastContext';
import type { NoteResponse } from '@/types/note';

export default function ViewNotePage() {
  const { urlCode } = useParams<{ urlCode: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [note, setNote] = useState<NoteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Full edit mode
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const checkboxSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCheckboxContentRef = useRef('');
  const pendingCheckboxSaveRef = useRef(false);

  const clearCheckboxSaveTimeout = () => {
    if (checkboxSaveTimeoutRef.current) {
      clearTimeout(checkboxSaveTimeoutRef.current);
      checkboxSaveTimeoutRef.current = null;
    }
  };

  const flushCheckboxSave = useCallback(async () => {
    if (!urlCode || !pendingCheckboxSaveRef.current) {
      return;
    }

    pendingCheckboxSaveRef.current = false;

    try {
      const updatedNote = await noteApi.updateNote(urlCode, {
        content: lastCheckboxContentRef.current,
      });
      setNote(updatedNote);
      setEditedContent(updatedNote.content);
    } catch (err) {
      console.error('Failed to save checkbox state:', err);
    }
  }, [urlCode]);

  useEffect(() => {
    if (!urlCode) return;

    const fetchNote = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await noteApi.getNote(urlCode);
        setNote(data);
        setEditedContent(data.content);
      } catch (err) {
        console.error('Failed to fetch note:', err);
        setError('Note not found or has expired.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [urlCode]);

  const handleEdit = () => {
    if (!note || note.isExpired || note.isReadOnly || (note.editMode || 'full') === 'read-only') {
      return;
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!urlCode || !editedContent.trim()) return;

    setIsSaving(true);
    try {
      const updatedNote = await noteApi.updateNote(urlCode, {
        content: editedContent,
      });
      setNote(updatedNote);
      setEditedContent(updatedNote.content);
      setIsEditing(false);
      showToast('Note updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update note:', error);
      showToast('Failed to update note. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCheckboxChange = (newContent: string) => {
    if (!note || note.isExpired) {
      return;
    }
    // Auto-save checkbox changes
    setEditedContent(newContent);
    setNote((prev) => (prev ? { ...prev, content: newContent } : prev));
    lastCheckboxContentRef.current = newContent;
    pendingCheckboxSaveRef.current = true;

    clearCheckboxSaveTimeout();

    checkboxSaveTimeoutRef.current = setTimeout(async () => {
      await flushCheckboxSave();
      checkboxSaveTimeoutRef.current = null;
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (checkboxSaveTimeoutRef.current) {
        clearTimeout(checkboxSaveTimeoutRef.current);
        checkboxSaveTimeoutRef.current = null;
      }

      if (pendingCheckboxSaveRef.current) {
        flushCheckboxSave();
      }
    };
  }, [flushCheckboxSave]);

  const handleNewNote = () => {
    navigate('/');
  };

  const handleCopyCode = async () => {
    if (!urlCode) return;
    try {
      await navigator.clipboard.writeText(urlCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
      showToast('Failed to copy code', 'error');
    }
  };
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading note...</p>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <SEO
          title="Note Not Found - NoteFade"
          description="This note could not be found or has expired."
        />
        <div className="text-center space-y-6 max-w-md px-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Note Not Found</h2>
            <p className="text-muted-foreground">
              {error || 'This note may have expired or does not exist.'}
            </p>
          </div>
          <Button onClick={handleNewNote} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New Note
          </Button>
        </div>
      </div>
    );
  }

  // Get note preview for SEO (first 150 chars without HTML)
  const notePreview = note.content
    .replace(/<[^>]*>/g, '')
    .substring(0, 150)
    .trim() + '...';

  const noteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Note ${urlCode}`,
    description: notePreview,
    datePublished: note.createdAt,
    dateModified: note.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'NoteFade App',
    },
  };

  // Determine editing state based on note's edit mode
  const noteIsReadOnly = Boolean(note.isReadOnly);
  const noteIsCheckboxOnly = !noteIsReadOnly && Boolean(note.isPartialEditingOnly);
  const noteEditMode = note.editMode || (noteIsReadOnly ? 'read-only' : noteIsCheckboxOnly ? 'checkbox-only' : 'full');
  const isCheckboxOnly = !isEditing && (noteIsCheckboxOnly || noteEditMode === 'checkbox-only');
  const isReadOnly = !isEditing && (noteIsReadOnly || noteEditMode === 'read-only');
  const showEditActions = !noteIsReadOnly;
  const editButtonDisabled = note.isExpired || noteIsReadOnly;
  const editorReadOnly = note.isExpired || isReadOnly || (!isEditing && !isCheckboxOnly);
  const displayedContent = isEditing || isCheckboxOnly ? editedContent : note.content;

  return (
    <div className="h-screen flex flex-col bg-background">
      <SEO
        title={`Note ${urlCode} - NoteFade`}
        description={notePreview}
        keywords="note, shared note, temporary note, view note"
        ogType="article"
        canonicalUrl={`${window.location.origin}/note/${urlCode}`}
        structuredData={noteStructuredData}
      />
      {/* Header */}
      <header className="border-b border-border/60 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 shadow-sm animate-fade-in">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold truncate">NoteFade</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden xs:block">
                {note.isExpired ? 'Expired note' : 'View note'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            <ThemeToggle />
            {isEditing ? (
              <Button
                onClick={handleSave}
                disabled={isSaving || !editedContent.trim()}
                size="sm"
                className="gap-1.5 text-xs sm:text-sm px-2.5 sm:px-4 h-9 sm:h-10 shadow-md hover:shadow-lg transition-shadow"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                    <span className="hidden sm:inline">Saving...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Save</span>
                    <span className="sm:hidden">Save</span>
                  </>
                )}
              </Button>
            ) : (
              <>
                {showEditActions && (
                  <Button
                    onClick={handleEdit}
                    variant="secondary"
                    size="sm"
                    className="gap-1.5 hidden md:flex text-xs sm:text-sm px-2 sm:px-3"
                    disabled={editButtonDisabled}
                    title={
                      note.isExpired
                        ? 'This note has expired and cannot be edited'
                        : undefined
                    }
                  >
                    <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden lg:inline">Full Edit</span>
                    <span className="lg:hidden">Edit</span>
                  </Button>
                )}
                {isReadOnly && (
                  <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/80 border border-border/60 text-muted-foreground text-xs sm:text-sm">
                    <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden lg:inline">Read Only</span>
                  </div>
                )}
                {isCheckboxOnly && (
                  <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs sm:text-sm">
                    <CheckSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden lg:inline">Checkbox Mode</span>
                    <span className="lg:hidden">Checkbox</span>
                  </div>
                )}
                <Button onClick={handleNewNote} size="sm" className="gap-1.5 text-xs sm:text-sm px-2.5 sm:px-4 h-9 sm:h-10 shadow-md hover:shadow-lg transition-shadow">
                  <PlusCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">New Note</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Note Info */}
      {!isEditing && (
        <div className="border-b border-border/60 bg-gradient-to-b from-muted/40 to-muted/20 backdrop-blur-sm animate-fade-in">
          <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm items-center">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground hidden xs:inline">Created:</span>
                  <span className="font-semibold text-foreground">{formatRelativeTime(note.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground hidden xs:inline">Expires:</span>
                  <span className={`font-semibold ${note.isExpired ? 'text-red-500 dark:text-red-400' : 'text-foreground'}`}>
                    {note.isExpired ? 'Expired' : formatRelativeTime(note.expiresAt)}
                  </span>
                </div>
                {note.updatedAt !== note.createdAt && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground hidden xs:inline">Edited:</span>
                    <span className="font-semibold text-foreground">{formatRelativeTime(note.updatedAt)}</span>
                  </div>
                )}
              </div>
              
              {/* Note Code Display */}
              <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-xl px-3 py-2 border-2 border-border/60 shadow-sm hover:shadow-md transition-shadow w-full sm:w-auto">
                <span className="text-xs text-muted-foreground font-medium">Code:</span>
                <code className="text-xs sm:text-sm font-mono font-bold bg-muted/80 px-2.5 py-1 rounded-lg border border-border/40 flex-1 sm:flex-initial text-center sm:text-left">
                  {urlCode}
                </code>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg hover:bg-accent transition-colors active:scale-95 touch-manipulation"
                  title="Copy note code"
                  aria-label="Copy note code"
                >
                  {copiedCode ? (
                    <Check className="h-4 w-4 text-green-500 dark:text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <main className="flex-1 overflow-hidden bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 h-full">
          <RichTextEditor
            content={displayedContent}
            onChange={isCheckboxOnly ? handleCheckboxChange : setEditedContent}
            readOnly={editorReadOnly}
            checkboxOnly={isCheckboxOnly}
            placeholder="Note content..."
          />
        </div>
      </main>

      {/* Mobile Action Buttons */}
      {!isEditing && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-md shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] p-3 sm:p-4 space-y-2">
          {isReadOnly && (
            <div className="flex items-center justify-center gap-2 py-2.5 px-3 text-muted-foreground text-sm bg-muted/60 rounded-lg border border-border/40">
              <Lock className="h-4 w-4" />
              This note is read-only
            </div>
          )}
          {isCheckboxOnly && (
            <div className="flex items-center justify-center gap-2 py-2.5 px-3 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm rounded-lg font-medium">
              <CheckSquare className="h-4 w-4" />
              Checkbox-only mode active
            </div>
          )}
          {showEditActions && (
            <Button
              onClick={handleEdit}
              variant="secondary"
              className="w-full gap-2 h-11 text-sm"
              disabled={editButtonDisabled}
              title={
                note.isExpired
                  ? 'This note has expired and cannot be edited'
                  : undefined
              }
            >
              <Edit3 className="h-4 w-4" />
              Enter Full Edit Mode
            </Button>
          )}
        </div>
      )}
      </div>
  );
}
