import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Accordion } from "@/components/ui/accordion";
import { FileHistoryItem } from "@/hooks/useFileHistory";
import { HistoryAccordion } from "@/components/HistoryAccordion";

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
  return (
    <Sidebar collapsible="offcanvas" side="left">
      <SidebarHeader>
        <SidebarGroupLabel>Features</SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Accordion type="multiple" defaultValue={["history"]} className="w-full">
              <HistoryAccordion
                fileHistory={fileHistory}
                currentFileIndex={currentFileIndex}
                onFileSelect={onFileSelect}
                onFileRemove={onFileRemove}
              />
              {/* Future feature accordions can be added here */}
            </Accordion>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
