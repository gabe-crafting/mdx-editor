import { useEditor, EditorContent, Editor as TipTapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useRef } from 'react';
import TurndownService from 'turndown';
import MarkdownIt from 'markdown-it';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onEditorReady?: (editor: TipTapEditor) => void;
}

export type { TipTapEditor };

// Initialize markdown converters
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

function htmlToMarkdown(html: string): string {
  return turndownService.turndown(html);
}

function markdownToHTML(markdown: string): string {
  return md.render(markdown);
}

export function Editor({ content, onChange, placeholder = 'Start typing your MDX content here...', onEditorReady }: EditorProps) {
  const contentRef = useRef(content);
  const isInternalUpdate = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
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
    ],
    content: markdownToHTML(content),
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-lg max-w-none focus:outline-none p-4 min-h-full prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
      },
    },
    onUpdate: ({ editor }) => {
      isInternalUpdate.current = true;
      const html = editor.getHTML();
      const markdown = htmlToMarkdown(html);
      contentRef.current = markdown;
      onChange(markdown);
    },
  });

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  useEffect(() => {
    if (!editor || isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    
    // Only update if content has changed externally (like file load)
    if (content !== contentRef.current) {
      const html = markdownToHTML(content);
      if (html !== editor.getHTML()) {
        editor.commands.setContent(html);
        contentRef.current = content;
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex-1 overflow-auto bg-background">
      <EditorContent editor={editor} />
    </div>
  );
}

