import { useState, useCallback, useEffect } from 'react';
import { LoadFileHistory, SaveFileHistory } from '../../wailsjs/go/main/App';

export interface FileHistoryItem {
  filePath: string;
  timestamp: number;
  // Note: content is not stored, loaded from disk when needed
}

const MAX_HISTORY_ITEMS = 100; // Limit to prevent storage from getting too large

export function useFileHistory() {
  const [fileHistory, setFileHistory] = useState<FileHistoryItem[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(true);

  // Load history from disk on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const loaded = await LoadFileHistory();
        // Limit to most recent items
        const limited = loaded.slice(-MAX_HISTORY_ITEMS);
        setFileHistory(limited);
        if (limited.length > 0) {
          setCurrentFileIndex(limited.length - 1);
        }
      } catch (error) {
        console.error('Failed to load file history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, []);

  // Save to disk whenever history changes (debounced)
  useEffect(() => {
    if (!isLoading && fileHistory.length >= 0) {
      const timeoutId = setTimeout(async () => {
        try {
          // Limit to most recent items before saving
          const limitedHistory = fileHistory.slice(-MAX_HISTORY_ITEMS);
          await SaveFileHistory(limitedHistory);
        } catch (error) {
          console.error('Failed to save file history:', error);
        }
      }, 500); // Debounce saves by 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [fileHistory, isLoading]);

  const addToHistory = useCallback((filePath: string) => {
    if (!filePath) return;

    setFileHistory(prev => {
      // Check if file already exists in history
      const existingIndex = prev.findIndex(item => item.filePath === filePath);
      
      if (existingIndex !== -1) {
        // Update timestamp and move to end
        const updated = [...prev];
        updated[existingIndex] = {
          filePath,
          timestamp: Date.now(),
        };
        // Move to end (most recent)
        const item = updated.splice(existingIndex, 1)[0];
        updated.push(item);
        setCurrentFileIndex(updated.length - 1);
        return updated;
      } else {
        // Add new entry
        const newHistory = [...prev, {
          filePath,
          timestamp: Date.now(),
        }];
        setCurrentFileIndex(newHistory.length - 1);
        return newHistory;
      }
    });
  }, []);

  const switchToFile = useCallback((index: number) => {
    if (index >= 0 && index < fileHistory.length) {
      setCurrentFileIndex(index);
      return fileHistory[index];
    }
    return null;
  }, [fileHistory]);

  const removeFromHistory = useCallback((index: number) => {
    setFileHistory(prev => {
      const newHistory = prev.filter((_, i) => i !== index);
      
      // Adjust current index
      if (index <= currentFileIndex) {
        if (currentFileIndex === 0) {
          setCurrentFileIndex(-1);
        } else {
          setCurrentFileIndex(currentFileIndex - 1);
        }
      }
      
      return newHistory;
    });
  }, [currentFileIndex]);

  const getCurrentFile = useCallback(() => {
    if (currentFileIndex >= 0 && currentFileIndex < fileHistory.length) {
      return fileHistory[currentFileIndex];
    }
    return null;
  }, [fileHistory, currentFileIndex]);

  return {
    fileHistory,
    currentFileIndex,
    addToHistory,
    switchToFile,
    removeFromHistory,
    getCurrentFile,
  };
}
