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
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface EditorToolbarProps {
  editor: Editor;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
}

const ToolbarButton = ({ onClick, isActive, children, title }: ToolbarButtonProps) => (
  <button
    onClick={onClick}
    title={title}
    className={cn(
      'p-2 rounded-lg transition-all duration-200',
      'hover:bg-accent/80 hover:scale-105',
      isActive 
        ? 'bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20'
        : 'bg-transparent'
    )}
    type="button"
  >
    {children}
  </button>
);

const COLOR_OPTIONS = [
  { label: 'Black', value: '#000000' },
  { label: 'Gray', value: '#6B7280' },
  { label: 'Red', value: '#EF4444' },
  { label: 'Orange', value: '#F97316' },
  { label: 'Yellow', value: '#EAB308' },
  { label: 'Green', value: '#10B981' },
  { label: 'Blue', value: '#3B82F6' },
  { label: 'Purple', value: '#8B5CF6' },
  { label: 'Pink', value: '#EC4899' },
];

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  return (
    <div className="border-b border-border bg-muted/30 p-3 flex flex-wrap gap-1 items-center animate-fade-in">
      {/* Text Formatting */}
      <div className="flex gap-1 pr-2 border-r border-border">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Headings */}
      <div className="flex gap-1 px-2 border-r border-border">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Text Alignment */}
      <div className="flex gap-1 px-2 border-r border-border">
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Lists */}
      <div className="flex gap-1 px-2 border-r border-border">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive('taskList')}
          title="Task List"
        >
          <CheckSquare className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Text Color */}
      <div className="flex gap-1 px-2 border-r border-border">
        <div className="flex gap-1 items-center">
          <span className="text-xs text-muted-foreground mr-1">Color:</span>
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color.value}
              onClick={() => editor.chain().focus().setColor(color.value).run()}
              className={cn(
                'w-5 h-5 rounded border-2 transition-all duration-200',
                'hover:scale-110 hover:border-primary/50',
                editor.isActive('textStyle', { color: color.value })
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background border-primary scale-110 shadow-md'
                  : 'border-border'
              )}
              style={{ backgroundColor: color.value }}
              title={color.label}
              type="button"
            />
          ))}
        </div>
      </div>

      {/* Undo/Redo */}
      <div className="flex gap-1 px-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </div>
  );
}
