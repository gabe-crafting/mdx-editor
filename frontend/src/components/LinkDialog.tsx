import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Editor as TipTapEditor } from '@tiptap/react';

interface LinkDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editor: TipTapEditor | null;
}

export function LinkDialog({ open, onOpenChange, editor }: LinkDialogProps) {
    const [url, setUrl] = useState('');
    const [text, setText] = useState('');

    useEffect(() => {
        if (open && editor) {
            const { from, to } = editor.state.selection;
            const selectedText = editor.state.doc.textBetween(from, to);
            
            // Check if current selection is a link
            const attrs = editor.getAttributes('link');
            if (attrs.href) {
                setUrl(attrs.href);
            } else {
                setUrl('');
            }
            setText(selectedText || '');
        }
    }, [open, editor]);

    const handleSave = () => {
        if (!editor || !url.trim()) return;

        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to);

        if (selectedText) {
            // If text is selected, apply link to it
            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: url.trim() })
                .run();
        } else {
            // If no text selected, insert link with text
            const linkText = text.trim() || url.trim();
            editor
                .chain()
                .focus()
                .insertContent(`<a href="${url.trim()}">${linkText}</a>`)
                .run();
        }

        // Clean up and close
        setUrl('');
        setText('');
        onOpenChange(false);
    };

    const handleRemove = () => {
        if (!editor) return;
        editor.chain().focus().unsetLink().run();
        setUrl('');
        setText('');
        onOpenChange(false);
    };

    const isLinkActive = editor?.isActive('link');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isLinkActive ? 'Edit Link' : 'Add Link'}</DialogTitle>
                    <DialogDescription>
                        Enter the URL and optional link text
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label htmlFor="url" className="text-sm font-medium">
                            URL
                        </label>
                        <Input
                            id="url"
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSave();
                                }
                            }}
                            autoFocus
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="text" className="text-sm font-medium">
                            Link Text (optional)
                        </label>
                        <Input
                            id="text"
                            placeholder="Link text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSave();
                                }
                            }}
                        />
                    </div>
                </div>
                <DialogFooter>
                    {isLinkActive && (
                        <Button
                            variant="destructive"
                            onClick={handleRemove}
                        >
                            Remove Link
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!url.trim()}
                    >
                        {isLinkActive ? 'Update' : 'Add'} Link
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

