import {useEffect, useState} from 'react';
import {OpenFile, SaveFile, SaveFileAs} from "../wailsjs/go/main/App";
import {Button} from "@/components/ui/button";
import {FolderOpen, Save, FileDown} from "lucide-react";
import {EventsOn} from "../wailsjs/runtime/runtime";

function App() {
    const [content, setContent] = useState('');
    const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);

    const handleOpen = async () => {
        try {
            const result = await OpenFile();
            if (result.filePath && result.content !== undefined) {
                setContent(result.content);
                setCurrentFilePath(result.filePath);
            }
        } catch (error) {
            console.error('Error opening file:', error);
            alert('Failed to open file: ' + error);
        }
    };

    const handleSave = async () => {
        if (!currentFilePath) {
            handleSaveAs();
            return;
        }
        try {
            await SaveFile(currentFilePath, content);
            alert('File saved successfully!');
        } catch (error) {
            console.error('Error saving file:', error);
            alert('Failed to save file: ' + error);
        }
    };

    const handleSaveAs = async () => {
        try {
            const filePath = await SaveFileAs(content);
            if (filePath) {
                setCurrentFilePath(filePath);
                alert('File saved successfully!');
            }
        } catch (error) {
            console.error('Error saving file:', error);
            alert('Failed to save file: ' + error);
        }
    };

    useEffect(() => {
        const offOpen = EventsOn("menu:file:open", handleOpen);
        const offSave = EventsOn("menu:file:save", handleSave);
        const offSaveAs = EventsOn("menu:file:saveas", handleSaveAs);

        return () => {
            offOpen();
            offSave();
            offSaveAs();
        };
    }, [handleOpen, handleSave, handleSaveAs]);

    return (
        <div className="h-screen flex flex-col bg-background">
            <div className="flex items-center gap-2 p-3 border-b border-border bg-card">
                <Button onClick={handleOpen} variant="outline" size="sm">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Open
                </Button>
                <Button onClick={handleSave} variant="outline" size="sm">
                    <Save className="mr-2 h-4 w-4" />
                    Save
                </Button>
                <Button onClick={handleSaveAs} variant="outline" size="sm">
                    <FileDown className="mr-2 h-4 w-4" />
                    Save As
                </Button>
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
                placeholder="Start typing your MDX content here..."
            />
        </div>
    )
}

export default App
