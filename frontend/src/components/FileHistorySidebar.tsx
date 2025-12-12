import { FileText, X } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { FileHistoryItem } from "@/hooks/useFileHistory";

interface FileHistorySidebarProps {
  fileHistory: FileHistoryItem[];
  currentFileIndex: number;
  onFileSelect: (index: number) => void;
  onFileRemove: (index: number) => void;
}

export function FileHistorySidebar({
  fileHistory,
  currentFileIndex,
  onFileSelect,
  onFileRemove,
}: FileHistorySidebarProps) {
  const getFileName = (filePath: string) => {
    return filePath.split(/[/\\]/).pop() || filePath;
  };

  return (
    <Sidebar collapsible="offcanvas" side="left">
      <SidebarHeader>
        <SidebarGroupLabel>File History</SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {fileHistory.length === 0 ? (
                <SidebarMenuItem>
                  <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                    No files opened yet
                  </div>
                </SidebarMenuItem>
              ) : (
                fileHistory.map((item, index) => (
                  <SidebarMenuItem key={`${item.filePath}-${item.timestamp}`}>
                    <SidebarMenuButton
                      isActive={index === currentFileIndex}
                      onClick={() => onFileSelect(index)}
                      tooltip={item.filePath}
                    >
                      <FileText />
                      <span className="truncate">{getFileName(item.filePath)}</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      onClick={(e) => {
                        e.stopPropagation();
                        onFileRemove(index);
                      }}
                      showOnHover
                    >
                      <X />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
