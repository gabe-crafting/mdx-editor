import {useRef, useState} from 'react';
import {Button} from "@/components/ui/button";
import {Bold, Heading1, Heading2, Heading3, Italic, Type, Link as LinkIcon, List, ListOrdered} from "lucide-react";
import {useFileOperations} from "@/hooks/useFileOperations";
import {useEditOperations} from "@/hooks/useEditOperations";
import {useTheme} from "@/hooks/useTheme";
import {Editor} from "@/components/Editor";
import {Editor as TipTapEditor} from '@tiptap/react';
import {LinkDialog} from "@/components/LinkDialog";

function App() {
    useTheme(); // Initialize theme system
    const [content, setContent] = useState('');
    const [, setUpdateKey] = useState(0);
    const [linkDialogOpen, setLinkDialogOpen] = useState(false);
    const editorRef = useRef<TipTapEditor | null>(null);

    const {
        currentFilePath,
    } = useFileOperations(content, setContent);

    const handleEditorReady = (editor: TipTapEditor) => {
        editorRef.current = editor;
        // Force re-render on selection/update changes to update button states
        editor.on('selectionUpdate', () => {
            setUpdateKey(prev => prev + 1);
        });
        editor.on('update', () => {
            setUpdateKey(prev => prev + 1);
        });
    };

    useEditOperations(editorRef);

    const applyFormatting = (format: 'p' | 'h1' | 'h2' | 'h3' | 'bold' | 'italic' | 'bulletList' | 'orderedList') => {
        const editor = editorRef.current;
        if (!editor) return;

        switch (format) {
            case 'p':
                editor.chain().focus().setParagraph().run();
                break;
            case 'h1':
                editor.chain().focus().toggleHeading({ level: 1 }).run();
                break;
            case 'h2':
                editor.chain().focus().toggleHeading({ level: 2 }).run();
                break;
            case 'h3':
                editor.chain().focus().toggleHeading({ level: 3 }).run();
                break;
            case 'bold':
                editor.chain().focus().toggleBold().run();
                break;
            case 'italic':
                editor.chain().focus().toggleItalic().run();
                break;
            case 'bulletList':
                editor.chain().focus().toggleBulletList().run();
                break;
            case 'orderedList':
                editor.chain().focus().toggleOrderedList().run();
                break;
        }
    };

    const isActive = (format: 'p' | 'h1' | 'h2' | 'h3' | 'bold' | 'italic' | 'link' | 'bulletList' | 'orderedList') => {
        const editor = editorRef.current;
        if (!editor) return false;

        switch (format) {
            case 'p':
                return editor.isActive('paragraph');
            case 'h1':
                return editor.isActive('heading', { level: 1 });
            case 'h2':
                return editor.isActive('heading', { level: 2 });
            case 'h3':
                return editor.isActive('heading', { level: 3 });
            case 'bold':
                return editor.isActive('bold');
            case 'italic':
                return editor.isActive('italic');
            case 'link':
                return editor.isActive('link');
            case 'bulletList':
                return editor.isActive('bulletList');
            case 'orderedList':
                return editor.isActive('orderedList');
            default:
                return false;
        }
    };

    const handleLinkClick = () => {
        const editor = editorRef.current;
        if (!editor) return;

        if (editor.isActive('link')) {
            // If link is active, remove it
            editor.chain().focus().unsetLink().run();
        } else {
            // Open dialog to add/edit link
            setLinkDialogOpen(true);
        }
    };


    const { theme } = useTheme();
    
    return (
        <div className="h-screen flex flex-col bg-background">
            <div className="flex items-center gap-3 p-3 border-b border-border bg-card text-card-foreground">
                <div className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/60 p-1">
                    <Button 
                        onClick={() => applyFormatting('p')} 
                        variant={isActive('p') ? "secondary" : "ghost"} 
                        size="icon"
                    >
                        <Type className="h-4 w-4"/>
                    </Button>
                    <Button 
                        onClick={() => applyFormatting('h1')} 
                        variant={isActive('h1') ? "secondary" : "ghost"} 
                        size="icon"
                    >
                        <Heading1 className="h-4 w-4"/>
                    </Button>
                    <Button 
                        onClick={() => applyFormatting('h2')} 
                        variant={isActive('h2') ? "secondary" : "ghost"} 
                        size="icon"
                    >
                        <Heading2 className="h-4 w-4"/>
                    </Button>
                    <Button 
                        onClick={() => applyFormatting('h3')} 
                        variant={isActive('h3') ? "secondary" : "ghost"} 
                        size="icon"
                    >
                        <Heading3 className="h-4 w-4"/>
                    </Button>
                    <Button 
                        onClick={() => applyFormatting('bold')} 
                        variant={isActive('bold') ? "secondary" : "ghost"} 
                        size="icon"
                    >
                        <Bold className="h-4 w-4"/>
                    </Button>
                    <Button 
                        onClick={() => applyFormatting('italic')} 
                        variant={isActive('italic') ? "secondary" : "ghost"} 
                        size="icon"
                    >
                        <Italic className="h-4 w-4"/>
                    </Button>
                    <Button 
                        onClick={handleLinkClick} 
                        variant={isActive('link') ? "secondary" : "ghost"} 
                        size="icon"
                    >
                        <LinkIcon className="h-4 w-4"/>
                    </Button>
                    <Button 
                        onClick={() => applyFormatting('bulletList')} 
                        variant={isActive('bulletList') ? "secondary" : "ghost"} 
                        size="icon"
                    >
                        <List className="h-4 w-4"/>
                    </Button>
                    <Button 
                        onClick={() => applyFormatting('orderedList')} 
                        variant={isActive('orderedList') ? "secondary" : "ghost"} 
                        size="icon"
                    >
                        <ListOrdered className="h-4 w-4"/>
                    </Button>
                </div>
                <LinkDialog
                    open={linkDialogOpen}
                    onOpenChange={setLinkDialogOpen}
                    editor={editorRef.current}
                />
                {currentFilePath && (
                    <span className="ml-auto text-sm text-muted-foreground font-mono px-3 py-1.5 bg-muted rounded-md truncate max-w-md">
                        {currentFilePath}
                    </span>
                )}
            </div>
            <Editor
                content={content}
                onChange={setContent}
                onEditorReady={handleEditorReady}
                placeholder="Start typing your MDX content here..."
            />
        </div>
    )
}

export default App
