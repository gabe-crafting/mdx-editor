import { useState, useMemo } from "react";
import { FileHistoryItem } from "./useFileHistory";

export interface FilteredHistoryItem {
  item: FileHistoryItem;
  originalIndex: number;
}

export function useFilteredHistory(fileHistory: FileHistoryItem[]) {
  const [searchQuery, setSearchQuery] = useState("");

  const getFileName = (filePath: string) => {
    return filePath.split(/[/\\]/).pop() || filePath;
  };

  // Filter file history based on search query (by file name)
  const filteredHistory = useMemo<FilteredHistoryItem[]>(() => {
    if (!searchQuery.trim()) {
      return fileHistory.map((item, index) => ({ item, originalIndex: index }));
    }

    const query = searchQuery.toLowerCase();
    return fileHistory
      .map((item, index) => ({ item, originalIndex: index }))
      .filter(({ item }) => {
        const fileName = getFileName(item.filePath).toLowerCase();
        return fileName.includes(query);
      });
  }, [fileHistory, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredHistory,
    getFileName,
  };
}
