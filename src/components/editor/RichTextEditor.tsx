import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Strike from '@tiptap/extension-strike';
import CodeBlock from '@tiptap/extension-code-block';
import Color from '@tiptap/extension-color'; // restore
import EditorToolbar from './EditorToolbar';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  checkboxOnly?: boolean; // New: only checkboxes are editable
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start writing your note...',
  readOnly = false,
  checkboxOnly = false,
}: RichTextEditorProps) {
  const isInternalUpdate = useRef(false);
  const scrollPositionRef = useRef<number>(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable default extensions we'll configure separately
        codeBlock: false,
        strike: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Strike,
      TextStyle,
      Subscript,
      Superscript,
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'code-block',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item-wrapper',
        },
      }),
      Color.configure({ types: ['textStyle'] }), // ensure color applies via textStyle
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      isInternalUpdate.current = true;
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-lg max-w-none focus:outline-none dark:prose-invert leading-relaxed',
        'data-checkbox-only': checkboxOnly ? 'true' : 'false',
      },
      // Prevent keyboard from opening and scroll jumping on mobile when in checkbox-only mode
      handleDOMEvents: {
        mousedown: (_view, event) => {
          if (!checkboxOnly) {
            return false;
          }
          const target = event.target as HTMLElement;
          if (target.tagName === 'INPUT' && target.getAttribute('type') === 'checkbox') {
            // Store current scroll position and prevent default
            scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;
            event.preventDefault();
            event.stopPropagation();
            
            // Manually toggle the checkbox
            const checkbox = target as HTMLInputElement;
            checkbox.checked = !checkbox.checked;
            
            // Trigger the change event to update TipTap
            const changeEvent = new Event('change', { bubbles: true });
            checkbox.dispatchEvent(changeEvent);
            
            return true;
          }
          return false;
        },
        click: (_view, event) => {
          if (!checkboxOnly) {
            return false;
          }
          const target = event.target as HTMLElement;
          if (target.tagName === 'INPUT' && target.getAttribute('type') === 'checkbox') {
            // Prevent all default click behavior
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            return true;
          }
          return false;
        },
        touchstart: (_view, event) => {
          if (!checkboxOnly) {
            return false;
          }
          const target = event.target as HTMLElement;
          if (target.tagName === 'INPUT' && target.getAttribute('type') === 'checkbox') {
            // Store scroll position and prevent default touch behavior
            scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;
            event.preventDefault();
            event.stopPropagation();
            return true;
          }
          return false;
        },
        touchend: (_view, event) => {
          if (!checkboxOnly) {
            return false;
          }
          const target = event.target as HTMLElement;
          if (target.tagName === 'INPUT' && target.getAttribute('type') === 'checkbox') {
            // Prevent default and manually handle checkbox toggle
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            
            // Manually toggle the checkbox
            const checkbox = target as HTMLInputElement;
            checkbox.checked = !checkbox.checked;
            
            // Trigger the change event to update TipTap
            const changeEvent = new Event('change', { bubbles: true });
            checkbox.dispatchEvent(changeEvent);
            
            return true;
          }
          return false;
        },
        focus: (_view, event) => {
          if (!checkboxOnly) {
            return false;
          }
          const target = event.target as HTMLElement;
          // Only allow focus on checkboxes
          if (target.tagName === 'INPUT' && target.getAttribute('type') === 'checkbox') {
            return false;
          }
          // Prevent focus on editor content to avoid keyboard popup
          event.preventDefault();
          (target as any).blur();
          return true;
        },
        keydown: (_view, event) => {
          if (!checkboxOnly) {
            return false;
          }

          const target = event.target as HTMLElement;
          const isCheckbox = target.tagName === 'INPUT' && target.getAttribute('type') === 'checkbox';
          const allowedKeys = ['Tab', 'Shift', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape'];

          if (isCheckbox) {
            // Allow space/enter on checkbox to toggle
            return false;
          }

          if (!allowedKeys.includes(event.key)) {
            event.preventDefault();
            return true;
          }

          return false;
        },
        paste: (_view, event) => {
          if (!checkboxOnly) {
            return false;
          }
          event.preventDefault();
          return true;
        },
        beforeinput: (_view, event) => {
          if (!checkboxOnly) {
            return false;
          }
          const inputEvent = event as InputEvent;
          const allowedInputTypes = ['deleteContentBackward', 'deleteContentForward'];
          if (!allowedInputTypes.includes(inputEvent.inputType)) {
            event.preventDefault();
            return true;
          }
          return false;
        },
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    
    // Only update editor content if the change came from outside (not from user typing)
    if (!isInternalUpdate.current && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
    
    // Reset the flag after checking
    isInternalUpdate.current = false;
  }, [content, editor]);

  useEffect(() => {
    if (editor) {
      // Keep editor editable in checkbox-only mode so onUpdate fires for checkbox changes
      editor.setEditable(!readOnly);
    }
  }, [editor, readOnly]);

  // Add scroll position protection for checkbox-only mode
  useEffect(() => {
    if (!checkboxOnly) return;

    let isCheckboxInteraction = false;
    let savedScrollPosition = 0;

    const handleScroll = () => {
      if (isCheckboxInteraction) {
        // Restore scroll position if it was a checkbox interaction
        window.scrollTo(0, savedScrollPosition);
        isCheckboxInteraction = false;
      }
    };

    const handleCheckboxClick = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' && target.getAttribute('type') === 'checkbox') {
        savedScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        isCheckboxInteraction = true;
        
        // Set a timeout to reset the flag
        setTimeout(() => {
          isCheckboxInteraction = false;
        }, 100);
      }
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: false });
    document.addEventListener('click', handleCheckboxClick, true);
    document.addEventListener('touchend', handleCheckboxClick, true);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleCheckboxClick, true);
      document.removeEventListener('touchend', handleCheckboxClick, true);
    };
  }, [checkboxOnly]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col h-full border-2 border-border/80 rounded-xl sm:rounded-2xl overflow-hidden bg-background shadow-lg backdrop-blur-sm">
      {!readOnly && !checkboxOnly && <EditorToolbar editor={editor} />}
      {checkboxOnly && (
        <div className="border-b-2 border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-blue-600/5 text-blue-700 dark:text-blue-300 px-3 sm:px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
          <div className="inline-flex items-center gap-2 font-semibold">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Checkbox-only mode
          </div>
          <span className="text-xs sm:text-[13px] text-blue-700/80 dark:text-blue-300/80 font-medium">
            Tap any checkbox to toggle instantly. Content updates auto-save.
          </span>
        </div>
      )}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-muted/10">
        <div className="h-full overflow-y-auto px-3 sm:px-6 py-3 sm:py-6">
          <EditorContent editor={editor} className="min-h-[45vh] sm:min-h-[55vh]" />
        </div>
      </div>
    </div>
  );
}
