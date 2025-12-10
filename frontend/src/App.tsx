import {useRef, useState} from 'react';
import {Button} from "@/components/ui/button";
import {Bold, Heading1, Heading2, Heading3, Italic, Type} from "lucide-react";
import {useFileOperations} from "@/hooks/useFileOperations";
import {useEditOperations} from "@/hooks/useEditOperations";

function App() {
    const [content, setContent] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const {
        currentFilePath,
    } = useFileOperations(content, setContent);

    useEditOperations(textareaRef);

    const applyFormatting = (format: 'p' | 'h1' | 'h2' | 'h3' | 'bold' | 'italic') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart ?? 0;
        const end = textarea.selectionEnd ?? 0;

        setContent((prev) => {
            const selected = prev.slice(start, end);
            const placeholderMap: Record<typeof format, string> = {
                p: 'Paragraph text',
                h1: 'Heading 1',
                h2: 'Heading 2',
                h3: 'Heading 3',
                bold: 'bold',
                italic: 'italic',
            };

            const text = selected || placeholderMap[format];

            let replacement = text;
            switch (format) {
                case 'p':
                    replacement = `\n\n${text}\n\n`;
                    break;
                case 'h1':
                    replacement = `# ${text}`;
                    break;
                case 'h2':
                    replacement = `## ${text}`;
                    break;
                case 'h3':
                    replacement = `### ${text}`;
                    break;
                case 'bold':
                    replacement = `**${text}**`;
                    break;
                case 'italic':
                    replacement = `*${text}*`;
                    break;
            }

            const newValue = prev.slice(0, start) + replacement + prev.slice(end);

            const cursor = start + replacement.length;
            requestAnimationFrame(() => {
                textarea.focus();
                textarea.setSelectionRange(cursor, cursor);
            });

            return newValue;
        });
    };


    return (
        <div className="h-screen flex flex-col bg-background">
            <div className="flex items-center gap-3 p-3 border-b border-border bg-card">
                <div className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/60 p-1">
                    <Button onClick={() => applyFormatting('p')} variant="ghost" size="icon">
                        <Type className="h-4 w-4"/>
                    </Button>
                    <Button onClick={() => applyFormatting('h1')} variant="ghost" size="icon">
                        <Heading1 className="h-4 w-4"/>
                    </Button>
                    <Button onClick={() => applyFormatting('h2')} variant="ghost" size="icon">
                        <Heading2 className="h-4 w-4"/>
                    </Button>
                    <Button onClick={() => applyFormatting('h3')} variant="ghost" size="icon">
                        <Heading3 className="h-4 w-4"/>
                    </Button>
                    <Button onClick={() => applyFormatting('bold')} variant="ghost" size="icon">
                        <Bold className="h-4 w-4"/>
                    </Button>
                    <Button onClick={() => applyFormatting('italic')} variant="ghost" size="icon">
                        <Italic className="h-4 w-4"/>
                    </Button>
                </div>
                {currentFilePath && (
                    <span className="ml-auto text-sm text-muted-foreground font-mono px-3 py-1.5 bg-muted rounded-md truncate max-w-md">
                        {currentFilePath}
                    </span>
                )}
            </div>
            <textarea
                className="flex-1 w-full p-4 border-none outline-none bg-background text-foreground font-mono text-sm leading-relaxed resize-none focus:ring-0"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                ref={textareaRef}
                placeholder="Start typing your MDX content here..."
            />
        </div>
    )
}

export default App
