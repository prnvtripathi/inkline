"use client";

import { useState, useMemo } from "react";
import { DndContext, DragOverlay, closestCenter, DragEndEvent, useSensors, useSensor, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import type {
  Block,
  BlockType,
  AVAILABLE_BLOCK_TYPES as AvailableBlockTypesType,
} from "@/lib/types";
import { HeaderBlock } from "@/components/blocks/header-block";
import { LineItemBlock } from "@/components/blocks/line-item-block";
import { ClauseBlock } from "@/components/blocks/clause-block";
import { SignatureBlock } from "@/components/blocks/signature-block";
import { BlockWrapper } from "@/components/blocks/block-wrapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileQuestion, GripVertical } from "lucide-react";
import { SortableBlock } from "./sortable-block";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface DocumentCanvasProps {
  blocks: Block[];
  onDropBlock: (type: BlockType) => void;
  onUpdateBlock: (blockId: string, newContent: any) => void;
  onRemoveBlock: (blockId: string) => void;
  onBlocksReordered?: (blocks: Block[]) => void;
  availableBlockTypes: typeof AvailableBlockTypesType;
}

interface BlockRendererProps {
  block: Block;
  onUpdateBlock: (blockId: string, newContent: any) => void;
  onRemoveBlock: (blockId: string) => void;
  availableBlockTypes: typeof AvailableBlockTypesType;
  dragHandleProps?: any;
  isDragging?: boolean;
  isPdf?: boolean;
}

function BlockRenderer({
  block,
  onUpdateBlock,
  onRemoveBlock,
  availableBlockTypes,
  dragHandleProps,
  isDragging,
  isPdf = false,
}: BlockRendererProps) {
  const blockDefinition = availableBlockTypes.find(
    (b) => b.type === block.type
  );
  const blockTitle = blockDefinition ? blockDefinition.name : "Unknown Block";

  const renderBlock = () => {
    switch (block.type) {
      case 'header':
        return <HeaderBlock block={block} onChange={onUpdateBlock} />;
      case 'lineItems':
        return <LineItemBlock block={block} onChange={onUpdateBlock} />;
      case 'clause':
        return <ClauseBlock block={block} onChange={onUpdateBlock} />;
      case 'signature':
        return <SignatureBlock block={block} onChange={onUpdateBlock} />;
      default:
        return null;
    }
  };

  if (isPdf) {
    return (
      <div className="mb-4">
        {renderBlock()}
      </div>
    );
  }

  return (
    <div className={cn("relative group", isDragging && "opacity-50")}>
      <BlockWrapper
        blockId={block.id}
        title={blockTitle}
        onRemove={onRemoveBlock}
        dragHandleProps={dragHandleProps}
      >
        {renderBlock()}
      </BlockWrapper>
    </div>
  );
}

export function DocumentCanvas({
  blocks,
  onDropBlock,
  onUpdateBlock,
  onRemoveBlock,
  onBlocksReordered,
  availableBlockTypes,
}: DocumentCanvasProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeBlock, setActiveBlock] = useState<Block | null>(null);
  
  // Initialize sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Enable click event on interactive elements
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveId(active.id);
    setActiveBlock(blocks.find(block => block.id === active.id) || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex(block => block.id === active.id);
      const newIndex = blocks.findIndex(block => block.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(blocks, oldIndex, newIndex);
        onBlocksReordered?.(newItems);
      }
    }
    
    setActiveId(null);
    setActiveBlock(null);
  };

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

  const renderBlock = (block: Block) => (
    <SortableBlock key={block.id} id={block.id}>
      <BlockRenderer
        block={block}
        onUpdateBlock={onUpdateBlock}
        onRemoveBlock={onRemoveBlock}
        availableBlockTypes={availableBlockTypes}
      />
    </SortableBlock>
  );

  // Use a ref to track if we're in PDF export mode
  const isPdfExport = useRef(false);

  // Effect to handle PDF export mode
  useEffect(() => {
    const handleBeforePrint = () => {
      isPdfExport.current = true;
    };

    const handleAfterPrint = () => {
      isPdfExport.current = false;
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  const pdfStyles: React.CSSProperties = {
    width: '210mm', // A4 width
    minHeight: '297mm', // A4 height
    margin: '0 auto',
    padding: '20mm',
    backgroundColor: 'white',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    boxSizing: 'border-box' as const,
  };

  return (
    <div className="relative flex-1 bg-transparent">
      <ScrollArea
        className="h-full w-full"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="mx-auto p-4 max-w-4xl">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={blocks.map(block => block.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {blocks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground bg-card rounded-lg border border-dashed">
                    <FileQuestion className="h-12 w-12 mb-4" />
                    <p>Drag and drop blocks here to build your document</p>
                  </div>
                ) : (
                  blocks.map(renderBlock)
                )}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId && activeBlock ? (
                <div className="opacity-70 bg-card rounded-md shadow-lg">
                  <BlockRenderer
                    block={activeBlock}
                    onUpdateBlock={onUpdateBlock}
                    onRemoveBlock={onRemoveBlock}
                    availableBlockTypes={availableBlockTypes}
                    isDragging={true}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </ScrollArea>

      {/* Hidden container for PDF generation */}
      <div className="hidden">
        <div id="document-preview-pdf">
          {blocks.map(block => (
            <div key={`pdf-${block.id}`} className="mb-4">
              <BlockRenderer
                block={block}
                onUpdateBlock={onUpdateBlock}
                onRemoveBlock={onRemoveBlock}
                availableBlockTypes={availableBlockTypes}
                isPdf={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
