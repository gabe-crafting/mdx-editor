import { useEditor, EditorContent, Editor as TipTapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from '@tiptap/markdown';
import { useEffect, useRef, useState } from 'react';
import { BrowserOpenURL } from '../../wailsjs/runtime/runtime';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onEditorReady?: (editor: TipTapEditor) => void;
}

export type { TipTapEditor };

export function Editor({ content, onChange, placeholder = 'Start typing your MDX content here...', onEditorReady }: EditorProps) {
  const contentRef = useRef(content);
  const isInternalUpdate = useRef(false);
  const editorRef = useRef<TipTapEditor | null>(null);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Markdown,
    ],
    content: content,
    contentType: 'markdown',
    editorProps: {
      attributes: {
        class: `${isDark ? 'prose-invert' : 'prose'} prose-sm max-w-none focus:outline-none p-4 min-h-full text-sm leading-snug prose-headings:text-foreground prose-headings:leading-tight prose-headings:my-1 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-sm prose-p:leading-snug prose-p:my-1 prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-ul:text-foreground prose-ol:text-foreground prose-li:text-sm prose-li:leading-snug prose-li:my-0.5 prose-li:text-foreground`,
      },
      handleClick: (view, pos, event) => {
        const target = event.target as HTMLElement;
        const linkElement = target.closest('a');
        
        if (linkElement) {
          const href = linkElement.getAttribute('href');
          if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
            event.preventDefault();
            event.stopPropagation();
            BrowserOpenURL(href);
            return true; // Indicates we handled it
          }
        }
        return false; // Let TipTap handle it normally
      },
      handleKeyDown: (view, event) => {
        const editor = editorRef.current;
        if (!editor) return false;

        // Handle Tab for indenting lists
        if (event.key === 'Tab' && !event.shiftKey) {
          if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
            event.preventDefault();
            editor.chain().focus().sinkListItem('listItem').run();
            return true;
          }
        }
        // Handle Shift+Tab for outdenting lists
        if (event.key === 'Tab' && event.shiftKey) {
          if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
            event.preventDefault();
            editor.chain().focus().liftListItem('listItem').run();
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      isInternalUpdate.current = true;
      const markdown = editor.getMarkdown();
      contentRef.current = markdown;
      onChange(markdown);
    },
  });

  useEffect(() => {
    if (editor) {
      editorRef.current = editor;
      if (onEditorReady) {
        onEditorReady(editor);
      }
    }
  }, [editor, onEditorReady]);

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains('dark');
      setIsDark(dark);
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, []);
  
  // Update editor classes when theme changes
  useEffect(() => {
    if (editor) {
      const editorElement = editor.view.dom;
      if (editorElement) {
        const proseClass = isDark ? 'prose-invert' : 'prose';
        const currentClass = editorElement.getAttribute('class') || '';
        const newClass = currentClass.replace(/prose-invert|prose(?=\s|$)/g, proseClass);
        editorElement.setAttribute('class', newClass);
      }
    }
  }, [editor, isDark]);


  useEffect(() => {
    if (!editor || isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    
    // Only update if content has changed externally (like file load)
    if (content !== contentRef.current) {
      editor.commands.setContent(content, { contentType: 'markdown' });
      contentRef.current = content;
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex-1 overflow-auto bg-background">
      <style>{`
        .ProseMirror ol li::marker {
          color: ${isDark ? 'white' : 'black'} !important;
        }
      `}</style>
      <EditorContent editor={editor} />
    </div>
  );
}

