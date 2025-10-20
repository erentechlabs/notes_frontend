import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Edit3, PlusCircle, Save, Loader2, AlertCircle } from 'lucide-react';
import RichTextEditor from '@/components/editor/RichTextEditor';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import SEO from '@/components/seo/SEO';
import StructuredData from '@/components/seo/StructuredData';
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (error) {
      console.error('Failed to update note:', error);
      showToast('Failed to update note. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewNote = () => {
    navigate('/');
  };

  const getNoteSummary = (content: string): string => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    return text.length > 160 ? text.substring(0, 157) + '...' : text;
  };

  const getNoteTitle = (content: string): string => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    const firstLine = text.split('\n')[0];
    return firstLine.length > 60 ? firstLine.substring(0, 57) + '...' : firstLine || 'Shared Note';
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

  return (
    <>
      <SEO
        title={getNoteTitle(note.content)}
        description={getNoteSummary(note.content)}
        type="article"
        url={`https://www.notefade.com/note/${urlCode}`}
        article={{
          publishedTime: note.createdAt,
          modifiedTime: note.updatedAt,
        }}
      />
      <StructuredData
        type="article"
        title={getNoteTitle(note.content)}
        description={getNoteSummary(note.content)}
        url={`https://www.notefade.com/note/${urlCode}`}
        datePublished={note.createdAt}
        dateModified={note.updatedAt}
      />
      
      <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fade-in">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Notes</h1>
            <p className="text-xs text-muted-foreground">
              {note.isExpired ? 'Expired note' : 'View note'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isEditing ? (
              <Button
                onClick={handleSave}
                disabled={isSaving || !editedContent.trim()}
                size="md"
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleEdit}
                  variant="secondary"
                  size="md"
                  className="gap-2 hidden sm:flex"
                  disabled={note.isExpired}
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
                <Button onClick={handleNewNote} size="md" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  New Note
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Note Info */}
      {!isEditing && (
        <div className="border-b border-border bg-muted/30 animate-fade-in">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">{formatRelativeTime(note.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Expires:</span>
                <span className={`font-medium ${note.isExpired ? 'text-red-500' : ''}`}>
                  {note.isExpired ? 'Expired' : formatRelativeTime(note.expiresAt)}
                </span>
              </div>
              {note.updatedAt !== note.createdAt && (
                <div className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last edited:</span>
                  <span className="font-medium">{formatRelativeTime(note.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-4 h-full">
          <RichTextEditor
            content={isEditing ? editedContent : note.content}
            onChange={setEditedContent}
            readOnly={!isEditing}
            placeholder="Note content..."
          />
        </div>
      </main>

      {/* Mobile Edit Button */}
      {!isEditing && !note.isExpired && (
        <div className="sm:hidden border-t border-border bg-background p-4">
          <Button onClick={handleEdit} variant="secondary" className="w-full gap-2">
            <Edit3 className="h-4 w-4" />
            Edit Note
          </Button>
        </div>
      )}
      </div>
    </>
  );
}
