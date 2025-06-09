"use client";

import type {
  Block,
  BlockType,
  AVAILABLE_BLOCK_TYPES as AvailableBlockTypesType,
} from "@/lib/types"; // Corrected import for type
import { HeaderBlock } from "@/components/blocks/header-block";
import { LineItemBlock } from "@/components/blocks/line-item-block";
import { ClauseBlock } from "@/components/blocks/clause-block";
import { SignatureBlock } from "@/components/blocks/signature-block";
import { BlockWrapper } from "@/components/blocks/block-wrapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileQuestion } from "lucide-react";

interface DocumentCanvasProps {
  blocks: Block[];
  onDropBlock: (type: BlockType) => void;
  onUpdateBlock: (blockId: string, newContent: any) => void;
  onRemoveBlock: (blockId: string) => void;
  availableBlockTypes: typeof AvailableBlockTypesType; // Use the imported type directly
}

export function DocumentCanvas({
  blocks,
  onDropBlock,
  onUpdateBlock,
  onRemoveBlock,
  availableBlockTypes,
}: DocumentCanvasProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (data) {
      try {
        const { type } = JSON.parse(data) as { type: BlockType };
        if (availableBlockTypes.some((bt) => bt.type === type)) {
          onDropBlock(type);
        }
      } catch (error) {
        console.error("Failed to parse dropped data:", error);
      }
    }
  };

  const renderBlock = (block: Block) => {
    const blockDefinition = availableBlockTypes.find(
      (b) => b.type === block.type
    );
    const blockTitle = blockDefinition ? blockDefinition.name : "Unknown Block";

    return (
      <BlockWrapper
        key={block.id}
        blockId={block.id}
        title={blockTitle}
        onRemove={onRemoveBlock}
      >
        {block.type === "header" && (
          <HeaderBlock block={block} onChange={onUpdateBlock} />
        )}
        {block.type === "lineItems" && (
          <LineItemBlock block={block} onChange={onUpdateBlock} />
        )}
        {block.type === "clause" && (
          <ClauseBlock block={block} onChange={onUpdateBlock} />
        )}
        {block.type === "signature" && (
          <SignatureBlock block={block} onChange={onUpdateBlock} />
        )}
      </BlockWrapper>
    );
  };

  return (
    <ScrollArea
      className="flex-1 bg-muted/30"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="mx-auto max-w-4xl p-4 md:p-8">
        {blocks.length === 0 ? (
          <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <FileQuestion className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No blocks yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Drag and drop blocks from the left panel to build your document.
            </p>
          </div>
        ) : (
          blocks.map(renderBlock)
        )}
      </div>
    </ScrollArea>
  );
}
