import { Search, History } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { FileHistoryItem } from "@/hooks/useFileHistory";
import { useFilteredHistory } from "@/hooks/useFilteredHistory";
import { HistoryList } from "@/components/HistoryList";

interface HistoryAccordionProps {
  fileHistory: FileHistoryItem[];
  currentFileIndex: number;
  onFileSelect: (index: number) => void;
  onFileRemove: (index: number) => void;
}

export function HistoryAccordion({
  fileHistory,
  currentFileIndex,
  onFileSelect,
  onFileRemove,
}: HistoryAccordionProps) {
  const { searchQuery, setSearchQuery, filteredHistory, getFileName } =
    useFilteredHistory(fileHistory);

  return (
    <AccordionItem value="history">
      <AccordionTrigger>
        <div className="flex items-center gap-2">
          <History className="h-4 w-4" />
          <span>History</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <HistoryList
            filteredHistory={filteredHistory}
            fileHistory={fileHistory}
            currentFileIndex={currentFileIndex}
            getFileName={getFileName}
            onFileSelect={onFileSelect}
            onFileRemove={onFileRemove}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
