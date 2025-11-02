import { useState, type ReactNode } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  CheckSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface EditorToolbarProps {
  editor: Editor;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  icon: ReactNode;
}

const ToolbarButton = ({ onClick, isActive, title, icon }: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={cn(
      'w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border-2 transition-all duration-200 touch-manipulation',
      'hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1',
      isActive 
        ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105' 
        : 'border-border/70 bg-background/95 hover:bg-accent/70 hover:border-primary/50 text-foreground shadow-sm'
    )}
    aria-label={title}
  >
    {icon}
  </button>
);

const COLOR_SWATCHES = [
  { name: 'Reset', value: '' },
  { name: 'Snow', value: '#f8fafc' },
  { name: 'Stone', value: '#e2e8f0' },
  { name: 'Slate', value: '#cbd5f5' },
  { name: 'Crimson', value: '#ef4444' },
  { name: 'Sunset', value: '#f97316' },
  { name: 'Amber', value: '#facc15' },
  { name: 'Lime', value: '#65a30d' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Violet', value: '#7c3aed' },
  { name: 'Magenta', value: '#db2777' },
  { name: 'Rose', value: '#f43f5e' },
];

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentColor = editor.getAttributes('textStyle').color;

  const applyColor = (value: string) => {
    if (!value) {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(value).run();
    }
  };

  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  const Divider = () => (
    <div className="w-px h-8 bg-border/60 mx-1.5" />
  );

  return (
    <div className="border-b border-border/60 bg-gradient-to-b from-muted/40 to-muted/20 backdrop-blur-sm sticky top-0 z-30">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between gap-2 px-3 sm:px-4 py-2 text-sm font-semibold hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
        aria-expanded={isExpanded}
      >
        <span className="flex items-center gap-2">
          <span>Formatting Tools</span>
        </span>
        {isExpanded ? <ChevronUp className="h-4 w-4 transition-transform" /> : <ChevronDown className="h-4 w-4 transition-transform" />}
      </button>

      {/* Horizontal Toolbar */}
      {isExpanded && (
        <div className="px-2 sm:px-3 py-2.5 overflow-x-auto">
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 animate-fade-in mx-auto min-w-max sm:min-w-0">
            {/* Text Formatting Group */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Bold (Ctrl+B)"
                icon={<Bold className="h-4 w-4" />}
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Italic (Ctrl+I)"
                icon={<Italic className="h-4 w-4" />}
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                title="Underline (Ctrl+U)"
                icon={<Underline className="h-4 w-4" />}
              />
            </div>

            <Divider />

            {/* Heading Group */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                title="Heading 1"
                icon={<Heading1 className="h-4 w-4" />}
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                title="Heading 2"
                icon={<Heading2 className="h-4 w-4" />}
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
                title="Heading 3"
                icon={<Heading3 className="h-4 w-4" />}
              />
            </div>

            <Divider />

            {/* Alignment Group */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                isActive={editor.isActive({ textAlign: 'left' })}
                title="Align Left"
                icon={<AlignLeft className="h-4 w-4" />}
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                isActive={editor.isActive({ textAlign: 'center' })}
                title="Align Center"
                icon={<AlignCenter className="h-4 w-4" />}
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                isActive={editor.isActive({ textAlign: 'right' })}
                title="Align Right"
                icon={<AlignRight className="h-4 w-4" />}
              />
            </div>

            <Divider />

            {/* Lists and Blocks Group */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Bullet List"
                icon={<List className="h-4 w-4" />}
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Ordered List"
                icon={<ListOrdered className="h-4 w-4" />}
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                isActive={editor.isActive('taskList')}
                title="Task List"
                icon={<CheckSquare className="h-4 w-4" />}
              />
            </div>

            <Divider />

            {/* Color Selector */}
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs sm:text-sm text-muted-foreground font-medium whitespace-nowrap">Color:</span>
              <div className="flex items-center gap-1">
                {COLOR_SWATCHES.slice(0, 10).map((swatch) => {
                  const isActive = swatch.value ? currentColor === swatch.value : !currentColor;
                  return (
                    <button
                      key={swatch.name}
                      type="button"
                      onClick={() => applyColor(swatch.value)}
                      className={cn(
                        'w-6 h-6 sm:w-7 sm:h-7 rounded border-2 transition-all duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                        isActive 
                          ? 'ring-2 ring-primary/60 scale-110 shadow-md' 
                          : 'border-border/70 shadow-sm hover:scale-110 hover:shadow-md active:scale-95'
                      )}
                      style={{ background: swatch.value || '#000000' }}
                      title={swatch.name === 'Reset' ? 'Reset color' : swatch.name}
                      aria-label={swatch.name === 'Reset' ? 'Reset text color' : `Set text color to ${swatch.name}`}
                    />
                  );
                })}
              </div>
            </div>

            <Divider />

            {/* Undo/Redo Group */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                title="Undo"
                icon={<Undo className="h-4 w-4" />}
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                title="Redo"
                icon={<Redo className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
