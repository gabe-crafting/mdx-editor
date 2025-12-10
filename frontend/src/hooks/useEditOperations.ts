import {useCallback, useEffect, RefObject} from 'react';
import {EventsOn} from "../../wailsjs/runtime/runtime";

export function useEditOperations(textareaRef: RefObject<HTMLTextAreaElement>) {
    const handleUndo = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.focus();
        document.execCommand('undo', false);
    }, []);

    const handleRedo = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.focus();
        document.execCommand('redo', false);
    }, []);

    useEffect(() => {
        const offUndo = EventsOn("menu:edit:undo", handleUndo);
        const offRedo = EventsOn("menu:edit:redo", handleRedo);

        return () => {
            offUndo();
            offRedo();
        };
    }, [handleUndo, handleRedo]);

    return {
        handleUndo,
        handleRedo,
    };
}

