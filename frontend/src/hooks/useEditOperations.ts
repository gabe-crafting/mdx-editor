import {useCallback, useEffect, RefObject} from 'react';
import {EventsOn} from "../../wailsjs/runtime/runtime";
import {Editor as TipTapEditor} from '@tiptap/react';

export function useEditOperations(editorRef: RefObject<TipTapEditor | null>) {
    const handleUndo = useCallback(() => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.chain().focus().undo().run();
    }, [editorRef]);

    const handleRedo = useCallback(() => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.chain().focus().redo().run();
    }, [editorRef]);

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

