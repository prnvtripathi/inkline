"use client";

import { DraggableBlockItem } from "./draggable-block-item";
import { AVAILABLE_BLOCK_TYPES } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heading1, List, FileText, PenLine } from "lucide-react";

const blockIcons: {
  [key in (typeof AVAILABLE_BLOCK_TYPES)[number]["type"]]: React.ElementType;
} = {
  header: Heading1,
  lineItems: List,
  clause: FileText,
  signature: PenLine,
};

export function BlockPalette() {
  return (
    <aside className="h-full w-72 border-r bg-background p-4">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        Available Blocks
      </h3>
      <ScrollArea className="h-[calc(100%-2rem)]">
        <div className="grid gap-3">
          {AVAILABLE_BLOCK_TYPES.map((blockDef) => (
            <DraggableBlockItem
              key={blockDef.type}
              type={blockDef.type}
              name={blockDef.name}
              icon={blockIcons[blockDef.type]}
            />
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
