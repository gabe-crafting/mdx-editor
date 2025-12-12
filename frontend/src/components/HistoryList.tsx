import { FileText, X } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { FileHistoryItem } from "@/hooks/useFileHistory";
import { FilteredHistoryItem } from "@/hooks/useFilteredHistory";

interface HistoryListProps {
  filteredHistory: FilteredHistoryItem[];
  fileHistory: FileHistoryItem[];
  currentFileIndex: number;
  getFileName: (filePath: string) => string;
  onFileSelect: (index: number) => void;
  onFileRemove: (index: number) => void;
}

export function HistoryList({
  filteredHistory,
  fileHistory,
  currentFileIndex,
  getFileName,
  onFileSelect,
  onFileRemove,
}: HistoryListProps) {
  if (filteredHistory.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="px-2 py-4 text-sm text-muted-foreground text-center">
            {fileHistory.length === 0
              ? "No files opened yet"
              : "No files match your search"}
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      {filteredHistory.map(({ item, originalIndex }) => (
        <SidebarMenuItem key={`${item.filePath}-${item.timestamp}`}>
          <SidebarMenuButton
            isActive={originalIndex === currentFileIndex}
            onClick={() => onFileSelect(originalIndex)}
            tooltip={item.filePath}
          >
            <FileText />
            <span className="truncate">{getFileName(item.filePath)}</span>
          </SidebarMenuButton>
          <SidebarMenuAction
            onClick={(e) => {
              e.stopPropagation();
              onFileRemove(originalIndex);
            }}
            showOnHover
          >
            <X />
          </SidebarMenuAction>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
