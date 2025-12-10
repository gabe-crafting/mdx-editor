import {useCallback, useEffect, useState} from 'react';
import {OpenFile, SaveFile, SaveFileAs} from "../../wailsjs/go/main/App";
import {EventsOn} from "../../wailsjs/runtime/runtime";

export function useFileOperations(
    content: string,
    setContent: (content: string | ((prev: string) => string)) => void
) {
    const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);

    const handleOpen = useCallback(async () => {
        try {
            const result = await OpenFile();
            if (result.filePath && result.content !== undefined) {
                setCurrentFilePath(result.filePath);
                setContent(result.content);
            }
        } catch (error) {
            console.error('Error opening file:', error);
            alert('Failed to open file: ' + error);
        }
    }, [setContent]);

    const handleSaveAs = useCallback(async () => {
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
    }, [content]);

    const handleSave = useCallback(async () => {
        if (!currentFilePath) {
            return await handleSaveAs();
        }
        try {
            await SaveFile(currentFilePath, content);
            alert('File saved successfully!');
        } catch (error) {
            console.error('Error saving file:', error);
            alert('Failed to save file: ' + error);
        }
    }, [currentFilePath, content, handleSaveAs]);

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

    return {
        currentFilePath,
        setCurrentFilePath,
        handleOpen,
        handleSave,
        handleSaveAs,
    };
}

